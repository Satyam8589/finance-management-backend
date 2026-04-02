# 🏦 Zorvyn Finance Backend - Dashboard API

A professional, role-based backend system for financial records management and data-driven insights. Built with Node.js, Express, and Prisma ORM for the Zorvyn FinTech Backend Developer Intern assignment.

## 🚀 Overview

The **Zorvyn Finance Dashboard** is a backend system designed for efficient storage and management of financial entries, user roles, and summary-level analytics. It supports a hierarchical permissions model (Viewer, Analyst, Admin) and provides aggregated insights like income/expense trends and category-wise totals.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma v7
- **Authentication**: JWT + bcryptjs
- **Validation**: Joi
- **Logging/Error Handling**: Centralized `AppError` + `asyncHandler` pattern

## 🔐 Roles & Permissions

The system enforces a clear access hierarchy:

| Role | Look At Records | Dashboard Insights | Create/Edit Records | Manage Users |
|---|:---:|:---:|:---:|:---:|
| `viewer`  | ✅ (Only Own)   | ❌ | ❌ | ❌ |
| `analyst` | ✅ (All Users)  | ✅ | ❌ | ❌ |
| `admin`   | ✅ (All Users)  | ✅ | ✅ | ✅ |

---

## 📋 API Endpoints

### Auth
- `POST /api/auth/register` — Public: Register a new account
- `POST /api/auth/login` — Public: Login and receive a 7-day JWT

### Records (Financial Management)
- `GET /api/records` — All Roles: List filtered/paginated records
- `GET /api/records/:id` — All Roles: View single record
- `POST /api/records` — **Admin Only**: Create new income/expense entry
- `PATCH /api/records/:id` — **Admin Only**: Update existing entry
- `DELETE /api/records/:id` — **Admin Only**: Soft delete record (isDeleted: true)

### Dashboard (Analytics & Insights)
- `GET /api/dashboard/overview` — Analyst/Admin: Summary totals + recent activity
- `GET /api/dashboard/categories` — Analyst/Admin: Category-wise breakdown
- `GET /api/dashboard/trends` — Analyst/Admin: Last 6 months income vs expense

### Users (Management)
- `GET /api/users` — **Admin Only**: List all registered users
- `PATCH /api/users/:id/role` — **Admin Only**: Change user role (admin/analyst/viewer)
- `PATCH /api/users/:id/status` — **Admin Only**: Activate/Deactivate user status

---

## ⚙️ Local Setup

1. **Clone and Install**:
```bash
git clone https://github.com/Satyam8589/zorvyn-finance-backend.git
cd zorvyn-finance-backend
npm install
```

2. **Environment Setup**:
- Create a `.env` file.
- Add your `DATABASE_URL` (PostgreSQL) and a secure `JWT_SECRET`.

3. **Database Migration & Seed**:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```
This will create your tables and a default **Admin** user:
- **Email**: `admin@zorvyn.io`
- **Password**: `Admin@123`

4. **Run Server**:
```bash
npm run dev
```

---

## ⚡ Design Decisions & Assumptions

### FinTech Data Precision
Financial amounts are stored as **integers** (e.g., paisa/cents) in the database to prevent floating-point precision errors during aggregations. For example, ₹50.00 is stored as `5000`.

### Soft Deletion
Records are never permanently deleted via the standard API to preserve the financial audit trail. Instead, an `isDeleted` flag is used, and the service layer automatically filters these out of all results.

### Authentication Strategy
A stateless JWT strategy with a 7-day expiration was chosen for simplicity and ease of testing. Tokens must be passed in the `Authorization: Bearer <token>` header.

### Validation Pattern
Every module (`auth`, `users`, `records`) has its own `validation.js` file using **Joi**. This ensures that "dirty" or malicious data never reaches the database.

---

## 📄 License
This project is for evaluation purposes only.
