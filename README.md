## Subscription Dashboard Task

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

##  Setup & Run Instruction
###  Backend Setup
cd server
npm install

## Add below document in users collections in your database
{
  "_id": {
    "$oid": "69dcadc283ab7ed10e4357c7"
  },
  "name": "admin",
  "email": "admin@gmail.com",
  "password": "$2a$12$El6ts6/jimOoSGFhO2Un9OLu.6IMOjWsDOY8GdMy1IcIli1/9hC4a",
  "role": "admin",
  "theme": "light",
  "createdAt": {
    "$date": "2026-04-13T08:48:02.893Z"
  },
  "updatedAt": {
    "$date": "2026-04-13T08:48:20.532Z"
  }
}
## Add below documents in plans collections in your database
[{
  "_id": {
    "$oid": "69dcac79edb4bdb05c1003a3"
  },
  "name": "Basic Plan",
  "price": 9.99,
  "features": [
    "Access to basic features",
    "Email support",
    "5GB storage"
  ],
  "duration": 30,
  "createdAt": {
    "$date": "2026-04-13T08:42:33.149Z"
  },
  "updatedAt": {
    "$date": "2026-04-13T08:42:33.149Z"
  }
},
{
  "_id": {
    "$oid": "69dcac79edb4bdb05c1003a4"
  },
  "name": "Pro Plan",
  "price": 19.99,
  "features": [
    "All Basic features",
    "Priority support",
    "50GB storage",
    "Advanced analytics"
  ],
  "duration": 30,
  "createdAt": {
    "$date": "2026-04-13T08:42:33.153Z"
  },
  "updatedAt": {
    "$date": "2026-04-13T08:42:33.153Z"
  }
},
{
  "_id": {
    "$oid": "69dcac79edb4bdb05c1003a5"
  },
  "name": "Enterprise Plan",
  "price": 49.99,
  "features": [
    "All Pro features",
    "Dedicated support",
    "Unlimited storage",
    "Custom integrations",
    "White-label options"
  ],
  "duration": 30,
  "createdAt": {
    "$date": "2026-04-13T08:42:33.153Z"
  },
  "updatedAt": {
    "$date": "2026-04-13T08:42:33.153Z"
  }
}]

PORT=5000
MONGO_URI=your_DB_URL
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret


## Run backend:
cd server
npm run dev

## Frontend Setup
cd client
npm install
npm run dev

## Admin Credentials
Email:admin@gmail.com
Password:admin123

## Normal Users can register using signup
---

## Contact
 Name:Soundharya N
 Email:soundharya28032002@gmail.com
 GitHub:https://github.com/soundharya-N/
 
## Submission
GitHub Repository Link:
https://github.com/soundharya-N/subscription-management.git
