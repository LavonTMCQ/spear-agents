---
id: affiliate-api-endpoints
title: Affiliate API Endpoints
type: api
category: client
audience: [developer, internal-ops, ai-agent]
status: current
related: [affiliate-program, affiliate-commission-process]
last_updated: 2026-01-30
version: 2.0
tags: [affiliate, api, referral, commission, payout, milestones, tiers]
---

# Affiliate API Endpoints

## Summary
API endpoints for the SPEAR affiliate marketing system, covering client-facing profile/stats/payouts/milestones and admin management. Supports dual affiliate types (general + private).

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
    "affiliateType": "general",
    "tier": "ambassador",
    "totalActivations": 4,
    "totalEarned": 12500,
    "totalPaid": 5000,
    "pendingBalance": 7500,
    "payoutEmail": "user@example.com",
    "createdAt": "2026-01-15"
  }
}
```

### POST /api/affiliate/profile
Creates an affiliate profile for the authenticated user. Generates a unique referral code. New profiles default to `affiliateType: "general"` and `tier: "standard"`.

**Response (201)**:
```json
{
  "profile": {
    "referralCode": "SPEAR-XYZ789",
    "status": "active",
    "commissionRate": 2500,
    "affiliateType": "general",
    "tier": "standard"
  }
}
```

---

### GET /api/affiliate/stats
Returns affiliate performance statistics with tier and milestone data.

**Response (200)**:
```json
{
  "totalReferrals": 5,
  "activeSubscribers": 3,
  "totalEarned": 12500,
  "pendingBalance": 7500,
  "commissionRate": 2500,
  "affiliateType": "general",
  "tier": "ambassador",
  "tierDisplayName": "Caregiver Ambassador",
  "totalActivations": 4,
  "nextMilestone": {
    "threshold": 5,
    "bonus": 7500
  },
  "milestoneProgress": [
    { "threshold": 3, "bonus": 2500, "status": "achieved" },
    { "threshold": 5, "bonus": 7500, "status": "next" },
    { "threshold": 10, "bonus": 25000, "status": "locked" },
    { "threshold": 25, "bonus": 100000, "status": "locked" }
  ]
}
```

**Notes**:
- `affiliateType`: "general" or "private"
- `tier`: "standard", "ambassador", or "captain" (general only)
- `nextMilestone`: null if all milestones achieved
- `milestoneProgress`: status is "achieved", "next", or "locked"

---

### GET /api/affiliate/milestones
Returns detailed milestone progress with database status for each threshold.

**Response (200)**:
```json
{
  "totalActivations": 4,
  "tier": "ambassador",
  "tierDisplayName": "Caregiver Ambassador",
  "affiliateType": "general",
  "milestones": [
    {
      "threshold": 3,
      "bonus": 2500,
      "displayStatus": "achieved",
      "dbStatus": "approved",
      "awardedAt": "2026-01-20T...",
      "approvedAt": "2026-02-04T...",
      "paidAt": null
    },
    {
      "threshold": 5,
      "bonus": 7500,
      "displayStatus": "next",
      "dbStatus": null,
      "awardedAt": null,
      "approvedAt": null,
      "paidAt": null
    }
  ]
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
Returns monthly earnings breakdown with commission types.

**Response (200)**:
```json
{
  "earnings": [
    {
      "month": "2026-01",
      "activeReferrals": 3,
      "totalEarned": 10000,
      "commissionTypes": ["one_time", "milestone_bonus"],
      "commissions": [
        {
          "amount": 2500,
          "status": "approved",
          "referralName": "John S.",
          "commissionType": "one_time"
        },
        {
          "amount": 7500,
          "status": "pending",
          "referralName": null,
          "commissionType": "milestone_bonus"
        }
      ]
    }
  ]
}
```

**Commission Types**:
- `one_time`: General affiliate activation bonus ($25)
- `recurring`: Private affiliate monthly commission ($25)
- `milestone_bonus`: Bonus for reaching activation threshold

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
List all affiliates with type, tier, and activation data (admin only).

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
      "affiliateType": "general",
      "tier": "ambassador",
      "totalActivations": 4,
      "totalReferrals": 5,
      "activeReferrals": 3,
      "totalEarned": 12500,
      "pendingBalance": 7500
    }
  ]
}
```

### GET /api/admin/affiliates/[id]
Get detailed affiliate info with referrals, commissions, and payouts.

### PUT /api/admin/affiliates/[id]
Update affiliate status, commission rate, type, or tier.

**Request Body**:
```json
{
  "status": "suspended",
  "commissionRate": 3000,
  "affiliateType": "private",
  "tier": "captain"
}
```

**Accepted Fields**:
- `status`: "active", "suspended", "banned"
- `commissionRate`: Integer (cents)
- `affiliateType`: "general" or "private"
- `tier`: "standard", "ambassador", or "captain"

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
- Marks associated approved commissions (including milestone bonuses) as "paid"

---

### GET /api/admin/affiliates/settings
Get program settings for both affiliate types.

**Response (200)**:
```json
{
  "settings": {
    "commissionRate": 2500,
    "minPayoutThreshold": 5000,
    "programEnabled": true,
    "generalCommissionRate": 2500,
    "generalHoldDays": 15,
    "generalSignupEnabled": true
  }
}
```

### PUT /api/admin/affiliates/settings
Update program settings.

**Request Body** (all fields optional):
```json
{
  "commissionRate": 2500,
  "minPayoutThreshold": 5000,
  "programEnabled": true,
  "generalCommissionRate": 2500,
  "generalHoldDays": 15,
  "generalSignupEnabled": true
}
```

**Settings**:
- `commissionRate`: Private affiliate commission rate (cents)
- `minPayoutThreshold`: Minimum payout amount (cents)
- `programEnabled`: Enable/disable entire program
- `generalCommissionRate`: General affiliate commission rate (cents)
- `generalHoldDays`: Hold period for general commissions (1-90 days, default 15)
- `generalSignupEnabled`: Allow self-signup for general affiliates

---

## Cron Endpoint

### GET /api/cron/process-commissions
Daily cron job (2am) that approves pending commissions using dynamic hold periods per affiliate type.

**Authentication**: Bearer token (`CRON_SECRET` environment variable)

**Hold Periods**:
- General affiliates: 15 days
- Private affiliates: 7 days

**Response (200)**:
```json
{
  "success": true,
  "approved": 5,
  "milestonesApproved": 1,
  "message": "Approved 5 commissions and 1 milestones"
}
```

---

## Related Documentation

- [Affiliate Program Feature](../../features/affiliate/program.md)
- [Affiliate Commission Process](../../processes/affiliate-commission.md)
- [Business Rules](../../reference/business-rules.md)
