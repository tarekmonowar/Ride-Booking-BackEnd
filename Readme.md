# Ride Booking API 🚕

## Overview

A secure, scalable backend system for ride-hailing services (like Uber/Pathao)
with role-based access control. Built with Express.js and Mongoose.

---

## Live Backend Link

https://booking-ride.vercel.app/

---

## Features ✨

- **🔐 JWT Authentication** with refresh tokens
- **🎭 Role-Based Authorization** (Rider, Driver, Admin)
- **🚗 Complete Ride Management** with status tracking
- **📊 Admin Dashboard** for system oversight
- **🔐 Google OAuth** integration
- **📜 Zod Schema Validation** for all requests
- **🔒 Secure Password Hashing** with bcrypt
- **📈 Ride History Tracking** for all users

## Tech Stack 🛠️

| Category       | Technologies             |
| -------------- | ------------------------ |
| Backend        | Node.js, Express.js      |
| Database       | MongoDB, Mongoose ODM    |
| Authentication | JWT, Passport.js, bcrypt |
| Validation     | Zod                      |
| Testing        | Postman                  |

---

## 👤 User Management

All user-related routes are prefixed with: `/api/v1/user`

| Method | Endpoint     | Description                                | Access        |
| ------ | ------------ | ------------------------------------------ | ------------- |
| POST   | `/register`  | Register new user with email/name/password | Public        |
| GET    | `/all-users` | Get all users                              | Admin Only    |
| GET    | `/me`        | Get current user profile                   | Authenticated |
| GET    | `/:id`       | Get user by ID                             | Admin Only    |
| PATCH  | `/:id`       | Update user information                    | Owner/Admin   |

---

## 🔐 Authentication Routes

All authentication-related routes are prefixed with: `/api/v1/auth`

| Method | Endpoint           | Description                       | Access        |
| ------ | ------------------ | --------------------------------- | ------------- |
| POST   | `/login`           | User login with credentials       | Public        |
| POST   | `/refresh-token`   | Refresh access token              | Public        |
| POST   | `/logout`          | Invalidate current session        | Authenticated |
| POST   | `/change-password` | Change user password              | Authenticated |
| POST   | `/set-password`    | set password for google auth user | Authenticated |
| POST   | `/forgot-password` | Initiate password reset           | Public        |
| GET    | `/google`          | Initiate Google OAuth login       | Public        |
| GET    | `/google/callback` | Google OAuth callback handler     | Public        |

---

## 🚗 Ride Management

All ride-related routes are prefixed with: `/api/v1/ride`

| Method | Endpoint             | Description               | Access     |
| ------ | -------------------- | ------------------------- | ---------- |
| POST   | `/rider-request`     | Request a new ride        | Rider      |
| PATCH  | `/ride-cancel/:id`   | Cancel requested ride     | Rider      |
| GET    | `/rider-history`     | Get rider's ride history  | Rider      |
| GET    | `/all-rides`         | Get all rides             | Admin Only |
| GET    | `/driver-history`    | Get driver's ride history | Driver     |
| PATCH  | `/update-status/:id` | Update ride status        | Driver     |

---

## 🧍 Rider Features

- Request rides with pickup and destination locations
- Cancel rides within allowed timeframe
- View ride history
- Manage user profile

## 🚗 Driver Features

- Accept or reject ride requests
- Update ride status through stages: Picked Up → In Transit → Completed
- View earnings history
- Set availability status (Online / Offline)

## 👑 Admin Features

- Manage users (block/unblock accounts)
- Approve or suspend drivers
- View all system data (users, drivers, rides)
- Generate reports

## 🚀 System Features

- Complete ride history tracking
- Input validation using Zod schemas
- RESTful API design principles
- Modular project architecture
- Centralized error handling middleware

---

## 🔄 Ride Lifecycle

The following are the stages a ride goes through from request to completion or
cancellation:

| Stage          | Description                                  |
| -------------- | -------------------------------------------- |
| **Requested**  | Rider creates a new ride request             |
| **Accepted**   | Driver accepts the ride request              |
| **Picked Up**  | Driver marks that the passenger is picked up |
| **In Transit** | Ride is in progress toward the destination   |
| **Completed**  | Ride finished successfully                   |
| **Cancelled**  | Ride was cancelled (by rider or system)      |

---

## Setup & Running

1. Clone the repository:

   ```bash
   git clone https://github.com/tarekmonowar/Ride-Booking-BackEnd.git

   ```
