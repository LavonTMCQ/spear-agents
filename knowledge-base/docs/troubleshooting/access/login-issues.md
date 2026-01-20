---
id: troubleshoot-login-issues
title: Login Issues
type: troubleshooting
category: access
audience: [customer-support, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [login, authentication, password, access, account]
---

# Login Issues

## Symptoms
- Customer can't log into their account
- "Invalid credentials" error
- "Account not found" error
- Social login (Google/Apple) not working
- 2FA code not accepted
- Stuck on login page

## Quick Diagnosis
```yaml
check_first: Does account exist? Search by email in /admin/clients
ask_user: "What error message do you see? Are you using email/password or Google/Apple login?"
lookup: /admin/clients - verify account exists and is active
```

---

## Causes & Solutions

### Cause 1: Wrong Password (Most Common)

**Diagnosis**:
- "Invalid credentials" error
- Customer forgot password
- Caps lock or typo

**Solution**:
1. Suggest password reset via "Forgot Password" link
2. Direct to `/forgot-password`
3. They'll receive reset email
4. Follow reset link to create new password

**Customer Message**:
> "Let's reset your password. Click the 'Forgot password?' link on the login page, enter your email, and you'll receive a reset link within a few minutes. Check your spam folder if you don't see it."

**Prevention**: Clear password visibility toggle on login

---

### Cause 2: Account Doesn't Exist

**Diagnosis**:
- "Account not found" or similar error
- Customer never completed signup
- Customer using wrong email

**Solution**:
1. Search `/admin/clients` by email
2. If not found, they need to register
3. Check if they have another email
4. Direct to registration if needed

**Customer Message**:
> "I don't see an account with that email address. Did you sign up with a different email? If not, you can create an account at our registration page."

**Prevention**: Clear signup vs login flow

---

### Cause 3: Using Wrong Login Method

**Diagnosis**:
- Customer signed up with Google but trying email/password
- Or signed up with email but clicking Google
- Clerk shows error about auth method

**Solution**:
1. Ask how they originally signed up
2. Use the same method to log in
3. Google signup = Google login
4. Email signup = email/password login

**Customer Message**:
> "It looks like you may have signed up using [Google/Apple/email]. Please use the same method to log in. If you signed up with Google, click the 'Google' button instead of entering your email and password."

**Prevention**: Show "Sign in with Google" option if we know they used it

---

### Cause 4: Google/Apple Login Error

**Diagnosis**:
- Error after clicking Google or Apple button
- Popup blocked
- OAuth callback failed

**Solution**:
1. Check for popup blocker
2. Allow popups for spear-global.com
3. Try different browser
4. Clear browser cache and cookies
5. Retry social login

**Customer Message**:
> "Social login can sometimes be blocked by your browser. Please make sure popups are allowed for our site, then try again. If that doesn't work, try using a different browser or clearing your browser's cache."

**Prevention**: Clear error messages for OAuth issues

---

### Cause 5: Two-Factor Authentication Failed (Admin)

**Diagnosis**:
- Admin trying to log in
- 2FA code rejected
- Authenticator out of sync

**Solution**:
1. Verify using correct authenticator app
2. Check device time is correct (TOTP is time-based)
3. Wait for new code (they expire every 30 seconds)
4. Use backup codes if available
5. Admin can use emergency access if needed

**Customer Message** (for admin):
> "Make sure your phone's time is set correctly (TOTP codes are time-sensitive). Wait for a fresh code and try again. If that doesn't work, you can use one of your backup codes."

**Prevention**: Provide backup codes during 2FA setup

---

### Cause 6: Session/Cookie Issues

**Diagnosis**:
- Login appears to work but immediately redirects back
- Already logged in but session not recognized
- Browser cookie issues

**Solution**:
1. Clear browser cookies for spear-global.com
2. Try incognito/private mode
3. Try different browser
4. Disable browser extensions that might interfere

**Customer Message**:
> "This might be a browser session issue. Please try clearing your cookies for our site, or try logging in using an incognito/private window. You can also try a different browser."

**Prevention**: Clear session error handling

---

### Cause 7: Account Disabled/Suspended

**Diagnosis**:
- Account exists but can't log in
- Admin disabled the account
- Fraud/abuse suspension

**Solution**:
1. Check account status in `/admin/clients`
2. If suspended, review reason
3. If legitimate, reactivate
4. If fraud, maintain suspension

**Customer Message** (if legitimate):
> "I see there was an issue with your account. Let me look into this and get it resolved for you."

**Customer Message** (if suspension valid):
> "Your account has been suspended. Please contact support for more information."

**Prevention**: Clear communication about account status

---

### Cause 8: Password Reset Link Expired

**Diagnosis**:
- Customer trying to use old reset link
- "Token expired" or "Invalid link" error
- Reset links expire after 24 hours

**Solution**:
1. Request a new password reset
2. Go to `/forgot-password`
3. Use new link immediately
4. Links expire after 24 hours

**Customer Message**:
> "Password reset links expire after 24 hours for security. Please request a new reset link and use it right away."

**Prevention**: Clear expiration messaging in emails

---

## Admin Actions

### Check Account Status
1. Go to `/admin/clients`
2. Search by email
3. Verify account exists
4. Check subscription status
5. Check if account is flagged

### Reset Password Manually (Rare)
If customer can't receive emails:
1. Verify customer identity
2. Use emergency access to reset
3. Provide temporary password
4. Have them change immediately

### Emergency Admin Access
For admin accounts with 2FA issues:
- Use `/emergency-admin` or `/direct-admin`
- Requires hardcoded admin email
- Bypasses 2FA for recovery

---

## Verification Steps

Before helping with account access, verify identity:

- [ ] Customer email matches records
- [ ] Can verify subscription/order details
- [ ] Answers security questions (if available)
- [ ] Request from known email address

**Never** reset passwords or reveal account info without verification.

---

## Escalation

If basic troubleshooting fails:
- **Escalate to**: Admin/Ops team
- **Provide**:
  - Customer email
  - Error message
  - Login method attempted
  - Steps already tried
- **SLA**: 4 hours for access issues

---

## Quick Response Templates

### Initial Response
> "I'm sorry you're having trouble logging in. Let me help you get back into your account."

### Asking for Details
> "What error message do you see? And just to confirm, are you trying to log in with your email and password, or using Google/Apple?"

### Password Reset Guidance
> "The quickest way to fix this is to reset your password. Click 'Forgot password?' on the login page, and you'll receive an email with a reset link. If you don't see it within a few minutes, check your spam folder."

### Account Found
> "Good news - I found your account! Let me walk you through the next steps."

### Issue Resolved
> "You should be able to log in now. Please try again and let me know if it works!"

---

## Related Documentation

- [Password Reset](../../features/auth/password-reset.md)
- [2FA Issues](./2fa-issues.md)
- [Clerk Integration](../../features/auth/clerk.md)
- [Emergency Admin Access](../../guides/admin/emergency-access.md)

---

*Last verified: 2025-01-20*
