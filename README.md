# 📋 My Tasks Dashboard

A personal task manager built with Next.js, Firebase, and Tailwind CSS.

## 🔗 Live Demo
**URL:** https://my-tasks-dashboard-indol.vercel.app

## 🔑 Demo Login
Email    : demo@mytasks.com
Password : Demo@1234

## ✨ Features
- Firebase Email/Password Authentication
- Login & Sign Up page
- Dashboard with 3 summary cards (Total, Completed This Week, Overdue)
- Bar chart showing tasks by status (Recharts)
- Projects page — Create & Delete projects
- Project detail page — Add, Delete, filter tasks
- Task fields: Title, Status (Todo/In Progress/Done), Priority (Low/Medium/High), Due Date
- Responsive UI (mobile & desktop)
- Firestore cloud storage

## 🛠 Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Firebase Auth + Firestore
- Recharts
- Vercel

## 🚀 Setup Instructions

### 1. Clone the repo
git clone https://github.com/Akshy-salesforce/my-tasks-dashboard.git
cd my-tasks-dashboard

### 2. Install dependencies
npm install

### 3. Create .env.local file
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

### 4. Run locally
npm run dev

Open http://localhost:3000

## 🔥 Firebase Config
1. Go to Firebase Console https://console.firebase.google.com
2. Create a project
3. Enable Authentication → Email/Password
4. Create Firestore database (Test mode)
5. Copy config to .env.local

## 🏗 Architecture
src/
  app/
    page.tsx          → Login/Signup
    dashboard/        → Dashboard + Chart
    projects/         → Projects list
    projects/[id]/    → Project tasks
  context/
    AuthContext.tsx   → Firebase Auth
  lib/
    firebase.js       → Firebase config

## 🎯 Design Decisions
- Used Firebase Firestore subcollections for tasks under projects
- AuthContext wraps entire app for global auth state
- Tailwind CSS for responsive design
- Recharts for lightweight charting