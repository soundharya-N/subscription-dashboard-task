## Subscription Dashboard Task
---

## Project Structure
subscription-dashboard-task/
 client   # Frontend (React)
 server   # Backend (Node.js + Express)

## Tech Stack
Frontend
 * React.js (Vite)
 * Bootstrap

## Backend
 * Node.js
 * Express.js

## Database
  * MongoDB (Mongoose)

## Authentication
* JWT (Access Token + Refresh Token)

---

##  Setup & Run Instructions

### Clone Repository

```
git clone https://github.com/soundharya-N/subscription-management.git
cd subscription-dashboard-task
```

---

###  Backend Setup

```
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/subscription_dashboard
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## Run backend:
```
cd server
npm run dev
```

---

## Frontend Setup

```
cd client
npm install
npm run dev
```

---

## Features

* User Registration & Login
* JWT Authentication
* Role-based Access (Admin/User)
* View Plans
* Subscribe to Plans
* View Active Subscription
* Admin Dashboard for Subscriptions

---
## Author
 Soundharya N
 Email:soundharya28032002@gmail.com
 Contact:8610666858

## Submission
GitHub Repository Link:
https://github.com/soundharya-N/subscription-management.git
