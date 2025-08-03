# Ride Booking API 🚕

## Overview

A secure, scalable backend system for ride-hailing services (like Uber/Pathao)
with role-based access control. Built with Express.js and Mongoose.

---

## Live Backend Link

https://booking-ride.vercel.app/

---

## Postman Json Provided in folder

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

| Method | Endpoint                 | Description                                            | Access        |
| ------ | ------------------------ | ------------------------------------------------------ | ------------- |
| POST   | `/register`              | Register new user with email/name/password             | Public        |
| GET    | `/all-users`             | Get all users by admin with filter,sort,pagination     | Admin Only    |
| GET    | `/all-users?role=DRIVER` | Get all Drivers by admin with filter,sort,pagination   | Admin Only    |
| GET    | `/me`                    | Get current user profile                               | Authenticated |
| GET    | `/:id`                   | Get user by ID                                         | Admin Only    |
| PATCH  | `/:id`                   | Update user information and admin allow driver profile | Owner/Admin   |

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
| POST   | `/forgot-password` | Initiate password reset Link      | Public        |
| POST   | `/forgot-password` | Initiate new password reset       | Public        |
| GET    | `/google`          | Initiate Google OAuth login       | Public        |
| GET    | `/google/callback` | Google OAuth callback handler     | Public        |

---

## 🚗 Ride Management

All ride-related routes are prefixed with: `/api/v1/otp`

| Method | Endpoint  | Description                          | Access        |
| ------ | --------- | ------------------------------------ | ------------- |
| POST   | `/send`   | send otp for verify credintial login | Authenticated |
| POST   | `/verify` | verify user credintial login         | Authenticated |

---

## 🚗 Ride Management

All ride-related routes are prefixed with: `/api/v1/ride`

| Method | Endpoint             | Description                                                   | Access     |
| ------ | -------------------- | ------------------------------------------------------------- | ---------- |
| POST   | `/rider-request`     | Request a new ride with pickupLocation and destination        | Rider      |
| PATCH  | `/ride-cancel/:id`   | Cancel requested ride                                         | Rider      |
| GET    | `/rider-history`     | Get rider's ride history                                      | Rider      |
| GET    | `/all-rides`         | Get all rides                                                 | Admin Only |
| GET    | `/driver-history`    | Get driver's ride history                                     | Driver     |
| PATCH  | `/update-status/:id` | Update ride status picked up.in transit,complete,canceled etc | Driver     |

---

## 🚗 Driver Management

All ride-related routes are prefixed with: `/api/v1/driver`

| Method | Endpoint          | Description                                          | Access |
| ------ | ----------------- | ---------------------------------------------------- | ------ |
| GET    | `/available-ride` | Get available rider's tthats are in requested status | Driver |
| PATCH  | `/accept/:id`     | driver accept rides                                  | Driver |
| PATCH  | `/availability`   | driver change their availability status true/false   | Driver |

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
