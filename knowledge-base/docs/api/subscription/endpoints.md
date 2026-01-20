---
id: api-subscription-endpoints
title: Subscription APIs
type: api
category: subscription
audience: [internal-ops, developer, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [subscription, billing, api, cancel, reactivate]
---

# Subscription APIs

## Summary
APIs for managing customer subscriptions including status checks, cancellation, and reactivation.

## Quick Reference
```yaml
base_paths: /api/subscription, /api/client/subscription
auth_required: Authenticated user or Admin
features: Get status, cancel, reactivate, update
```

---

## GET /api/subscription

### Summary
Get subscription status for current authenticated user.

### Endpoint Details
**URL**: `GET /api/subscription`

**Authentication**: Required (session cookie)

### Response

**Has Subscription (200)**:
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "status": "active",
    "planType": "founder_byod",
    "amount": 100.00,
    "currentPeriodStart": "2025-01-20T00:00:00Z",
    "currentPeriodEnd": "2025-02-20T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**No Subscription (200)**:
```json
{
  "success": true,
  "subscription": null
}
```

**Not Authenticated (401)**:
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

---

## GET /api/client/subscription

### Summary
Get detailed subscription information for client dashboard.

### Endpoint Details
**URL**: `GET /api/client/subscription`

**Authentication**: Required (CLIENT or ADMIN role)

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_123",
      "status": "active",
      "planType": "founder_byod",
      "amount": 100.00,
      "currentPeriodEnd": "2025-02-20T00:00:00Z",
      "cancelAtPeriodEnd": false
    },
    "plan": {
      "name": "Founder's BYOD",
      "description": "Bring your own device",
      "price": 100.00,
      "features": [
        "Unlimited remote access",
        "24/7 support",
        "Founder pricing locked"
      ]
    },
    "billingHistory": [
      {
        "id": "order_123",
        "date": "2025-01-20T00:00:00Z",
        "amount": 100.00,
        "status": "completed"
      }
    ],
    "nextBillingDate": "2025-02-20T00:00:00Z",
    "daysRemaining": 31
  }
}
```

---

## POST /api/client/subscription/cancel

### Summary
Cancel the current user's subscription.

### Endpoint Details
**URL**: `POST /api/client/subscription/cancel`

**Authentication**: Required (owner of subscription)

### Request
```json
{
  "reason": "Too expensive",
  "feedback": "Optional additional feedback"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| reason | string | Yes | Cancellation reason |
| feedback | string | No | Additional feedback |

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123",
    "status": "active",
    "cancelAtPeriodEnd": true,
    "accessUntil": "2025-02-20T00:00:00Z",
    "message": "Your subscription will end on February 20, 2025. You'll continue to have access until then."
  }
}
```

**Errors**:
| Status | Code | Message |
|--------|------|---------|
| 400 | NO_SUBSCRIPTION | No active subscription found |
| 400 | ALREADY_CANCELLED | Subscription already cancelled |

### Side Effects
- Sets `cancelAtPeriodEnd: true`
- Sends cancellation confirmation email
- Logs cancellation reason

### Notes
- Access continues until `currentPeriodEnd`
- No immediate access revocation
- Can be reactivated before period ends

---

## POST /api/subscription/reactivate

### Summary
Reactivate a cancelled subscription before it expires.

### Endpoint Details
**URL**: `POST /api/subscription/reactivate`

**Authentication**: Required (owner of subscription)

### Request
```json
{}
```

No body required - reactivates current user's subscription.

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123",
    "status": "active",
    "cancelAtPeriodEnd": false,
    "message": "Your subscription has been reactivated. You will be billed on February 20, 2025."
  }
}
```

**Errors**:
| Status | Code | Message |
|--------|------|---------|
| 400 | NO_SUBSCRIPTION | No subscription found |
| 400 | NOT_CANCELLED | Subscription is not pending cancellation |
| 400 | ALREADY_EXPIRED | Subscription has already expired |

### Side Effects
- Sets `cancelAtPeriodEnd: false`
- Sends reactivation confirmation email

### Notes
- Only works if subscription is `active` with `cancelAtPeriodEnd: true`
- If already expired, need to create new subscription

---

## GET /api/device/subscription-status

### Summary
Quick check if user has active subscription for device access.

### Endpoint Details
**URL**: `GET /api/device/subscription-status`

**Authentication**: Required

### Response

**Active Subscription (200)**:
```json
{
  "hasAccess": true,
  "status": "active",
  "expiresAt": "2025-02-20T00:00:00Z"
}
```

**No Access (200)**:
```json
{
  "hasAccess": false,
  "status": "inactive",
  "reason": "subscription_expired"
}
```

### Use Case
Quick validation before allowing device connections.

---

## GET /api/admin/subscriptions

### Summary
List all subscriptions with filtering (admin only).

### Endpoint Details
**URL**: `GET /api/admin/subscriptions`

**Authentication**: Admin role required

### Query Parameters
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 20 | Items per page |
| status | string | No | - | Filter by status |
| planType | string | No | - | Filter by plan |

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "sub_123",
        "userId": "user_123",
        "userEmail": "john@example.com",
        "userName": "John Doe",
        "status": "active",
        "planType": "founder_byod",
        "amount": 100.00,
        "currentPeriodEnd": "2025-02-20T00:00:00Z",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    },
    "summary": {
      "total": 150,
      "active": 120,
      "pastDue": 10,
      "cancelled": 15,
      "inactive": 5
    }
  }
}
```

---

## POST /api/admin/subscriptions/[id]/extend

### Summary
Extend a subscription's current period (admin only).

### Endpoint Details
**URL**: `POST /api/admin/subscriptions/{subscriptionId}/extend`

**Authentication**: Admin role required

### Request
```json
{
  "days": 7,
  "reason": "Service outage compensation"
}
```

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123",
    "previousEnd": "2025-02-20T00:00:00Z",
    "newEnd": "2025-02-27T00:00:00Z",
    "daysAdded": 7
  }
}
```

### Audit
Action logged with admin ID, reason, and dates.

---

## POST /api/admin/subscriptions/[id]/cancel

### Summary
Cancel a subscription immediately or at period end (admin only).

### Endpoint Details
**URL**: `POST /api/admin/subscriptions/{subscriptionId}/cancel`

**Authentication**: Admin role required

### Request
```json
{
  "reason": "Customer requested via support",
  "immediate": false,
  "refund": false
}
```

**Parameters**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| reason | string | Yes | - | Cancellation reason |
| immediate | boolean | No | false | Cancel now vs period end |
| refund | boolean | No | false | Process refund |

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123",
    "status": "cancelled",
    "effectiveDate": "2025-02-20T00:00:00Z",
    "refundProcessed": false
  }
}
```

### Side Effects
- Updates subscription status
- If immediate: Revokes device access
- If refund: Processes PayPal refund
- Sends notification email
- Creates audit log

---

## GET /api/cron/check-subscriptions

### Summary
Scheduled job to check and process subscription statuses.

### Endpoint Details
**URL**: `GET /api/cron/check-subscriptions`

**Authentication**: Cron secret or Admin

### Processing

Checks all subscriptions for:
1. **Expiring Soon**: Send reminder emails (7 days before)
2. **Past Due**: Attempt payment retry
3. **Grace Period Ended**: Revoke access
4. **Cancelled Period End**: Deactivate

### Response

**Success (200)**:
```json
{
  "success": true,
  "processed": {
    "reminders_sent": 5,
    "retries_attempted": 3,
    "access_revoked": 1,
    "deactivated": 2
  }
}
```

### Schedule
Should run daily via cron job or external scheduler.

---

## Error Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| NO_SUBSCRIPTION | 400 | User has no subscription |
| ALREADY_CANCELLED | 400 | Already cancelled |
| ALREADY_EXPIRED | 400 | Subscription expired |
| NOT_CANCELLED | 400 | Not pending cancellation |
| SUBSCRIPTION_NOT_FOUND | 404 | Subscription ID not found |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Not admin (for admin endpoints) |

---

## Related Documentation

- [Subscription Lifecycle](../../processes/subscription-lifecycle.md)
- [Subscription Management Feature](../../features/subscription/management.md)
- [Admin Clients API](../admin/clients.md)
- [Pricing Reference](../../reference/pricing.md)
