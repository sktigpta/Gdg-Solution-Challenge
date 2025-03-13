const admin = require("firebase-admin");
const path = require("path");

// Correct path to service account key
const serviceAccount = require(path.join(__dirname, "../firebase/serviceAccountKey.json"));

// Initialize Firebase only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://youtube-scraper-450106-default-rtdb.firebaseio.com",
  });

  console.log("✅ Firebase initialized successfully!");
}

const db = admin.firestore();

module.exports = { admin, db };
