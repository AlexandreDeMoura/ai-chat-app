// server.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const admin = require('firebase-admin');
const { initializeDb, getDb } = require('./db');

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-config.json');
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Initialize the database
initializeDb(firebaseApp);

// Firebase Auth Middleware
const authenticateFirebase = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Create Conversation endpoint
app.post('/api/conversations', authenticateFirebase, async (req, res) => {
    try {
        const conversation = {
            ...req.body,
            userId: req.user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await getDb().collection('conversations').add(conversation);
        res.status(201).json({ id: docRef.id, ...conversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Conversation endpoint
app.put('/api/conversations/:id', authenticateFirebase, async (req, res) => {
    try {
        const conversationRef = getDb().collection('conversations').doc(req.params.id);
        const doc = await conversationRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        if (doc.data().userId !== req.user.uid) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await conversationRef.update({
            ...req.body,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });
        const updatedDoc = await conversationRef.get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
        console.error('Error updating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Conversations endpoint
app.get('/api/conversations', authenticateFirebase, async (req, res) => {
    try {
        const conversationsSnapshot = await getDb().collection('conversations')
            .where('userId', '==', req.user.uid)
            .orderBy('lastUpdated', 'desc')
            .get();

        const conversations = conversationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
    (accessToken, refreshToken, profile, done) => {
        // Here, you can handle the user profile information
        // For simplicity, we'll just return the profile
        return done(null, profile);
    }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes

// Auth with Google
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google auth callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to frontend
        res.redirect(process.env.CLIENT_URL);
    }
);

// Logout route
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(process.env.CLIENT_URL);
    });
});

// API endpoint to get user info
app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
