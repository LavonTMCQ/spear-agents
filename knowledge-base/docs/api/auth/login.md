---
id: api-auth-login
title: Authentication & Login APIs
type: api
category: auth
audience: [internal-ops, developer, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [auth, login, session, clerk, nextauth]
---

# Authentication & Login APIs

## Summary
APIs for user authentication including login, registration, password management, and social login via Clerk.

## Quick Reference
```yaml
auth_providers: NextAuth.js (primary), Clerk (social)
session_type: Database sessions (not JWT)
social_login: Google, Apple (via Clerk)
2fa: TOTP for admin accounts
```

---

## POST /api/auth/[...nextauth]

### Summary
NextAuth.js handler for credential-based authentication.

### Endpoint Details
**URL**: `POST /api/auth/callback/credentials`

**Authentication**: None (this creates authentication)

### Request
```json
{
  "email": "user@example.com",
  "password": "userPassword123"
}
```

### Response

**Success (200)**:
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLIENT"
  }
}
```

**Errors**:
| Status | Message | Cause |
|--------|---------|-------|
| 401 | Invalid credentials | Wrong email or password |
| 401 | Account not found | Email doesn't exist |
| 403 | Account disabled | Account suspended |

### Notes
- Creates database session on success
- Session stored in `Session` table
- Cookie set for subsequent requests

---

## POST /api/auth/register

### Summary
Create a new user account.

### Endpoint Details
**URL**: `POST /api/auth/register`

**Authentication**: None

### Request
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Validation**:
- Email: Valid format, not already registered
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Passwords must match

### Response

**Success (201)**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors**:
| Status | Code | Message |
|--------|------|---------|
| 400 | VALIDATION_ERROR | Password requirements not met |
| 400 | PASSWORDS_MISMATCH | Passwords do not match |
| 409 | EMAIL_EXISTS | Email already registered |

### Side Effects
- Creates `User` record with role `CLIENT`
- Password hashed with bcrypt
- Welcome email sent (if configured)

---

## POST /api/auth/forgot-password

### Summary
Initiate password reset by sending reset email.

### Endpoint Details
**URL**: `POST /api/auth/forgot-password`

**Authentication**: None

### Request
```json
{
  "email": "user@example.com"
}
```

### Response

**Success (200)**:
```json
{
  "success": true,
  "message": "If an account exists, a reset email has been sent"
}
```

**Note**: Always returns success to prevent email enumeration attacks.

### Side Effects
- Generates reset token (expires 24 hours)
- Stores token hash in `User.passwordResetToken`
- Sets `User.passwordResetExpires`
- Sends reset email with link

### Security
- Token is hashed before storage
- Link expires after 24 hours
- Rate limited: 3 requests per email per hour

---

## GET /api/auth/reset-password

### Summary
Validate a password reset token.

### Endpoint Details
**URL**: `GET /api/auth/reset-password?token={token}`

**Authentication**: None

### Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| token | string | Yes | Reset token from email |

### Response

**Valid Token (200)**:
```json
{
  "valid": true,
  "email": "user@example.com"
}
```

**Invalid Token (200)**:
```json
{
  "valid": false,
  "error": "Invalid or expired reset link"
}
```

---

## POST /api/auth/reset-password

### Summary
Complete password reset with new password.

### Endpoint Details
**URL**: `POST /api/auth/reset-password`

**Authentication**: None (token-based)

### Request
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

### Response

**Success (200)**:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Errors**:
| Status | Code | Message |
|--------|------|---------|
| 400 | INVALID_TOKEN | Token invalid or expired |
| 400 | PASSWORDS_MISMATCH | Passwords do not match |
| 400 | WEAK_PASSWORD | Password requirements not met |

### Side Effects
- Updates `User.password` with new hash
- Clears `passwordResetToken` and `passwordResetExpires`
- Invalidates all existing sessions

---

## GET /api/auth/me

### Summary
Get current authenticated user.

### Endpoint Details
**URL**: `GET /api/auth/me`

**Authentication**: Required (session cookie)

### Response

**Authenticated (200)**:
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLIENT",
    "subscriptionStatus": "active"
  }
}
```

**Not Authenticated (401)**:
```json
{
  "error": "Not authenticated"
}
```

---

## POST /api/clerk/webhook

### Summary
Webhook handler for Clerk user synchronization.

### Endpoint Details
**URL**: `POST /api/clerk/webhook`

**Authentication**: Clerk webhook signature

### Events Handled

**user.created**:
- Creates new `User` if email doesn't exist
- Links existing user if email matches
- Sets `clerkId` on user record

**user.updated**:
- Updates user name/email if changed
- Syncs profile changes

### Request Headers
```
svix-id: msg_xxx
svix-timestamp: 1234567890
svix-signature: v1,xxx
```

### Security
- Verifies Clerk webhook signature
- Rejects invalid signatures with 401

---

## POST /api/auth/emergency-admin

### Summary
Emergency admin access bypass for recovery.

### Endpoint Details
**URL**: `POST /api/auth/emergency-admin`

**Authentication**: None (hardcoded credential check)

### Request
```json
{
  "email": "quiseforeverphilly@gmail.com",
  "password": "emergency_password"
}
```

### Access Control
- Only works for hardcoded admin email
- Bypasses 2FA requirement
- Intended for emergency recovery only

### Response

**Success (200)**:
```json
{
  "success": true,
  "user": {
    "id": "admin_id",
    "email": "quiseforeverphilly@gmail.com",
    "role": "ADMIN"
  }
}
```

**Failure (401)**:
```json
{
  "error": "Invalid credentials"
}
```

---

## POST /api/auth/check-2fa

### Summary
Verify 2FA TOTP code during login.

### Endpoint Details
**URL**: `POST /api/auth/check-2fa`

**Authentication**: Partial session (post-password, pre-2FA)

### Request
```json
{
  "userId": "user_123",
  "code": "123456"
}
```

### Response

**Valid Code (200)**:
```json
{
  "success": true,
  "verified": true
}
```

**Invalid Code (200)**:
```json
{
  "success": true,
  "verified": false,
  "error": "Invalid code"
}
```

### Notes
- TOTP codes are time-based (30 second window)
- Allows small time drift tolerance
- Backup codes also accepted

---

## Social Login Flow (Clerk)

### Flow Overview
1. User clicks "Google" or "Apple" on login page
2. Redirects to Clerk OAuth flow
3. User authenticates with provider
4. Clerk redirects to `/sso-callback`
5. Webhook creates/links user
6. Session established

### Endpoints Involved
- `/login` - Initial button click
- Clerk OAuth URLs - External
- `/sso-callback` - Return handler
- `/api/clerk/webhook` - User sync

### User Linking Logic
```
Email exists in database?
  → Yes: Link Clerk account to existing user
  → No: Create new user with Clerk data
```

---

## Session Management

### Session Storage
- Sessions stored in database (`Session` table)
- Not JWT-based for security

### Session Fields
```json
{
  "id": "session_xxx",
  "userId": "user_123",
  "expires": "2025-02-20T00:00:00Z",
  "sessionToken": "token_xxx"
}
```

### Session Cookie
- Name: `next-auth.session-token`
- HttpOnly: Yes
- Secure: Yes (production)
- SameSite: Lax

---

## Error Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_CREDENTIALS | 401 | Wrong email/password |
| ACCOUNT_NOT_FOUND | 401 | Email not registered |
| ACCOUNT_DISABLED | 403 | Account suspended |
| EMAIL_EXISTS | 409 | Email already registered |
| INVALID_TOKEN | 400 | Reset token invalid/expired |
| WEAK_PASSWORD | 400 | Password requirements not met |
| RATE_LIMITED | 429 | Too many requests |

---

## Related Documentation

- [Login Feature](../../features/auth/login.md)
- [Password Reset Feature](../../features/auth/password-reset.md)
- [2FA Feature](../../features/auth/2fa.md)
- [Login Troubleshooting](../../troubleshooting/access/login-issues.md)
