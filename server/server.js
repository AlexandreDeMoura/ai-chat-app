// server.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config();

const app = express();

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
