---
id: feature-device-pairing
title: Device Pairing System
type: feature
category: device
audience: [customer-support, internal-ops, ai-agent]
status: current
last_updated: 2025-01-21
version: 1.0
tags: [device, pairing, rustdesk, onboarding, registration]
---

# Device Pairing System

## Summary
The Device Pairing System allows users to link their RustDesk device to their SPEAR account using a unique pairing code and their 9-digit RustDesk ID. This replaces manual device assignment and simplifies the onboarding process.

## Quick Reference
```yaml
what: Self-service device registration system
who: All SPEAR customers with active subscriptions
where: /dashboard/devices, device-pairing component
when: During or after device setup
why: Simplify device linking, reduce admin overhead
pairing_code_format: SP429-A7X9 (2 letters + 3 digits + hyphen + 1 letter + 1 digit + 2 letters)
device_id_format: 9 digits (e.g., 123 456 789)
limit: One device per user
```

---

## Overview

The Device Pairing System enables automatic device-to-user association without admin intervention.

### Key Features

- **Unique Pairing Codes**: Each user gets a unique code (format: `SP429-A7X9`)
- **9-Digit RustDesk ID**: Users enter their device's RustDesk ID to link
- **One Device Per User**: Only one device can be paired at a time
- **Self-Service Updates**: Users can change their paired device anytime
- **Admin Reporting**: Dashboard shows unpaired devices needing attention

---

## How It Works

### Pairing Code Generation

Each user receives a unique pairing code:
- **Format**: `SP429-A7X9` (2 letters + 3 digits + hyphen + 1 letter + 1 digit + 2 letters)
- **Auto-generated**: Created when user first accesses device pairing
- **Permanent**: Code stays the same for the user's account
- **One per user**: Ensures one-to-one device mapping

### Device Linking Process

1. User logs into SPEAR dashboard
2. Navigates to Devices section
3. System displays their unique pairing code
4. User enters their Samsung's 9-digit RustDesk ID
5. System validates the ID format (exactly 9 digits)
6. System checks device isn't already paired to another user
7. Device is linked to user's account

### Device Replacement

If a user needs to change their device:
1. Go to Devices section in dashboard
2. Click "Change Device"
3. Enter new 9-digit RustDesk ID
4. Old device is automatically unassigned
5. New device is linked

---

## Validation Rules

### Pairing Code Validation
- Must match format: 2 letters + 3 digits + hyphen + 1 letter + 1 digit + 2 letters
- Example valid: `SP429-A7X9`, `AB123-C4DE`
- Example invalid: `12345-ABCD`, `SP-1234`

### RustDesk ID Validation
- Must be exactly 9 digits
- No letters, spaces, or special characters
- Example valid: `123456789`, `987654321`
- Example invalid: `12345`, `1234567890`, `12-345-678`

### Business Rules
- **One device per user**: Users can only have one active paired device
- **Unique devices**: A device can only be paired to one user
- **Grandfathered devices**: Legacy devices with `bypassSubscriptionCheck: true` are excluded from pairing requirements
- **Subscription required**: Users must have an active subscription to pair devices

---

## Database Schema

### DevicePairingCode Model

```prisma
model DevicePairingCode {
  id              String    @id @default(uuid())
  code            String    @unique           // Format: SP429-A7X9
  userId          String    @unique           // One code per user
  pairedAt        DateTime?                   // When device was paired
  pairedDeviceId  String?                     // RustDesk device ID
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  user            User      @relation(...)
  @@index([code])
}
```

### Device Model Updates
- Devices are linked via `pairedDeviceId` matching `rustDeskId`
- Assignment status reflects pairing state

---

## API Endpoints

### Client APIs

#### Get Pairing Code
```
GET /api/device/pairing-code
Authorization: Required (active subscription)

Response:
{
  "code": "SP429-A7X9",
  "isPaired": false,
  "pairedDeviceId": null
}
```

#### Pair Device
```
POST /api/device/pair
Authorization: Required
Body: {
  "code": "SP429-A7X9",
  "deviceId": "123456789"
}

Response:
{
  "success": true,
  "message": "Device paired successfully"
}
```

#### Update Paired Device
```
PUT /api/device/pair
Authorization: Required
Body: {
  "newRustDeskId": "987654321"
}

Response:
{
  "success": true,
  "message": "Device updated successfully"
}
```

### Admin APIs

#### Unpaired Devices Report
```
GET /api/admin/devices/unpaired
Authorization: Admin required

Response:
{
  "total": 50,
  "paired": 45,
  "unpaired": 5,
  "grandfathered": 3,
  "unpairedDevices": [
    {
      "id": "...",
      "name": "Device-001",
      "rustDeskId": "123456789",
      "createdAt": "2025-01-15T...",
      "daysSinceCreated": 6
    }
  ]
}
```

---

## User Interface Components

### DevicePairing Component
**Location**: `/src/components/client/device-pairing.tsx`

Features:
- Displays user's pairing code
- Input field for 9-digit RustDesk ID
- Auto-formats ID as `123 456 789` for readability
- "Link Device" button
- Paired status display with current device ID
- "Change Device" dialog for updates

### Admin Unpaired Report
**Location**: `/src/components/admin/unpaired-devices-report.tsx`

Features:
- Device metrics summary (Total, Paired, Unpaired, Grandfathered)
- Table of unpaired devices
- Days since created column
- Manual refresh capability

---

## Troubleshooting

### User Can't Find Pairing Code

**Solutions**:
1. Ensure user is logged in
2. Navigate to Devices section
3. Code is auto-generated on first visit
4. If not showing, check subscription status

### Invalid Device ID Error

**Solutions**:
1. Ensure exactly 9 digits entered
2. No spaces, dashes, or letters
3. Find ID in RustDesk app main screen

### Device Already Paired Error

**Solutions**:
1. Device may be linked to another account
2. Contact support to investigate
3. Admin can manually unassign if needed

### Pairing Not Saving

**Solutions**:
1. Verify active subscription
2. Check internet connection
3. Try refreshing page
4. Contact support if persists

---

## For Customer Support

### Common Questions

**Q: Where do I find my pairing code?**
> A: Log into your SPEAR dashboard and go to the Devices section. Your unique pairing code will be displayed at the top.

**Q: Where do I find my 9-digit RustDesk ID?**
> A: Open the RustDesk app on your Samsung device. The 9-digit ID is displayed on the main screen.

**Q: Can I change my device later?**
> A: Yes! Go to your Devices section and click "Change Device" to link a different device.

**Q: Why can't I pair my device?**
> A: Check that: (1) You have an active subscription, (2) The device ID is exactly 9 digits, (3) The device isn't already linked to another account.

### Escalation Path

1. User reports pairing issue
2. Verify subscription status
3. Check device ID format
4. Check if device is already paired (admin lookup)
5. If unresolvable, escalate to admin for manual intervention

---

## Admin Operations

### Manual Device Assignment

If pairing system fails, admin can:
1. Go to Admin > Devices
2. Find or create device record
3. Manually assign to user
4. Set `bypassSubscriptionCheck` if needed

### Unpaired Devices Monitoring

Regular checks:
1. Review unpaired devices report weekly
2. Identify devices unpaired > 7 days
3. Reach out to users who may need help
4. Clean up abandoned devices monthly

---

## Code Locations

| Component | File Path |
|-----------|-----------|
| Pairing Logic | `/src/lib/device-pairing.ts` |
| User Pairing UI | `/src/components/client/device-pairing.tsx` |
| Admin Report | `/src/components/admin/unpaired-devices-report.tsx` |
| Pairing Code API | `/src/app/api/device/pairing-code/route.ts` |
| Pair Device API | `/src/app/api/device/pair/route.ts` |
| Unpaired Report API | `/src/app/api/admin/devices/unpaired/route.ts` |
| Database Model | `/prisma/schema.prisma` (DevicePairingCode) |

---

## Related Documentation

- [BYOD Setup](./byod-setup.md)
- [Furnished Device Setup](./furnished-setup.md)
- [RustDesk Feature](./rustdesk.md)
- [Device Status Reference](../../reference/device-status.md)
- [Device Connection Troubleshooting](../../troubleshooting/device/connection-failed.md)
