# SECURITY_REQUIREMENTS.md

# Security Requirements

## Purpose

This document lists the security controls that are practical and relevant for the Blackcoffer Visualization Dashboard.

The assignment does not require authentication or multi-user account features, so the security scope stays focused on protecting the backend, database, configuration, deployment environment, and API surface.

---

## Security Goals

The project should:

* keep secrets out of source code and the frontend bundle
* restrict database access to the backend only
* validate all incoming data and query parameters
* avoid exposing internal errors, logs, or debug pages
* protect against injection and cross-site scripting risks
* use safe deployment and configuration practices
* keep dependencies updated and reviewed

---

## Applicable Security Risks for This Project

The following risks from the security checklist are relevant and implementable in this assignment:

* exposed database credentials
* public `.env` files
* hardcoded API keys
* weak or missing authentication for backend admin surfaces
* missing authorization checks if any privileged routes are added later
* open database read/write permissions
* misconfigured Supabase access rules
* debug pages exposed in production
* build logs leaking secrets
* verbose error messages leaking stack traces
* secrets included in frontend JavaScript
* client-side-only security checks
* missing input validation
* SQL injection
* cross-site scripting (XSS)
* cross-site request forgery (CSRF) if cookies are introduced later
* overly permissive CORS
* rate limits missing on APIs
* public test or staging environments
* webhooks without signature verification if webhooks are added later
* insecure direct object references if record-level access is added later
* logs containing tokens, emails, passwords, or private data
* exposed source maps in production
* dependency vulnerabilities
* outdated packages
* excessive database permissions for the application user
* missing security headers

---

## Security Scope by Layer

### 1. Configuration and Secrets

Requirements:

* store secrets only in environment variables
* never commit `.env` files
* never expose database URLs, API keys, or service-role keys in frontend code
* use separate values for development and production
* rotate credentials if they are ever exposed

Implementation notes:

* keep `.env` in `.gitignore`
* use a `.env.example` file with placeholder values only
* only the backend may read Supabase credentials
* the frontend may only use public-safe variables if absolutely required

---

### 2. Database Security

Requirements:

* the backend database user should have only the minimum permissions needed
* avoid exposing read/write access to the database from the browser
* use parameterized queries or safe ORM methods
* restrict direct access to the main analytics table
* use Supabase Row Level Security if direct client access is ever enabled

Implementation notes:

* prefer backend-mediated access for all queries
* do not allow anonymous writes to the analytics table
* validate imported JSON before inserting it into the database

---

### 3. API Security

Requirements:

* validate all query parameters and request payloads
* reject invalid filter values
* sanitize user-controlled strings before using them in search or SQL conditions
* use parameterized queries for all database calls
* return generic error messages to the client
* do not expose stack traces in production
* apply rate limiting where practical

Implementation notes:

* FastAPI request models should enforce types and allowed values
* chart endpoints should accept only known `group_by` and `metric` values
* filter endpoints should ignore or reject unknown parameters
* API responses should not include internal SQL, file paths, or secrets

---

### 4. Frontend Security

Requirements:

* do not place secrets in React code
* do not store private credentials in localStorage
* avoid rendering raw HTML from the dataset unless it is escaped or sanitized
* keep client-side checks as usability helpers only, not as the only security layer
* avoid exposing debug information in the browser

Implementation notes:

* escape any text rendered into the DOM
* treat URLs and text fields from the dataset as untrusted input
* do not use `dangerouslySetInnerHTML` unless there is a strong reason
* keep source maps disabled in production builds if possible

---

### 5. CORS and Network Controls

Requirements:

* allow CORS only for the trusted frontend origin
* do not use wildcard CORS in production unless required and safe
* keep the API behind HTTPS in deployment
* do not expose internal admin or debugging routes publicly

Implementation notes:

* set an explicit allowed origin list
* separate local development CORS from production CORS
* keep backend and frontend environment values distinct

---

### 6. Logging and Monitoring

Requirements:

* do not log secrets, tokens, passwords, or private user data
* keep logs concise and safe
* log enough information for debugging without exposing sensitive details
* monitor for failed requests, import failures, and unexpected API errors

Implementation notes:

* remove sensitive payloads from exception traces before logging
* avoid printing environment variables
* use structured logs where possible

---

### 7. Deployment Security

Requirements:

* production must not expose debug mode
* production must not expose test endpoints unnecessarily
* keep frontend and backend deployments separated where possible
* avoid publicly accessible internal dashboards
* use HTTPS for any deployed environment

Implementation notes:

* verify that Supabase credentials are not present in the frontend bundle
* verify that build artifacts do not include `.env` files
* ensure production configuration is different from local development

---

### 8. Dependency Security

Requirements:

* review dependencies before adding them
* keep packages updated
* remove unused packages
* avoid libraries with known critical vulnerabilities

Implementation notes:

* use a lockfile
* run dependency audits where possible
* keep the project lean to reduce attack surface

---

## Project-Specific Security Rules

### Must Do

* Keep all Supabase secrets server-side only.
* Validate every API query parameter.
* Use backend-only access to the database.
* Never expose `.env` files or secret keys.
* Return safe error messages.
* Avoid raw HTML rendering from dataset text.
* Use explicit CORS rules.
* Keep debug mode off in production.
* Review generated code before use.

### Should Do

* Add rate limiting to public APIs if feasible.
* Add security headers in deployment.
* Disable source maps in production.
* Add dependency checks before submission.
* Keep logs free of sensitive data.

### Not Required for This Assignment

* user authentication
* role-based access control
* password reset flows
* session management
* payment security
* webhook verification
* tenant isolation

These are not necessary because the project is a read-only analytics dashboard without user accounts or billing.

---

## Input Validation Rules

### Filters

Only allow the expected filter values and types.

Examples:

* `end_year` must be an integer
* `topic` must be a string from the allowed dataset values
* `group_by` must be one of the supported chart dimensions

### Search

If search is implemented:

* limit query length
* escape special characters as needed
* prevent injection into SQL or text search queries

### Import Script

When importing `jsondata.json`:

* validate each record
* handle missing fields safely
* reject malformed rows
* log import errors without exposing secrets

---

## Error Handling Rules

* Do not show stack traces to the user.
* Do not expose database connection strings.
* Do not reveal internal file paths.
* Return a short error message and a safe status code.

Example:

* `400 Bad Request` for invalid filters
* `500 Internal Server Error` for unexpected failures

---

## Review Checklist

Before submission, verify that:

* no secrets are committed
* no credentials are visible in the frontend bundle
* no debug endpoints are exposed
* CORS is restricted
* database access is backend-only
* all inputs are validated
* logs are safe
* dependencies are up to date
* production build does not expose source maps or debug mode

---

## Acceptance Criteria

The security implementation is acceptable if:

* the dashboard works without exposing secrets
* the backend accepts only valid input
* the database is not publicly writable
* no sensitive data appears in logs or client code
* the deployment is safe enough for an interview submission

---

## Final Note

This project is a take-home analytics dashboard, not a high-security multi-tenant platform.
The security requirements should therefore focus on preventing common implementation mistakes, especially those that frequently appear in AI-generated or vibe-coded applications.
