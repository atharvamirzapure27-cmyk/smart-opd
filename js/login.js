import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Login functionality
document.getElementById('loginBtn').addEventListener('click', async () => {
    const msg = document.getElementById('loginMsg');
    msg.textContent = '';

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        msg.textContent = 'Email and password required';
        return;
    }

    showLoading(true);
    try {
        // Authenticate user with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
            alert('User profile not found');
            showLoading(false);
            return;
        }

        const userData = userDoc.data();
        const role = userData.role;

        // Redirect based on role
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else if (role === 'doctor') {
            window.location.href = 'doctor.html';
        } else if (role === 'patient') {
            window.location.href = 'patient.html';
        } else {
            alert('Invalid role assigned');
            showLoading(false);
        }
    } catch (e) {
        alert(e.message);
        showLoading(false);
    }
});

function showLoading(v) {
    document.getElementById('loading').classList.toggle('hidden', !v);
}

// Auto-redirect if already logged in
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, check their role and redirect
        getDoc(doc(db, 'users', user.uid)).then(userDoc => {
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (role === 'admin') {
                    window.location.href = 'admin.html';
                } else if (role === 'doctor') {
                    window.location.href = 'doctor.html';
                } else if (role === 'patient') {
                    window.location.href = 'patient.html';
                }
            }
        }).catch(error => {
            console.error('Error getting user role:', error);
        });
    }
});