import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ===============================
   LOGIN BUTTON HANDLER
================================ */
const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("loginMsg");
const loader = document.getElementById("loading");

loginBtn.addEventListener("click", async () => {
  msg.textContent = "";

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    msg.textContent = "Email and password required";
    return;
  }

  showLoading(true);

  try {
    // 🔐 Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 📄 Fetch user profile from Firestore
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User profile not found in database");
      showLoading(false);
      return;
    }

    const firestoreRole = userSnap.data().role;
    const selectedRole = localStorage.getItem('selectedRole');

    // Compare selected role with Firestore role
    if (firestoreRole !== selectedRole) {
      alert("Unauthorized access. Please select the correct role."); 
      showLoading(false);
      return;
    }

    // 🔁 Redirect based on role
    redirectByRole(firestoreRole);

  } catch (error) {
    console.error("Login error:", error);

    if (error.code === "auth/invalid-credential") {
      msg.textContent = "Invalid email or password";
    } else if (error.code === "auth/user-not-found") {
      msg.textContent = "User not found";
    } else if (error.code === "auth/wrong-password") {
      msg.textContent = "Incorrect password";
    } else {
      msg.textContent = "Login failed. Try again.";
    }

    showLoading(false);
  }
});

/* ===============================
   AUTO LOGIN (SESSION CHECK)
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const firestoreRole = userSnap.data().role;
      const selectedRole = localStorage.getItem('selectedRole');

      // Compare selected role with Firestore role
      if (firestoreRole !== selectedRole) {
        alert("Unauthorized access. Please select the correct role."); 
        return;
      }

      redirectByRole(firestoreRole);
    }
  } catch (err) {
    console.error("Auto-login error:", err);
  }
});

/* ===============================
   HELPERS
================================ */
function redirectByRole(role) {
  if (role === "admin") {
    window.location.href = "admin.html";
  } else if (role === "doctor") {
    window.location.href = "doctor.html";
  } else if (role === "patient") {
    window.location.href = "patient.html";
  } else {
    alert("Invalid role assigned");
    showLoading(false);
  }
}

function showLoading(show) {
  loader.classList.toggle("hidden", !show);
}
