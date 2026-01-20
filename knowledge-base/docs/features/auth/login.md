---
id: feature-login
title: Login & Authentication
type: feature
category: auth
audience: [customer-support, internal-ops, sales, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [login, authentication, google, apple, clerk, password]
---

# Login & Authentication

## Summary
SPEAR supports multiple authentication methods: email/password login and social login via Google and Apple.

## Quick Reference
```yaml
what: User authentication to access SPEAR
who: All users (clients and admins)
where: /login
when: Accessing protected pages
why: Secure access to user accounts and devices
methods: Email/password, Google OAuth, Apple OAuth
```

---

## Overview

SPEAR provides a secure, multi-method authentication system:

1. **Email/Password**: Traditional login with credentials
2. **Google Login**: OAuth via Clerk
3. **Apple Login**: OAuth via Clerk

All methods create the same type of session, giving users full access to their dashboard and devices.

---

## Login Methods

### Email/Password Login

The traditional authentication method:

1. User enters email address
2. User enters password
3. System validates credentials
4. Session created on success

**Location**: Main login form at `/login`

**Requirements**:
- Must have registered account
- Correct email and password

### Google Login

Quick login via Google account:

1. User clicks "Google" button
2. Redirects to Google OAuth
3. User approves access
4. Returns to SPEAR with session

**Requirements**:
- Google account
- Allow SPEAR app access

### Apple Login

Quick login via Apple ID:

1. User clicks "Apple" button
2. Redirects to Apple OAuth
3. User approves with Face ID/Touch ID/password
4. Returns to SPEAR with session

**Requirements**:
- Apple ID
- Allow SPEAR app access

---

## User Experience

### Login Page Layout

```
┌─────────────────────────────────┐
│         SPEAR Logo              │
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │ Google  │  │  Apple  │      │
│  └─────────┘  └─────────┘      │
│                                 │
│  ─── Or continue with email ─── │
│                                 │
│  Email: [________________]      │
│  Password: [______________]     │
│            Forgot password?     │
│                                 │
│         [ Login ]               │
│                                 │
│  Don't have an account?         │
│  Register here                  │
└─────────────────────────────────┘
```

### After Successful Login

**For Clients**:
- Redirected to `/dashboard`
- See their devices, subscription status

**For Admins**:
- Redirected to `/admin`
- If 2FA enabled, prompted for code first
- Full admin dashboard access

---

## Actions

### Action: Login with Email

**Description**: Authenticate using email and password

**Trigger**:
- UI: Enter credentials, click "Login" at /login

**Permissions**:
- Role: Any registered user

**Input**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email |
| password | string | Yes | User's password |

**Output**:
- Success: Redirect to dashboard/admin
- Failure: Error message displayed

**Error Messages**:
| Error | Meaning | User Action |
|-------|---------|-------------|
| "Invalid credentials" | Wrong password | Try again or reset password |
| "Account not found" | Email not registered | Register or check email |

### Action: Login with Google

**Description**: Authenticate using Google account

**Trigger**:
- UI: Click "Google" button at /login

**Flow**:
1. Click button → Redirect to Google
2. Approve access → Return to /sso-callback
3. Account linked → Redirect to dashboard

**Account Linking**:
- If email exists: Links to existing account
- If new email: Creates new account

### Action: Login with Apple

**Description**: Authenticate using Apple ID

**Trigger**:
- UI: Click "Apple" button at /login

**Flow**:
1. Click button → Redirect to Apple
2. Approve with biometrics → Return to /sso-callback
3. Account linked → Redirect to dashboard

**Note**: Apple may hide email on first login (use relay)

### Action: Forgot Password

**Description**: Request password reset email

**Trigger**:
- UI: Click "Forgot password?" link at /login

**Flow**:
1. Click link → Go to /forgot-password
2. Enter email → Submit
3. Check email → Click reset link
4. Enter new password → Login

See [Password Reset](./password-reset.md) for details.

---

## Common Issues

### "Invalid credentials"

**Causes**:
- Wrong password
- Caps lock on
- Typo in password

**Solutions**:
1. Check caps lock
2. Try password again carefully
3. Use "Forgot password" to reset

### "Account not found"

**Causes**:
- Email not registered
- Typo in email
- Signed up with different email

**Solutions**:
1. Check email spelling
2. Try other email addresses
3. Register if new user

### Social login not working

**Causes**:
- Popup blocked
- Browser cookies disabled
- Previous session conflict

**Solutions**:
1. Allow popups for spear-global.com
2. Enable cookies
3. Clear browser cache
4. Try incognito mode

### Stuck after social login

**Causes**:
- Callback URL issue
- Network interruption

**Solutions**:
1. Return to /login and try again
2. Try different browser
3. Clear cookies and retry

---

## For Customer Support

### "I can't log in"

**Questions to ask**:
1. "What error message do you see?"
2. "Are you using email/password or Google/Apple?"
3. "Have you logged in before, or is this your first time?"

**Quick checks**:
1. Search for account in `/admin/clients`
2. Verify email exists
3. Check subscription status

**Common resolutions**:
- Password reset for forgotten passwords
- Correct login method guidance
- Account creation for new users

### "I signed up with Google but trying email login"

Explain that they need to use the same method:
> "Since you signed up with Google, you'll need to click the Google button to log in. You can't use email/password if you signed up with social login."

### "I forgot which email I used"

Ask about their order/subscription:
> "Do you have an order confirmation email? The email we have on file would be the one that received confirmations."

---

## Security Notes

### Session Security
- Sessions stored in database (not JWT)
- HttpOnly cookies prevent XSS
- Sessions expire after inactivity
- Logout clears session

### Admin Security
- Admin accounts require 2FA
- Emergency access available for recovery
- All admin logins logged

### Password Security
- Passwords hashed with bcrypt
- Minimum requirements enforced
- Reset tokens expire in 24 hours

---

## Related Documentation

- [Password Reset](./password-reset.md)
- [Two-Factor Authentication](./2fa.md)
- [Registration](./registration.md)
- [Login Troubleshooting](../../troubleshooting/access/login-issues.md)
- [Authentication API](../../api/auth/login.md)
