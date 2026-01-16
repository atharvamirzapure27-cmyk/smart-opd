# Smart OPD Appointment Management System

A comprehensive hospital queue management system built with modern web technologies.

## 🏥 Features

- **Patient Portal**: Book appointments, view queue status, and track tokens
- **Doctor Dashboard**: Manage OPD queues, call patients, and update consultation status
- **Admin Panel**: System management, doctor registration, and analytics
- **Real-time Updates**: Live queue status using Firebase Firestore
- **Role-based Access**: Secure authentication and authorization

## 🚀 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Firebase Authentication & Cloud Firestore
- **Hosting**: GitHub Pages
- **Database**: Google Cloud Firestore (Production)

## 📁 Project Structure

```
Smart-OPD-Appointment-Management-System/
├── index.html          # Main landing page
├── login.html          # Authentication page
├── patient.html        # Patient dashboard
├── doctor.html         # Doctor dashboard
├── admin.html          # Admin panel
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── firebase-config.js    # Firebase initialization
│   └── hospital-config.js    # Hospital settings
└── assets/
    └── logo.svg        # Brand assets
```

## 🔧 Setup Instructions

1. Clone this repository
2. The site is hosted on GitHub Pages and ready to use
3. Visit the deployed URL to access the system

## 🔐 Authentication

The system uses Firebase Authentication with email/password:
- **Admin**: System administrators
- **Doctor**: Medical practitioners
- **Patient**: General users

## 🏢 Hospital Information

- **Supported Hospitals**: 
  - AVBRH, DMIHER, Sawangi (Wardha)
  - Shalini Tai Meghe Superspeciality Centre
- **Working Hours**: 
  - Monday-Friday: 9:00 AM - 5:00 PM
  - Saturday: 9:00 AM - 1:00 PM
  - Sunday: CLOSED

## 📱 Responsive Design

Fully responsive interface that works on:
- Desktop computers
- Tablets
- Mobile devices

## 🛡️ Security Features

- Role-based access control
- Secure Firebase Authentication
- Production-ready Firestore configuration
- No emulator dependencies

## 📄 License

© 2026 Smart OPD System. All rights reserved.

**Built by Atharva Mirzapure**
B.Tech (2nd Year) Student