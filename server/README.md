# Subscription Dashboard Backend

A Node.js/Express backend for managing subscription plans and user subscriptions.

## Features

- User authentication (existing)
- Plan management
- User subscriptions
- JWT-based authentication

## API Endpoints

### Plans

#### GET /api/plans
Get all available subscription plans.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "plan_id",
      "name": "Basic Plan",
      "price": 9.99,
      "features": ["Access to basic features", "Email support", "5GB storage"],
      "duration": 30,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Subscriptions

#### POST /api/subscribe/:planId
Subscribe to a specific plan. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to plan",
  "data": {
    "_id": "subscription_id",
    "user": "user_id",
    "plan": {
      "_id": "plan_id",
      "name": "Basic Plan",
      "price": 9.99,
      "features": ["Access to basic features", "Email support", "5GB storage"],
      "duration": 30
    },
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T00:00:00.000Z",
    "isActive": true
  }
}
```

#### GET /api/my-subscription
Get the current user's active subscription. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "subscription_id",
    "user": "user_id",
    "plan": {
      "_id": "plan_id",
      "name": "Basic Plan",
      "price": 9.99,
      "features": ["Access to basic features", "Email support", "5GB storage"],
      "duration": 30
    },
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T00:00:00.000Z",
    "isActive": true
  }
}
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. Start MongoDB locally on port 27017

4. Seed the database with sample plans:
```bash
npm run seed
```

5. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Database Models

### Plan
- `name`: String (required, unique)
- `price`: Number (required, >= 0)
- `features`: Array of Strings (required)
- `duration`: Number (required, days, >= 1)

### Subscription
- `user`: ObjectId (ref: User, required)
- `plan`: ObjectId (ref: Plan, required)
- `startDate`: Date (default: now)
- `endDate`: Date (required)
- `isActive`: Boolean (default: true)

## Authentication

All subscription endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

The JWT token is obtained from the existing authentication system.