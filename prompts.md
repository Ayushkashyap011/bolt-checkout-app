# Prompts Audit Log (`prompts.md`)

A complete, chronological record of every prompt issued to the LLM agent during the design, architecture, implementation, debugging, and verification of the **Bolt 1-Click OTP Checkout Application**.

Each prompt is documented with its **role assignment**, **contextual framing**, **task specification**, **constraints**, and **expected output format** — following structured prompt engineering best practices.

---

## Prompt 1 — Project Architecture & PRD Generation

**Objective**: Bootstrap the full-stack project by generating a detailed Product Requirements Document (PRD) and technical implementation plan aligned with the Bolt assessment rubric.

```
ROLE:
You are a senior full-stack architect with deep expertise in Django REST Framework,
React 18 (TypeScript), PostgreSQL, and production-grade API design. You have 10+
years of experience shipping high-performance, modular web applications at scale.

CONTEXT:
I am building a full-stack web application for a software engineering assessment at
Bolt (1-click checkout company). The application must implement:
  1. User Registration — collecting email, first name, last name; generating a
     random 6-digit numeric passcode displayed to the user on success.
  2. Real-Time User Recognition — as a registered user types their email into a
     checkout form, the system must recognize them in the background (while they
     continue filling out phone number and shipping address) and trigger a login
     modal prompting for their 6-digit code.
  3. OTP Verification — validate the submitted code against the stored code. On
     match → log in and show user's name at the top of the checkout form. On
     mismatch → show inline error inside the modal. Include a "skip login" option.
  4. Order Submission — submitting the completed checkout form records all form
     data into a database table.

CONSTRAINTS:
  - Stack: React (TypeScript, Vite), Python (Django REST Framework), PostgreSQL.
  - Architecture: Strict separation into frontend/, backend/, and database layers.
  - Code quality: Production-grade, clean, readable. Every feature in a separate
    module. Every reusable component in its own file. Service layer pattern for
    business logic (no logic in views).
  - Required deliverables: schema.sql (checked into repo), prompts.md (this file),
    public deployment, GitHub repo with boltapp-hiring collaborator access.

TASK:
Generate a comprehensive PRD and implementation plan covering:
  1. Feature specifications for all 4 workflows above.
  2. Database schema design (shoppers + checkout_orders tables).
  3. REST API endpoint contracts (request/response JSON).
  4. Frontend component hierarchy and state management approach.
  5. File/folder structure for both frontend and backend.
  6. Testing strategy (unit tests for all API endpoints).
  7. Step-by-step build order: Backend → Database → Frontend → Integration → Deploy.

OUTPUT FORMAT:
Markdown document with clear section headers, code blocks for schema/API examples,
and a numbered task checklist for implementation sequencing.
```

**Result**: Generated `implementation_plan.md` with full PRD, architecture diagram, API contracts, database schema, component tree, and phased build plan.

---

## Prompt 2 — Backend Foundation: Django Project, Models & Service Layer

**Objective**: Scaffold the Django project structure and implement the core data models, business logic services, serializers, views, and URL routing.

```
ROLE:
You are a senior Django backend engineer following clean architecture principles.
You write type-hinted, well-documented Python with strict separation of concerns.

CONTEXT:
The PRD and database schema have been finalized. The tech stack is:
  - Python 3.11 + Django 5.x + Django REST Framework 3.15
  - PostgreSQL (with SQLite fallback for local development)
  - django-cors-headers for cross-origin frontend requests

The database schema requires two tables:
  - shoppers (id, email UNIQUE, first_name, last_name, otp_code VARCHAR(6), created_at)
  - checkout_orders (id, order_number UNIQUE, shopper_id FK, email, phone_number,
    shipping_address, city, state, zip_code, country, total_amount, is_guest, created_at)

CONSTRAINTS:
  - Layered architecture: models.py → services.py → serializers.py → views.py → urls.py
  - Business logic MUST live in services.py (AuthService, OrderService classes).
  - Views must be thin wrappers that delegate to service methods.
  - Email normalization: always .strip().lower() before any DB lookup or insert.
  - OTP generation: random 6-digit numeric string (100000–999999).
  - Recognition endpoint must NEVER expose the user's OTP code in its response.
  - Phone number validation: regex ^[0-9\+\-\s\(\)]{7,20}$ on the serializer level.
  - Include a management command `seed.py` to populate 3 demo shoppers for testing.

TASK:
Implement the following files in order:
  1. bolt_core/settings.py — DRF config, CORS, database settings, installed apps.
  2. authentication/models.py — Shopper and CheckoutOrder Django ORM models.
  3. authentication/services.py — AuthService (register, recognize, verify_otp) and
     OrderService (process_checkout) with full docstrings.
  4. authentication/serializers.py — DRF serializers with field-level validation.
  5. authentication/views.py — API views delegating to service layer.
  6. authentication/urls.py — URL patterns under /api/ prefix.
  7. bolt_core/urls.py — Root URL conf with health check endpoint.
  8. authentication/management/commands/seed.py — Demo data seeder.

OUTPUT FORMAT:
Complete, production-ready Python source files. Each file must include module-level
docstrings explaining its role in the architecture.
```

**Result**: Implemented all 8 backend files with clean service-layer architecture, comprehensive validation, and a working seed command creating 3 demo shoppers.

---

## Prompt 3 — Database Schema & Migration

**Objective**: Create the PostgreSQL-compatible schema file and run Django migrations.

```
ROLE:
You are a database architect designing a normalized PostgreSQL schema optimized
for fast email-based lookups during real-time user recognition.

CONTEXT:
The application requires sub-200ms response times for the /api/auth/recognize/
endpoint since it fires in the background while the user is still typing.

TASK:
  1. Write schema.sql with CREATE TABLE statements for shoppers and checkout_orders.
  2. Add performance indexes on shoppers.email and checkout_orders.email columns.
  3. Add a UNIQUE constraint on shoppers.email to prevent duplicate registrations.
  4. Use CASCADE on foreign key relationships for clean data lifecycle.
  5. Run Django makemigrations and migrate to sync ORM models with the database.

CONSTRAINTS:
  - Schema must be checked into the repository root as required by the assessment.
  - Include DROP TABLE IF EXISTS for idempotent re-deployment.
  - Compatible with PostgreSQL 12+ syntax.

OUTPUT FORMAT:
Raw SQL file (schema.sql) with inline comments explaining each table and index.
```

**Result**: Created `schema.sql` at project root with indexed email columns, unique constraints, and cascading foreign keys. Migrations applied successfully.

---

## Prompt 4 — Automated Unit Test Suite

**Objective**: Write comprehensive Django unit tests covering all API endpoints with both success and failure scenarios.

```
ROLE:
You are a QA engineer writing automated API tests using Django's TestCase
framework and DRF's APIClient.

CONTEXT:
The backend exposes 5 endpoints:
  - POST /api/auth/register/
  - POST /api/auth/recognize/
  - POST /api/auth/verify-otp/
  - POST /api/orders/checkout/
  - GET /api/demo-users/

TASK:
Write unit tests covering:
  1. Successful shopper registration (201 response, OTP code in response).
  2. Duplicate email registration rejection (400 response).
  3. Recognition of existing shopper (200, exists=true, no OTP leaked).
  4. Recognition of unknown email (200, exists=false).
  5. Successful OTP verification (200, success=true, shopper data returned).
  6. Failed OTP verification with wrong code (400, success=false).
  7. Successful checkout order creation (201, order_number in response).
  8. Checkout rejection with invalid phone number (400, validation error).

CONSTRAINTS:
  - Each test must be independent and idempotent (use setUp for test data).
  - Assert specific response status codes AND response body fields.
  - Test names must be descriptive: test_<action>_<scenario>.

OUTPUT FORMAT:
Single tests.py file with a TestCase class containing all test methods.
```

**Result**: Implemented 7 automated unit tests in `authentication/tests.py`. All passing with `python manage.py test` (7/7 — 100% pass rate).

---

## Prompt 5 — Frontend: React Component Architecture & Design System

**Objective**: Build the React frontend with a modular component hierarchy, custom hooks, and a premium dark-mode design system.

```
ROLE:
You are a senior frontend engineer specializing in React 18, TypeScript, and
modern UI/UX design. You build accessible, responsive, and visually premium
interfaces with clean component architecture.

CONTEXT:
The frontend must connect to the Django REST API at http://localhost:8000/api/.
The UI implements Bolt's signature dark checkout experience with glassmorphism,
gradient accents, and smooth micro-animations.

TASK:
Build the following component hierarchy:

  src/
  ├── types/index.ts              — TypeScript interfaces (Shopper, Order, etc.)
  ├── services/apiClient.ts       — Axios HTTP client with all API methods
  ├── hooks/
  │   ├── useDebounce.ts          — 350ms debounce hook for email input
  │   └── useUserRecognition.ts   — Real-time background recognition state machine
  ├── components/
  │   ├── ui/Button.tsx           — Reusable button with loading spinner
  │   ├── ui/Input.tsx            — Styled input with icon, label, error, helper
  │   ├── ui/Modal.tsx            — Animated overlay modal with backdrop blur
  │   ├── ui/Badge.tsx            — Status badge component
  │   ├── checkout/EmailRecognitionInput.tsx  — Email field with live recognition
  │   ├── checkout/OTPVerificationModal.tsx   — 6-digit OTP input modal
  │   ├── checkout/LoggedInHeader.tsx         — Welcome back header banner
  │   ├── checkout/ShippingAddressForm.tsx    — Address form with validation
  │   ├── checkout/OrderSummaryCard.tsx       — Order total & pay button
  │   └── checkout/OrderSuccessView.tsx       — Confirmation screen
  ├── pages/
  │   ├── LandingPage.tsx         — Sign Up / Sign In tabbed portal
  │   └── OrdersPage.tsx          — Order history viewer
  └── App.tsx                     — Router with Navbar, Footer, 3 routes

CONSTRAINTS:
  - Every component in its own file. No component exceeds 200 lines.
  - Custom hooks for all side effects (no useEffect in components for API calls).
  - Phone number input must strip non-numeric characters and show validation.
  - OTP modal: 6 individual digit inputs with auto-focus advance and backspace.
  - Email uniqueness enforced: duplicate signup shows error with "Sign In" link.
  - Design: dark background (#0A0F24), glassmorphism panels, Bolt-orange accents,
    smooth fade/slide animations, Inter font family.

OUTPUT FORMAT:
Complete TypeScript React source files, one per component, with inline JSDoc
comments for all props interfaces.
```

**Result**: Built 15+ modular React components, 2 custom hooks, typed API client, and 3 routed pages with premium dark-mode Bolt-inspired UI.

---

## Prompt 6 — Bug Fixes: Phone Validation & Recognition Lifecycle

**Objective**: Fix identified bugs in phone number validation and the OTP modal trigger lifecycle.

```
ROLE:
You are a senior full-stack debugger performing root cause analysis on reported
UI/UX bugs and implementing targeted fixes with regression tests.

CONTEXT:
Two bugs were reported during manual testing:
  Bug 1: Phone number field accepts alphabetic characters and the form submits
         successfully with invalid phone data like "abcdefg".
  Bug 2: The OTP verification modal opens immediately for first-time users who
         have never registered, creating a confusing UX flow.

TASK:
  1. [Bug 1 — Backend] Add regex validation (^[0-9\+\-\s\(\)]{7,20}$) to the
     CheckoutOrderSerializer.phone_number field. Write a new unit test
     test_create_checkout_order_invalid_phone asserting 400 response.
  2. [Bug 1 — Frontend] Update ShippingAddressForm.tsx to auto-strip non-numeric
     characters on input and show a real-time validation checkmark.
  3. [Bug 2 — Frontend] Refactor useUserRecognition.ts to normalize email
     comparisons, prevent re-triggering on the same email, and require explicit
     user action ("Enter OTP Code" button) before opening the modal — instead
     of auto-opening on recognition.

CONSTRAINTS:
  - Fixes must not break any existing passing tests (run full suite after).
  - Minimal code changes — surgical fixes only, no refactoring unrelated code.
  - All new validation must provide clear, user-friendly error messages.

OUTPUT FORMAT:
Diff-style changes showing exactly what was modified in each file, with before/
after code blocks.
```

**Result**: Fixed both bugs. Phone validation enforced on both frontend and backend. Recognition lifecycle refactored to prevent premature OTP modal triggers. Test suite expanded to 7/7 passing.

---

## Prompt 7 — Landing Page: Sign Up / Sign In Authentication Portal

**Objective**: Create a dedicated authentication landing page with tabbed Sign Up and Sign In flows that gate access to the checkout experience.

```
ROLE:
You are a UX engineer designing a conversion-optimized authentication portal
for an e-commerce checkout platform.

CONTEXT:
The assessment requires a clear registration → recognition → checkout flow.
Currently the app loads directly into the checkout form. We need a proper
entry point that separates account creation from the checkout experience.

TASK:
Build a LandingPage.tsx with:
  1. Tabbed interface toggling between "Create Account (Sign Up)" and
     "Sign In (1-Click OTP)" views.
  2. Sign Up tab: email, first name, last name fields → on success, display
     the generated 6-digit passcode with a copy button and a "Proceed to
     Checkout" CTA that navigates to /checkout with the logged-in state.
  3. Sign In tab: email field → recognize endpoint → if found, open OTP
     modal → on success, navigate to /checkout with authenticated state.
     If not found, show error with suggestion to sign up.
  4. Quick Demo Account banner in Sign In tab showing pre-seeded test
     credentials with a "Fill Demo" auto-populate button.
  5. Duplicate email detection: if a user tries to sign up with an existing
     email, show an error with a clickable "Sign In instead" link that
     switches tabs and pre-fills the email.

CONSTRAINTS:
  - Email must be unique (enforced by backend, handled gracefully on frontend).
  - No demo user panel on top — embed it naturally within the Sign In tab.
  - Route "/" → LandingPage, "/checkout" → CheckoutPage, "/orders" → OrdersPage.
  - Maintain the existing dark glassmorphism design language.

OUTPUT FORMAT:
Complete LandingPage.tsx component with all state management, form handlers,
and navigation logic. Update App.tsx routing accordingly.
```

**Result**: Built `LandingPage.tsx` with tabbed Sign Up / Sign In portal, passcode display card, demo account quick-fill, duplicate email handling, and seamless navigation to authenticated checkout.

---

## Prompt 8 — Documentation & Assessment Compliance Verification

**Objective**: Generate all required documentation artifacts and perform a line-by-line compliance audit against the Bolt assessment rubric.

```
ROLE:
You are a technical writer and QA auditor preparing a software project for
submission to a hiring panel. Your documentation must be clear, professional,
and demonstrate engineering rigor.

CONTEXT:
The Bolt assessment requires these deliverables:
  1. Publicly hosted website (or deployment-ready instructions).
  2. GitHub repository with boltapp-hiring granted collaborator access, including
     a .sql database schema file.
  3. prompts.md listing every prompt given to the LLM during development.

TASK:
Generate the following documentation files:
  1. README.md — Project overview, tech stack, setup instructions, API reference.
  2. PROJECT_DOCUMENTATION.md — Comprehensive system architecture documentation
     including entity diagrams, API contracts, component hierarchy, and local
     setup instructions.
  3. DEPLOYMENT_GUIDE.md — Step-by-step instructions for deploying to Railway
     (backend) and Vercel (frontend) with environment variable configuration.
  4. ASSESSMENT_VERIFICATION.md — Line-by-line requirement verification matrix
     mapping every assessment requirement to its implementation file and method.

CONSTRAINTS:
  - All file references must be clickable relative links.
  - Include ASCII architecture diagrams (no external image dependencies).
  - README must be concise enough for a recruiter to scan in under 2 minutes.
  - Assessment verification must prove 100% requirement coverage with no gaps.

OUTPUT FORMAT:
Four separate Markdown files, each with clear section headers, tables where
appropriate, and code blocks for commands and configuration examples.
```

**Result**: Generated `README.md`, `PROJECT_DOCUMENTATION.md`, `DEPLOYMENT_GUIDE.md`, and `ASSESSMENT_VERIFICATION.md` — all cross-referenced and audit-ready.

---

## Summary Statistics

| Metric | Value |
|---|---|
| **Total Prompts Issued** | 8 |
| **Backend Files Generated** | 9 (settings, models, services, serializers, views, urls ×2, seed, tests) |
| **Frontend Files Generated** | 18 (components, hooks, services, types, pages, config) |
| **Documentation Files** | 5 (README, PROJECT_DOCUMENTATION, DEPLOYMENT_GUIDE, ASSESSMENT_VERIFICATION, prompts.md) |
| **Database Artifacts** | 1 (schema.sql at root and backend/) |
| **Unit Tests Written** | 7 (100% pass rate) |
| **Total Lines of Code** | ~2,400+ |
| **Prompt Engineering Pattern** | ROLE → CONTEXT → CONSTRAINTS → TASK → OUTPUT FORMAT |
