# SPEAR Admin API Endpoints Documentation

## Overview

Admin API endpoints provide comprehensive subscription management and system monitoring capabilities. All endpoints require admin authentication (`quiseforeverphilly@gmail.com`).

## Authentication

### Admin Access Control

```typescript
// Standard admin check used in all admin endpoints
const session = await auth();
if (!session || !session.user || session.user.email !== "quiseforeverphilly@gmail.com") {
  return NextResponse.json(
    { error: "Unauthorized - Admin access required" },
    { status: 401 }
  );
}
```

**Admin Email**: `quiseforeverphilly@gmail.com` (hardcoded for security)

## Subscription Management API

### GET /api/admin/subscriptions

**Purpose**: Monitor all customer subscriptions and payment status

**Location**: `src/app/api/admin/subscriptions/route.ts`

**Query Parameters**:
```typescript
interface QueryParams {
  status?: 'active' | 'past_due' | 'unpaid' | 'cancelled';
  userId?: string;
  limit?: number;    // Default: 50
  offset?: number;   // Default: 0
}
```

**Request Example**:
```bash
GET /api/admin/subscriptions?status=active&limit=20&offset=0
Authorization: Admin session required
```

**Response Format**:
```typescript
interface SubscriptionResponse {
  success: boolean;
  subscriptions: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
    };
    subscriptionPlan: string;
    amount: number;
    currency: string;
    paymentId: string;
    status: string;
    subscriptionStatus: 'active' | 'past_due' | 'unpaid' | 'cancelled';
    paymentStatus: string;
    deviceAccess: 'active' | 'revoked';
    nextBillingDate: string | null;
    createdAt: string;
    updatedAt: string;
    notes: any;
  }>;
  summary: {
    total: number;
    active: number;
    pastDue: number;
    unpaid: number;
  };
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
```

**Response Example**:
```json
{
  "success": true,
  "subscriptions": [
    {
      "id": "order_123",
      "userId": "user_456",
      "user": {
        "id": "user_456",
        "email": "customer@example.com",
        "name": "John Doe",
        "createdAt": "2024-01-15T10:00:00Z"
      },
      "subscriptionPlan": "single-user",
      "amount": 19900,
      "currency": "USD",
      "paymentId": "PAYPAL_ORDER_789",
      "status": "active",
      "subscriptionStatus": "active",
      "paymentStatus": "completed",
      "deviceAccess": "active",
      "nextBillingDate": "2024-02-15T10:00:00Z",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "notes": null
    }
  ],
  "summary": {
    "total": 1,
    "active": 1,
    "pastDue": 0,
    "unpaid": 0
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}
```

### POST /api/admin/subscriptions

**Purpose**: Manage subscription actions (cancel, reactivate, check status)

**Request Format**:
```typescript
interface SubscriptionActionRequest {
  action: 'cancel' | 'reactivate' | 'check_status';
  subscriptionId: string;
  userId?: string;
  reason?: string;
}
```

**Request Examples**:

1. **Cancel Subscription**:
```json
{
  "action": "cancel",
  "subscriptionId": "order_123",
  "reason": "Customer request"
}
```

2. **Reactivate Subscription**:
```json
{
  "action": "reactivate",
  "subscriptionId": "order_123",
  "reason": "Payment resolved"
}
```

3. **Check Status**:
```json
{
  "action": "check_status",
  "subscriptionId": "order_123"
}
```

**Response Format**:
```typescript
interface SubscriptionActionResponse {
  success: boolean;
  message?: string;
  subscription?: any;
  error?: string;
}
```

## Test Payment API

### POST /api/test-payment

**Purpose**: Create test payments for PayPal integration verification

**Location**: `src/app/api/test-payment/route.ts`

**Request Format**:
```typescript
interface TestPaymentRequest {
  amount: number;        // Amount in cents (1-1000, $0.01-$10.00)
  currency?: string;     // Default: 'USD'
  description?: string;  // Default: 'Test Payment'
  testType: 'payment' | 'subscription';
}
```

**Request Example**:
```json
{
  "amount": 100,
  "currency": "USD",
  "description": "PayPal Integration Test",
  "testType": "payment"
}
```

**Response Format**:
```typescript
interface TestPaymentResponse {
  success: boolean;
  message?: string;
  payment?: {
    id: string;
    status: string;
    amount: { amount: number; currency: string };
    approvalUrl?: string;
    orderId: string;
  };
  testOrder?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
  error?: string;
}
```

**Response Example**:
```json
{
  "success": true,
  "message": "Test payment created successfully",
  "payment": {
    "id": "PAYPAL_TEST_123",
    "status": "created",
    "amount": { "amount": 100, "currency": "USD" },
    "approvalUrl": "https://www.paypal.com/checkoutnow?token=...",
    "orderId": "test_order_456"
  },
  "testOrder": {
    "id": "test_order_456",
    "amount": 100,
    "currency": "USD",
    "status": "test_payment"
  }
}
```

### GET /api/test-payment

**Purpose**: Retrieve test payment history

**Response Format**:
```typescript
interface TestPaymentHistoryResponse {
  success: boolean;
  testPayments: Array<{
    id: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    subscriptionPlan: string;
    createdAt: string;
    notes: any;
  }>;
  total: number;
}
```

## Error Handling

### Standard Error Responses

```typescript
// Unauthorized access
{
  "error": "Unauthorized - Admin access required",
  "status": 401
}

// Invalid request
{
  "error": "Action and subscriptionId are required",
  "status": 400
}

// Internal server error
{
  "error": "Internal server error",
  "status": 500
}
```

### Error Logging

All admin API endpoints include comprehensive error logging:

```typescript
console.error('Admin API error:', {
  endpoint: '/api/admin/subscriptions',
  action: 'cancel',
  subscriptionId: 'order_123',
  error: error.message,
  timestamp: new Date().toISOString(),
  adminUser: session.user.email
});
```

## Rate Limiting

### Current Implementation
- No rate limiting implemented
- Admin access is restricted by authentication
- Consider implementing rate limiting for production

### Recommended Limits
```typescript
// Suggested rate limits for admin endpoints
const RATE_LIMITS = {
  '/api/admin/subscriptions': '100 requests per minute',
  '/api/test-payment': '10 requests per minute'
};
```

## Security Considerations

### 1. Authentication Security
- Admin email hardcoded in application
- Session-based authentication required
- No API key or token-based access

### 2. Data Protection
- Sensitive payment data not exposed
- User PII access logged
- Admin actions audited

### 3. Access Logging
```typescript
// Log all admin actions
console.log('Admin action:', {
  action: 'subscription_cancel',
  adminUser: session.user.email,
  targetUser: subscription.userId,
  subscriptionId: subscriptionId,
  timestamp: new Date().toISOString()
});
```

## Usage Examples

### 1. Monitor Subscription Health

```typescript
// Get all past due subscriptions
const response = await fetch('/api/admin/subscriptions?status=past_due');
const data = await response.json();

// Process past due subscriptions
data.subscriptions.forEach(subscription => {
  if (subscription.deviceAccess === 'active') {
    // Revoke device access
    console.log(`Revoking access for ${subscription.user.email}`);
  }
});
```

### 2. Test PayPal Integration

```typescript
// Create test payment
const testPayment = await fetch('/api/test-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 100,
    testType: 'payment',
    description: 'Integration test'
  })
});

const result = await testPayment.json();
if (result.success && result.payment.approvalUrl) {
  // Open PayPal approval URL
  window.open(result.payment.approvalUrl, '_blank');
}
```

### 3. Bulk Subscription Management

```typescript
// Get all active subscriptions
const subscriptions = await fetch('/api/admin/subscriptions?status=active');
const data = await subscriptions.json();

// Check each subscription status
for (const subscription of data.subscriptions) {
  const statusCheck = await fetch('/api/admin/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'check_status',
      subscriptionId: subscription.id
    })
  });
  
  const status = await statusCheck.json();
  console.log(`Subscription ${subscription.id}: ${status.subscription.status}`);
}
```

## Integration with Frontend

### Admin Dashboard Integration

**Component**: `src/app/admin/clients/page.tsx`

**Key Features**:
- Real-time subscription monitoring
- Subscription action buttons
- Test payment interface
- Status filtering and pagination

**API Usage Pattern**:
```typescript
// Fetch subscriptions with filtering
const fetchSubscriptions = async () => {
  const params = new URLSearchParams();
  if (statusFilter !== "all") {
    params.append("status", statusFilter);
  }
  
  const response = await fetch(`/api/admin/subscriptions?${params}`);
  const data = await response.json();
  
  if (data.success) {
    setSubscriptions(data.subscriptions);
    setSummary(data.summary);
  }
};
```

---

**CRITICAL REMINDER**: All admin endpoints require proper authentication. Never expose admin functionality to regular users.
