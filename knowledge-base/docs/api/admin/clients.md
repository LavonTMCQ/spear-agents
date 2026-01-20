---
id: api-admin-clients
title: Admin Clients API
type: api
category: admin
audience: [internal-ops, developer, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [admin, clients, customers, management]
---

# Admin Clients API

## Summary
APIs for managing customer accounts, viewing client details, and performing administrative actions on user accounts.

## Quick Reference
```yaml
base_path: /api/admin/clients
auth_required: Admin role
features: List, search, view details, modify subscriptions
```

---

## GET /api/admin/clients

### Summary
List all clients with pagination, search, and filtering.

### Endpoint Details
**URL**: `GET /api/admin/clients`

**Authentication**: Admin role required

### Query Parameters
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 20 | Items per page (max 100) |
| search | string | No | - | Search by email or name |
| status | string | No | - | Filter by subscription status |
| sortBy | string | No | createdAt | Sort field |
| sortOrder | string | No | desc | `asc` or `desc` |

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "CLIENT",
        "subscriptionStatus": "active",
        "planType": "founder_byod",
        "currentPeriodEnd": "2025-02-20T00:00:00Z",
        "devicesCount": 1,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### Example Requests

**List all clients**:
```bash
GET /api/admin/clients?page=1&limit=20
```

**Search by email**:
```bash
GET /api/admin/clients?search=john@example.com
```

**Filter by status**:
```bash
GET /api/admin/clients?status=active
```

**Combined filters**:
```bash
GET /api/admin/clients?search=john&status=active&sortBy=name&sortOrder=asc
```

---

## GET /api/admin/clients/[id]

### Summary
Get detailed information for a specific client.

### Endpoint Details
**URL**: `GET /api/admin/clients/{clientId}`

**Authentication**: Admin role required

### Path Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Client's user ID |

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CLIENT",
      "phone": "+1234567890",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-15T00:00:00Z"
    },
    "subscription": {
      "id": "sub_123",
      "status": "active",
      "planType": "founder_byod",
      "currentPeriodStart": "2025-01-20T00:00:00Z",
      "currentPeriodEnd": "2025-02-20T00:00:00Z",
      "cancelAtPeriodEnd": false,
      "amount": 100.00
    },
    "devices": [
      {
        "id": "device_123",
        "rustDeskId": "123456789",
        "status": "active",
        "lastSeen": "2025-01-20T10:00:00Z"
      }
    ],
    "orders": [
      {
        "id": "order_123",
        "amount": 100.00,
        "status": "active",
        "paymentStatus": "completed",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "supportTickets": [
      {
        "id": "ticket_123",
        "subject": "Connection issue",
        "status": "resolved",
        "createdAt": "2025-01-10T00:00:00Z"
      }
    ]
  }
}
```

**Not Found (404)**:
```json
{
  "success": false,
  "error": "Client not found"
}
```

---

## GET /api/admin/clients/subscription-summary

### Summary
Get aggregated subscription statistics across all clients.

### Endpoint Details
**URL**: `GET /api/admin/clients/subscription-summary`

**Authentication**: Admin role required

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 120,
    "pastDue": 10,
    "cancelled": 15,
    "inactive": 5,
    "byPlan": {
      "founder_byod": 50,
      "founder_device": 40,
      "standard": 30
    },
    "mrr": 15000.00,
    "churnRate": 3.5
  }
}
```

---

## POST /api/admin/clients/[id]/extend-subscription

### Summary
Extend a client's subscription period (goodwill gesture).

### Endpoint Details
**URL**: `POST /api/admin/clients/{clientId}/extend-subscription`

**Authentication**: Admin role required

### Request
```json
{
  "days": 7,
  "reason": "Service outage compensation"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| days | number | Yes | Days to extend (1-365) |
| reason | string | Yes | Reason for extension (logged) |

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123",
    "previousEnd": "2025-02-20T00:00:00Z",
    "newEnd": "2025-02-27T00:00:00Z",
    "daysExtended": 7
  }
}
```

### Side Effects
- Updates `Subscription.currentPeriodEnd`
- Creates audit log entry

---

## POST /api/admin/clients/[id]/cancel-subscription

### Summary
Cancel a client's subscription.

### Endpoint Details
**URL**: `POST /api/admin/clients/{clientId}/cancel-subscription`

**Authentication**: Admin role required

### Request
```json
{
  "reason": "Customer requested",
  "immediate": false,
  "refund": false
}
```

**Parameters**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| reason | string | Yes | - | Cancellation reason |
| immediate | boolean | No | false | Cancel now vs end of period |
| refund | boolean | No | false | Process refund with cancellation |

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
- Updates `Subscription.status` or `cancelAtPeriodEnd`
- Revokes device access (if immediate)
- Creates audit log entry
- Sends cancellation email

---

## POST /api/admin/clients/[id]/reactivate

### Summary
Reactivate a cancelled or inactive subscription.

### Endpoint Details
**URL**: `POST /api/admin/clients/{clientId}/reactivate`

**Authentication**: Admin role required

### Request
```json
{
  "reason": "Customer returned",
  "waivePayment": false
}
```

### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123",
    "status": "active",
    "currentPeriodEnd": "2025-02-20T00:00:00Z"
  }
}
```

### Notes
- May require new payment unless waived
- Restores device access

---

## DELETE /api/admin/clients/[id]

### Summary
Delete a client account (GDPR compliance).

### Endpoint Details
**URL**: `DELETE /api/admin/clients/{clientId}`

**Authentication**: Admin role required

### Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| confirm | boolean | Yes | Must be `true` |

### Response

**Success (200)**:
```json
{
  "success": true,
  "message": "Client account deleted"
}
```

### Side Effects
- Deletes user record
- Anonymizes orders (keeps for accounting)
- Removes all personal data
- Creates GDPR deletion record

### Warning
This action is **irreversible**. Used for GDPR right-to-deletion requests.

---

## Error Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Not admin role |
| CLIENT_NOT_FOUND | 404 | Client ID not found |
| INVALID_EXTENSION | 400 | Invalid days value |
| SUBSCRIPTION_NOT_FOUND | 404 | No subscription for client |
| ALREADY_CANCELLED | 400 | Subscription already cancelled |

---

## Audit Logging

All administrative actions are logged:

```json
{
  "action": "EXTEND_SUBSCRIPTION",
  "adminId": "admin_user_id",
  "targetId": "client_user_id",
  "details": {
    "days": 7,
    "reason": "Service outage compensation"
  },
  "timestamp": "2025-01-20T12:00:00Z"
}
```

Actions logged:
- extend_subscription
- cancel_subscription
- reactivate_subscription
- delete_client
- modify_subscription

---

## Related Documentation

- [Admin Dashboard Guide](../../guides/admin/clients.md)
- [Subscription Lifecycle](../../processes/subscription-lifecycle.md)
- [GDPR Compliance](../../reference/gdpr.md)
