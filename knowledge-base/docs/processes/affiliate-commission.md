---
id: affiliate-commission-process
title: Affiliate Commission Process
type: process
category: payment
audience: [internal-ops, admin, ai-agent]
status: current
related: [affiliate-program, payment-flow, subscription-lifecycle]
last_updated: 2026-01-30
version: 1.0
tags: [affiliate, commission, payout, webhook, cron]
---

# Affiliate Commission Process

## Summary
End-to-end process for how affiliate commissions are earned, held, approved, and paid out.

## Quick Reference
```yaml
trigger: PayPal renewal webhook (PAYMENT.SALE.COMPLETED)
owner: System (automated accrual/approval), Admin (manual payouts)
duration: 37+ days from referral signup to first payout eligibility
automation: partial (accrual and approval automated, payouts manual)
```

---

## Process Flow

```
Referred user subscribes → Referral record created →
First renewal (30 days) → Commission accrued (pending) →
7-day hold → Cron approves commission → Balance updated →
Client requests payout → Admin processes via PayPal
```

---

## Detailed Steps

### Step 1: Referral Attribution

**Trigger**: New user signs up using a referral link (`?ref=SPEAR-XXXXXX`)

**System Actions**:
1. ReferralProvider captures `?ref=` from URL, saves to localStorage
2. At checkout, referral code passed to `create-payment` or `create-subscription` API
3. Code stored in order's `notes` JSON field
4. On payment capture/subscription callback, Referral record created

**Database Record**:
```json
{
  "affiliateId": "affiliate_profile_id",
  "referredUserId": "new_user_id",
  "referralCode": "SPEAR-ABC123",
  "status": "subscribed",
  "signupDate": "2026-01-30"
}
```

**Validations**:
- Referral code must exist and affiliate must be active
- Cannot self-refer (referredUserId !== affiliate.userId)
- One referrer per user (referredUserId unique constraint)

---

### Step 2: Commission Accrual (On Renewal)

**Trigger**: PayPal webhook `PAYMENT.SALE.COMPLETED` (recurring payment)

**System Actions**:
1. Webhook handler identifies this is a renewal (not initial payment)
2. Calls `accrueAffiliateCommission(referredUserId, orderId, amountCents)`
3. Looks up Referral for this referred user
4. Creates AffiliateCommission record as "pending"
5. Increments affiliate's `pendingBalance`
6. If first renewal, updates referral status to "active" and sets `firstPaymentDate`

**Database Record**:
```json
{
  "affiliateId": "affiliate_profile_id",
  "referralId": "referral_id",
  "orderId": "order_id",
  "amount": 2500,
  "subscriptionAmount": 29900,
  "status": "pending",
  "periodStart": "2026-02-01",
  "periodEnd": "2026-03-01"
}
```

**Key Rule**: No commission on initial payment. First commission only after 30+ days (first renewal).

---

### Step 3: 7-Day Hold & Approval

**Trigger**: Daily cron job at 2am (`/api/cron/process-commissions`)

**System Actions**:
1. Cron runs with CRON_SECRET bearer token authentication
2. Calls `approvePendingCommissions()`
3. Finds all "pending" commissions older than 7 days
4. For each: updates status to "approved", moves amount from `pendingBalance` to `totalEarned`
5. Uses database transaction for atomicity

**Purpose**: 7-day hold protects against:
- Refunds issued within first week
- Payment disputes/chargebacks
- Fraudulent signups

---

### Step 4: Payout Request

**Trigger**: Client clicks "Request Payout" on `/dashboard/affiliate`

**Validations**:
- Balance >= $50 minimum threshold
- PayPal payout email is set
- No existing pending/processing payout

**System Actions**:
1. Creates AffiliatePayout record with status "requested"
2. Admin receives notification

**Database Record**:
```json
{
  "affiliateId": "affiliate_profile_id",
  "amount": 5000,
  "status": "requested",
  "payoutMethod": "paypal",
  "payoutEmail": "affiliate@example.com"
}
```

---

### Step 5: Admin Payout Processing

**Trigger**: Admin reviews pending payout at `/admin/affiliates` (Pending Payouts tab)

**Manual Steps**:
1. Admin sees payout request with amount and PayPal email
2. Admin sends money via PayPal manually
3. Admin enters PayPal transaction ID in the admin panel
4. Admin clicks "Complete" to mark payout as processed

**System Actions on Completion**:
1. Payout status updated to "completed"
2. Affiliate's `pendingBalance` decremented
3. Affiliate's `totalPaid` incremented
4. All approved commissions up to payout amount marked as "paid" with payoutId

---

## Reversal Scenarios

### Refund Issued

**Trigger**: PayPal webhook `PAYMENT.CAPTURE.REFUNDED`

**System Actions**:
1. Calls `reverseAffiliateCommission(orderId, "Refund issued")`
2. Finds commission linked to that orderId
3. If pending or approved: reverses commission, decrements `pendingBalance`
4. Commission status set to "reversed" with reason

### Subscription Cancelled

**Trigger**: PayPal webhook `BILLING.SUBSCRIPTION.CANCELLED`

**System Actions**:
1. Calls `updateReferralStatus(referredUserId, "churned")`
2. No new commissions accrue for this referral
3. Existing approved/paid commissions are NOT reversed

### Subscription Suspended

**Trigger**: PayPal webhook `BILLING.SUBSCRIPTION.SUSPENDED`

**System Actions**:
1. Calls `updateReferralStatus(referredUserId, "churned")`
2. If user later reactivates, referral status returns to "active"

---

## Decision Points

| Condition | Action |
|-----------|--------|
| Initial payment (not renewal) | No commission |
| Referred user renews | Accrue $25 commission |
| Commission < 7 days old | Keep as pending |
| Commission >= 7 days old | Approve via cron |
| Refund issued | Reverse commission |
| Referred user cancels | Mark referral churned, stop commissions |
| Referred user re-subscribes | Resume commissions on next renewal |
| Payout request < $50 | Reject |
| No PayPal email set | Block payout request |

---

## Failure Handling

| Failure Point | Detection | Recovery |
|---------------|-----------|----------|
| Commission accrual fails | Error logged in webhook handler | Manual review, retry |
| Cron job fails | Vercel cron monitoring | Commissions stay pending until next run |
| Payout send fails | Admin marks as "failed" | Retry with correct details |
| Reversal fails | Error logged | Manual adjustment by admin |

---

## Monitoring

### Key Metrics
- Total commissions accrued per month
- Commission approval rate
- Average payout amount
- Referral conversion rate (signup → active)
- Churn rate of referred users

### Admin Dashboard
- `/admin/affiliates` shows all affiliates, pending payouts, history
- Settings tab controls commission rate, min payout, program enable/disable

---

## Related Documentation

- [Affiliate Program Feature](../features/affiliate/program.md)
- [Affiliate API Endpoints](../api/affiliate/endpoints.md)
- [Payment Flow](./payment-flow.md)
- [Subscription Lifecycle](./subscription-lifecycle.md)
- [Business Rules](../reference/business-rules.md)
