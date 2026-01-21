Smart OPD Queue System

Quick start (Emulator-only, safe)

Prerequisites
- Node.js (14+)
- Firebase CLI installed (`npm i -g firebase-tools`)

1) Start emulators
Open a PowerShell in the project root and run:

```powershell
cd "C:\Users\Atharva\OneDrive\Desktop\Project OPD\smart-opd-system"
firebase emulators:start
```

Expected emulator ports (required):
- Auth: 9099
- Firestore: 8080
- Hosting: 5000
- Emulator UI: 4000

2) Seed demo users (run in a new terminal after emulators are running):

```powershell
$env:FIRESTORE_EMULATOR_HOST='127.0.0.1:8080'; $env:FIREBASE_AUTH_EMULATOR_HOST='127.0.0.1:9099'; node functions/seed.js
```

Seeded accounts (from `functions/seed.js`):
- Admin: admin@example.com / password
- Doctor: alice@example.com / password
- Patient: bob@example.com / password

3) Open the app
- Visit: http://127.0.0.1:5000
- Login with one of the seeded accounts.

What to test
- Patient: book an appointment → token generated for chosen doctor+OPD; see live updates.
- Doctor: sign in → see waiting queue filtered by `doctorEmail`; Start Consultation and Mark Completed update status in real time.
- Admin: view totals, OPD counts, add doctor (creates emulator auth user + Firestore `users` doc), reset queue.

Troubleshooting
- If browser shows connection refused to Firestore or Auth, confirm emulators are listening on the required ports:
```powershell
netstat -aon | findstr ":8080"
netstat -aon | findstr ":9099"
```
- If another process occupies a port, stop it or restart emulators after freeing the port.

- If web page still shows production Identity Toolkit calls (requests to googleapis), ensure you cleared cache and that `connectAuthEmulator`/`connectFirestoreEmulator` lines exist in the top of `public/*.html` files (they are present in this project).

Notes
- This project is emulator-only; no production Firebase calls should be made when run on localhost.
- If you want a fresh seed, re-run the seed command while emulators are running.

Contact
- If issues persist, paste the emulator startup log and browser console output (first ~40 lines) into the project issue.
