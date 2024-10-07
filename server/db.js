const admin = require('firebase-admin');

let db;

function initializeDb(app) {
    db = app.firestore();
}

module.exports = {
    initializeDb,
    getDb: () => db
};