---
id: feature-subscription-management
title: Subscription Management
type: feature
category: subscription
audience: [customer-support, internal-ops, sales, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [subscription, billing, plans, cancellation, renewal]
---

# Subscription Management

## Summary
How customers view and manage their SPEAR subscriptions, including plan details, billing, and cancellation.

## Quick Reference
```yaml
what: View and manage subscription
who: Clients with subscriptions
where: /dashboard/subscription
when: Anytime
why: Control billing, view status, manage plan
billing: Monthly, auto-renewal
payment: PayPal
```

---

## Overview

Every SPEAR customer has a subscription that controls:
- Access to remote devices
- Billing cycle and amount
- Plan features

Customers can view their subscription status and request changes through the dashboard.

---

## Subscription Status

### Status Types

| Status | Meaning | Device Access |
|--------|---------|---------------|
| **Active** | Paid and current | Full access |
| **Past Due** | Payment failed, in grace period | Access maintained (7 days) |
| **Cancelled** | User requested cancellation | Access until period end |
| **Inactive** | Expired or terminated | No access |

### Viewing Status

**Location**: Dashboard → Subscription

**Shows**:
- Current plan name
- Monthly amount
- Next billing date
- Payment method (PayPal)
- Status indicator

---

## Actions

### Action: View Subscription Details

**Description**: See full subscription information

**Trigger**:
- UI: Dashboard → Subscription

**Information Displayed**:
| Field | Description |
|-------|-------------|
| Plan | Current plan type (Founder's BYOD, etc.) |
| Status | Active, Past Due, Cancelled, Inactive |
| Amount | Monthly charge |
| Next Billing | Date of next charge |
| Member Since | Original signup date |
| Devices | Number of devices included |

### Action: View Billing History

**Description**: See past payments and invoices

**Trigger**:
- UI: Dashboard → Subscription → Billing History

**Shows**:
- Date of each payment
- Amount charged
- Payment status
- Invoice download link

### Action: Cancel Subscription

**Description**: Request subscription cancellation

**Trigger**:
- UI: Dashboard → Subscription → Cancel Subscription

**Process**:
1. Click "Cancel Subscription"
2. Confirm cancellation
3. Subscription marked for cancellation
4. Access continues until `currentPeriodEnd`
5. No further billing

**Important Notes**:
- No immediate access loss
- Access until billing period ends
- No partial refunds
- Can reactivate later

### Action: Reactivate Subscription

**Description**: Resume a cancelled subscription

**Trigger**:
- UI: Dashboard → Subscription → Reactivate (if cancelled)
- Contact support

**Process**:
1. Click "Reactivate" or contact support
2. Payment processed for new period
3. Subscription status → Active
4. Device access restored (if was lost)

### Action: Update Payment Method

**Description**: Change PayPal account for billing

**Trigger**:
- UI: Dashboard → Subscription → Update Payment

**Process**:
1. Click "Update Payment Method"
2. Redirected to PayPal
3. Authorize new payment method
4. Next billing uses new method

---

## Billing Cycle

### How Billing Works

1. **Signup**: First payment on signup day
2. **Renewal**: Same day each month
3. **Charge Attempt**: On billing date
4. **Success**: Access continues
5. **Failure**: Grace period starts

### Example Timeline

```
Jan 15: Signup, pay $100
Feb 15: Auto-charge $100
Mar 15: Auto-charge $100
...
```

### Grace Period

If payment fails:
- Day 1: Payment failed email, retry
- Day 3: Second retry
- Day 5: Urgent reminder
- Day 7: Access revoked if still unpaid

During grace period:
- Device access maintained
- Can update payment method
- Retry payment anytime

---

## Plan Types

### Founder's BYOD
- **Price**: $100/month
- **Devices**: Bring your own
- **Special**: Locked-in founder pricing

### Founder's Device
- **Price**: $200 first month, then $100/month
- **Devices**: 1 device included
- **Special**: Device provided, founder pricing

### Standard
- **Price**: $299/month (or $199 with SPEARMINT)
- **Devices**: 1 device included
- **Special**: Full price plan

### Comparing Plans

| Feature | Founder's BYOD | Founder's Device | Standard |
|---------|---------------|------------------|----------|
| Monthly Cost | $100 | $100 | $299 |
| First Month | $100 | $200 | $299 |
| Device Included | No | Yes | Yes |
| Price Lock | Yes | Yes | No |

---

## Common Questions

### "When will I be charged next?"

Look at "Next Billing Date" in subscription details. This is when the next automatic charge will occur.

### "Can I cancel anytime?"

Yes. No contracts, no cancellation fees. Access continues until your paid period ends.

### "Do I get a refund if I cancel?"

No partial refunds for early cancellation. You keep access until your current period ends.

### "Can I change my plan?"

Contact support to discuss plan changes. Changes typically take effect at next billing cycle.

### "What happens if my payment fails?"

You have 7 days to update your payment method. Access continues during this grace period.

### "How do I update my card?"

Click "Update Payment Method" in subscription settings. You'll be redirected to PayPal to authorize a new payment source.

---

## For Customer Support

### "I want to cancel"

1. Explain access continues until period end
2. Confirm no partial refunds
3. Guide to Dashboard → Subscription → Cancel
4. Or process via admin if requested

**Script**:
> "I can help you cancel. Just so you know, you'll keep access until [date]. After that, you won't be charged again. Would you like to proceed?"

### "My subscription shows Past Due"

1. Check when payment failed
2. Explain grace period (7 days)
3. Guide to update payment method
4. Offer to extend grace if needed (admin)

**Script**:
> "It looks like your recent payment didn't go through. You still have access for now, and you can update your payment method to avoid any interruption."

### "I was charged but show inactive"

1. Verify payment in PayPal/admin
2. Check order created properly
3. If payment exists but no subscription, escalate
4. May need manual activation

### "I want to change my plan"

1. Explain current plan options
2. Note any pricing changes
3. Process change for next billing cycle
4. Document in admin notes

---

## Admin Actions

### Extend Subscription

When to use: Goodwill gesture, service issues

1. Go to /admin/clients
2. Find customer
3. Click "Extend"
4. Enter days and reason
5. Save (audited)

### Cancel Immediately

When to use: Fraud, abuse, customer request

1. Go to /admin/clients
2. Find customer
3. Click "Cancel"
4. Choose "Immediate" if needed
5. Save (audited)

### Manual Activation

When to use: Payment sync issues

1. Verify PayPal payment received
2. Create/update subscription record
3. Set correct period dates
4. Notify customer

---

## Related Documentation

- [Subscription Lifecycle](../../processes/subscription-lifecycle.md)
- [Pricing Reference](../../reference/pricing.md)
- [Payment Flow](../../processes/payment-flow.md)
- [Grace Period](./grace-period.md)
- [Cancellation](./cancellation.md)
