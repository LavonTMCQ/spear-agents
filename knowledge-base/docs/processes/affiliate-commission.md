---
id: affiliate-commission-process
title: Affiliate Commission Process
type: process
category: payment
audience: [internal-ops, admin, ai-agent]
status: current
related: [affiliate-program, payment-flow, subscription-lifecycle]
last_updated: 2026-01-30
version: 2.0
tags: [affiliate, commission, payout, webhook, cron, milestones, tiers]
---

# Affiliate Commission Process

## Summary
End-to-end process for how affiliate commissions are earned, held, approved, and paid out. Supports two affiliate types: **General** (one-time $25 per activation + milestones) and **Private** ($25/month recurring on renewals).

## Quick Reference
```yaml
trigger_general: First payment capture (one-time commission)
trigger_private: PayPal renewal webhook PAYMENT.SALE.COMPLETED (recurring)
hold_general: 15 days
hold_private: 7 days
owner: System (automated accrual/approval), Admin (manual payouts)
automation: partial (accrual, approval, tier upgrades automated; payouts manual)
```

---

## Process Flow (General Affiliates)

```
Referred user pays → Referral record created →
$25 one-time commission created (pending) →
totalActivations incremented → tier recalculated →
milestone check (award bonus if threshold reached) →
15-day hold → Cron approves commission → Balance updated →
Client requests payout → Admin processes via PayPal
```

## Process Flow (Private Affiliates)

```
Referred user subscribes → Referral record created →
First renewal (30 days) → $25 commission accrued (pending) →
7-day hold → Cron approves commission → Balance updated →
Each subsequent renewal → Another $25 commission →
Client requests payout → Admin processes via PayPal
```

---

## Detailed Steps

### Step 1: Referral Attribution (Both Types)

**Trigger**: New user signs up using a referral link (`?ref=SPEAR-XXXXXX`) or enters code at checkout

**System Actions**:
1. ReferralProvider captures `?ref=` from URL, saves to localStorage
2. At checkout, referral code shown (auto-detected or manually entered)
3. Code passed to `create-payment` or `create-subscription` API, stored in order `notes`
4. On payment capture/subscription callback, `createReferralFromPayment()` creates Referral record
5. **If affiliate is General**: immediately calls `accrueGeneralCommission()` (see Step 2A)
6. **If affiliate is Private**: no commission yet (waits for renewal webhook, see Step 2B)

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

### Step 2A: Commission Accrual - General (On First Payment)

**Trigger**: `createReferralFromPayment()` detects affiliate is type "general"

**System Actions** (`accrueGeneralCommission()`):
1. Creates AffiliateCommission with `commissionType: "one_time"`, status "pending"
2. Adds $25 to affiliate's `pendingBalance`
3. Increments affiliate's `totalActivations` by 1
4. Recalculates tier via `calculateTier()` (standard/ambassador/captain)
5. Calls `checkAndAwardMilestones()` to check for bonus eligibility

**Database Record**:
```json
{
  "affiliateId": "affiliate_profile_id",
  "referralId": "referral_id",
  "amount": 2500,
  "commissionType": "one_time",
  "status": "pending"
}
```

**Key Rule**: Commission fires on first payment capture. No renewal required for general affiliates.

---

### Step 2B: Commission Accrual - Private (On Renewal)

**Trigger**: PayPal webhook `PAYMENT.SALE.COMPLETED` (recurring payment)

**System Actions** (`accrueAffiliateCommission()`):
1. Webhook handler identifies this is a renewal (not initial payment)
2. Checks affiliate type - skips if "general" (general affiliates don't earn on renewals)
3. Creates AffiliateCommission with `commissionType: "recurring"`, status "pending"
4. Increments affiliate's `pendingBalance`
5. If first renewal, updates referral status to "active" and sets `firstPaymentDate`

**Database Record**:
```json
{
  "affiliateId": "affiliate_profile_id",
  "referralId": "referral_id",
  "orderId": "order_id",
  "amount": 2500,
  "commissionType": "recurring",
  "subscriptionAmount": 29900,
  "status": "pending",
  "periodStart": "2026-02-01",
  "periodEnd": "2026-03-01"
}
```

**Key Rule**: No commission on initial payment. First commission only after 30+ days (first renewal). General affiliates are skipped.

---

### Step 2C: Milestone Check (General Only)

**Trigger**: After each activation in `accrueGeneralCommission()`

**System Actions** (`checkAndAwardMilestones()`):
1. Checks if `totalActivations` has reached any milestone threshold (3, 5, 10, 25)
2. For each reached threshold not already awarded:
   - Creates AffiliateMilestone record (status: "pending")
   - Creates AffiliateCommission with `commissionType: "milestone_bonus"`
   - Adds bonus amount to affiliate's `pendingBalance`
3. Unique constraint `[affiliateId, milestone]` prevents double-awarding

**Milestone Definitions**:
| Threshold | Bonus Amount |
|-----------|-------------|
| 3 activations | $25 (2500 cents) |
| 5 activations | $75 (7500 cents) |
| 10 activations | $250 (25000 cents) |
| 25 activations | $1,000 (100000 cents) |

**Tier Auto-Upgrade**:
| Activations | Tier |
|-------------|------|
| 0-2 | standard |
| 3-9 | ambassador |
| 10+ | captain |

---

### Step 3: Hold Period & Approval (Both Types)

**Trigger**: Daily cron job at 2am (`/api/cron/process-commissions`)

**System Actions** (`approvePendingCommissions()`):
1. Cron runs with CRON_SECRET bearer token authentication
2. Finds all "pending" commissions grouped by affiliate
3. **Dynamic hold period**: checks each affiliate's type
   - General: 15-day hold
   - Private: 7-day hold
4. For each commission past its hold period: updates status to "approved", moves amount from `pendingBalance` to `totalEarned`
5. Also approves pending AffiliateMilestone records past the hold period
6. Uses database transaction for atomicity

**Purpose**: Hold period protects against:
- Refunds issued early
- Payment disputes/chargebacks
- Fraudulent signups

---

### Step 4: Payout Request (Both Types)

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

### Step 5: Admin Payout Processing (Both Types)

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
4. All approved commissions (including milestone bonuses) up to payout amount marked as "paid" with payoutId

---

## Reversal Scenarios

### Refund Issued

**Trigger**: PayPal webhook `PAYMENT.CAPTURE.REFUNDED`

**System Actions** (`reverseAffiliateCommission()`):
1. Finds commission linked to that orderId
2. If pending or approved: reverses commission, decrements `pendingBalance`
3. Commission status set to "reversed" with reason
4. **For general one-time commissions**: also decrements `totalActivations` and recalculates tier via `calculateTier()`

### Subscription Cancelled

**Trigger**: PayPal webhook `BILLING.SUBSCRIPTION.CANCELLED`

**System Actions**:
1. Calls `updateReferralStatus(referredUserId, "churned")`
2. **Private**: No new recurring commissions accrue for this referral
3. **General**: One-time commission was already earned (not affected by cancellation)
4. Existing approved/paid commissions are NOT reversed

### Subscription Suspended

**Trigger**: PayPal webhook `BILLING.SUBSCRIPTION.SUSPENDED`

**System Actions**:
1. Calls `updateReferralStatus(referredUserId, "churned")`
2. If user later reactivates, referral status returns to "active"

---

## Decision Points

| Condition | General Action | Private Action |
|-----------|---------------|----------------|
| Initial payment captured | Accrue $25 one-time + check milestones | No commission |
| Referred user renews | No additional commission | Accrue $25 recurring |
| Commission < hold period | Keep as pending (15 days) | Keep as pending (7 days) |
| Commission >= hold period | Approve via cron | Approve via cron |
| Refund issued | Reverse commission + decrement activations + recalculate tier | Reverse commission |
| Referred user cancels | One-time already earned | Mark churned, stop commissions |
| Referred user re-subscribes | No new commission | Resume commissions on next renewal |
| Milestone threshold reached | Award bonus + upgrade tier | N/A |
| Payout request < $50 | Reject | Reject |
| No PayPal email set | Block payout request | Block payout request |

---

## Failure Handling

| Failure Point | Detection | Recovery |
|---------------|-----------|----------|
| General commission accrual fails | Error logged in referral handler | Manual review |
| Recurring commission accrual fails | Error logged in webhook handler | Manual review, retry |
| Milestone check fails | Error logged | Milestones awarded on next activation |
| Cron job fails | Vercel cron monitoring | Commissions stay pending until next run |
| Payout send fails | Admin marks as "failed" | Retry with correct details |
| Reversal fails | Error logged | Manual adjustment by admin |

---

## Monitoring

### Key Metrics
- Total commissions accrued per month (one-time vs recurring vs milestone)
- Commission approval rate
- Average payout amount
- Referral conversion rate (signup -> active)
- Churn rate of referred users
- Tier distribution (standard/ambassador/captain)
- Milestone achievement rate

### Admin Dashboard
- `/admin/affiliates` shows all affiliates with type, tier, pending payouts, history
- Settings tab controls commission rates, hold periods, program enable/disable for both types

---

## Related Documentation

- [Affiliate Program Feature](../features/affiliate/program.md)
- [Affiliate API Endpoints](../api/affiliate/endpoints.md)
- [Payment Flow](./payment-flow.md)
- [Subscription Lifecycle](./subscription-lifecycle.md)
- [Business Rules](../reference/business-rules.md)
