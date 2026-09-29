# ⚡ Bolt 1-Click OTP Checkout & User Recognition System

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript%20%2B%20React%20Router-0052FF?logo=react)](https://react.dev/)
[![Django](https://img.shields.io/badge/Backend-Python%20%2F%20Django%205-092E20?logo=django)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2012%2B-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Unit%20Tests-8%2F8%20Passing-10B981)](#-automated-testing)

A production-grade full-stack web application built for the **Bolt Software Engineer** technical assessment. It features a **Landing Page (Sign Up & Sign In Portal)** that redirects shoppers directly to Bolt's **1-Click Checkout & Real-Time User Recognition** flow.

---

## 🌐 Multi-Page Routes & Application Flow

1. **` / ` — Landing Portal (Sign Up & Sign In)**:
   - **Sign Up Tab**: Enforces unique email registration. Generates and displays a random 6-digit numeric OTP passcode card with copy button, and a **"Proceed to 1-Click Checkout ⚡"** redirection button.
   - **Sign In Tab**: Recognizes existing shoppers, prompts for their 6-digit OTP passcode in a modal popup, and redirects to checkout upon verification.
2. **` /checkout ` — Bolt 1-Click Checkout Page**:
   - Real-time debounced background email recognition observer.
   - Form inputs with strict phone number regex validation (`^[0-9\+\-\s\(\)]{7,20}$`) and live checkmarks.
   - Order submission recording payload into PostgreSQL `checkout_orders` table.
3. **` /orders ` — Live Database Orders Dashboard**:
   - Dedicated page displaying all recorded checkout orders stored in PostgreSQL.

---

## 🎯 Assessment Requirements Audit

| Goal / Requirement from PDF | Status | Implementation Details |
|---|---|---|
| **1a. Registration Flow** | ✅ Complete | Route `/`: Unique email constraint enforced. Collects email, first name, last name -> generates random 6-digit numeric OTP passcode card. |
| **1b. Real-Time Recognition** | ✅ Complete | Route `/checkout`: Debounced 350ms background check on email input. Checks user existence without UI delay. |
| **1b. OTP Verification Modal** | ✅ Complete | Routes `/` & `/checkout`: Modal prompts for 6-digit code. Validates against registration code. Shows error on mismatch, logs in on match. |
| **1b. Skip / Guest Option** | ✅ Complete | Route `/checkout`: Includes *"Skip login & continue as guest"* button closing modal and permitting guest checkout. |
| **1b. Logged-In Header** | ✅ Complete | Route `/checkout`: Displays *"Welcome back [Name]!"* banner at top of checkout form once authenticated. |
| **1b. Order Persistence** | ✅ Complete | Submitting checkout form records order payload into `checkout_orders` table. Viewable on `/orders` dashboard. |
| **Checked-in `.sql` Schema** | ✅ Complete | Checked in at repository root: [`schema.sql`](./schema.sql) with table definitions and indexes. |
| **Audit Log `prompts.md`** | ✅ Complete | Checked in at repository root: [`prompts.md`](./prompts.md) documenting every prompt used. |

---

## ⚡ Pre-Seeded Test Accounts

| Email Address | First Name | Last Name | 6-Digit OTP Passcode |
|---|---|---|---|
| `alex.merchant@bolt.com` | Alex | Merchant | **`482910`** |
| `sarah.connor@example.com` | Sarah | Connor | **`930182`** |
| `john.doe@example.com` | John | Doe | **`123456`** |

---

## 🛠 Local Setup

### 1. Backend API (Django + Python 3.11)
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver 8000
```
Backend API runs at `http://127.0.0.1:8000/api/`.

### 2. Run Backend Unit Tests (8/8 Passing)
```bash
python manage.py test
```

### 3. Frontend Web App (React 18 + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend Web App runs at `http://localhost:5173`.
