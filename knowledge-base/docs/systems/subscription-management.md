# SPEAR Subscription Management Documentation

## Overview

SPEAR's subscription management system handles the complete customer lifecycle from payment to device access control. The system implements a 30-day billing cycle with automatic access revocation for non-paying customers.

## Subscription Lifecycle

### 1. Subscription Creation Flow

```
Customer Registration → Plan Selection → Payment Processing → 
Subscription Activation → Device Provisioning → Access Granted
```

**Detailed Steps**:
1. Customer creates account
2. Selects subscription plan (single-user or two-user)
3. Applies coupon if available (SPEARMINT)
4. Completes PayPal payment
5. Webhook processes payment confirmation
6. Order status updated to "device_prep"
7. Admin ships device to customer
8. Order status updated to "shipped"
9. Customer receives device
10. Order status updated to "active"
11. Customer gains device access

### 2. Subscription States

```typescript
// Order status progression
type OrderStatus = 
  | 'pending'        // Payment not completed
  | 'device_prep'    // Payment completed, preparing device
  | 'shipped'        // Device shipped to customer
  | 'active'         // Subscription active, device accessible
  | 'past_due'       // Payment overdue (>30 days)
  | 'cancelled'      // Subscription cancelled
  | 'test_payment'   // Admin test payment
  | 'test_subscription'; // Admin test subscription
```

### 3. Billing Cycle Management

**30-Day Billing Cycle**:
- Subscription starts on payment completion date
- Next billing date = creation date + 30 days
- Grace period: 7 days after due date
- Auto-revocation: After 37 days total

```typescript
// Calculate subscription status
function getSubscriptionStatus(order: Order): SubscriptionStatus {
  const now = new Date();
  const createdAt = new Date(order.createdAt);
  const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  if (order.status === 'cancelled') return 'cancelled';
  if (order.status === 'pending') return 'pending';
  
  if (daysSinceCreation <= 30) return 'active';
  if (daysSinceCreation <= 37) return 'past_due'; // 7-day grace period
  return 'unpaid'; // Auto-revoke access
}
```

## Admin Subscription Management

### 1. Subscription Monitor Dashboard

**Location**: `/admin/clients`
**Component**: `src/app/admin/clients/page.tsx`

**Key Features**:
- Real-time subscription status monitoring
- Payment status verification
- Device access control
- Subscription actions (cancel, reactivate)
- Summary statistics and filtering

**Dashboard Sections**:
1. **Summary Cards**: Total, active, past due, unpaid counts
2. **Filters**: Status filtering and search
3. **Subscription List**: Detailed customer information
4. **Action Buttons**: Subscription management controls

### 2. Subscription Status Monitoring

```typescript
// Real-time status checking
const checkSubscriptionStatus = async (subscriptionId: string) => {
  try {
    // Get PayPal payment status
    const paymentResult = await paymentService.getPaymentStatus(subscriptionId);
    
    // Determine subscription status
    let subscriptionStatus = 'unknown';
    if (paymentResult.success && paymentResult.status === 'completed') {
      subscriptionStatus = 'active';
      
      // Check if subscription is past due
      const nextBillingDate = new Date(order.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      if (new Date() > nextBillingDate) {
        subscriptionStatus = 'past_due';
      }
    } else {
      subscriptionStatus = 'unpaid';
    }
    
    return { subscriptionStatus, paymentStatus: paymentResult.status };
  } catch (error) {
    console.error('Status check failed:', error);
    return { subscriptionStatus: 'unknown', paymentStatus: 'unknown' };
  }
};
```

### 3. Device Access Control

**Business Rule**: Device access is tied directly to subscription payment status

```typescript
// Device access logic
function getDeviceAccess(subscriptionStatus: string): 'active' | 'revoked' {
  switch (subscriptionStatus) {
    case 'active':
      return 'active';
    case 'past_due':
      return 'active'; // Grace period - maintain access
    case 'unpaid':
    case 'cancelled':
      return 'revoked';
    default:
      return 'revoked'; // Default to revoked for security
  }
}
```

## Subscription Actions

### 1. Cancel Subscription

**API Endpoint**: `POST /api/admin/subscriptions`
**Action**: `cancel`

```typescript
// Cancel subscription request
const cancelSubscription = async (subscriptionId: string, reason: string) => {
  const response = await fetch('/api/admin/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'cancel',
      subscriptionId: subscriptionId,
      reason: reason
    })
  });
  
  const result = await response.json();
  if (result.success) {
    // Update UI
    // Revoke device access
    // Notify customer (future)
  }
};
```

**Cancellation Process**:
1. Update order status to "cancelled"
2. Add cancellation metadata to notes
3. Revoke device access immediately
4. Log admin action
5. Update subscription monitor display

### 2. Reactivate Subscription

**Use Cases**:
- Customer payment issue resolved
- Administrative error correction
- Customer service intervention

```typescript
// Reactivate subscription
const reactivateSubscription = async (subscriptionId: string, reason: string) => {
  const response = await fetch('/api/admin/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'reactivate',
      subscriptionId: subscriptionId,
      reason: reason
    })
  });
  
  // Process reactivation
  if (response.ok) {
    // Restore device access
    // Reset billing cycle (optional)
    // Update subscription status
  }
};
```

### 3. Check Subscription Status

**Real-time Status Verification**:
```typescript
// Check current status with PayPal
const checkStatus = async (subscriptionId: string) => {
  const response = await fetch('/api/admin/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'check_status',
      subscriptionId: subscriptionId
    })
  });
  
  const result = await response.json();
  return result.subscription;
};
```

## Grandfathered Pricing Management

### Two-User Bundle Special Pricing

**Business Rule**: All current two-user customers get $298/month instead of $598/month

```typescript
// Grandfathered pricing logic
function calculateTwoUserPrice(): number {
  // All current customers are grandfathered at $298
  // Future customers (if any) would pay $598
  return 29800; // $298.00 in cents
}

// Display grandfathered pricing
function displayTwoUserPricing() {
  return {
    regularPrice: 59800,     // $598.00 (crossed out)
    grandfatheredPrice: 29800, // $298.00 (actual price)
    discount: 30000,         // $300.00 savings
    message: "Grandfathered Price!"
  };
}
```

### SPEARMINT Coupon Management

**Coupon Details**:
- **Code**: SPEARMINT
- **Discount**: $100.00
- **Applies To**: Single-user plan only
- **Expiration**: None (permanent)

```typescript
// SPEARMINT coupon application
function applySpearmintCoupon(planId: string, amount: number): number {
  if (planId === 'single-user') {
    return Math.max(amount - 10000, 0); // $100 discount, minimum $0
  }
  return amount; // No discount for other plans
}
```

## Automated Subscription Management

### 1. Past Due Detection

```typescript
// Daily job to check past due subscriptions
async function checkPastDueSubscriptions() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const pastDueOrders = await prisma.order.findMany({
    where: {
      status: 'active',
      createdAt: {
        lt: thirtyDaysAgo
      }
    },
    include: {
      user: true
    }
  });
  
  for (const order of pastDueOrders) {
    // Update status to past_due
    await prisma.order.update({
      where: { id: order.id },
      data: { 
        status: 'past_due',
        notes: JSON.stringify({
          pastDueDate: new Date().toISOString(),
          originalStatus: 'active'
        })
      }
    });
    
    // Notify admin (future implementation)
    console.log(`Subscription past due: ${order.user.email}`);
  }
}
```

### 2. Auto-Revocation

```typescript
// Auto-revoke access after grace period (37 days total)
async function autoRevokeExpiredSubscriptions() {
  const thirtySevenDaysAgo = new Date(Date.now() - 37 * 24 * 60 * 60 * 1000);
  
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: 'past_due',
      createdAt: {
        lt: thirtySevenDaysAgo
      }
    }
  });
  
  for (const order of expiredOrders) {
    // Revoke device access
    await revokeDeviceAccess(order.userId);
    
    // Update status
    await prisma.order.update({
      where: { id: order.id },
      data: { 
        status: 'cancelled',
        notes: JSON.stringify({
          autoRevokedDate: new Date().toISOString(),
          reason: 'payment_overdue'
        })
      }
    });
  }
}
```

## Customer Communication

### 1. Subscription Status Notifications

**Future Implementation**:
- Email notifications for payment due
- SMS alerts for past due accounts
- In-app notifications for subscription status

```typescript
// Notification system (future)
interface NotificationService {
  sendPaymentDue(userEmail: string, dueDate: Date): Promise<void>;
  sendPastDueWarning(userEmail: string, gracePeriodEnd: Date): Promise<void>;
  sendAccessRevoked(userEmail: string, reason: string): Promise<void>;
  sendSubscriptionReactivated(userEmail: string): Promise<void>;
}
```

### 2. Customer Self-Service

**Current**: Limited to viewing subscription status
**Future**: Allow customers to update payment methods, view billing history

## Reporting and Analytics

### 1. Subscription Metrics

```typescript
// Key subscription metrics
interface SubscriptionMetrics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pastDueSubscriptions: number;
  cancelledSubscriptions: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  averageCustomerLifetime: number;
}

// Calculate metrics
async function getSubscriptionMetrics(): Promise<SubscriptionMetrics> {
  const orders = await prisma.order.findMany({
    where: {
      subscriptionPlan: {
        in: ['single-user', 'two-user']
      }
    }
  });
  
  // Calculate metrics from orders
  return {
    totalSubscriptions: orders.length,
    activeSubscriptions: orders.filter(o => o.status === 'active').length,
    pastDueSubscriptions: orders.filter(o => o.status === 'past_due').length,
    cancelledSubscriptions: orders.filter(o => o.status === 'cancelled').length,
    monthlyRecurringRevenue: calculateMRR(orders),
    churnRate: calculateChurnRate(orders),
    averageCustomerLifetime: calculateAverageLifetime(orders)
  };
}
```

### 2. Revenue Tracking

```typescript
// Revenue calculations
function calculateMonthlyRecurringRevenue(orders: Order[]): number {
  return orders
    .filter(order => order.status === 'active')
    .reduce((total, order) => total + order.amount, 0);
}

function calculateChurnRate(orders: Order[]): number {
  const thisMonth = new Date();
  const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
  
  const activeLastMonth = orders.filter(o => 
    o.createdAt < thisMonth && o.status === 'active'
  ).length;
  
  const cancelledThisMonth = orders.filter(o => 
    o.updatedAt >= lastMonth && o.status === 'cancelled'
  ).length;
  
  return activeLastMonth > 0 ? (cancelledThisMonth / activeLastMonth) * 100 : 0;
}
```

## Integration Points

### 1. Payment System Integration

- PayPal webhook processing updates subscription status
- Payment failures trigger past due status
- Successful payments reactivate subscriptions

### 2. Device Management Integration

- Subscription status controls device access
- Device provisioning triggered by payment completion
- Access revocation automated based on payment status

### 3. Customer Support Integration

- Admin dashboard provides customer subscription overview
- Support actions logged for audit trail
- Customer communication triggered by status changes

---

**CRITICAL REMINDER**: Subscription management directly affects customer access and revenue. Always test subscription changes thoroughly and maintain audit trails for all administrative actions.
