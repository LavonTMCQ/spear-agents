# SPEAR Payment Issues Troubleshooting Guide

## Overview

This guide covers common payment-related issues in SPEAR and their solutions. Always test fixes with the admin test payment system before deploying to production.

## Critical Payment Configuration

### ⚠️ VERIFY THESE FIRST

```bash
# PayPal Production Credentials (DO NOT CHANGE)
PAYPAL_CLIENT_ID=AXclM4bywjg_OwYBbpzek6HcjEo53xu9g7XmDSCDJ9ACnytqsPjAhAOgQmRz-DG7rj1M1cZjzibzlcqC
PAYPAL_CLIENT_SECRET=REPLACE_WITH_PAYPAL_CLIENT_SECRET
PAYPAL_ENVIRONMENT=production
```

```typescript
// Correct Pricing Structure (DO NOT MODIFY)
const CORRECT_PRICING = {
  singleUser: {
    regular: 29900,    // $299.00
    withSPEARMINT: 19900  // $199.00 (after $100 discount)
  },
  twoUser: {
    regular: 59800,    // $598.00
    grandfathered: 29800  // $298.00 (early customers)
  }
};
```

## Common Payment Issues

### 1. Wrong Payment Amount Displayed

**Symptoms**:
- PayPal shows incorrect amount (e.g., $99 instead of $199)
- Checkout page shows wrong pricing
- Coupon discount not applied correctly

**Root Causes**:
- Pricing mismatch between frontend and backend
- Incorrect coupon calculation
- Grandfathered pricing logic error

**Solution Steps**:

1. **Check Frontend Pricing** (`src/app/checkout/page.tsx`):
```typescript
// Verify these values are correct
const plans = {
  "single-user": {
    monthlyPrice: 299,  // Must be 299, not 199
  },
  "two-user": {
    monthlyPrice: 598,  // Must be 598, not 298
  }
};
```

2. **Check PayPal Service** (`src/lib/payment/providers/paypal-service.ts`):
```typescript
// Verify amount calculation
if (request.planId === 'single-user') {
  finalAmount = { amount: 29900, currency: 'USD' }; // $299.00
} else if (request.planId === 'two-user') {
  finalAmount = { amount: 29800, currency: 'USD' }; // $298.00 grandfathered
}
```

3. **Check Coupon Logic**:
```typescript
// SPEARMINT should give $100 discount
const discountedAmount = (coupon.toUpperCase() === 'SPEARMINT' && planId === 'single-user')
  ? Math.max(priceInCents - 10000, 0) // $100 discount
  : priceInCents;
```

**Testing**:
```bash
# Test with admin test payment system
curl -X POST https://spear-global.com/api/test-payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 19900, "testType": "payment", "description": "Pricing test"}'
```

### 2. PayPal Payment Creation Fails

**Symptoms**:
- "Payment creation failed" error
- PayPal API returns 400/401 errors
- No approval URL returned

**Root Causes**:
- Invalid PayPal credentials
- Incorrect API endpoint
- Malformed payment request

**Diagnostic Steps**:

1. **Check PayPal Credentials**:
```bash
# Verify environment variables are set
echo $PAYPAL_CLIENT_ID
echo $PAYPAL_ENVIRONMENT
# Should be "production", not "sandbox"
```

2. **Check PayPal API Response**:
```typescript
// Add logging to PayPal service
console.log('PayPal request:', {
  amount: finalAmount,
  currency: 'USD',
  environment: process.env.PAYPAL_ENVIRONMENT
});

console.log('PayPal response:', paypalResponse);
```

3. **Test PayPal Connection**:
```bash
# Test PayPal API access
curl -X POST https://api.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

**Solutions**:
- Verify PayPal credentials in Vercel environment
- Check PayPal account status
- Ensure production environment is configured

### 3. Webhook Not Received

**Symptoms**:
- Payment completed but order status not updated
- User stuck on "processing payment" page
- No webhook events in logs

**Root Causes**:
- Webhook URL not configured in PayPal
- Webhook signature verification failing
- Webhook endpoint not accessible

**Diagnostic Steps**:

1. **Check Webhook Configuration**:
```bash
# Webhook URL should be:
https://spear-global.com/api/paypal/webhook
```

2. **Check Webhook Logs**:
```typescript
// Add logging to webhook handler
console.log('Webhook received:', {
  event_type: body.event_type,
  resource_id: body.resource?.id,
  timestamp: new Date().toISOString()
});
```

3. **Test Webhook Endpoint**:
```bash
# Test webhook endpoint accessibility
curl -X POST https://spear-global.com/api/paypal/webhook \
  -H "Content-Type: application/json" \
  -d '{"event_type": "test"}'
```

**Solutions**:
- Configure webhook URL in PayPal dashboard
- Verify webhook signature verification
- Check Vercel function logs

### 4. Mobile Input Visibility Issues

**Symptoms**:
- White text on light background
- Input fields appear empty
- Users can't see what they're typing

**Root Cause**:
- Missing text color classes in input styling

**Solution**:
```typescript
// Add explicit text color to all inputs
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
```

**Files to Check**:
- `src/components/payment/PayPalPaymentForm.tsx`
- `src/app/checkout/page.tsx`

### 5. Subscription Status Not Updating

**Symptoms**:
- Payment completed but subscription shows as pending
- Device access not granted after payment
- Admin dashboard shows incorrect status

**Root Causes**:
- Database update failure
- Webhook processing error
- Order status logic error

**Diagnostic Steps**:

1. **Check Database**:
```sql
-- Check order status
SELECT * FROM "Order" WHERE paymentId = 'PAYPAL_ORDER_ID';

-- Check recent orders
SELECT * FROM "Order" ORDER BY createdAt DESC LIMIT 10;
```

2. **Check Webhook Processing**:
```typescript
// Verify webhook updates database
console.log('Updating order:', {
  orderId: order.id,
  newStatus: 'active',
  paymentId: paymentId
});
```

**Solutions**:
- Verify database connection
- Check webhook event handling
- Test order status updates

## Testing Procedures

### 1. Test Payment Flow

```typescript
// Admin test payment procedure
1. Login as admin (quiseforeverphilly@gmail.com)
2. Go to /admin/clients
3. Click "Test Payments" tab
4. Create test payment:
   - Amount: 100 ($1.00)
   - Type: payment
   - Description: "Integration test"
5. Complete PayPal payment
6. Verify webhook processing
7. Check order creation in database
```

### 2. Test Pricing Logic

```typescript
// Test each pricing scenario
const testCases = [
  { plan: 'single-user', coupon: null, expected: 29900 },
  { plan: 'single-user', coupon: 'SPEARMINT', expected: 19900 },
  { plan: 'two-user', coupon: null, expected: 29800 }, // Grandfathered
];

testCases.forEach(test => {
  // Verify pricing calculation
  const result = calculatePrice(test.plan, test.coupon);
  assert(result === test.expected, `Pricing test failed for ${test.plan}`);
});
```

### 3. Test Mobile Interface

```bash
# Test mobile input visibility
1. Open checkout page on mobile device
2. Enter billing information
3. Verify all text is visible
4. Check input field contrast
5. Test on different mobile browsers
```

## Emergency Procedures

### 1. Payment System Down

**Immediate Actions**:
1. Check PayPal service status
2. Verify environment variables
3. Check Vercel deployment status
4. Review recent code changes

**Communication**:
- Notify customers of payment issues
- Provide alternative contact method
- Update status page if available

### 2. Incorrect Charges

**Investigation Steps**:
1. Check order records in database
2. Review PayPal transaction details
3. Verify pricing logic
4. Check for duplicate payments

**Resolution**:
1. Issue refund through PayPal
2. Update order status
3. Notify customer
4. Fix underlying issue

### 3. Webhook Failures

**Immediate Actions**:
1. Check webhook endpoint logs
2. Verify PayPal webhook configuration
3. Manually process pending orders
4. Fix webhook processing

**Recovery**:
1. Replay missed webhook events
2. Update order statuses manually
3. Verify customer access

## Prevention Strategies

### 1. Monitoring

```typescript
// Add comprehensive logging
const paymentLogger = {
  logPaymentAttempt: (userId, amount, plan) => {
    console.log('Payment attempt:', { userId, amount, plan, timestamp: new Date() });
  },
  logPaymentSuccess: (orderId, paymentId) => {
    console.log('Payment success:', { orderId, paymentId, timestamp: new Date() });
  },
  logPaymentFailure: (error, context) => {
    console.error('Payment failure:', { error, context, timestamp: new Date() });
  }
};
```

### 2. Automated Testing

```typescript
// Implement payment flow tests
describe('Payment System', () => {
  test('Single user pricing with SPEARMINT', () => {
    const price = calculatePrice('single-user', 'SPEARMINT');
    expect(price).toBe(19900);
  });
  
  test('Two user grandfathered pricing', () => {
    const price = calculatePrice('two-user', null);
    expect(price).toBe(29800);
  });
});
```

### 3. Health Checks

```typescript
// Regular payment system health checks
const healthCheck = async () => {
  try {
    // Test PayPal API connection
    const token = await getPayPalAccessToken();
    
    // Test database connection
    const orderCount = await prisma.order.count();
    
    // Test webhook endpoint
    const webhookTest = await fetch('/api/paypal/webhook', { method: 'POST' });
    
    return { status: 'healthy', checks: { paypal: true, database: true, webhook: true } };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};
```

---

**CRITICAL REMINDER**: Always test payment changes with the admin test payment system before deploying to production. Payment issues directly affect revenue.
