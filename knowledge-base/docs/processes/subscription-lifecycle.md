---
id: subscription-lifecycle
title: Subscription Lifecycle
type: process
category: subscription
audience: [customer-support, internal-ops, admin, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [subscription, billing, renewal, cancellation, grace-period]
---

# Subscription Lifecycle

## Summary
Complete lifecycle of a SPEAR subscription from signup to cancellation, including billing, renewals, and access management.

## Quick Reference
```yaml
trigger: Customer completes payment
owner: System (automated) + Admin (exceptions)
duration: Ongoing monthly cycle
automation: full (billing), partial (exceptions)
billing_cycle: Monthly
grace_period: 7 days
```

---

## Lifecycle Stages

```
Signup → Active → Renewal Due → Payment Attempt →
  ↓ (success)     ↓ (fail)
  Active         Past Due → Grace Period →
                    ↓ (pay)     ↓ (no pay)
                  Active      Inactive → Access Revoked
```

---

## Stage 1: Signup & Activation

### Trigger
Customer completes payment (see [Payment Flow](./payment-flow.md))

### System Actions
1. Create `Subscription` record with status `active`
2. Set `currentPeriodStart` to today
3. Set `currentPeriodEnd` to today + 30 days
4. Grant device access

### Subscription Record
```json
{
  "status": "active",
  "planType": "founder_byod",
  "currentPeriodStart": "2025-01-20T00:00:00Z",
  "currentPeriodEnd": "2025-02-20T00:00:00Z",
  "paypalOrderId": "ORIGINAL_PAYMENT_ID"
}
```

### Customer Experience
- Immediate dashboard access
- Devices become accessible
- Confirmation email sent

---

## Stage 2: Active Period

### Duration
From `currentPeriodStart` to `currentPeriodEnd` (30 days)

### Customer Capabilities
- Full device access via RustDesk
- Dashboard access
- Support access
- Can cancel (access until period end)

### System Actions
- Monitor device connections
- Track usage metrics
- Send renewal reminders (7 days before)

---

## Stage 3: Renewal Due

### Trigger
`currentPeriodEnd` approaches (7 days before)

### System Actions
1. Send renewal reminder email
2. Prepare PayPal billing agreement (if applicable)
3. Schedule payment attempt

### Customer Options
- Do nothing (auto-renewal)
- Update payment method
- Cancel subscription

---

## Stage 4: Payment Attempt

### Trigger
`currentPeriodEnd` date reached

### System Actions
1. Attempt PayPal charge via billing agreement
2. Process result

### Success Path
```json
{
  "action": "Extend subscription",
  "newPeriodStart": "2025-02-20",
  "newPeriodEnd": "2025-03-20",
  "status": "active"
}
```
- Create new `Order` record
- Send receipt email
- Continue access

### Failure Path
```json
{
  "action": "Mark past due",
  "status": "past_due",
  "graceEnds": "2025-02-27"
}
```
- Send payment failed email
- Schedule dunning attempts
- Start grace period countdown

---

## Stage 5: Past Due & Grace Period

### Duration
7 days from failed payment

### Subscription Status
```json
{
  "status": "past_due",
  "currentPeriodEnd": "2025-02-20",
  "gracePeriodEnd": "2025-02-27"
}
```

### Customer Capabilities
- **Still has access** during grace period
- Can update payment method
- Can make manual payment
- Receives dunning emails

### System Actions (Dunning)
| Day | Action |
|-----|--------|
| 0 | First failure notification |
| 2 | Retry payment attempt |
| 4 | Second retry + urgent email |
| 6 | Final warning email |
| 7 | Access revocation |

### Dunning Record
```json
{
  "subscriptionId": "sub_id",
  "attemptNumber": 1,
  "status": "failed",
  "nextAttemptAt": "2025-02-22"
}
```

---

## Stage 6: Recovery or Revocation

### Recovery (Payment Received)
1. Process successful payment
2. Reset subscription to `active`
3. Set new `currentPeriodEnd`
4. Clear dunning records
5. Send confirmation email

### Revocation (No Payment)
1. Set subscription status to `inactive`
2. **Revoke device access immediately**
3. Send access revoked email
4. Flag for potential follow-up

### Revoked Subscription
```json
{
  "status": "inactive",
  "cancelledAt": "2025-02-27",
  "cancelReason": "payment_failed"
}
```

---

## Stage 7: Cancellation (Customer-Initiated)

### Trigger
Customer requests cancellation

### Cancellation Endpoint
`POST /api/client/subscription/cancel`

### System Actions
1. Set `cancelAtPeriodEnd` to `true`
2. **Keep access until `currentPeriodEnd`**
3. Send cancellation confirmation
4. No further billing

### Cancelled Subscription (Pending)
```json
{
  "status": "active",
  "cancelAtPeriodEnd": true,
  "currentPeriodEnd": "2025-02-20"
}
```

### After Period Ends
```json
{
  "status": "cancelled",
  "cancelledAt": "2025-02-20",
  "cancelReason": "customer_requested"
}
```

---

## Stage 8: Reactivation

### Trigger
Former customer wants to return

### Reactivation Endpoint
`POST /api/subscription/reactivate`

### Process
1. Verify previous subscription exists
2. Process new payment
3. Create new subscription period
4. Restore device access

### Considerations
- May need new device assignment
- Previous pricing may not apply (unless grandfathered)
- Review cancellation history

---

## Status Reference

| Status | Description | Has Access |
|--------|-------------|------------|
| `active` | Paid and current | Yes |
| `trialing` | In trial period | Yes |
| `past_due` | Payment failed, in grace | Yes |
| `cancelled` | Customer cancelled | No |
| `inactive` | Expired/terminated | No |

---

## For Customer Support

### "When does my subscription renew?"
Look at `currentPeriodEnd` in subscription record.

### "I cancelled but still have access"
Correct - access continues until `currentPeriodEnd`. Explain this is normal.

### "My access was cut off"
1. Check subscription status
2. If `inactive` due to payment: Offer to help update payment method
3. If `cancelled`: Offer reactivation

### "I want to cancel"
1. Explain access continues until period end
2. Direct to Dashboard → Subscription → Cancel
3. Or process via `/admin/clients`

### "Can I get a refund?"
- No partial refunds for cancellation
- Full refund only for service issues (admin decision)
- See [Refund Process](./refund-process.md)

---

## For Internal Operations

### Manual Subscription Extension
Use case: Goodwill gesture, service outage compensation

1. Go to `/admin/clients`
2. Find customer
3. Edit subscription `currentPeriodEnd`
4. Document reason in notes

### Force Cancellation
Use case: Fraud, abuse, non-payment

1. Set subscription `status` to `inactive`
2. Revoke device access immediately
3. Document reason
4. Consider blocking future signups

### Check Subscription Health
```
GET /api/admin/subscriptions
```
Returns all subscriptions with status filters.

---

## Automated Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| Subscription check | Daily | Find expiring subscriptions |
| Dunning processor | Every 2 days | Retry failed payments |
| Access revocation | Daily | Revoke access after grace |
| Reminder emails | 7 days before | Renewal reminders |

### Cron Endpoint
`GET /api/cron/check-subscriptions`

---

## Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Churn rate | <5% | Monthly cancellations |
| Payment failure rate | <10% | Failed renewal attempts |
| Recovery rate | >60% | Past due → active |
| Dunning success | >40% | Recovered via retries |

---

## Related Documentation

- [Payment Flow](./payment-flow.md)
- [Pricing Reference](../reference/pricing.md)
- [Grace Period Feature](../features/subscription/grace-period.md)
- [Cancellation Feature](../features/subscription/cancellation.md)

---

*Lifecycle verified as of 2025-01-20*
