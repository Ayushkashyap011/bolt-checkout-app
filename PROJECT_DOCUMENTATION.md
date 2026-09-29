# Bolt 1-Click OTP Checkout — Comprehensive System Documentation

## Executive Summary
This application is a production-grade full-stack implementation of **Bolt's signature 1-Click Checkout and Real-Time User Recognition system**. It detects registered shoppers in real-time as they type their email address in the checkout form, presents a 6-digit numeric passcode verification modal, logs them in seamlessly upon code verification, and persists completed checkout orders.

---

## 🏗 High-Level System Architecture

```
                                  ┌──────────────────────────────┐
                                  │      React + Vite App        │
                                  │   (TypeScript & Tailwind)    │
                                  └──────────────┬───────────────┘
                                                 │
                                     HTTP / REST API Calls
                                                 │
                                  ┌──────────────▼───────────────┐
                                  │   Django REST Framework API  │
                                  │     (Python 3.11 Service)    │
                                  └──────────────┬───────────────┘
                                                 │
                                      SQL Queries / ORM
                                                 │
                                  ┌──────────────▼───────────────┐
                                  │     PostgreSQL Database      │
                                  │  (shoppers & checkout_orders)│
                                  └──────────────────────────────┘
```

---

## 📂 Project Directory Structure

```
bolt_checkout_app/
├── schema.sql                               # PostgreSQL DB Schema Script
├── prompts.md                               # LLM Prompt Engineering Audit Log
├── PROJECT_DOCUMENTATION.md                 # System Architecture & API Specs
├── backend/
│   ├── manage.py
│   ├── schema.sql
│   ├── bolt_core/                           # Django Settings & Routing
│   │   ├── settings.py                      # REST, CORS, DB config
│   │   └── urls.py                          # Master URL router
│   └── authentication/                      # Auth & Order App
│       ├── models.py                        # Shopper & CheckoutOrder ORM Models
│       ├── services.py                      # Business Logic Layer (AuthService, OrderService)
│       ├── serializers.py                   # DRF Input/Output Serializers
│       ├── views.py                         # REST API ViewSets
│       ├── urls.py                          # Endpoint Routing
│       ├── tests.py                         # Automated Unit Tests
│       └── management/commands/seed.py      # Demo Data Seeder Command
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── App.tsx                          # Core Application Controller
        ├── index.css                        # Tailwind directives & Glassmorphism styles
        ├── types/index.ts                   # TypeScript Interfaces
        ├── services/apiClient.ts            # Axios Client & API Calls
        ├── hooks/
        │   ├── useDebounce.ts               # 350ms Input Debounce Hook
        │   └── useUserRecognition.ts        # Real-time Background Recognition Hook
        └── components/
            ├── ui/                          # Button, Input, Modal, Badge
            ├── checkout/                    # EmailInput, OTPModal, Header, AddressForm, OrderSummary, OrderSuccess
            ├── registration/                # RegistrationForm, DemoShopperBanner
            └── layout/                      # Navbar, Footer
```

---

## 🔑 Core Features & Workflows Explained

### 1. Registration Flow
- **Fields**: Email Address, First Name, Last Name.
- **Passcode Generation**: Backend `AuthService.generate_6digit_otp()` creates a random 6-digit numeric string (e.g. `482910`).
- **Response**: Displays a secure passcode card in the UI allowing the user to copy their code for future checkout testing.

### 2. Real-Time Background Recognition Flow
- **Email Validation**: Form validates email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- **Debounced Observer**: `useDebounce` hook waits 350ms after the user stops typing to trigger `POST /api/auth/recognize/`.
- **Zero UI Interruption**: The request executes in the background while the user continues filling out their phone number and shipping address.
- **Security Scoping**: The `/recognize/` response returns `{ "exists": true, "first_name": "..." }`, but **never** leaks the user's OTP passcode.

### 3. OTP Passcode Login Modal Flow
- **Modal Trigger**: Triggered automatically when recognition returns `exists: true`.
- **Passcode Inputs**: 6 individual numeric digit fields with auto-focus advancing and backspace focus retention.
- **Guest Skip Option**: Includes a **"Skip login & continue as guest"** button allowing shoppers to dismiss the modal and check out without logging in.
- **Mismatch Error Handling**: If an incorrect code is entered, an inline error alert is displayed inside the modal without closing it.
- **Match Login**: On valid OTP match, modal closes, user state is set to logged-in, and a **"Welcome Back, [First Name] [Last Name]!"** header appears at the top of the checkout form.

### 4. Order Submission & Database Persistence
- Submitting the checkout form calls `POST /api/orders/checkout/`.
- Automatically links the order to the registered `Shopper` record if logged in, or sets `is_guest: true`.
- Displays order reference number (`ORD-XXXXXX`) and confirmation summary.

---

## 🗄 Database Schema Design (`schema.sql`)

### `shoppers` Table
| Field | Type | Modifiers | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Unique Shopper ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | Primary search index for background recognition |
| `first_name` | VARCHAR(100) | NOT NULL | User's first name |
| `last_name` | VARCHAR(100) | NOT NULL | User's last name |
| `otp_code` | VARCHAR(6) | NOT NULL | 6-digit numeric passcode |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Registration timestamp |

### `checkout_orders` Table
| Field | Type | Modifiers | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Order Record ID |
| `order_number` | VARCHAR(32) | UNIQUE, NOT NULL, INDEX | Order reference string (e.g. `ORD-849201`) |
| `shopper_id` | INT | FOREIGN KEY (shoppers.id) | Optional link to registered shopper |
| `email` | VARCHAR(255) | NOT NULL, INDEX | Customer email address |
| `phone_number` | VARCHAR(30) | NOT NULL | Contact phone number |
| `shipping_address`| VARCHAR(255) | NOT NULL | Street shipping address |
| `city` | VARCHAR(100) | NOT NULL | City |
| `state` | VARCHAR(100) | NOT NULL | State / Region |
| `zip_code` | VARCHAR(20) | NOT NULL | Postal code |
| `country` | VARCHAR(100) | DEFAULT 'United States' | Country |
| `total_amount` | DECIMAL(10,2)| DEFAULT 99.99 | Order total amount |
| `is_guest` | BOOLEAN | DEFAULT FALSE | Guest vs Logged-In flag |

---

## 🌐 REST API Endpoints Specification

### 1. `POST /api/auth/register/`
**Request Payload:**
```json
{
  "email": "alex.merchant@bolt.com",
  "first_name": "Alex",
  "last_name": "Merchant"
}
```
**Response (201 Created):**
```json
{
  "message": "Shopper registered successfully",
  "shopper": {
    "id": 1,
    "email": "alex.merchant@bolt.com",
    "first_name": "Alex",
    "last_name": "Merchant",
    "otp_code": "482910",
    "created_at": "2026-09-28T16:14:00Z"
  }
}
```

### 2. `POST /api/auth/recognize/`
**Request Payload:**
```json
{
  "email": "alex.merchant@bolt.com"
}
```
**Response (200 OK):**
```json
{
  "exists": true,
  "email": "alex.merchant@bolt.com",
  "first_name": "Alex",
  "last_name": "Merchant"
}
```

### 3. `POST /api/auth/verify-otp/`
**Request Payload:**
```json
{
  "email": "alex.merchant@bolt.com",
  "otp_code": "482910"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP verification successful.",
  "shopper": {
    "id": 1,
    "email": "alex.merchant@bolt.com",
    "first_name": "Alex",
    "last_name": "Merchant"
  }
}
```

### 4. `POST /api/orders/checkout/`
**Request Payload:**
```json
{
  "email": "alex.merchant@bolt.com",
  "phone_number": "+1 555-0199",
  "shipping_address": "500 Howard St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94105",
  "country": "United States",
  "is_guest": false
}
```
**Response (201 Created):**
```json
{
  "message": "Checkout order recorded successfully.",
  "order": {
    "id": 1,
    "order_number": "ORD-482910",
    "email": "alex.merchant@bolt.com",
    "phone_number": "+1 555-0199",
    "shipping_address": "500 Howard St",
    "city": "San Francisco",
    "state": "CA",
    "zip_code": "94105",
    "country": "United States",
    "total_amount": "99.99",
    "status": "COMPLETED",
    "is_guest": false,
    "created_at": "2026-09-28T16:15:00Z"
  }
}
```

---

## ⚡ How to Run Locally

### Backend Setup
1. Open terminal in `backend/` directory.
2. Activate virtual environment:
   ```bash
   venv\Scripts\activate      # Windows
   source venv/bin/activate    # Mac/Linux
   ```
3. Run migrations and seed test data:
   ```bash
   python manage.py migrate
   python manage.py seed
   ```
4. Run automated test suite:
   ```bash
   python manage.py test
   ```
5. Start development server on port 8000:
   ```bash
   python manage.py runserver 8000
   ```

### Frontend Setup
1. Open terminal in `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Open browser at `http://localhost:5173`.
