const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

async function ensureUser(uid, email, password, displayName, role) {
  try {
    await admin.auth().getUser(uid);
    console.log('Auth user exists:', uid);
  } catch (e) {
    await admin.auth().createUser({ uid, email, password, displayName });
    console.log('Created auth user:', uid);
  }
  await db.collection('users').doc(uid).set({ name: displayName, email, role, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  console.log('Wrote user doc', uid);
}

async function seed() {
  console.log('Seeding users and appointments (emulator)...');

  // users: uid, email, password, name, role
  const users = [
    { uid: 'admin1', email: 'admin@example.com', password: 'password', name: 'Super Admin', role: 'admin' },
    { uid: 'doc1', email: 'alice@example.com', password: 'password', name: 'Dr. Alice', role: 'doctor' },
    { uid: 'pat1', email: 'bob@example.com', password: 'password', name: 'Bob Patient', role: 'patient' }
  ];

  for (const u of users) {
    await ensureUser(u.uid, u.email, u.password, u.name, u.role);
  }

  // appointments (use final data model)
  const now = admin.firestore.Timestamp.now();
  const appointments = [
    {
      id: 'apt1',
      patientId: 'pat1',
      patientEmail: 'bob@example.com',
      doctorEmail: 'alice@example.com',
      opd: 'General',
      time: '10:00',
      token: 1,
      status: 'waiting',
      createdAt: now
    },
    {
      id: 'apt2',
      patientId: 'pat1',
      patientEmail: 'bob@example.com',
      doctorEmail: 'alice@example.com',
      opd: 'General',
      time: '10:15',
      token: 2,
      status: 'waiting',
      createdAt: now
    }
  ];

  for (const a of appointments) {
    await db.collection('appointments').doc(a.id).set({
      patientId: a.patientId,
      patientEmail: a.patientEmail,
      doctorEmail: a.doctorEmail,
      opd: a.opd,
      time: a.time,
      token: a.token,
      status: a.status,
      createdAt: a.createdAt
    });
    console.log('Wrote appointment', a.id);
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
