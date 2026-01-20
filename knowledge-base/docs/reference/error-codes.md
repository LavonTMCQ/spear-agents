---
id: reference-error-codes
title: Error Codes Reference
type: reference
category: system
audience: [customer-support, internal-ops, developer, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [errors, codes, api, troubleshooting]
---

# Error Codes Reference

## Summary
Complete reference of error codes returned by SPEAR APIs and displayed to users.

## Quick Reference
```yaml
what: Error code definitions and resolutions
who: Support, developers, AI agents
format: HTTP status + error code + message
categories: Auth, Payment, Subscription, Device, General
```

---

## HTTP Status Codes

| Status | Meaning | When Used |
|--------|---------|-----------|
| 200 | Success | Request completed |
| 201 | Created | New resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate/conflict |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Internal error |

---

## Authentication Errors

### AUTH_001: INVALID_CREDENTIALS
- **HTTP Status**: 401
- **Message**: "Invalid email or password"
- **Cause**: Wrong password or email
- **Resolution**: Verify credentials or reset password

### AUTH_002: ACCOUNT_NOT_FOUND
- **HTTP Status**: 401
- **Message**: "Account not found"
- **Cause**: Email not registered
- **Resolution**: Register new account or check email

### AUTH_003: ACCOUNT_DISABLED
- **HTTP Status**: 403
- **Message**: "Account has been disabled"
- **Cause**: Admin suspended account
- **Resolution**: Contact support

### AUTH_004: SESSION_EXPIRED
- **HTTP Status**: 401
- **Message**: "Session has expired"
- **Cause**: Inactive session timeout
- **Resolution**: Login again

### AUTH_005: INVALID_TOKEN
- **HTTP Status**: 400
- **Message**: "Invalid or expired token"
- **Cause**: Password reset token invalid/expired
- **Resolution**: Request new reset email

### AUTH_006: 2FA_REQUIRED
- **HTTP Status**: 403
- **Message**: "Two-factor authentication required"
- **Cause**: Admin account needs 2FA
- **Resolution**: Enter 2FA code

### AUTH_007: INVALID_2FA_CODE
- **HTTP Status**: 400
- **Message**: "Invalid verification code"
- **Cause**: Wrong 2FA code entered
- **Resolution**: Check code, verify phone time

### AUTH_008: EMAIL_EXISTS
- **HTTP Status**: 409
- **Message**: "Email already registered"
- **Cause**: Attempting to register existing email
- **Resolution**: Login or use different email

### AUTH_009: WEAK_PASSWORD
- **HTTP Status**: 400
- **Message**: "Password does not meet requirements"
- **Cause**: Password too weak
- **Resolution**: Use stronger password (8+ chars, upper, lower, number)

### AUTH_010: PASSWORDS_MISMATCH
- **HTTP Status**: 400
- **Message**: "Passwords do not match"
- **Cause**: Confirm password doesn't match
- **Resolution**: Re-enter matching passwords

---

## Payment Errors

### PAY_001: INVALID_PLAN
- **HTTP Status**: 400
- **Message**: "Invalid plan type"
- **Cause**: Unknown plan type specified
- **Resolution**: Check available plans

### PAY_002: INVALID_COUPON
- **HTTP Status**: 400
- **Message**: "Invalid or expired coupon code"
- **Cause**: Coupon doesn't exist or expired
- **Resolution**: Verify coupon code, use different code

### PAY_003: PAYMENT_NOT_APPROVED
- **HTTP Status**: 400
- **Message**: "Payment was not approved"
- **Cause**: User cancelled PayPal flow
- **Resolution**: Retry checkout

### PAY_004: CAPTURE_FAILED
- **HTTP Status**: 400
- **Message**: "Payment capture failed"
- **Cause**: PayPal rejected capture
- **Resolution**: Check PayPal account, retry

### PAY_005: DUPLICATE_ORDER
- **HTTP Status**: 409
- **Message**: "Order already processed"
- **Cause**: Same PayPal order ID submitted twice
- **Resolution**: Return existing order info

### PAY_006: PAYPAL_ERROR
- **HTTP Status**: 500
- **Message**: "Payment service error"
- **Cause**: PayPal API failure
- **Resolution**: Retry, check PayPal status

### PAY_007: INSUFFICIENT_FUNDS
- **HTTP Status**: 400
- **Message**: "Insufficient funds"
- **Cause**: PayPal/card balance too low
- **Resolution**: Add funds, use different payment

### PAY_008: REFUND_FAILED
- **HTTP Status**: 500
- **Message**: "Refund could not be processed"
- **Cause**: PayPal refund API error
- **Resolution**: Retry or manual refund

### PAY_009: COUPON_LIMIT_REACHED
- **HTTP Status**: 400
- **Message**: "Coupon usage limit reached"
- **Cause**: Coupon max uses exceeded
- **Resolution**: Use different coupon

### PAY_010: COUPON_ALREADY_USED
- **HTTP Status**: 400
- **Message**: "Coupon already used by this account"
- **Cause**: One-per-customer coupon used
- **Resolution**: Proceed without coupon

---

## Subscription Errors

### SUB_001: NO_SUBSCRIPTION
- **HTTP Status**: 400
- **Message**: "No active subscription found"
- **Cause**: User doesn't have subscription
- **Resolution**: Purchase subscription

### SUB_002: ALREADY_CANCELLED
- **HTTP Status**: 400
- **Message**: "Subscription already cancelled"
- **Cause**: Cancellation on cancelled sub
- **Resolution**: No action needed

### SUB_003: ALREADY_ACTIVE
- **HTTP Status**: 400
- **Message**: "Subscription already active"
- **Cause**: Reactivating active sub
- **Resolution**: No action needed

### SUB_004: SUBSCRIPTION_EXPIRED
- **HTTP Status**: 400
- **Message**: "Subscription has expired"
- **Cause**: Can't perform action on expired sub
- **Resolution**: Create new subscription

### SUB_005: NOT_CANCELLED
- **HTTP Status**: 400
- **Message**: "Subscription is not pending cancellation"
- **Cause**: Trying to reactivate non-cancelled sub
- **Resolution**: Subscription is already active

### SUB_006: INVALID_EXTENSION
- **HTTP Status**: 400
- **Message**: "Invalid extension period"
- **Cause**: Days parameter out of range
- **Resolution**: Use 1-365 days

### SUB_007: ACCESS_DENIED
- **HTTP Status**: 403
- **Message**: "Subscription access denied"
- **Cause**: Inactive subscription trying to access resource
- **Resolution**: Reactivate subscription

---

## Device Errors

### DEV_001: DEVICE_NOT_FOUND
- **HTTP Status**: 404
- **Message**: "Device not found"
- **Cause**: Invalid device ID
- **Resolution**: Verify device ID

### DEV_002: DEVICE_OFFLINE
- **HTTP Status**: 400
- **Message**: "Device is offline"
- **Cause**: Device not connected to network
- **Resolution**: Check device power/internet

### DEV_003: CONNECTION_FAILED
- **HTTP Status**: 500
- **Message**: "Failed to connect to device"
- **Cause**: RustDesk connection error
- **Resolution**: Retry, check device status

### DEV_004: DEVICE_ALREADY_ASSIGNED
- **HTTP Status**: 409
- **Message**: "Device already assigned"
- **Cause**: Trying to assign assigned device
- **Resolution**: Unassign first or use different device

### DEV_005: NO_DEVICE_ACCESS
- **HTTP Status**: 403
- **Message**: "No access to this device"
- **Cause**: User doesn't own device
- **Resolution**: Use own devices only

### DEV_006: SYNC_FAILED
- **HTTP Status**: 500
- **Message**: "Device sync failed"
- **Cause**: RustDesk server communication error
- **Resolution**: Retry sync

### DEV_007: INVALID_RUSTDESK_ID
- **HTTP Status**: 400
- **Message**: "Invalid RustDesk ID format"
- **Cause**: ID doesn't match expected format
- **Resolution**: Check ID (9 digits)

---

## General Errors

### GEN_001: VALIDATION_ERROR
- **HTTP Status**: 400
- **Message**: "Validation error: [details]"
- **Cause**: Invalid input data
- **Resolution**: Fix input per message

### GEN_002: NOT_FOUND
- **HTTP Status**: 404
- **Message**: "Resource not found"
- **Cause**: Requested resource doesn't exist
- **Resolution**: Check ID/path

### GEN_003: UNAUTHORIZED
- **HTTP Status**: 401
- **Message**: "Authentication required"
- **Cause**: Not logged in
- **Resolution**: Login first

### GEN_004: FORBIDDEN
- **HTTP Status**: 403
- **Message**: "Permission denied"
- **Cause**: Don't have required role
- **Resolution**: Use appropriate account

### GEN_005: RATE_LIMITED
- **HTTP Status**: 429
- **Message**: "Too many requests"
- **Cause**: Exceeded rate limit
- **Resolution**: Wait and retry

### GEN_006: SERVER_ERROR
- **HTTP Status**: 500
- **Message**: "Internal server error"
- **Cause**: Unexpected server failure
- **Resolution**: Retry, contact support

### GEN_007: DATABASE_ERROR
- **HTTP Status**: 500
- **Message**: "Database error"
- **Cause**: Database operation failed
- **Resolution**: Retry, escalate if persists

### GEN_008: SERVICE_UNAVAILABLE
- **HTTP Status**: 503
- **Message**: "Service temporarily unavailable"
- **Cause**: Maintenance or overload
- **Resolution**: Wait and retry

---

## Error Response Format

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid email or password",
    "details": null
  }
}
```

### Validation Error Response
```json
{
  "success": false,
  "error": {
    "code": "GEN_001",
    "message": "Validation error",
    "details": {
      "email": "Invalid email format",
      "password": "Password is required"
    }
  }
}
```

---

## For Customer Support

### Quick Resolution Guide

| Error Code | Quick Fix |
|------------|-----------|
| AUTH_001 | Password reset |
| AUTH_005 | Request new reset email |
| PAY_002 | Verify coupon code |
| PAY_003 | Retry checkout |
| SUB_001 | Purchase subscription |
| DEV_002 | Check device power/internet |

### When to Escalate

Escalate to ops/technical if:
- GEN_006 (Server Error) persists
- GEN_007 (Database Error) persists
- DEV_003 (Connection Failed) for multiple users
- Any 500-level error recurring

---

## Related Documentation

- [Login Troubleshooting](../troubleshooting/access/login-issues.md)
- [Payment Troubleshooting](../troubleshooting/payment/failed-payment.md)
- [Device Troubleshooting](../troubleshooting/device/connection-failed.md)
- [API Reference](../api/)
