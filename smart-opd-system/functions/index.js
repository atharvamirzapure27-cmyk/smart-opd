const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.registerPatient = functions.https.onRequest(async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing data" });
    }

    const patientId = "PID" + Date.now();

    await admin.firestore().collection("patients").doc(patientId).set({
      name,
      phone,
      patientId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      patientId: patientId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create appointment
exports.createAppointment = functions.https.onRequest(async (req, res) => {
  try {
    const { patientId, patientName, doctorId, doctorName, opd } = req.body;

    if (!patientId || !patientName || !doctorId || !doctorName || !opd) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const db = admin.firestore();
    const apptRef = db.collection('appointments').doc();

    await db.runTransaction(async (t) => {
      const q = db.collection('appointments')
        .where('opd', '==', opd)
        .where('doctorId', '==', doctorId)
        .where('status', '==', 'waiting');

      const snap = await t.get(q);
      const tokenNo = snap.size + 1;

      t.set(apptRef, {
        patientId,
        patientName,
        doctorId,
        doctorName,
        opd,
        tokenNo,
        status: 'waiting',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    res.json({ success: true, appointmentId: apptRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Advance token: mark current consulting as done and set next waiting to consulting
exports.advanceToken = functions.https.onRequest(async (req, res) => {
  try {
    const { opd, doctorId } = req.body;
    if (!opd) return res.status(400).json({ error: 'Missing opd' });

    const db = admin.firestore();

    const consultingQuery = db.collection('appointments')
      .where('opd', '==', opd)
      .where('status', '==', 'consulting');
    if (doctorId) consultingQuery.where('doctorId', '==', doctorId);

    const waitingQuery = db.collection('appointments')
      .where('opd', '==', opd)
      .where('status', '==', 'waiting')
      .orderBy('createdAt')
      .limit(1);

    await db.runTransaction(async (t) => {
      const consSnap = await t.get(consultingQuery);
      let finishedId = null;
      consSnap.forEach(d => {
        finishedId = d.id;
        t.update(d.ref, { status: 'done' });
      });

      const waitSnap = await t.get(waitingQuery);
      let nextId = null;
      waitSnap.forEach(d => {
        nextId = d.id;
        t.update(d.ref, { status: 'consulting' });
      });

      res.json({ success: true, finishedId, nextId });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change appointment status
exports.changeStatus = functions.https.onRequest(async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    if (!appointmentId || !status) return res.status(400).json({ error: 'Missing fields' });

    const db = admin.firestore();
    const ref = db.collection('appointments').doc(appointmentId);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });

    await ref.update({ status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
