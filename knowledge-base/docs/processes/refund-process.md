---
id: process-refund
title: Refund Process
type: process
category: payment
audience: [customer-support, internal-ops, admin, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [refund, payment, paypal, dispute]
---

# Refund Process

## Summary
How refunds are evaluated, processed, and tracked at SPEAR.

## Quick Reference
```yaml
trigger: Customer request or service issue
owner: Admin/Ops team
duration: 1-3 business days to process, 5-10 days to appear
automation: partial (PayPal API for processing)
payment_provider: PayPal
```

---

## Refund Policy Overview

### 7-Day Refund Window (Auto-Approve)

**Within 7 days of delivery**: Refunds are automatically approved.
- No questions asked
- AI agent or ops can process immediately
- Full refund of subscription amount

### When Refunds Are Approved (After 7 Days - Requires Admin)

| Situation | Refund | Notes |
|-----------|--------|-------|
| Service outage (extended) | Full or partial | Based on duration |
| Technical issue prevented use | Full or partial | Must be verified |
| Double/duplicate charge | Full | Always approved |
| Unauthorized charge | Full | With verification |
| Device never delivered | Full | Verify with shipping |

**IMPORTANT**: All refund requests after 7 days require admin (Cash) approval.

### When Refunds Are NOT Approved

| Situation | Reason |
|-----------|--------|
| Cancellation mid-period | Access continues until period end |
| Change of mind (after 7 days) | Outside refund window |
| Didn't use the service | Service was available |
| Price objection after purchase | Agreed to price at checkout |

---

## Process Flow

```
Request Received
      ↓
Verify Customer Identity
      ↓
Review Request Reason
      ↓
Check Eligibility
      ↓
  Eligible?
    ↓ Yes         ↓ No
Calculate Amount    Explain Policy
    ↓               ↓
Process via PayPal  Offer Alternatives
    ↓
Update Records
    ↓
Notify Customer
```

---

## Step-by-Step Process

### Step 1: Receive Request

**Sources**:
- Support ticket
- Email
- Chat/phone
- PayPal dispute (escalated)

**Information Needed**:
- Customer email
- Order/transaction ID (if known)
- Reason for request
- Preferred resolution

### Step 2: Verify Identity

**Before discussing account**:
1. Confirm email matches account
2. Verify order exists
3. Check customer owns the account

**Never**:
- Process refund without verification
- Discuss account details with non-owner

### Step 3: Review Reason

**Ask clarifying questions**:
- When did the issue occur?
- What was the impact?
- Have they tried troubleshooting?

**Check system**:
- Service status during reported period
- Customer's usage history
- Previous refund requests

### Step 4: Check Eligibility

**Approved if**:
- Documented service outage
- Technical issue verified
- Duplicate charge confirmed
- Within reasonable timeframe

**Denied if**:
- Service was available and used
- Simple cancellation request
- Outside refund window (90 days)
- Previous abuse of refund policy

### Step 5: Calculate Refund Amount

**Full Refund**:
- Service completely unusable
- Duplicate charge
- Device never received

**Partial Refund**:
- Service partially affected
- Pro-rated for outage duration

**Calculation for Partial**:
```
Daily rate = Monthly amount / 30
Refund = Daily rate × Days affected
```

### Step 6: Process Refund

**Via Admin Dashboard**:
1. Go to `/admin/orders`
2. Find the order
3. Click "Refund"
4. Enter amount and reason
5. Confirm

**API Call**:
```
POST /api/admin/orders/{orderId}/refund
{
  "amount": 33.00,
  "reason": "service_issue"
}
```

**PayPal Processing**:
- Refund submitted to PayPal
- Can take 5-10 business days to appear
- Customer notified by PayPal

### Step 7: Update Records

**Automatic**:
- Order `paymentStatus` → "refunded"
- `Refund` record created
- Audit log entry

**Manual if needed**:
- Update subscription status
- Add notes to customer account
- Update device access if applicable

### Step 8: Notify Customer

**Confirmation includes**:
- Refund amount
- Expected timeline (5-10 days)
- Impact on subscription (if any)
- Contact info for questions

---

## Refund Amounts

### Full Refund Scenarios

| Scenario | Action |
|----------|--------|
| Duplicate charge | Refund second charge |
| Device not delivered | Full amount |
| Extended outage (>3 days) | Full current period |
| Fraud/unauthorized | Full amount |

### Partial Refund Calculation

**Example**: Customer on $100/month, service down 3 days

```
Daily rate: $100 / 30 = $3.33
Refund: $3.33 × 3 = $10.00
```

**Goodwill additions**:
- May add extra days as gesture
- Round up to next dollar

---

## Impact on Subscription

### Refund WITHOUT Cancellation
- Subscription remains active
- No change to access
- Next billing continues normally

### Refund WITH Cancellation
- Subscription cancelled
- Access revoked (immediate or period end)
- No future billing

### Partial Refund
- Subscription typically continues
- May extend period by refunded days

---

## Admin Actions

### Process Refund in Dashboard

1. Navigate to `/admin/orders`
2. Search for customer or order ID
3. Click on the order
4. Click "Refund" button
5. Enter:
   - Amount (full or partial)
   - Reason (dropdown)
   - Notes (internal)
6. Confirm with "Process Refund"
7. System calls PayPal API
8. Confirmation displayed

### Refund Reasons (Admin)

| Code | Label | Use When |
|------|-------|----------|
| customer_request | Customer Request | General request |
| service_issue | Service Issue | Outage/technical |
| duplicate_charge | Duplicate Charge | Double billing |
| fraud | Fraud | Unauthorized |
| other | Other | Document in notes |

### View Refund History

1. `/admin/orders` → Filter by "refunded"
2. Or customer detail → Orders → See refunded
3. Each refund shows:
   - Amount
   - Date
   - Reason
   - Admin who processed

---

## Customer Communication

### Approving Refund

> "I've processed a refund of $[amount] for you. This will appear back on your PayPal account within 5-10 business days. Your subscription [will continue / has been cancelled] as discussed. Is there anything else I can help with?"

### Denying Refund

> "I understand you'd like a refund. However, since [reason - e.g., the service was available during this period], I'm not able to process a refund according to our policy. What I can offer is [alternative - e.g., extend your subscription by X days / credit toward future month]. Would that help?"

### Partial Refund Explanation

> "Based on the [X days] of service disruption you experienced, I've processed a partial refund of $[amount]. This should appear in your account within 5-10 business days."

---

## Special Cases

### PayPal Dispute Filed

If customer filed PayPal dispute:
1. Review in `/admin/disputes`
2. If legitimate, process refund proactively
3. If not legitimate, prepare evidence
4. Respond to PayPal within deadline

### Subscription Auto-Cancelled After Refund

If customer requests refund on current period:
1. Clarify: Continue subscription or cancel?
2. If cancel: Process refund, cancel subscription
3. If continue: Process refund, extend period

### Multiple Refund Requests

If customer has history of refund requests:
1. Review previous requests
2. Look for patterns
3. May need to decline future requests
4. Consider account review

---

## Audit & Compliance

All refunds are logged:

```json
{
  "action": "PROCESS_REFUND",
  "adminId": "admin_user_id",
  "orderId": "order_id",
  "amount": 100.00,
  "reason": "service_issue",
  "notes": "Extended outage on Jan 15-18",
  "timestamp": "2025-01-20T12:00:00Z"
}
```

**Retention**: 7 years (financial records)

---

## Metrics

Track refund-related metrics:
| Metric | Target | Purpose |
|--------|--------|---------|
| Refund rate | <2% | Monitor service quality |
| Refund resolution time | <24h | Customer satisfaction |
| Dispute escalation rate | <0.5% | Avoid PayPal issues |

---

## Related Documentation

- [Payment Flow](./payment-flow.md)
- [Dispute Handling](./dispute-handling.md)
- [Subscription Lifecycle](./subscription-lifecycle.md)
- [Admin Orders API](../api/admin/orders.md)
