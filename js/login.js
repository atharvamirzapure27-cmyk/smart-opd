import { auth, db, GoogleAuthProvider } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider as FirebaseAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ===============================
   LOGIN BUTTON HANDLER
================================ */
const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("loginMsg");
const loader = document.getElementById("loading");

// Patient-specific elements
const googleLoginBtn = document.getElementById("googleLoginBtn");
const registerBtn = document.getElementById("registerBtn");
const showRegisterLink = document.getElementById("showRegisterLink");
const showLoginLink = document.getElementById("showLoginLink");
const patientOptions = document.getElementById("patientOptions");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// Registration form inputs
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

// Check if current role is patient
const selectedRole = localStorage.getItem('selectedRole');
if (selectedRole === 'patient') {
  patientOptions.classList.remove('hidden');
}

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

/* ===============================
   PATIENT REGISTRATION
================================ */
registerBtn.addEventListener("click", async () => {
  msg.textContent = "";

  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value;
  const confirmPass = confirmPassword.value;

  // Validation
  if (!name || !email || !password || !confirmPass) {
    msg.textContent = "All fields are required";
    return;
  }

  if (password !== confirmPass) {
    msg.textContent = "Passwords do not match";
    return;
  }

  if (password.length < 6) {
    msg.textContent = "Password must be at least 6 characters";
    return;
  }

  showLoading(true);

  try {
    // Create user with email/password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Create user profile in Firestore
    await setDoc(doc(db, "users", uid), {
      name: name,
      email: email,
      role: "patient",
      createdAt: serverTimestamp()
    });

    // Redirect to patient dashboard
    window.location.href = "patient.html";

  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.code === "auth/email-already-in-use") {
      msg.textContent = "Email already registered";
    } else if (error.code === "auth/weak-password") {
      msg.textContent = "Password is too weak";
    } else {
      msg.textContent = "Registration failed. Try again.";
    }
    
    showLoading(false);
  }
});

/* ===============================
   GOOGLE SIGN-IN
================================ */
googleLoginBtn.addEventListener("click", async () => {
  msg.textContent = "";
  
  // Only allow Google sign-in for patients
  if (localStorage.getItem('selectedRole') !== 'patient') {
    msg.textContent = "Google sign-in is only available for patients";
    return;
  }
  
  showLoading(true);
  
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    const uid = user.uid;
    
    // Check if user profile exists in Firestore
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create user profile in Firestore
      await setDoc(doc(db, "users", uid), {
        name: user.displayName || "Patient",
        email: user.email,
        role: "patient",
        createdAt: serverTimestamp()
      });
    }
    
    // Redirect to patient dashboard
    window.location.href = "patient.html";
    
  } catch (error) {
    console.error("Google sign-in error:", error);
    
    if (error.code === "auth/popup-blocked") {
      msg.textContent = "Pop-up blocked. Please allow pop-ups and try again";
    } else if (error.code === "auth/popup-closed-by-user") {
      msg.textContent = "Sign-in cancelled";
    } else {
      msg.textContent = "Google sign-in failed. Try again.";
    }
    
    showLoading(false);
  }
});

/* ===============================
   FORM TOGGLE
================================ */
showRegisterLink.addEventListener("click", () => {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  document.getElementById('authTitle').textContent = 'Register as Patient';
});

showLoginLink.addEventListener("click", () => {
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  document.getElementById('authTitle').textContent = 'Login';
  // Clear registration form
  registerName.value = '';
  registerEmail.value = '';
  registerPassword.value = '';
  confirmPassword.value = '';
  msg.textContent = '';
});