---
id: payment-flow
title: Payment Flow Process
type: process
category: payment
audience: [customer-support, internal-ops, admin, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [payment, paypal, checkout, subscription]
---

# Payment Flow Process

## Summary
End-to-end process from customer checkout to subscription activation.

## Quick Reference
```yaml
trigger: Customer clicks "Subscribe" or "Checkout"
owner: System (automated)
duration: 1-5 minutes
automation: full
payment_provider: PayPal
```

---

## Process Overview

```
Customer → Select Plan → Apply Coupon → PayPal Checkout →
Payment Capture → Order Created → Subscription Active → Device Access
```

---

## Detailed Flow

### Step 1: Plan Selection

**Location**: `/pricing` or `/checkout`

**Customer Actions**:
- Selects subscription plan
- Optionally enters coupon code
- Clicks "Subscribe" or "Get Started"

**System Actions**:
- Validates plan selection
- If coupon entered, calls `/api/coupons/validate`
- Calculates final price
- Displays payment button

**Data Created**:
- None yet (client-side only)

---

### Step 2: PayPal Checkout Initiation

**Trigger**: Customer clicks PayPal button

**API Call**: `POST /api/paypal/create-payment`

**Request Payload**:
```json
{
  "planType": "founder_byod" | "founder_device" | "standard",
  "couponCode": "SPEARMINT" | null,
  "email": "customer@example.com"
}
```

**System Actions**:
1. Validates plan and coupon
2. Calculates final amount
3. Creates PayPal order via PayPal API
4. Returns PayPal order ID to client

**Response**:
```json
{
  "success": true,
  "orderId": "PAYPAL_ORDER_ID"
}
```

**Customer Experience**:
- PayPal popup/redirect appears
- Customer logs into PayPal
- Customer reviews and approves payment

---

### Step 3: Payment Approval

**Location**: PayPal interface

**Customer Actions**:
- Reviews order details in PayPal
- Clicks "Pay Now" or equivalent
- Returns to SPEAR site

**System Actions**:
- PayPal notifies client of approval
- Client calls capture endpoint

---

### Step 4: Payment Capture

**Trigger**: PayPal approval callback

**API Call**: `POST /api/paypal/capture-payment`

**Request Payload**:
```json
{
  "orderId": "PAYPAL_ORDER_ID",
  "planType": "founder_byod",
  "couponCode": "SPEARMINT"
}
```

**System Actions**:
1. Calls PayPal capture API
2. Verifies payment successful
3. Creates/updates User record
4. Creates Subscription record
5. Creates Order record
6. Sends confirmation email

**Database Records Created**:

**User** (if new):
```json
{
  "email": "customer@example.com",
  "role": "CLIENT",
  "subscriptionStatus": "active"
}
```

**Subscription**:
```json
{
  "userId": "user_id",
  "status": "active",
  "planType": "founder_byod",
  "paypalOrderId": "PAYPAL_ORDER_ID",
  "currentPeriodStart": "2025-01-20",
  "currentPeriodEnd": "2025-02-20"
}
```

**Order**:
```json
{
  "userId": "user_id",
  "subscriptionPlanType": "founder_byod",
  "amount": 100.00,
  "paymentStatus": "completed",
  "paypalCaptureId": "CAPTURE_ID",
  "status": "device_prep"
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "internal_order_id",
  "subscriptionId": "subscription_id"
}
```

---

### Step 5: Post-Payment Processing

**Trigger**: Successful capture

**System Actions**:
1. Redirects customer to `/checkout/success`
2. Sends confirmation email
3. Notifies admin of new order
4. Initiates device fulfillment (if applicable)

**Customer Experience**:
- Sees success page with order confirmation
- Receives email confirmation
- Can access `/dashboard`

---

### Step 6: Webhook Confirmation

**Trigger**: PayPal webhook event

**API Call**: `POST /api/paypal/webhook`

**Purpose**:
- Backup confirmation of payment
- Handles edge cases where client doesn't complete
- Updates order if needed

**Events Handled**:
- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.DENIED`
- `PAYMENT.CAPTURE.REFUNDED`

---

## Decision Points

| Condition | Action |
|-----------|--------|
| Coupon invalid | Show error, don't proceed |
| PayPal timeout | Show retry option |
| Payment declined | Show declined message, suggest retry |
| User already exists | Link to existing account |
| Duplicate payment | Detect and prevent, show existing order |

---

## Failure Handling

| Failure Point | Detection | Recovery |
|---------------|-----------|----------|
| PayPal API down | API error response | Show "try again later" |
| Capture fails | Capture returns error | Retry or manual review |
| Database write fails | Transaction rollback | Retry capture |
| Email fails | Async, logged | Admin notification |
| Webhook missed | Cron job reconciliation | Manual verification |

---

## Monitoring

### Key Metrics
- Payment success rate
- Average checkout time
- Coupon usage rate
- Failure rate by step

### Alerts
- Multiple failed payments from same user
- Unusual failure rate increase
- PayPal API errors

---

## For Customer Support

### "My payment went through but I don't have access"

1. Check `/admin/orders` for the customer's email
2. Verify `paymentStatus` is `completed`
3. Check `Subscription` status is `active`
4. If order exists but subscription isn't active, escalate to ops

### "I was charged twice"

1. Check `/admin/orders` for duplicate orders
2. Verify PayPal transaction IDs are different
3. If duplicate, process refund for second charge
4. Prevent at source: check `WebhookEvent` idempotency

### "My coupon didn't apply"

1. Verify coupon was entered before PayPal button clicked
2. Check order amount vs expected discounted amount
3. If coupon should have applied, consider partial refund

---

## Related Documentation

- [PayPal Create Payment API](../api/payment/create-payment.md)
- [PayPal Capture Payment API](../api/payment/capture-payment.md)
- [Subscription Lifecycle](./subscription-lifecycle.md)
- [Pricing Reference](../reference/pricing.md)

---

## Technical Details

### PayPal Configuration
- Environment: Production
- API Version: v2
- Credentials: In environment variables

### Database Transactions
- Capture creates User, Subscription, Order atomically
- Rollback on any failure

### Idempotency
- `WebhookEvent` table tracks processed events
- Prevents duplicate processing

---

*Process verified as of 2025-01-20*
