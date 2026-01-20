---
id: feature-2fa
title: Two-Factor Authentication (2FA)
type: feature
category: auth
audience: [customer-support, internal-ops, admin, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [2fa, totp, security, authentication, admin]
---

# Two-Factor Authentication (2FA)

## Summary
TOTP-based two-factor authentication for enhanced security, primarily used for admin accounts.

## Quick Reference
```yaml
what: Additional security layer for login
who: Admin accounts (optional for clients)
where: /admin/security for setup, login flow for verification
when: After password authentication
why: Protect admin access from compromised passwords
method: TOTP (Time-based One-Time Password)
apps: Google Authenticator, Authy, 1Password, etc.
```

---

## Overview

Two-Factor Authentication adds an extra security layer by requiring:
1. Something you know (password)
2. Something you have (phone with authenticator app)

When 2FA is enabled, after entering your password, you must also enter a 6-digit code from your authenticator app.

---

## How It Works

### TOTP (Time-based One-Time Password)

- Codes are generated every 30 seconds
- Based on shared secret between SPEAR and your app
- Codes work offline (no internet needed on phone)
- Small time drift tolerance (±30 seconds)

### Setup Flow

```
1. Go to /admin/security
2. Click "Enable 2FA"
3. Scan QR code with authenticator app
4. Enter verification code to confirm
5. Save backup codes securely
```

### Login Flow with 2FA

```
1. Enter email and password
2. Click Login
3. If 2FA enabled: Show code entry screen
4. Enter 6-digit code from app
5. If correct: Login complete
6. If incorrect: Try again or use backup code
```

---

## Actions

### Action: Enable 2FA

**Description**: Set up two-factor authentication on account

**Trigger**:
- UI: /admin/security → "Enable 2FA"
- API: `POST /api/admin/2fa/setup`

**Permissions**:
- Role: ADMIN (required for admin accounts)

**Steps**:
1. Click "Enable 2FA"
2. System generates secret key
3. QR code displayed
4. Scan with authenticator app
5. Enter verification code
6. 2FA activated

**Output**:
- QR code for scanning
- Manual entry key (if QR doesn't work)
- Backup codes (save these!)

### Action: Verify 2FA Code

**Description**: Enter 2FA code during login

**Trigger**:
- UI: 2FA prompt after password login
- API: `POST /api/admin/2fa/verify`

**Input**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | 6-digit code from app |

**Output**:
- Success: Login complete, redirect to admin
- Failure: "Invalid code" error

### Action: Use Backup Code

**Description**: Use backup code when phone unavailable

**Trigger**:
- UI: Click "Use backup code" on 2FA screen
- API: `POST /api/admin/2fa/verify` with backup code

**Notes**:
- Each backup code works once only
- 10 codes generated during setup
- Generate new codes if running low

### Action: Disable 2FA

**Description**: Turn off two-factor authentication

**Trigger**:
- UI: /admin/security → "Disable 2FA"
- API: `POST /api/admin/2fa/disable`

**Requirements**:
- Must verify current 2FA code to disable
- Or use backup code

**Warning**: Reduces account security

### Action: Regenerate Backup Codes

**Description**: Get new backup codes

**Trigger**:
- UI: /admin/security → "Generate New Backup Codes"
- API: `GET /api/admin/2fa/backup-codes`

**Output**:
- 10 new backup codes
- Old codes invalidated

---

## Authenticator Apps

### Recommended Apps

| App | Platform | Notes |
|-----|----------|-------|
| Google Authenticator | iOS, Android | Simple, reliable |
| Authy | iOS, Android, Desktop | Cloud backup, multi-device |
| 1Password | All | Built into password manager |
| Microsoft Authenticator | iOS, Android | Good for enterprise |

### Setting Up in App

1. Open authenticator app
2. Tap "+" or "Add account"
3. Choose "Scan QR code"
4. Point camera at QR code on screen
5. Account appears in app with 6-digit code

### Manual Entry

If QR scanning doesn't work:
1. Tap "Enter manually" in app
2. Enter account name: SPEAR Admin
3. Enter key shown below QR code
4. Save

---

## Backup Codes

### What Are They?

Backup codes are one-time passwords for emergencies:
- Use when phone is lost/broken
- Use when app deleted
- Use when traveling without phone

### How to Use

1. On 2FA screen, click "Use backup code"
2. Enter one of your saved codes
3. Login completes
4. That code is now invalid

### Storing Safely

**Do**:
- Save in password manager
- Print and store securely
- Save in encrypted file

**Don't**:
- Store in plain text on computer
- Share with anyone
- Leave visible

---

## Common Issues

### "Invalid code"

**Causes**:
- Code expired (entered too slowly)
- Wrong code typed
- Phone time incorrect

**Solutions**:
1. Wait for new code, enter quickly
2. Check code carefully (no typos)
3. Verify phone time is correct (Settings → Time → Automatic)

### Lost Phone / Deleted App

**Solutions**:
1. Use backup code to login
2. Disable 2FA from security settings
3. Re-enable with new phone

**If no backup codes**: Contact admin for recovery

### Phone Time Sync

TOTP codes depend on accurate time:

**iOS**: Settings → General → Date & Time → Set Automatically

**Android**: Settings → Date & Time → Automatic date & time

### New Phone

When getting new phone:
1. Login with backup code on old phone (if possible)
2. Disable 2FA
3. Set up 2FA again with new phone
4. Save new backup codes

Or:
1. Use backup code on new phone to login
2. Disable and re-enable 2FA
3. Scan QR with new phone

---

## Emergency Access

### Admin Emergency Recovery

If admin is locked out and has no backup codes:

1. Go to `/emergency-admin` or `/direct-admin`
2. Enter admin email: `quiseforeverphilly@gmail.com`
3. Enter emergency password
4. Bypasses 2FA for recovery

**Security**: Only works for hardcoded admin email

---

## For Customer Support

### "I can't get my 2FA code"

**Questions to ask**:
1. "Do you have your phone with the authenticator app?"
2. "Do you have your backup codes saved anywhere?"
3. "Did you recently change phones?"

**Resolution paths**:
1. **Has backup codes**: Guide to use backup code
2. **Has old phone**: Disable 2FA, re-setup on new phone
3. **No backup, no phone**: Escalate to admin for manual recovery

### "My codes aren't working"

Check these in order:
1. Phone time set to automatic?
2. Entering code within 30 seconds?
3. Using correct account in app?
4. Typos in the 6 digits?

### "I need to set up 2FA"

Guide to:
1. Login to admin dashboard
2. Go to Settings → Security
3. Click Enable 2FA
4. Follow on-screen instructions
5. **Emphasize**: Save backup codes!

---

## API Reference

### GET /api/admin/2fa/status

Check if 2FA is enabled for current user.

**Response**:
```json
{
  "enabled": true,
  "backupCodesRemaining": 8
}
```

### POST /api/admin/2fa/setup

Initialize 2FA setup.

**Response**:
```json
{
  "secret": "BASE32SECRET",
  "qrCode": "data:image/png;base64,..."
}
```

### POST /api/admin/2fa/verify

Verify a 2FA code.

**Request**:
```json
{
  "code": "123456"
}
```

### POST /api/admin/2fa/disable

Disable 2FA (requires code verification).

### GET /api/admin/2fa/backup-codes

Generate new backup codes.

---

## Security Best Practices

1. **Always save backup codes** - Can't recover without them
2. **Use authenticator app, not SMS** - More secure
3. **Don't share codes** - Even with support
4. **Enable on all admin accounts** - Protects platform
5. **Rotate backup codes periodically** - Fresh codes

---

## Related Documentation

- [Login Feature](./login.md)
- [Admin Security Settings](../../guides/admin/security.md)
- [2FA Troubleshooting](../../troubleshooting/access/2fa-issues.md)
- [Emergency Access](../../guides/admin/emergency-access.md)
