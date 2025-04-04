# LegalEase Application Flow Documentation

**Version:** 1.1
**Date:** April 1, 2023
**Author:** LegalEase Development Team
**Status:** Approved

---

## 1. Introduction

This document details the primary user flows within the LegalEase SaaS platform. It serves as the definitive guide for understanding how users navigate through and interact with the core features defined in our product documentation. These flows are essential references for developers implementing the frontend and backend systems, ensuring a consistent user experience aligned with our product vision.

> **For product requirements and features, see [product-requirement.md](product-requirement.md)**  
> **For frontend implementation guidance, see [frontend-implementation-plan.md](frontend-implementation-plan.md)**

---

## 2. Authentication Flow

### 2.1 User Login
1.  **Start:** User navigates to the LegalEase login page (`/login`).
2.  **Action:** User enters their registered email address and password into the login form.
3.  **Action:** User clicks the "Login" button.
4.  **System:** Backend verifies credentials against the Supabase user database.
5.  **System (Success):**
    *   Generates a JWT (JSON Web Token) with appropriate user claims and permissions.
    *   Stores the JWT securely using NextAuth.js's secure cookie mechanism.
    *   Records login timestamp and IP address for security audit logs.
    *   Redirects the user to their personalized dashboard (`/dashboard`).
6.  **System (Failure - Invalid Credentials):**
    *   Displays an error message on the login form: "Invalid email or password."
    *   Increments failed login counter (for rate limiting/lockout protection).
    *   Keeps the user on the login page with cleared password field.
7.  **System (Failure - Other Errors):**
    *   Displays a user-friendly error message: "Login failed. Please try again."
    *   Logs detailed error information to Sentry for developer troubleshooting.

> **Technical Implementation Note:** Authentication uses NextAuth.js with Supabase provider as specified in [technical-stack.md](technical-stack.md).

### 2.2 User Registration
1.  **Start:** User navigates to the signup page (`/signup`) or accepts an invitation link.
2.  **Action:** User completes the registration form, providing:
    * Full Name
    * Email Address
    * Law Firm Name
    * Password (with strength indicator)
    * Agreement to Terms of Service
3.  **Action:** User clicks the "Create Account" button.
4.  **System:** Frontend validates input using React Hook Form with Zod schema validation.
5.  **System:** Backend validates input and checks email uniqueness in Supabase.
6.  **System (Success):**
    *   Creates a new user record in Supabase with appropriate role assignment.
    *   Sends a verification email via SendGrid with secure verification link.
    *   Displays confirmation page with instructions to verify email.
7.  **System (Failure - Email Exists):**
    *   Displays specific error message: "This email is already registered."
    *   Provides a link to password reset flow.
8.  **System (Failure - Validation Error):**
    *   Highlights invalid fields with specific error messages.
    *   Preserves valid input data in the form.
9.  **Email Verification:**
    *   User receives email and clicks verification link.
    *   System validates token and marks account as verified.
    *   Redirects to login page with success message.

### 2.3 Password Reset
1.  **Start:** User clicks the "Forgot Password?" link on the login page.
2.  **Action:** User enters their registered email address.
3.  **Action:** User clicks the "Send Reset Link" button.
4.  **System:** Backend verifies the email exists in Supabase.
5.  **System (Success):**
    *   Generates a secure, time-limited password reset token (30-minute expiry).
    *   Sends an email via SendGrid containing a unique password reset link.
    *   Displays a confirmation message: "Password reset link sent if the email is registered."
6.  **System (Failure - Email Not Found):**
    *   Displays the same confirmation message to prevent email enumeration.
7.  **User Action:** User clicks the link in the email.
8.  **System:** Navigates the user to the password reset page (`/reset-password?token=...`).
9.  **Action:** User enters a new password and confirms it. Password requirements are clearly displayed and validated in real-time.
10. **Action:** User clicks the "Reset Password" button.
11. **System:** Backend validates the token (checks existence and expiry) and the new password.
12. **System (Success):**
    *   Updates the user's password in Supabase with appropriate hashing.
    *   Invalidates the reset token and any active sessions.
    *   Redirects the user to the login page with a success message.
13. **System (Failure - Invalid/Expired Token):**
    *   Displays an error message: "Invalid or expired reset link."
    *   Provides an option to request a new password reset link.
14. **System (Failure - Password Validation):**
    *   Displays specific password requirement errors.

---

## 3. Case/Matter Management Flow

### 3.1 Create New Case/Matter
1.  **Start:** User is logged in and navigates to the "Matters" section via the sidebar navigation.
2.  **Action:** User clicks the prominent "New Matter" button in the header.
3.  **System:** Displays a multi-step form modal with the following sections:
    * Basic Information (Matter Name, Matter Number, Practice Area)
    * Client Information (Select existing client or create new)
    * Matter Details (Description, Open Date, Statute of Limitations)
    * Team Assignment (Responsible Attorney, Support Staff)
    * Billing Information (Billing Type, Rates, Retainer Amount)
4.  **Action:** User completes each section, with the system providing real-time validation.
5.  **Action:** User clicks "Create Matter" on the final step.
6.  **System:** Backend API validates all data and creates records in Supabase:
    * New case record in the `matters` table
    * Relationship records linking to `clients` and `users` tables
    * Initial billing settings in `matter_billing` table
7.  **System (Success):**
    *   Redirects the user to the newly created matter's detail page (`/matters/:matterId`).
    *   Displays a success toast notification.
    *   Updates the matter list in the Redux store.
8.  **System (Failure - Validation Error):**
    *   Highlights invalid fields with specific error messages.
    *   Preserves all valid input data.
9.  **System (Failure - Other Errors):**
    *   Displays a generic error message.
    *   Logs detailed error information to Sentry.

> **Related Component:** See `frontend/src/pages/Matters/NewMatterForm` in [file-structure.md](file-structure.md).

### 3.2 View Case Details
1.  **Start:** User is in the "Matters" list view or dashboard.
2.  **Action:** User clicks on a specific matter name or card.
3.  **System:** Navigates to the matter detail page (`/matters/:matterId`).
4.  **System:** Frontend makes parallel API requests to fetch:
    * Core matter details
    * Associated documents
    * Linked tasks and deadlines
    * Time entries and billing information
    * Client details
    * Notes and activity history
5.  **System:** Backend performs authorization checks to ensure the user has permissions to view this matter.
6.  **System:** Displays the matter information in a tabbed interface:
    * Overview (key details, status, team members)
    * Documents (files organized by category)
    * Tasks (deadlines, assignments, status)
    * Time & Billing (time entries, invoices, trust accounting)
    * Notes (matter-related notes and communications)
    * Client (client details and related matters)

### 3.3 Update Case Details
1.  **Start:** User is on the matter detail page (`/matters/:matterId`).
2.  **Action:** User clicks the "Edit" button in the matter header or section-specific edit buttons.
3.  **System:** Transforms the relevant section into an editable form, pre-populated with current data.
4.  **Action:** User modifies the fields with real-time validation feedback.
5.  **Action:** User clicks "Save" or "Update" button.
6.  **System:** Backend API validates data and updates the corresponding matter record in Supabase.
7.  **System:** Creates an audit log entry recording the change details, user, and timestamp.
8.  **System (Success):**
    *   Updates the view to reflect the changes.
    *   Displays a success toast notification.
    *   Updates the Redux store.
9.  **System (Failure):**
    *   Reverts the view to read-only mode with current data.
    *   Displays validation or generic error messages.
    *   Logs details to Sentry.

### 3.4 Add Task to Case
1.  **Start:** User is on the matter detail page (`/matters/:matterId`), in the "Tasks" tab.
2.  **Action:** User clicks the "Add Task" button.
3.  **System:** Displays a task creation modal with fields:
    * Task Title
    * Description
    * Due Date (with calendar picker)
    * Assignee (dropdown of firm members)
    * Priority (High, Medium, Low)
    * Estimated Time
    * Billable toggle
4.  **Action:** User completes the form.
5.  **Action:** User clicks "Add Task" button.
6.  **System:** Backend API creates a new task record in the `tasks` table, linking it to the matter.
7.  **System (Success):**
    *   Adds the task to the list view with appropriate styling based on priority and due date.
    *   Displays a success notification.
    *   Sends an in-app notification to the assignee.
    *   Optionally sends an email notification based on user preferences.
8.  **System (Failure):**
    *   Keeps the modal open with error messages.
    *   Preserves user input for correction.

---

## 4. Document Management Flow

### 4.1 Upload Document to Case
1.  **Start:** User is on the matter detail page, in the "Documents" tab.
2.  **Action:** User clicks "Upload Document" button or drags files onto the drop zone.
3.  **System:** Displays upload interface with:
    * File selection dialog or active drag-and-drop area
    * Multi-file upload support
    * Progress indicators
4.  **Action:** User selects one or more files.
5.  **System:** Begins preprocessing files:
    * Validates file types and sizes
    * Generates previews where possible
    * Scans for viruses/malware
6.  **Action:** User adds metadata for each file:
    * Document Type (pleading, correspondence, evidence, etc.)
    * Description
    * Date (defaults to current date)
    * Tags/Categories
    * Access permissions (firm-only or client-visible)
7.  **Action:** User clicks "Upload" or "Save" button.
8.  **System:** For each file:
    * Generates a unique identifier
    * Uploads to AWS S3 with appropriate encryption
    * Creates metadata record in Supabase `documents` table
    * Links document to matter via `matter_documents` junction table
9.  **System (Success):**
    *   Updates document list view with new entries
    *   Displays success notification with count of uploaded files
    *   Triggers Elasticsearch indexing if configured
10. **System (Partial Success):**
    *   Indicates which files succeeded and which failed
    *   Provides specific error reasons for failed uploads
11. **System (Failure):**
    *   Displays specific error messages (e.g., "File too large," "Unsupported file type")
    *   Logs detailed error information

> **Security Note:** Documents are encrypted at rest in S3 and all access is logged for audit purposes. See [technical-stack.md](technical-stack.md) for implementation details.

### 4.2 View/Download Document
1.  **Start:** User is viewing a list of documents within a matter.
2.  **Action:** User clicks on a document name or the "View" icon.
3.  **System:** Frontend requests a secure document access URL from the backend.
4.  **System:** Backend:
    * Verifies user has permission to access the document
    * Generates a pre-signed, time-limited URL (5 minute expiry) for the S3 object
    * Logs the access attempt in the audit trail
5.  **System (Success - Viewable Document):**
    *   If the document is a viewable type (PDF, image, etc.), opens it in the in-app document viewer
    *   Displays document with options for downloading, printing, or sharing
6.  **System (Success - Other Document):**
    *   Initiates a download using the secure URL
7.  **System (Failure):**
    *   Displays an appropriate error message
    *   Logs the error details

### 4.3 Search Documents
1.  **Start:** User clicks in the global search bar or navigates to the dedicated document search page.
2.  **Action:** User enters search keywords and applies filters:
    * Matter/Case (dropdown)
    * Document Type (checkbox list)
    * Date Range (calendar picker)
    * Tags (multiselect)
    * Created By (user dropdown)
3.  **Action:** User presses Enter or clicks "Search" button.
4.  **System:** Frontend sends the query parameters to the backend search API.
5.  **System:** Backend performs a search using Elasticsearch:
    * Full-text search across document content and metadata
    * Applies authorization filters to show only accessible documents
    * Performs relevance ranking
6.  **System:** Returns and displays results with:
    * Document name and type
    * Matter association
    * Last modified date
    * Relevance snippets showing matching text
    * Quick action buttons (view, download, share)
7.  **Pagination:** Results are paginated with infinite scroll or traditional pagination controls.
8.  **Real-time Filtering:** Users can refine results with faceted filters that update result counts dynamically.

---

## 5. Time Tracking & Billing Flow

### 5.1 Start/Stop Timer
1.  **Start:** User is logged in, viewing the global timer in the top navigation bar.
2.  **Action:** User clicks the "Start Timer" button (play icon).
3.  **System:** Displays a quick entry form with:
    * Matter dropdown (with type-ahead search)
    * Activity description field
    * Billable toggle (default based on matter settings)
4.  **Action:** User selects a matter and optionally adds a description.
5.  **Action:** User clicks "Start" to begin tracking.
6.  **System:** Timer begins counting in the UI (hours:minutes:seconds).
    * Timer state persists across page navigation
    * Timer is visible in a minimized state in the header
    * Active timer is saved to local storage for recovery in case of browser issues
7.  **Action:** User performs work while timer runs.
8.  **Action:** User clicks "Stop" button when finished.
9.  **System:** Displays time entry completion modal with:
    * Elapsed time (editable)
    * Matter (editable)
    * Description (editable)
    * Billable status toggle
    * Billing code selection (if applicable)
10. **Action:** User reviews, edits if needed, and clicks "Save Time Entry".
11. **System:** Backend creates a time entry record in Supabase, linked to user and matter.
12. **System (Success):**
    *   Displays success notification
    *   Updates relevant time entry lists in the UI
    *   Updates matter billing totals in the background
13. **System (Failure):**
    *   Preserves time entry data in the modal
    *   Displays error message
    *   Offers retry option

> **Mobile Support:** Timer functionality is fully supported on mobile devices, with background tracking capabilities. See [frontend-guide.md](frontend-guide.md) for responsive design considerations.

### 5.2 Manual Time Entry
1.  **Start:** User navigates to "Time Tracking" section or a matter's billing tab.
2.  **Action:** User clicks "Add Time Entry" button.
3.  **System:** Displays a form with:
    * Date (calendar picker, defaults to today)
    * Start Time (optional)
    * End Time (optional) or Duration (hours and minutes)
    * Matter (required dropdown with search)
    * Activity Description (required text field)
    * Billable toggle
    * Billing Code (if applicable to the firm)
4.  **Action:** User completes the form with validation feedback.
5.  **Action:** User clicks "Save".
6.  **System:** Backend validates and creates the time entry in Supabase.
7.  **System (Success):**
    *   Entry appears in the time entries list
    *   Success notification displays
    *   Matter billing totals update
8.  **System (Failure):**
    *   Form remains open with validation errors highlighted
    *   Error notification displays

### 5.3 Generate Invoice
1.  **Start:** User navigates to the "Billing" section or a specific matter's billing tab.
2.  **Action:** User selects the "Generate Invoice" function.
3.  **System:** Displays invoice generation wizard with:
    * Client/Matter selection (single or multiple)
    * Date range selection
    * Unbilled time entries and expenses table with checkboxes
    * Summary of amounts by matter and timekeeper
4.  **Action:** User selects specific time entries and expenses to include.
5.  **Action:** User clicks "Create Draft Invoice".
6.  **System:** Generates a draft invoice with:
    * Client and firm details
    * Matter information
    * Itemized time entries with details
    * Expense items
    * Subtotals by category
    * Tax calculations if applicable
    * Total amount due
7.  **Action:** User reviews the draft and can:
    * Edit line item descriptions
    * Apply discounts (percentage or fixed amount)
    * Add notes to client
    * Adjust payment terms
8.  **Action:** User clicks "Finalize Invoice".
9.  **System:** Backend finalizes the invoice:
    * Creates invoice record in `invoices` table
    * Links time entries and expenses to the invoice
    * Marks included items as billed
    * Generates a PDF version stored in S3
10. **System (Success):**
    *   Displays the finalized invoice with options:
    *   Download PDF
    *   Send to Client
    *   Record Payment
    *   Print
11. **System (Failure):**
    *   Keeps draft state
    *   Displays error message
    *   Provides option to retry or save draft

### 5.4 Record Payment
1.  **Start:** User views an outstanding invoice in the Billing section.
2.  **Action:** User clicks "Record Payment" button.
3.  **System:** Displays payment recording form with:
    * Amount (defaults to remaining balance)
    * Payment Date (defaults to today)
    * Payment Method (dropdown: Check, Credit Card, Bank Transfer, Cash, Other)
    * Reference Number (check number, transaction ID, etc.)
    * Notes
    * Apply to Trust Account toggle (for trust payments)
4.  **Action:** User completes the form.
5.  **Action:** User clicks "Save Payment".
6.  **System:** Backend creates payment record in the `payments` table:
    * Links payment to invoice
    * Updates invoice status (Paid, Partially Paid)
    * Updates trust account balance if applicable
    * Records in accounting ledger
7.  **System (Success):**
    *   Updates invoice status in the UI
    *   Displays success notification
    *   Updates A/R reports and dashboards
8.  **System (Failure):**
   *   Displays error messages. Logs error via Sentry.
*Note: Flow for online payments via integrated gateway would involve redirects and webhook handling.*
    *   Form remains open with error message
    *   No payment is recorded

---

## 6. Client Communication & Portal Flow

### 6.1 Client Portal Access
1.  **Start:** Firm user navigates to client's details and clicks "Portal Access".
2.  **Action:** Firm user clicks "Invite to Portal" (if client doesn't have access) or "Manage Access".
3.  **System:** For new invites, displays invitation form:
    * Client email verification
    * Customizable welcome message
    * Access level selection
4.  **Action:** Firm user sends invitation.
5.  **System:** Generates secure invitation with temporary access code and sends email.
6.  **Client Action:** Client receives email and clicks the invitation link.
7.  **System:** Guides client through account creation:
    * Email verification (pre-filled)
    * Password creation
    * Profile completion
    * Terms acceptance
8.  **System:** Creates client portal user account with appropriate permissions.
9.  **System:** Redirects client to portal dashboard showing:
    * Active matters
    * Shared documents
    * Outstanding invoices
    * Upcoming appointments
    * Secure messages

### 6.2 Client Views Shared Document
1.  **Start:** Client is logged into the portal, viewing their case details or Documents section.
2.  **Action:** Client clicks on a document shared by the firm.
3.  **System:** Portal backend verifies client's permission to access this document.
4.  **System:** Generates a secure, time-limited view URL with watermarking if configured.
5.  **System:** Displays document in secure viewer or initiates download:
    * In-browser preview for compatible formats
    * Download option with access logging
    * Prevents saving/printing if restricted by firm settings

### 6.3 Client Sends Secure Message
1.  **Start:** Client is logged into the portal, in the Messages section.
2.  **Action:** Client clicks "New Message" or selects an existing thread.
3.  **System:** Displays message composition interface:
    * Recipients dropdown (pre-filled with assigned attorneys and staff)
    * Subject line
    * Message body with basic formatting options
    * File attachment option (with size and type restrictions)
4.  **Action:** Client composes message and optionally attaches files.
5.  **Action:** Client clicks "Send".
6.  **System:** Backend securely stores the message:
    * End-to-end encryption for message content
    * Virus scanning for attachments
    * Storage in `client_messages` table with relationship to matter
7.  **System:** Sends notification to recipients:
    * In-app notification
    * Email alert (configurable)
    * Mobile push notification (if enabled)
8.  **System (Success):**
    *   Message appears in the conversation thread
    *   Confirmation indicator shows delivery status

---

## 7. Scheduling & Calendar Flow

### 7.1 Create Calendar Event
1.  **Start:** User navigates to the "Calendar" section.
2.  **Action:** User clicks on a time slot or the "Add Event" button.
3.  **System:** Displays event creation form with:
    * Title/Description
    * Date and Time (start/end)
    * Event Type (Court Date, Meeting, Deadline, etc.)
    * Location (physical or virtual with video conference options)
    * Associated Matter (optional)
    * Attendees (internal team members and external contacts)
    * Reminder settings
    * Recurrence pattern (if repeating event)
4.  **Action:** User fills in details and clicks "Check Conflicts".
5.  **System:** Checks for scheduling conflicts:
    * Team member availability
    * Conflicting court dates
    * Room/resource conflicts
6.  **Action:** User resolves any conflicts and clicks "Save".
7.  **System:** Creates the event in Supabase and:
    * Updates the calendar view
    * Sends invitations to attendees if selected
    * Schedules reminder notifications
    * Syncs with external calendars if configured
    
## 8. Reporting Flow

### 8.1 View Dashboard
1.  **Start:** User logs in or navigates to the "Dashboard" section.
2.  **System:** Frontend requests dashboard data from the backend API (e.g., active cases count, upcoming deadlines, recent activity, key financial metrics).
3.  **System:** Backend aggregates data from various Supabase tables (cases, tasks, time entries, invoices), performs authorization.
4.  **System:** Displays interactive widgets and charts (using Material-UI components or a charting library) visualizing the key metrics. Data updates in near real-time or based on user refresh.

### 8.2 Generate Custom Report
1.  **Start:** User navigates to the "Reports" section.
2.  **Action:** User selects a report type (e.g., Billable Hours, Case Revenue, Client List).
3.  **Action:** User specifies parameters (Date Range, Client, User, Case Status, etc.).
4.  **Action:** User clicks "Generate Report".
5.  **System:** Backend API queries Supabase based on the selected type and parameters, performs complex aggregation if needed.
6.  **System:** Displays the report data in a table or chart format. Provides options to "Export" (PDF, CSV/Excel).
7.  **Action (Export):** User clicks "Export as PDF".
8.  **System:** Backend generates the report in the requested format and initiates a file download.
### 7.2 Calendar Synchronization
1.  **Start:** User navigates to Calendar Settings.
2.  **Action:** User enables synchronization with external calendar (Google, Outlook, etc.).
3.  **System:** Initiates OAuth flow for the selected provider.
4.  **Action:** User grants calendar access permissions.
5.  **System:** Establishes bidirectional sync:
    * Imports relevant external events
    * Exports LegalEase events (respecting confidentiality settings)
    * Handles conflict resolution based on user preferences
6.  **Ongoing:** System maintains synchronization with configurable frequency.

---
*Note: Flows for features like Legal Research, AI Tools, Contact/CRM, and Integrations would follow similar patterns involving user input, API calls, backend processing, and UI updates based on the specific requirements outlined in the PRD.
> **Related Documentation:**
> - [product-requirement.md](product-requirement.md) - Complete feature requirements and specifications
> - [frontend-implementation-plan.md](frontend-implementation-plan.md) - Frontend implementation guidelines
> - [technical-stack.md](technical-stack.md) - Technical implementation details
> - [frontend-guide.md](frontend-guide.md) - Frontend development standards 
