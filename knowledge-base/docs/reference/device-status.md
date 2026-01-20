---
id: reference-device-status
title: Device Status Reference
type: reference
category: device
audience: [customer-support, internal-ops, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [device, status, reference]
---

# Device Status Reference

## Summary
Complete reference for device status values, their meanings, and transitions.

## Quick Reference
```yaml
what: Device status definitions
statuses: pending, active, inactive, offline, available, assigned, shipped, delivered
primary_indicator: online vs offline (connection status)
```

---

## Device Status Values

### Connection Status (Real-time)

| Status | Icon | Meaning | Can Connect? |
|--------|------|---------|--------------|
| **Online** | Green | Device connected to RustDesk | Yes |
| **Offline** | Red | Device not connected | No |

### Assignment Status

| Status | Meaning | Next Steps |
|--------|---------|------------|
| **pending** | Added to system, not configured | Configure and test |
| **available** | Ready for assignment | Assign to customer |
| **assigned** | Linked to customer order | Ship to customer |
| **shipped** | In transit to customer | Await delivery |
| **delivered** | Received by customer | Await first connection |

### Operational Status

| Status | Meaning | Customer Impact |
|--------|---------|-----------------|
| **active** | Fully operational | Full access |
| **inactive** | Disabled/suspended | No access |

---

## Status Lifecycle

### New Device Flow

```
pending → available → assigned → shipped → delivered → active
```

1. **pending**: Device received at warehouse
2. **available**: Configured and tested
3. **assigned**: Linked to customer order
4. **shipped**: Carrier has device
5. **delivered**: Customer received
6. **active**: Customer connected successfully

### Status Transitions

| From | To | Trigger |
|------|----|---------|
| pending | available | Admin marks ready |
| available | assigned | Assigned to order |
| assigned | shipped | Tracking added |
| shipped | delivered | Delivery confirmed |
| delivered | active | First connection |
| active | inactive | Subscription cancelled |
| inactive | active | Subscription reactivated |

---

## Status Details

### pending
- **Definition**: Device exists in system but not configured
- **Visibility**: Admin only
- **Actions**: Configure, test, mark available
- **Customer Impact**: None (not assigned)

### available
- **Definition**: Device ready to assign to a customer
- **Visibility**: Admin only
- **Actions**: Assign to order
- **Customer Impact**: None (not assigned)

### assigned
- **Definition**: Device linked to customer order
- **Visibility**: Admin and customer
- **Actions**: Ship, update tracking
- **Customer Impact**: Visible in order status

### shipped
- **Definition**: Device in transit with carrier
- **Visibility**: Admin and customer
- **Actions**: Track, await delivery
- **Customer Impact**: Can track shipment

### delivered
- **Definition**: Device received by customer
- **Visibility**: Admin and customer
- **Actions**: Wait for customer setup
- **Customer Impact**: Ready to connect

### active
- **Definition**: Device operational and accessible
- **Visibility**: Admin and customer
- **Actions**: Connect, monitor
- **Customer Impact**: Full remote access

### inactive
- **Definition**: Device disabled/subscription ended
- **Visibility**: Admin and customer
- **Actions**: Reactivate subscription
- **Customer Impact**: Cannot connect

### offline
- **Definition**: Device not currently connected to RustDesk
- **Visibility**: Admin and customer
- **Actions**: Troubleshoot connection
- **Customer Impact**: Cannot connect until online

---

## Status by Audience

### What Customers See

| System Status | Customer Sees | Meaning |
|---------------|---------------|---------|
| pending | (not visible) | - |
| available | (not visible) | - |
| assigned | "Preparing" | Device being set up |
| shipped | "Shipped" + tracking | In transit |
| delivered | "Delivered" | You have it |
| active + online | "Online" (green) | Ready to connect |
| active + offline | "Offline" (red) | Check device |
| inactive | "Subscription Required" | Need to renew |

### What Admins See

Full status visibility plus:
- Last seen timestamp
- Connection history
- Assignment history
- RustDesk ID
- Password (masked)

---

## Dashboard Indicators

### Customer Dashboard

```
Device: Samsung Galaxy A14
ID: 123456789
Status: ● Online (green) or ○ Offline (red)
[Connect] button
```

### Admin Dashboard

```
Device ID: device_123
RustDesk: 123456789
Status: active
Online: ● Yes / ○ No
Last Seen: 5 minutes ago
Assigned To: john@example.com
Order: order_123
```

---

## Common Scenarios

### Customer Can't Connect

**Check these in order**:
1. Subscription status → Must be `active`
2. Device status → Must be `active`
3. Online status → Must be `online` (green)

**If subscription inactive**: Renew subscription
**If device inactive**: Check subscription, contact support
**If device offline**: Check device power/internet

### New Customer Waiting for Access

**Expected timeline**:
1. Order placed → Device `assigned`
2. Ships within 1-2 days → `shipped`
3. Arrives 3-5 days → `delivered`
4. Customer connects → `active`

### Device Shows Offline

**Possible causes**:
- Device powered off
- No internet connection
- RustDesk app not running
- Device in airplane mode

**Resolution**:
1. Power on device
2. Connect to WiFi/cellular
3. Open RustDesk app
4. Wait 1-2 minutes

---

## Admin Actions by Status

| Status | Available Actions |
|--------|-------------------|
| pending | Edit, Delete, Mark Available |
| available | Assign to Order |
| assigned | Update Tracking, Mark Shipped |
| shipped | Mark Delivered |
| delivered | (Wait for customer) |
| active | View, Disconnect, Reassign |
| inactive | Reactivate, Reassign |

---

## API Status Values

### GET /api/devices Response

```json
{
  "id": "device_123",
  "rustDeskId": "123456789",
  "status": "active",
  "isOnline": true,
  "lastSeen": "2025-01-20T10:00:00Z",
  "assignedTo": {
    "userId": "user_123",
    "email": "john@example.com"
  }
}
```

### Status Enum Values

```typescript
enum DeviceStatus {
  PENDING = 'pending',
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
```

---

## Related Documentation

- [RustDesk Feature](../features/device/rustdesk.md)
- [Device Connection Troubleshooting](../troubleshooting/device/connection-failed.md)
- [Device Offline Troubleshooting](../troubleshooting/device/device-offline.md)
- [Order Status Reference](./order-status.md)
