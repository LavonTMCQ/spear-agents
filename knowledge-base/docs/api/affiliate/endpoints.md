---
id: affiliate-api-endpoints
title: Affiliate API Endpoints
type: api
category: client
audience: [developer, internal-ops, ai-agent]
status: current
related: [affiliate-program, affiliate-commission-process]
last_updated: 2026-01-30
version: 1.0
tags: [affiliate, api, referral, commission, payout]
---

# Affiliate API Endpoints

## Summary
API endpoints for the SPEAR affiliate marketing system, covering client-facing profile/stats/payouts and admin management.

## Quick Reference
```yaml
method: Various (GET, POST, PUT)
path: /api/affiliate/* (client), /api/admin/affiliates/* (admin)
auth: required (Clerk session for client, ADMIN role for admin)
rate_limit: Standard
```

---

## Client Endpoints

### GET /api/affiliate/profile
Returns the authenticated user's affiliate profile, or null if not activated.

**Response (200)**:
```json
{
  "profile": {
    "id": "...",
    "referralCode": "SPEAR-ABC123",
    "commissionRate": 2500,
    "status": "active",
    "totalEarned": 7500,
    "totalPaid": 5000,
    "pendingBalance": 2500,
    "payoutEmail": "user@example.com",
    "createdAt": "2026-01-15"
  }
}
```

### POST /api/affiliate/profile
Creates an affiliate profile for the authenticated user. Generates a unique referral code.

**Response (201)**:
```json
{
  "profile": {
    "referralCode": "SPEAR-XYZ789",
    "status": "active",
    "commissionRate": 2500
  }
}
```

---

### GET /api/affiliate/stats
Returns affiliate performance statistics.

**Response (200)**:
```json
{
  "totalReferrals": 5,
  "activeSubscribers": 3,
  "totalEarned": 7500,
  "pendingBalance": 2500,
  "commissionRate": 2500
}
```

---

### GET /api/affiliate/referrals
Returns list of referrals with privacy-safe display names.

**Response (200)**:
```json
{
  "referrals": [
    {
      "id": "...",
      "displayName": "John S.",
      "signupDate": "2026-01-10",
      "status": "active",
      "totalCommission": 5000
    }
  ]
}
```

---

### GET /api/affiliate/earnings
Returns monthly earnings breakdown.

**Response (200)**:
```json
{
  "earnings": [
    {
      "month": "2026-01",
      "activeReferrals": 3,
      "totalEarned": 7500,
      "commissions": [
        {
          "amount": 2500,
          "status": "approved",
          "referralName": "John S."
        }
      ]
    }
  ]
}
```

---

### GET /api/affiliate/payouts
Returns payout history and current balance.

**Response (200)**:
```json
{
  "balance": 5000,
  "payoutEmail": "user@example.com",
  "payouts": [
    {
      "id": "...",
      "amount": 5000,
      "status": "completed",
      "requestedAt": "2026-01-20",
      "processedAt": "2026-01-22"
    }
  ]
}
```

### POST /api/affiliate/payouts
Request a new payout.

**Validations**:
- Balance >= $50 (5000 cents)
- Payout email must be set
- No existing pending/processing payout

**Response (201)**:
```json
{
  "payout": {
    "id": "...",
    "amount": 5000,
    "status": "requested"
  }
}
```

**Errors**:
| Status | Message |
|--------|---------|
| 400 | "Minimum payout is $50.00" |
| 400 | "Set your PayPal payout email first" |
| 400 | "You already have a pending payout request" |

---

### PUT /api/affiliate/payout-method
Update PayPal payout email.

**Request Body**:
```json
{
  "payoutEmail": "newemail@example.com"
}
```

**Response (200)**:
```json
{
  "success": true,
  "payoutEmail": "newemail@example.com"
}
```

---

## Admin Endpoints

### GET /api/admin/affiliates
List all affiliates (admin only).

**Response (200)**:
```json
{
  "affiliates": [
    {
      "id": "...",
      "userName": "John Smith",
      "userEmail": "john@example.com",
      "referralCode": "SPEAR-ABC123",
      "status": "active",
      "totalReferrals": 5,
      "activeReferrals": 3,
      "totalEarned": 7500,
      "pendingBalance": 2500
    }
  ]
}
```

### GET /api/admin/affiliates/[id]
Get detailed affiliate info with referrals, commissions, and payouts.

### PUT /api/admin/affiliates/[id]
Update affiliate status or commission rate.

**Request Body**:
```json
{
  "status": "suspended",
  "commissionRate": 3000
}
```

---

### GET /api/admin/affiliates/payouts
List all payout requests. Optional `?status=requested` filter.

### PUT /api/admin/affiliates/payouts/[id]
Process a payout.

**Request Body**:
```json
{
  "status": "completed",
  "paypalPayoutId": "PAYPAL-TXN-123",
  "notes": "Processed manually via PayPal"
}
```

**Side Effects on "completed"**:
- Decrements affiliate's `pendingBalance`
- Increments affiliate's `totalPaid`
- Marks associated approved commissions as "paid"

---

### GET /api/admin/affiliates/settings
Get program settings (default commission rate, min payout, enabled flag).

### PUT /api/admin/affiliates/settings
Update program settings.

**Request Body**:
```json
{
  "defaultCommissionRate": 2500,
  "minPayoutThreshold": 5000,
  "affiliateProgramEnabled": true
}
```

---

## Cron Endpoint

### GET /api/cron/process-commissions
Daily cron job (2am) that approves pending commissions older than 7 days.

**Authentication**: Bearer token (`CRON_SECRET` environment variable)

**Response (200)**:
```json
{
  "success": true,
  "approved": 5,
  "message": "Approved 5 commissions"
}
```

---

## Related Documentation

- [Affiliate Program Feature](../../features/affiliate/program.md)
- [Affiliate Commission Process](../../processes/affiliate-commission.md)
- [Business Rules](../../reference/business-rules.md)
