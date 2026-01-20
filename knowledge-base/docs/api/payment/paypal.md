---
id: api-payment-paypal
title: PayPal Payment APIs
type: api
category: payment
audience: [internal-ops, developer, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [payment, paypal, checkout, capture, webhook]
---

# PayPal Payment APIs

## Summary
APIs for processing payments through PayPal including order creation, payment capture, and webhook handling.

## Quick Reference
```yaml
provider: PayPal
environment: Production
api_version: v2
currency: USD
webhook_events: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED
```

---

## POST /api/paypal/create-payment

### Summary
Initialize a PayPal payment order for checkout.

### Endpoint Details
**URL**: `POST /api/paypal/create-payment`

**Authentication**: Optional (can be guest checkout)

### Request
```json
{
  "planType": "founder_byod",
  "couponCode": "SPEARMINT",
  "email": "customer@example.com",
  "name": "John Doe"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| planType | string | Yes | `founder_byod`, `founder_device`, `standard` |
| couponCode | string | No | Discount code |
| email | string | Yes | Customer email |
| name | string | No | Customer name |

### Response

**Success (200)**:
```json
{
  "success": true,
  "orderId": "PAYPAL_ORDER_ID_XXX",
  "amount": 100.00,
  "currency": "USD"
}
```

**Errors**:
| Status | Code | Message |
|--------|------|---------|
| 400 | INVALID_PLAN | Plan type not recognized |
| 400 | INVALID_COUPON | Coupon code invalid or expired |
| 500 | PAYPAL_ERROR | PayPal API error |

### Processing Logic
1. Validate plan type
2. Validate coupon (if provided)
3. Calculate final amount
4. Call PayPal Orders API to create order
5. Return PayPal order ID to client

### Amount Calculation
```
Base Amount = Plan price
- Coupon Discount (if valid)
= Final Amount
```

### PayPal API Call
```javascript
// Internal PayPal SDK call
const order = await paypal.orders.create({
  intent: "CAPTURE",
  purchase_units: [{
    amount: {
      currency_code: "USD",
      value: finalAmount
    },
    description: `SPEAR ${planType} Subscription`
  }]
});
```

---

## POST /api/paypal/capture-payment

### Summary
Capture an approved PayPal payment and create subscription.

### Endpoint Details
**URL**: `POST /api/paypal/capture-payment`

**Authentication**: Optional

### Request
```json
{
  "orderId": "PAYPAL_ORDER_ID_XXX",
  "planType": "founder_byod",
  "couponCode": "SPEARMINT",
  "email": "customer@example.com",
  "name": "John Doe",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  }
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | string | Yes | PayPal order ID from create-payment |
| planType | string | Yes | Same as create-payment |
| couponCode | string | No | Same coupon if used |
| email | string | Yes | Customer email |
| name | string | No | Customer name |
| shippingAddress | object | No | For device-included plans |

### Response

**Success (200)**:
```json
{
  "success": true,
  "orderId": "internal_order_id",
  "subscriptionId": "subscription_id",
  "customerId": "user_id",
  "status": "completed",
  "amount": 100.00
}
```

**Errors**:
| Status | Code | Message |
|--------|------|---------|
| 400 | PAYMENT_NOT_APPROVED | User didn't approve payment |
| 400 | CAPTURE_FAILED | PayPal capture failed |
| 409 | DUPLICATE_ORDER | Order already processed |
| 500 | DATABASE_ERROR | Failed to create records |

### Processing Logic
1. Call PayPal capture API
2. Verify capture successful
3. Create or find User record
4. Create Subscription record
5. Create Order record
6. Send confirmation email
7. Return success with IDs

### Database Records Created

**User** (if new):
```json
{
  "id": "uuid",
  "email": "customer@example.com",
  "name": "John Doe",
  "role": "CLIENT",
  "subscriptionStatus": "active"
}
```

**Subscription**:
```json
{
  "id": "uuid",
  "userId": "user_id",
  "status": "active",
  "planType": "founder_byod",
  "paypalOrderId": "PAYPAL_ORDER_ID",
  "currentPeriodStart": "2025-01-20",
  "currentPeriodEnd": "2025-02-20",
  "amount": 100.00
}
```

**Order**:
```json
{
  "id": "uuid",
  "userId": "user_id",
  "subscriptionPlanType": "founder_byod",
  "amount": 100.00,
  "paymentStatus": "completed",
  "paypalCaptureId": "CAPTURE_ID",
  "status": "device_prep",
  "couponCode": "SPEARMINT"
}
```

### Idempotency
- Checks `WebhookEvent` table for duplicate processing
- Returns existing order if already processed

---

## POST /api/paypal/webhook

### Summary
Handle PayPal webhook events for payment lifecycle.

### Endpoint Details
**URL**: `POST /api/paypal/webhook`

**Authentication**: PayPal webhook signature verification

### Request Headers
```
paypal-auth-algo: SHA256withRSA
paypal-cert-url: https://api.paypal.com/v1/notifications/certs/xxx
paypal-transmission-id: xxx-xxx-xxx
paypal-transmission-sig: xxx
paypal-transmission-time: 2025-01-20T12:00:00Z
```

### Events Handled

**PAYMENT.CAPTURE.COMPLETED**
```json
{
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": {
    "id": "CAPTURE_ID",
    "status": "COMPLETED",
    "amount": {
      "currency_code": "USD",
      "value": "100.00"
    }
  }
}
```

**Actions**:
- Verify payment in database
- Update order status if needed
- Backup confirmation mechanism

**PAYMENT.CAPTURE.DENIED**
```json
{
  "event_type": "PAYMENT.CAPTURE.DENIED",
  "resource": {
    "id": "CAPTURE_ID",
    "status": "DENIED"
  }
}
```

**Actions**:
- Mark order as failed
- Update subscription status
- Send failure notification

**PAYMENT.CAPTURE.REFUNDED**
```json
{
  "event_type": "PAYMENT.CAPTURE.REFUNDED",
  "resource": {
    "id": "CAPTURE_ID",
    "status": "REFUNDED"
  }
}
```

**Actions**:
- Update order paymentStatus to "refunded"
- Create Refund record
- Update subscription if applicable

### Response

**Success (200)**:
```json
{
  "received": true
}
```

### Security
- Verifies PayPal signature
- Rejects invalid signatures
- Logs all webhook events
- Idempotent processing via `WebhookEvent` table

---

## POST /api/coupons/validate

### Summary
Validate a coupon code before checkout.

### Endpoint Details
**URL**: `POST /api/coupons/validate`

**Authentication**: None

### Request
```json
{
  "code": "SPEARMINT",
  "planType": "standard"
}
```

### Response

**Valid Coupon (200)**:
```json
{
  "valid": true,
  "code": "SPEARMINT",
  "discountAmount": 100.00,
  "discountType": "fixed",
  "finalPrice": 199.00,
  "originalPrice": 299.00
}
```

**Invalid Coupon (200)**:
```json
{
  "valid": false,
  "error": "Coupon expired or invalid"
}
```

### Validation Checks
1. Coupon exists in database
2. Coupon not expired
3. Coupon not max uses reached
4. Coupon applies to selected plan

---

## POST /api/test-payment

### Summary
Admin-only test payment endpoint for safe testing.

### Endpoint Details
**URL**: `POST /api/test-payment`

**Authentication**: Admin only

### Request
```json
{
  "amount": 1.00,
  "email": "test@example.com",
  "description": "Test payment"
}
```

**Constraints**:
- Amount: $0.01 - $10.00 only
- Admin role required

### Response
```json
{
  "success": true,
  "orderId": "test_order_id",
  "message": "Test payment processed"
}
```

### Purpose
- Test PayPal integration safely
- Verify webhook processing
- Debug payment issues

---

## Error Reference

| Code | HTTP Status | Description | Resolution |
|------|-------------|-------------|------------|
| INVALID_PLAN | 400 | Plan type not recognized | Check planType value |
| INVALID_COUPON | 400 | Coupon invalid/expired | Verify coupon code |
| PAYMENT_NOT_APPROVED | 400 | User cancelled PayPal | Ask user to retry |
| CAPTURE_FAILED | 400 | PayPal capture rejected | Check PayPal account |
| DUPLICATE_ORDER | 409 | Order already processed | Return existing order |
| PAYPAL_ERROR | 500 | PayPal API failure | Check PayPal status |
| DATABASE_ERROR | 500 | Database write failed | Retry or escalate |

---

## Integration Notes

### PayPal Configuration
```env
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx
PAYPAL_ENVIRONMENT=production
```

### Webhook Setup
1. Create webhook in PayPal Dashboard
2. Subscribe to events:
   - PAYMENT.CAPTURE.COMPLETED
   - PAYMENT.CAPTURE.DENIED
   - PAYMENT.CAPTURE.REFUNDED
3. Set URL: `https://www.spear-global.com/api/paypal/webhook`
4. Store webhook ID in environment

### Testing
- Use sandbox credentials for development
- Test payments limited to $0.01-$10.00
- Webhook can be tested via PayPal dashboard

---

## Related Documentation

- [Payment Flow Process](../../processes/payment-flow.md)
- [Pricing Reference](../../reference/pricing.md)
- [Failed Payment Troubleshooting](../../troubleshooting/payment/failed-payment.md)
- [Refund Process](../../processes/refund-process.md)
