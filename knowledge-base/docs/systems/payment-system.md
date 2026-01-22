# SPEAR Payment System Documentation

## Overview

The SPEAR payment system handles subscription billing through PayPal integration with a sophisticated pricing structure that includes promotional pricing and grandfathered rates for early customers.

## ⚠️ CRITICAL PRICING STRUCTURE

### DO NOT MODIFY WITHOUT UNDERSTANDING BUSINESS IMPACT

```typescript
// CORRECT PRICING (as of 2024-01-20)
const PRICING_STRUCTURE = {
  singleUser: {
    regularPrice: 29900,      // $299.00/month
    spearmintPrice: 19900,    // $199.00/month (with SPEARMINT coupon)
    discount: 10000           // $100.00 discount
  },
  twoUser: {
    regularPrice: 59800,      // $598.00/month
    grandfatheredPrice: 29800, // $298.00/month (early customers)
    discount: 30000           // $300.00 early customer discount
  }
};
```

### Pricing Logic Locations
- **Frontend Display**: `src/app/checkout/page.tsx` (lines 22-47)
- **PayPal Service**: `src/lib/payment/providers/paypal-service.ts` (lines 295-300)
- **Type Definitions**: `src/lib/payment/types.ts` (lines 167-194)
- **Coupon Logic**: `src/lib/payment/types.ts` (lines 197-207)

## Architecture

### Payment Factory Pattern

```typescript
// src/lib/payment/payment-factory.ts
export function getPaymentService(provider: 'paypal'): PaymentProvider {
  switch (provider) {
    case 'paypal':
      return new PayPalService();
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}
```

### PayPal Service Implementation

**Location**: `src/lib/payment/providers/paypal-service.ts`

**Key Methods**:
- `processPayment()` - Handle one-time payments
- `createSubscription()` - Create subscription (currently using one-time payments)
- `getPaymentStatus()` - Check payment status
- `cancelSubscription()` - Cancel subscription
- `validateCoupon()` - Validate coupon codes

## Payment Flow

### 1. Checkout Process

```
User Flow:
1. User selects plan on pricing page
2. User creates account (if not logged in)
3. User enters billing information
4. System calculates final amount (with coupons/grandfathered pricing)
5. PayPal payment order created
6. User redirected to PayPal for payment
7. User completes payment on PayPal
8. PayPal sends webhook to SPEAR
9. SPEAR updates order status in database
10. User redirected to success page
```

### 2. Webhook Processing

**Endpoint**: `/api/paypal/webhook`
**Location**: `src/app/api/paypal/webhook/route.ts`

**Supported Events**:
- `PAYMENT.CAPTURE.COMPLETED` - Payment successful
- `PAYMENT.CAPTURE.DENIED` - Payment failed
- `PAYMENT.CAPTURE.PENDING` - Payment pending

**Webhook Verification**:
```typescript
// Verify PayPal webhook signature
const isValid = await verifyPayPalWebhook(
  headers,
  body,
  process.env.PAYPAL_WEBHOOK_ID
);
```

## Coupon System

### SPEARMINT Coupon

**Code**: `SPEARMINT`
**Discount**: $100.00 (10000 cents)
**Applies To**: Single User Plan only
**Logic**: $299 → $199

```typescript
// src/lib/payment/types.ts
export const SPEAR_COUPONS: CouponCode[] = [
  {
    code: 'SPEARMINT',
    description: 'SPEAR Launch Discount - $100 off Single User Plan',
    discountType: 'fixed',
    discountValue: 10000, // $100.00 in cents
    validPlans: ['single-user'],
    isActive: true,
    expiresAt: null // No expiration
  }
];
```

### Grandfathered Pricing

**Two User Bundle**: Early customers get $298 instead of $598
**Implementation**: Special logic in checkout and PayPal service
**Business Rule**: All current customers are grandfathered at this rate

```typescript
// Special grandfathered pricing logic
if (planId === 'two-user') {
  priceInCents = 29800; // $298.00 grandfathered price
}
```

## Environment Configuration

### Production PayPal Credentials

```bash
# DO NOT CHANGE - PRODUCTION CREDENTIALS
PAYPAL_CLIENT_ID=AXclM4bywjg_OwYBbpzek6HcjEo53xu9g7XmDSCDJ9ACnytqsPjAhAOgQmRz-DG7rj1M1cZjzibzlcqC
PAYPAL_CLIENT_SECRET=REPLACE_WITH_PAYPAL_CLIENT_SECRET
PAYPAL_ENVIRONMENT=production
```

### Webhook Configuration

**Webhook URL**: `https://spear-global.com/api/paypal/webhook`
**Events**: Payment capture events
**Verification**: Signature-based verification required

## Database Integration

### Order Table Schema

```sql
-- Key fields for payment tracking
CREATE TABLE "Order" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  amount INTEGER NOT NULL,        -- Amount in cents
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,           -- Order status
  paymentId TEXT,                 -- PayPal payment ID
  subscriptionPlan TEXT NOT NULL, -- Plan identifier
  notes TEXT,                     -- JSON metadata
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Payment Status Tracking

**Order Statuses**:
- `pending` - Order created, payment not completed
- `device_prep` - Payment completed, preparing device
- `shipped` - Device shipped to customer
- `active` - Subscription active
- `cancelled` - Subscription cancelled
- `test_payment` - Test payment (admin only)

## Admin Payment Management

### Subscription Monitor

**Location**: `/admin/clients`
**Component**: `src/app/admin/clients/page.tsx`

**Features**:
- Real-time subscription status monitoring
- Payment status checking
- Device access control
- Subscription cancellation/reactivation
- Test payment system

### Test Payment System

**Endpoint**: `/api/test-payment`
**Purpose**: Admin testing of PayPal integration
**Limits**: $0.01 - $10.00 test amounts
**Access**: Admin only (quiseforeverphilly@gmail.com)

```typescript
// Test payment creation
const testPayment = await fetch('/api/test-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 100,        // $1.00 in cents
    testType: 'payment',
    description: 'Test Payment'
  })
});
```

## Error Handling

### Payment Failures

**Common Issues**:
1. **Insufficient Funds**: PayPal returns `INSUFFICIENT_FUNDS`
2. **Invalid Payment Method**: PayPal returns `INVALID_PAYMENT_METHOD`
3. **Webhook Failures**: Retry mechanism with exponential backoff

**Error Logging**:
```typescript
console.error('Payment processing error:', {
  orderId,
  error: error.message,
  paypalResponse,
  timestamp: new Date().toISOString()
});
```

### Webhook Reliability

**Retry Logic**: PayPal automatically retries failed webhooks
**Idempotency**: Handle duplicate webhook events
**Verification**: Always verify webhook signatures

## Security Considerations

### 1. Payment Data Protection
- Never store credit card information
- Use PayPal's secure payment processing
- Encrypt sensitive configuration data

### 2. Webhook Security
- Verify all webhook signatures
- Use HTTPS-only endpoints
- Validate webhook event data

### 3. Admin Access Control
- Restrict payment management to admin users
- Log all payment-related admin actions
- Secure test payment system access

## Troubleshooting

### Common Payment Issues

1. **Wrong Payment Amount**
   - Check pricing logic in checkout page
   - Verify PayPal service amount calculation
   - Ensure coupon logic is correct

2. **Webhook Not Received**
   - Check PayPal webhook configuration
   - Verify webhook URL is accessible
   - Check webhook signature verification

3. **Payment Status Not Updated**
   - Check database connection
   - Verify webhook processing logic
   - Check order status update queries

### Testing Procedures

1. **Test Payment Flow**
   - Use admin test payment system
   - Test with small amounts ($1.00)
   - Verify webhook processing

2. **Coupon Testing**
   - Test SPEARMINT coupon application
   - Verify discount calculation
   - Check grandfathered pricing

3. **Admin Functions**
   - Test subscription monitoring
   - Verify payment status checking
   - Test subscription cancellation

## Legacy PayPal Integration Guide

*Note: This section contains historical PayPal integration information that has been superseded by the current production system documented above.*

### Historical PayPal Setup (Reference Only)

The SPEAR application previously used a modular payment system architecture that supported multiple payment processors. This section is preserved for reference but should not be used for current development.

**Previous Features:**
- Modular architecture for switching between payment providers
- PayPal integration with sandbox testing
- SPEARMINT coupon functionality
- Webhook support for real-time notifications
- Fulfillment integration for device shipping

**Previous Environment Variables (Sandbox):**
```bash
# Historical sandbox configuration (DO NOT USE)
PAYPAL_CLIENT_ID=ASAERpwrSldApjLkNAahSYX2AyE-xBRemRBFJMDDUVWe6nAWeQVAkV8b_Km_lm55oTRP2tuadjOMm1Jq
PAYPAL_ENVIRONMENT=sandbox
```

**Migration Notes:**
- Square integration was completely removed
- PayPal became the primary provider
- Architecture supported adding Stripe, Square, or other providers
- Existing fulfillment workflow remained unchanged

---

**CRITICAL REMINDER**: Any changes to payment logic must be thoroughly tested with the admin test payment system before deployment to production.
