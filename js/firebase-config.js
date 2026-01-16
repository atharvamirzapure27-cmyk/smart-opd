// Smart OPD Queue Management System - Firebase Configuration
// Single source of truth for Firebase initialization

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6ALCXtrsYoZ2RrIwAQMLLHX30ztYTnpo",
  authDomain: "studio-1828532244-e822b.firebaseapp.com",
  projectId: "studio-1828532244-e822b",
  storageBucket: "studio-1828532244-e822b.appspot.com",
  messagingSenderId: "722776494280",
  appId: "1:722776494280:web:a3fef849e76f15a98995fd"
};

// Initialize Firebase (singleton)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Production configuration - no emulators

export { app, auth, db };
