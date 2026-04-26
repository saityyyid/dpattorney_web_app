# Product Requirements Document (PRD)
# Legal Operations Hub

**Version:** 1.0  
**Date:** April 2026  
**Status:** Draft  
**Author:** Product Team  
**Stakeholders:** Law Firm Management, Legal Operations, Finance Team, IT Security

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Goals & Success Metrics](#3-product-goals--success-metrics)
4. [Target Users & Personas](#4-target-users--personas)
5. [Functional Requirements](#5-functional-requirements)
   - 5.1 [Foundation: Auth & Core Entities](#51-foundation-auth--core-entities)
   - 5.2 [Time-Tracking Module](#52-time-tracking-module)
   - 5.3 [Financial Engine](#53-financial-engine)
   - 5.4 [Dashboard & Analytics](#54-dashboard--analytics)
   - 5.5 [Client Portal](#55-client-portal)
   - 5.6 [Notifications & Document Management](#56-notifications--document-management)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [Data Model & Schema](#8-data-model--schema)
9. [User Flows & Journeys](#9-user-flows--journeys)
10. [UI/UX Requirements](#10-uiux-requirements)
11. [Security & Compliance](#11-security--compliance)
12. [Integration Requirements](#12-integration-requirements)
13. [Risk Assessment & Mitigation](#13-risk-assessment--mitigation)
14. [Release Roadmap](#14-release-roadmap)
15. [Appendix](#15-appendix)

---

## 1. Executive Summary

**Legal Operations Hub** is an integrated case management and financial monitoring web application designed specifically for mid-sized law firms. The platform bridges the gap between legal operations and financial transparency by providing a unified system for case tracking, billable hour recording, expense management, automated invoicing, and client communication.

Built on a modern serverless architecture (Next.js + Supabase), the application prioritizes data security, audit compliance, and operational efficiency. The product follows an iterative development approach, delivering core functionality first and expanding into advanced analytics and client-facing features.

**Key Value Propositions:**
- **Operational Efficiency:** Reduce administrative overhead in time tracking and billing by 60%.
- **Financial Transparency:** Real-time visibility into retainer utilization, outstanding receivables, and case profitability.
- **Client Trust:** Secure, read-only client portal providing transparent access to case status and financial summaries.
- **Compliance:** Immutable audit trails for all financial and client data modifications.

---

## 2. Problem Statement

### Current Pain Points

1. **Fragmented Time Tracking:** Lawyers rely on manual spreadsheets or disparate tools to record billable hours, leading to revenue leakage (estimated 15-20% of billable time goes unrecorded).
2. **Reactive Financial Monitoring:** Partners lack real-time visibility into retainer burn rates. Budget overruns are discovered only after they occur, damaging client relationships.
3. **Manual Invoicing:** Invoices are compiled manually from time logs and expense receipts, consuming 8-12 hours per month per partner and increasing error rates.
4. **Poor Client Communication:** Clients frequently request status updates and expense breakdowns via email/phone, creating repetitive administrative work.
5. **Data Security Gaps:** Sensitive client and financial data is stored across unsecured spreadsheets and personal drives, violating professional responsibility standards.
6. **No Audit Trail:** Changes to financial records (retainer adjustments, write-offs) are not tracked, creating liability exposure.

### Opportunity

A unified, secure, and user-friendly platform that integrates case lifecycle management with financial operations, designed with law firm workflows and compliance requirements as first-class constraints.

---

## 3. Product Goals & Success Metrics

### Primary Goals

| Goal ID | Goal Description | Target Metric |
|---------|-----------------|---------------|
| G1 | Streamline billable hour capture | 95% of billable hours recorded within 24 hours of work completion |
| G2 | Prevent retainer overruns | 100% of cases approaching budget threshold trigger automated alerts |
| G3 | Reduce invoicing cycle time | Invoice generation time reduced from 3 days to < 30 minutes |
| G4 | Improve client satisfaction | Client portal adoption rate > 80% within 3 months of launch |
| G5 | Ensure compliance | 100% of financial data modifications captured in immutable audit log |

### Success Metrics (KPIs)

**Operational KPIs:**
- Average time to log a billable hour: < 2 minutes
- Invoice accuracy rate: > 99%
- Cases with active budget monitoring: 100%

**Financial KPIs:**
- Reduction in unbilled time (revenue leakage): < 5%
- Days Sales Outstanding (DSO): < 45 days
- Retainer utilization visibility: Real-time

**Adoption KPIs:**
- Daily Active Users (DAU) / Monthly Active Users (MAU): > 70%
- Feature adoption (Time Tracking, Expenses, Invoicing): > 85% per feature
- Client portal logins per month: > 2 per active client

---

## 4. Target Users & Personas

### Persona 1: Managing Partner ("Diana")
- **Role:** Firm owner, strategic decision maker, ultimate financial responsibility.
- **Needs:** High-level financial dashboards, cash flow visibility, budget oversight, audit compliance.
- **Pain Points:** Cannot quickly determine firm profitability, discovers budget issues too late.
- **Key Features:** Financial Dashboard, Budget Alerts, Audit Logs, Invoice Approval.

### Persona 2: Associate Lawyer ("Budi")
- **Role:** Handles 15-20 active cases, responsible for time tracking and case documentation.
- **Needs:** Frictionless time tracking, clear case assignments, mobile-friendly access.
- **Pain Points:** Forgets to log hours, spends too much time on administrative tasks.
- **Key Features:** Floating Timer Widget, Case Detail View, Time Log History.

### Persona 3: Finance/Operations Staff ("Sari")
- **Role:** Manages invoicing, expense verification, and client billing inquiries.
- **Needs:** Automated invoice generation, expense receipt management, receivables tracking.
- **Pain Points:** Manual invoice compilation, chasing missing receipts, answering repetitive client billing questions.
- **Key Features:** Invoice Generation, Expense Tracking, Aging Receivables Report.

### Persona 4: Corporate Client ("PT Maju Jaya")
- **Role:** In-house legal counsel managing external law firm relationships.
- **Needs:** Transparent view of case status, expense justification, invoice history.
- **Pain Points:** Opaque billing, delayed status updates, difficulty verifying expense legitimacy.
- **Key Features:** Client Portal (Case Status, Expense List, Invoice List).

---

## 5. Functional Requirements

### 5.1 Foundation: Auth & Core Entities

#### 5.1.1 Authentication & Authorization
- **FR-AUTH-01:** System shall support email/password authentication via Supabase Auth.
- **FR-AUTH-02:** System shall support role-based access control (RBAC) with four roles: ADMIN, PARTNER, LAWYER, CLIENT.
- **FR-AUTH-03:** System shall enforce middleware-based session refresh for all protected routes.
- **FR-AUTH-04:** System shall restrict route access based on role (e.g., CLIENT cannot access `/dashboard` or `/cases` internal views).
- **FR-AUTH-05:** System shall store user profiles synchronized with the authentication provider.

#### 5.1.2 Client Management
- **FR-CLI-01:** Users with ADMIN/PARTNER roles shall be able to create, read, update, and soft-delete client records.
- **FR-CLI-02:** Client records shall contain: name, email, phone, address, company name (optional), tax ID (optional).
- **FR-CLI-03:** System shall display total active cases and total retainer value per client in the client list view.
- **FR-CLI-04:** Soft-deleted clients shall remain in the database but be excluded from active lists and new case assignments.
- **FR-CLI-05:** Client list shall support server-side pagination and search by name or email.

#### 5.1.3 Case Management
- **FR-CAS-01:** Users shall be able to create cases with: case number (auto-generated, unique), title, description, status, client assignment, lawyer assignment, retainer amount, deposit balance.
- **FR-CAS-02:** Case status shall follow a state machine: OPEN → IN_PROGRESS → ON_HOLD → CLOSED → ARCHIVED. Direct transitions from OPEN to CLOSED require PARTNER approval.
- **FR-CAS-03:** Case list view shall display: case number, title, client name, assigned lawyer, status, retainer amount, and a visual progress bar showing budget utilization.
- **FR-CAS-04:** Budget utilization shall be calculated as: `(SUM(TimeLog fees) + SUM(Expense amounts)) / Retainer Amount × 100%`.
- **FR-CAS-05:** Cases shall be filterable by status, lawyer, client, and budget alert status.

### 5.2 Time-Tracking Module

#### 5.2.1 Time Log Entity
- **FR-TIME-01:** Time logs shall contain: ID, case reference, user reference, start time, end time, duration (minutes), hourly rate (snapshot at creation), description, billed status, invoice reference (nullable).
- **FR-TIME-02:** Hourly rate shall be copied from the user's profile at the time of log creation and stored immutably in the log record.
- **FR-TIME-03:** Duration shall be automatically computed from start and end times.
- **FR-TIME-04:** Validation: duration must be > 0 and ≤ 1440 minutes (24 hours).
- **FR-TIME-05:** Time logs with `isBilled = true` shall be non-editable and non-deletable by any role.

#### 5.2.2 Floating Timer Widget
- **FR-TIME-06:** System shall provide a persistent floating widget accessible from any page for authenticated LAWYER users.
- **FR-TIME-07:** Widget shall support: Start (with case selection), Pause/Resume, Stop, and Reset.
- **FR-TIME-08:** Case selection dropdown shall only display cases assigned to the current user with status OPEN or IN_PROGRESS.
- **FR-TIME-09:** Upon stopping the timer, system shall display a modal pre-filled with duration and requiring a description before saving.
- **FR-TIME-10:** Widget shall display elapsed time in HH:MM:SS format.

#### 5.2.3 Time Log Management
- **FR-TIME-11:** Users shall be able to view their time log history at `/time-logs`.
- **FR-TIME-12:** Time log list shall support filtering by date range, case, and billed status.
- **FR-TIME-13:** Users shall be able to manually add time logs (back-dated entries) with case selection, date, duration, and description.
- **FR-TIME-14:** Edit and delete operations shall only be permitted on unbilled logs owned by the user (or by ADMIN/PARTNER roles).

### 5.3 Financial Engine

#### 5.3.1 Expense Tracking
- **FR-EXP-01:** Expense records shall contain: ID, case reference, category (COURT_FEE, TRANSPORT, STAMP_DUTY, DOCUMENTATION, WITNESS_FEE, RESEARCH, OTHER), amount, date, description, receipt URL (Supabase Storage), billed status, invoice reference.
- **FR-EXP-02:** Users shall be able to upload receipt images/PDFs to Supabase Storage with automatic file type and size validation (max 10MB).
- **FR-EXP-03:** Images shall be compressed client-side before upload to optimize storage usage.
- **FR-EXP-04:** Expense list per case shall display category, amount, date, description, and thumbnail preview of receipt.
- **FR-EXP-05:** Expense summary cards shall show total per category for the selected case.

#### 5.3.2 Automated Invoicing
- **FR-INV-01:** System shall support invoice records with: ID, case reference, invoice number (auto-generated format: INV-YYYY-SEQUENCE), issue date, due date, status, notes, subtotal, tax rate, tax amount, total, paid amount.
- **FR-INV-02:** Invoice generation shall be an atomic database transaction comprising:
  1. Create invoice record with calculated totals.
  2. Mark all selected unbilled time logs as billed and link to invoice.
  3. Mark all selected unbilled expenses as billed and link to invoice.
  4. Create audit log entry for invoice creation.
- **FR-INV-03:** Invoice preview modal shall display all items to be included (time logs and expenses) with individual and total amounts before confirmation.
- **FR-INV-04:** Only ADMIN and PARTNER roles shall be authorized to generate invoices.
- **FR-INV-05:** Invoice status transitions: DRAFT → SENT → UNPAID → PARTIAL/PAID/OVERDUE.
- **FR-INV-06:** System shall support recording partial payments against an invoice, updating `paidAmount` and status accordingly.

#### 5.3.3 Budget Alert System
- **FR-BUD-01:** System shall continuously calculate total case expenditure: `totalUsed = SUM(TimeLog fees) + SUM(Expense amounts)`.
- **FR-BUD-02:** When `(totalUsed / retainerAmount) >= (budgetAlertThreshold / 100)`, system shall display a persistent alert banner on the case detail page.
- **FR-BUD-03:** When `totalUsed > retainerAmount`, system shall display an "OVER BUDGET" badge and trigger notifications to PARTNER and assigned LAWYER.
- **FR-BUD-04:** Budget alert threshold shall be configurable per case (default 80%).
- **FR-BUD-05:** Progress bar visualization shall use color coding: green (< 50%), yellow (50-80%), red (> 80%).

### 5.4 Dashboard & Analytics

#### 5.4.1 Internal Financial Dashboard
- **FR-DASH-01:** Dashboard shall be accessible at `/dashboard` and restricted to ADMIN, PARTNER, and LAWYER roles.
- **FR-DASH-02:** Dashboard shall display "Cash Flow This Month" card: sum of `paidAmount` from invoices with status PAID updated in the current month.
- **FR-DASH-03:** Dashboard shall display "Outstanding Receivables" card: sum of `(total - paidAmount)` from invoices with status UNPAID or OVERDUE.
- **FR-DASH-04:** Dashboard shall display "Billable Hours This Week" card: total hours logged by all lawyers in the current week (Sunday-Saturday).
- **FR-DASH-05:** Dashboard shall include a bar chart showing cash flow trend (paid vs outstanding) over the last 6 months.
- **FR-DASH-06:** Dashboard shall include a donut chart showing case distribution by status.
- **FR-DASH-07:** Dashboard shall include a horizontal bar chart showing top 5 lawyers by billable hours for the current month.
- **FR-DASH-08:** Dashboard shall include an "Aging Receivables" table grouping outstanding invoices by age: 0-30 days, 31-60 days, 61-90 days, >90 days.

### 5.5 Client Portal

#### 5.5.1 Portal Access & Navigation
- **FR-PORT-01:** Client Portal shall be accessible at `/portal` and restricted to users with CLIENT role.
- **FR-PORT-02:** CLIENT users shall only see cases where their linked client ID matches the case's client ID.
- **FR-PORT-03:** Portal shall have a simplified navigation: My Cases, My Invoices.

#### 5.5.2 Case Visibility (Read-Only)
- **FR-PORT-04:** Case detail view shall display: case number, title, status, and a timeline of status changes (anonymized as "Team Kami" without specific lawyer names).
- **FR-PORT-05:** Expense list shall display: category, amount, date, and description. It shall NOT display who recorded the expense.
- **FR-PORT-06:** Time log list shall display: date, duration, and description of work performed. It shall NOT display the lawyer's name or hourly rate.
- **FR-PORT-07:** Financial summary shall show: total used, retainer amount, and deposit balance as a progress bar.

#### 5.5.3 Invoice Visibility
- **FR-PORT-08:** Client shall see a list of their invoices: invoice number, issue date, due date, status, total amount.
- **FR-PORT-09:** Client shall be able to view invoice details and download invoice PDF (when feature is available).

### 5.6 Notifications & Document Management

#### 5.6.1 Notification System
- **FR-NOT-01:** System shall maintain a notification entity: ID, user ID, title, message, type, read status, optional deep link URL.
- **FR-NOT-02:** System shall automatically generate notifications for events:
  - Budget threshold reached (recipients: PARTNER, assigned LAWYER).
  - Invoice becomes overdue (recipients: PARTNER).
  - Case assigned to lawyer (recipient: assigned LAWYER).
- **FR-NOT-03:** Users shall see an unread notification badge in the navbar.
- **FR-NOT-04:** Users shall be able to view, mark as read, and dismiss notifications via a dropdown panel.

#### 5.6.2 Document Management
- **FR-DOC-01:** System shall support document records: ID, case ID, file name, file URL, file type, category (CONTRACT, COURT_ORDER, EVIDENCE, CORRESPONDENCE), file size, uploader ID.
- **FR-DOC-02:** Users shall be able to upload documents via drag-and-drop interface in the case detail page.
- **FR-DOC-03:** System shall validate file types (PDF, DOCX, JPG, PNG) and reject unsupported formats.
- **FR-DOC-04:** Documents shall be stored in Supabase Storage with path structure: `{caseId}/{filename}`.
- **FR-DOC-05:** Document list shall display file name, category, size, upload date, and download link.

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **NFR-PERF-01:** Initial page load shall be < 3 seconds on standard broadband (10 Mbps).
- **NFR-PERF-02:** Server Actions shall respond within 500ms for standard CRUD operations.
- **NFR-PERF-03:** Dashboard charts and data shall load within 2 seconds.
- **NFR-PERF-04:** Database queries shall use proper indexing to support < 200ms query time for tables up to 100,000 records.

### 6.2 Scalability
- **NFR-SCAL-01:** Architecture shall support up to 50 concurrent users without performance degradation on free tier infrastructure.
- **NFR-SCAL-02:** Database schema shall support future migration to paid tier without structural changes.
- **NFR-SCAL-03:** File storage shall support tiered archiving strategy for documents older than 2 years.

### 6.3 Reliability
- **NFR-REL-01:** System shall implement soft delete for all business entities to prevent accidental data loss.
- **NFR-REL-02:** Financial calculations (invoice totals, budget utilization) shall be computed server-side to prevent client-side tampering.
- **NFR-REL-03:** All database write operations for financial data shall use transactions to ensure atomicity.

### 6.4 Usability
- **NFR-UX-01:** Application shall be fully functional on modern browsers (Chrome, Firefox, Safari, Edge) last 2 versions.
- **NFR-UX-02:** Application shall be responsive and usable on screen sizes from 320px (mobile) to 1920px (desktop).
- **NFR-UX-03:** Time tracking widget shall be operable with a single click start/stop.
- **NFR-UX-04:** Forms shall provide clear validation feedback and error messages in Bahasa Indonesia.

### 6.5 Maintainability
- **NFR-MAINT-01:** Code shall follow modular architecture with clear separation of concerns (UI components, server actions, data access).
- **NFR-MAINT-02:** All database schema changes shall be managed through versioned migrations.
- **NFR-MAINT-03:** Environment-specific configuration shall be externalized via environment variables.

---

## 7. Technical Architecture

### 7.1 System Architecture

```
┌─────────────────────────────────────────────┐
│              Vercel Edge Network            │
│         (Next.js App Router + SSR)          │
│  ┌─────────────┐      ┌─────────────────┐  │
│  │   Server    │      │  Server Actions │  │
│  │ Components  │◄────►│   (Mutations)   │  │
│  └─────────────┘      └─────────────────┘  │
└────────────────────┬────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼────────┐
│   Supabase     │      │   Supabase      │
│   PostgreSQL   │      │   Storage       │
│   (Database)   │      │   (Files)       │
└────────────────┘      └─────────────────┘
        │
┌───────▼────────┐
│   Supabase     │
│   Auth         │
│   (GoTrue)     │
└────────────────┘
```

### 7.2 Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend Framework** | Next.js 15+ (App Router) | Server Components reduce client JS, Server Actions simplify mutations, native Vercel integration |
| **Styling** | Tailwind CSS + Shadcn UI | Rapid UI development, consistent design system, accessible primitives |
| **Charts** | Recharts | React-native, customizable, sufficient for dashboard visualizations |
| **ORM** | Prisma 6+ | Type-safe queries, migration management, excellent PostgreSQL support |
| **Database** | Supabase PostgreSQL | Managed Postgres with RLS, connection pooling, free tier suitable for MVP |
| **Auth** | Supabase Auth + @supabase/ssr | Integrated with database, JWT sessions, SSR-compatible |
| **File Storage** | Supabase Storage | Integrated policies, S3-compatible API, unified with auth |
| **Email** | Resend | Generous free tier, reliable delivery, simple API |
| **Deployment** | Vercel | Zero-config deploys, preview environments, edge network |

### 7.3 Data Flow

1. **Authentication Flow:** User → Supabase Auth (email/password) → JWT session cookie → Middleware validation → Route access.
2. **Data Read Flow:** Server Component → Prisma Client → Supabase PostgreSQL (connection pooler) → Rendered HTML.
3. **Data Write Flow:** User Action → Server Action → Auth validation → Business logic validation → Prisma Transaction → Database + Audit Log → Revalidation.
4. **File Upload Flow:** Client → Supabase Storage (direct upload with auth token) → Return public URL → Save URL to database.

---

## 8. Data Model & Schema

### 8.1 Entity Relationship Overview

```
User (1) ───────< (N) Case (assigned as lawyer)
Client (1) ─────< (N) Case
Case (1) ───────< (N) TimeLog
Case (1) ───────< (N) Expense
Case (1) ───────< (N) Invoice
Case (1) ───────< (N) CaseDocument
Invoice (1) ────< (N) TimeLog
Invoice (1) ────< (N) Expense
User (1) ───────< (N) TimeLog (created)
User (1) ───────< (N) AuditLog
User (1) ───────< (N) Notification
User (1) ───────< (N) Invoice (created by)
Client (1) ─────(1) User (portal account, optional)
```

### 8.2 Schema Definitions

**Users**
- `id`: UUID, PK
- `email`: String, unique
- `name`: String
- `role`: Enum [ADMIN, PARTNER, LAWYER, CLIENT]
- `hourlyRate`: Decimal(12,2), nullable
- `phone`: String, nullable
- `avatarUrl`: String, nullable
- `clientId`: UUID, nullable, unique (FK to Clients, for portal users)
- `isActive`: Boolean, default true
- `createdAt`, `updatedAt`, `deletedAt`: DateTime

**Clients**
- `id`: UUID, PK
- `name`: String
- `email`: String
- `phone`: String, nullable
- `address`: String, nullable
- `companyName`: String, nullable
- `taxId`: String, nullable
- `isActive`: Boolean, default true
- `createdAt`, `updatedAt`, `deletedAt`: DateTime

**Cases**
- `id`: UUID, PK
- `caseNumber`: String, unique
- `title`: String
- `description`: String, nullable
- `status`: Enum [OPEN, IN_PROGRESS, ON_HOLD, CLOSED, ARCHIVED]
- `retainerAmount`: Decimal(12,2), default 0
- `depositBalance`: Decimal(12,2), default 0
- `budgetAlertThreshold`: Decimal(5,2), default 80.00
- `clientId`: UUID, FK
- `lawyerId`: UUID, FK
- `createdAt`, `updatedAt`, `deletedAt`: DateTime

**TimeLogs**
- `id`: UUID, PK
- `caseId`: UUID, FK
- `userId`: UUID, FK
- `startTime`: DateTime
- `endTime`: DateTime, nullable
- `durationMin`: Int
- `hourlyRate`: Decimal(12,2)
- `description`: String
- `isBilled`: Boolean, default false
- `invoiceId`: UUID, nullable, FK
- `createdAt`, `updatedAt`: DateTime

**Expenses**
- `id`: UUID, PK
- `caseId`: UUID, FK
- `category`: Enum [COURT_FEE, TRANSPORT, STAMP_DUTY, DOCUMENTATION, WITNESS_FEE, RESEARCH, OTHER]
- `amount`: Decimal(12,2)
- `date`: DateTime
- `description`: String
- `receiptUrl`: String, nullable
- `isBilled`: Boolean, default false
- `invoiceId`: UUID, nullable, FK
- `createdBy`: UUID (User)
- `createdAt`, `updatedAt`: DateTime

**Invoices**
- `id`: UUID, PK
- `caseId`: UUID, FK
- `invoiceNo`: String, unique
- `issueDate`: DateTime, default now
- `dueDate`: DateTime
- `status`: Enum [DRAFT, SENT, UNPAID, PARTIAL, PAID, OVERDUE, CANCELLED]
- `notes`: String, nullable
- `subtotal`: Decimal(12,2)
- `taxRate`: Decimal(5,2), default 0
- `taxAmount`: Decimal(12,2)
- `total`: Decimal(12,2)
- `paidAmount`: Decimal(12,2), default 0
- `createdBy`: UUID, FK
- `createdAt`, `updatedAt`: DateTime

**AuditLogs**
- `id`: UUID, PK
- `tableName`: String
- `recordId`: String
- `action`: String
- `userId`: UUID, FK
- `oldData`: JSON, nullable
- `newData`: JSON, nullable
- `createdAt`: DateTime

**Notifications**
- `id`: UUID, PK
- `userId`: UUID, FK
- `title`: String
- `message`: String
- `type`: String
- `isRead`: Boolean, default false
- `linkUrl`: String, nullable
- `createdAt`: DateTime

**CaseDocuments**
- `id`: UUID, PK
- `caseId`: UUID, FK
- `name`: String
- `fileUrl`: String
- `fileType`: String
- `category`: String
- `sizeBytes`: Int
- `uploadedBy`: UUID
- `createdAt`: DateTime

---

## 9. User Flows & Journeys

### 9.1 Lawyer Daily Workflow

1. **Login** → Redirect to Dashboard
2. **Check Notifications** → Review case assignments or budget alerts
3. **Start Work on Case** → Open Floating Timer → Select Case → Start Timer
4. **Complete Task** → Stop Timer → Fill Description → Save Time Log
5. **Record Expense** (if any) → Navigate to Case Detail → Upload Receipt → Save Expense
6. **End of Day** → Review `/time-logs` → Ensure all hours are logged

### 9.2 Partner Invoicing Workflow

1. **Navigate to Case Detail** → Review unbilled time logs and expenses
2. **Click "Generate Invoice"** → Review preview modal with all items
3. **Confirm** → System executes atomic transaction → Invoice created
4. **Review Invoice** → Mark as Sent → System sends email notification to client
5. **Record Payment** (when received) → Update paid amount → Status changes to PAID/PARTIAL

### 9.3 Client Portal Journey

1. **Receive Email** → Magic link or login credentials for portal
2. **Login to `/portal`** → See list of active cases
3. **Select Case** → View status timeline and financial summary
4. **Review Expenses** → Verify expense categories and amounts
5. **Check Invoices** → View invoice list → Download PDF invoice

---

## 10. UI/UX Requirements

### 10.1 Design System
- **Color Palette:**
  - Primary: Slate-900 (headers), Slate-700 (body text)
  - Accent: Blue-600 (actions, links), Blue-50 (light backgrounds)
  - Success: Emerald-600 (paid, on-track)
  - Warning: Amber-500 (approaching threshold)
  - Danger: Red-600 (over budget, overdue)
  - Background: Slate-50 (page), White (cards)
- **Typography:** Inter or system sans-serif. Headings: semibold. Body: regular.
- **Spacing:** 4px base unit. Cards: rounded-xl (12px), shadow-sm.
- **Icons:** Lucide React (consistent with Shadcn UI).

### 10.2 Key Interface Components

**Navigation:**
- Sidebar (desktop) / Bottom bar (mobile) with role-aware menu items.
- CLIENT role sees only: My Cases, My Invoices, Settings.

**Floating Timer Widget:**
- Position: fixed, bottom-right, 16px margin.
- Size: collapsed 56px circle, expanded 320px card.
- States: Idle (play icon), Running (pause/stop buttons + timer display).

**Case Detail Page:**
- Layout: 3-column (desktop) — Case Info | Financials & Alerts | Activity Timeline.
- Tabs: Overview, Time Logs, Expenses, Invoices, Documents.

**Dashboard:**
- Layout: Grid system, responsive 1-3 columns.
- Cards: metric cards with trend indicators (up/down percentages).
- Charts: responsive containers with tooltips.

---

## 11. Security & Compliance

### 11.1 Data Security
- **Encryption:** All data in transit via TLS 1.3. Database at rest encrypted by Supabase.
- **RLS:** Row Level Security enforced on all database tables. No table shall be accessible without policy.
- **Input Validation:** All user inputs sanitized server-side. File uploads restricted by type and size.
- **Session Management:** JWT tokens with automatic refresh. Secure, httpOnly cookies.

### 11.2 Access Control Matrix

| Feature | ADMIN | PARTNER | LAWYER | CLIENT |
|---------|-------|---------|--------|--------|
| User Management | CRUD | R | - | - |
| Client Management | CRUD | CRUD | R | R (own) |
| Case Management | CRUD | CRUD | RU (assigned) | R (own) |
| Time Logging | R | R | CRUD (own) | - |
| Expense Tracking | R | R | CRUD (assigned) | R (own case) |
| Invoice Generation | - | CR | - | R (own) |
| Payment Recording | - | CRU | - | - |
| Dashboard | Full | Full | Limited | - |
| Client Portal | - | - | - | Read (own) |
| Audit Logs | R | R | - | - |
| Document Upload | CRUD | CRUD | CRUD (assigned) | - |

### 11.3 Compliance Requirements
- **Audit Trail:** Immutable logs for all financial data changes (who, what, when, before, after).
- **Data Retention:** Soft-deleted records retained indefinitely for legal compliance.
- **Privacy:** Client portal data anonymized (no lawyer names, no internal rates exposed).
- **Backup:** Reliance on Supabase automated backups (daily for free tier, configurable for paid).

---

## 12. Integration Requirements

### 12.1 Supabase Integration
- **Auth:** @supabase/ssr for cookie-based session handling in Next.js App Router.
- **Database:** Connection pooling via PgBouncer (port 6543) for runtime queries; direct connection (port 5432) for migrations.
- **Storage:** Two buckets: `receipts` (expense proofs) and `case-documents` (case files). Policies restrict access by authentication and case association.

### 12.2 Resend Integration
- **Triggers:**
  - Invoice sent to client
  - Budget alert threshold reached (internal notification)
  - Case assigned to lawyer
  - Overdue invoice reminder
- **Rate Limiting:** Respect Resend free tier (3,000 emails/month). Implement queue if necessary.

### 12.3 External APIs (Future)
- **Accounting Software:** Export invoices to Xero/QuickBooks (Phase 2 roadmap).
- **Calendar Integration:** Sync case deadlines to Google Calendar/Outlook (Phase 2 roadmap).

---

## 13. Risk Assessment & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Supabase free tier DB pauses after 7 days idle | High | Medium | Implement keep-alive ping via cron job during active development; upgrade to Pro for production |
| Revenue calculation errors due to floating point | Low | Critical | Use Decimal/Numeric type for all currency; validate calculations in transactions |
| Unauthorized data access via RLS misconfiguration | Medium | Critical | Mandatory RLS policy review checklist; test with anon key before release |
| File storage quota exceeded (1GB) | Medium | Medium | Client-side image compression; file size limits; archiving strategy for old documents |
| Lawyer resistance to time tracking adoption | High | High | Design frictionless floating widget; gamification/billing transparency reports |
| Data loss due to accidental hard delete | Low | Critical | Soft delete enforced at application level; database backups |
| Vercel hobby tier limitations (non-commercial ToS) | Low | Medium | Evaluate upgrade to Pro ($20/month) before commercial launch; alternative: Railway/Render |

---

## 14. Release Roadmap

### Phase 1: Foundation (Week 1-2)
- Project scaffolding (Next.js, Tailwind, Shadcn, Prisma, Supabase)
- Database schema design and migration
- RLS policies implementation
- Authentication system (login, register, middleware, role guards)
- Client CRUD UI
- Case CRUD UI with budget progress bar

**Deliverable:** Working internal app with client and case management.

### Phase 2: Time Tracking (Week 3)
- TimeLog schema and CRUD
- Floating timer widget
- Time log history page with filters
- Manual time entry form

**Deliverable:** Lawyers can track and manage billable hours.

### Phase 3: Financial Engine (Week 4-5)
- Expense tracking with receipt upload
- Invoice generation (atomic transaction)
- Invoice management (status, payment recording)
- Budget alert system with notifications

**Deliverable:** Complete billing workflow from time/expense to invoice.

### Phase 4: Dashboard & Portal (Week 6)
- Internal financial dashboard with charts
- Client portal layout and auth
- Client case view (anonymized)
- Client invoice view

**Deliverable:** Partners have financial visibility; clients have transparent access.

### Phase 5: Polish & Extensions (Week 7-8)
- Notification system (in-app)
- Document management module
- PDF invoice generation
- Email integration (Resend)
- Performance optimization
- Security audit and RLS testing

**Deliverable:** Production-ready MVP.

### Phase 6: Post-MVP (Future)
- Multi-currency support
- Advanced reporting (profitability per lawyer, per client)
- Calendar/deadline management
- Integration with accounting software
- Mobile native app (PWA or React Native)

---

## 15. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **Retainer** | Upfront payment made by a client to secure legal services |
| **Billable Hour** | Time spent on client work that can be charged to the client |
| **Time Log** | A record of work performed on a case, including duration and rate |
| **RLS** | Row Level Security — database feature restricting data access at the row level |
| **Soft Delete** | Marking a record as deleted without physically removing it from the database |
| **Atomic Transaction** | A database operation that either completes entirely or rolls back completely |
| **DSO** | Days Sales Outstanding — average number of days to collect payment after invoice |

### B. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-25 | Product Team | Initial PRD draft |

### C. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Tech Lead | | | |
| Security Officer | | | |

---

*End of Document*
