---
id: feature-device-rustdesk
title: RustDesk Remote Access
type: feature
category: device
audience: [customer-support, internal-ops, sales, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [device, rustdesk, remote, connection, access]
---

# RustDesk Remote Access

## Summary
RustDesk is the remote desktop technology that powers SPEAR's device access, allowing users to view and control their devices from anywhere.

## Quick Reference
```yaml
what: Remote desktop access to managed devices
who: Clients with active subscriptions
where: /dashboard/devices, /remote-connect
when: Anytime with internet connection
why: Access and control devices remotely
technology: RustDesk (open source remote desktop)
ports: TCP 21116 (signaling), TCP/UDP 21117 (relay)
```

---

## Overview

RustDesk enables secure remote access to your SPEAR devices:

- **View** your device screen in real-time
- **Control** via mouse and keyboard
- **Transfer** files between devices
- **Access** from computer or mobile

All connections are encrypted and go through SPEAR's secure servers.

---

## How It Works

### Architecture

```
Your Computer/Phone
        ↓
  SPEAR RustDesk Server (157.230.227.24)
        ↓
  Your Remote Device (Samsung Galaxy A14)
```

### Connection Process

1. **You**: Click "Connect" on your device in dashboard
2. **System**: Checks subscription is active
3. **System**: Opens RustDesk connection to device
4. **Device**: Accepts connection (unattended access)
5. **You**: See device screen, can control it

### Security

- **Encryption**: 256-bit end-to-end encryption
- **Authentication**: Device password + subscription validation
- **Isolation**: Each device has unique credentials
- **Logging**: All connections tracked

---

## Actions

### Action: Connect to Device

**Description**: Initiate remote connection to your device

**Trigger**:
- UI: Dashboard → Devices → Click device → "Connect"
- UI: /remote-connect page

**Permissions**:
- Role: CLIENT (own devices only) or ADMIN (any device)
- Subscription: Must be active

**Prerequisites**:
- Device is online (shows green status)
- Active subscription
- Internet connection on both ends

**Input**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| deviceId | string | Yes | Device to connect to |

**Process**:
1. System validates subscription
2. System checks device is online
3. Opens RustDesk connection
4. Displays device screen

**Output**:
- Success: Remote desktop window/view opens
- Failure: Error message with reason

### Action: Check Device Status

**Description**: See if device is online and available

**Trigger**:
- UI: Dashboard → Devices → View status indicator
- API: `GET /api/devices`

**Status Indicators**:
| Color | Status | Meaning |
|-------|--------|---------|
| Green | Online | Ready to connect |
| Red | Offline | Not available |
| Yellow | Unknown | Checking status |

### Action: View Connection History

**Description**: See past connections to your device

**Trigger**:
- UI: Dashboard → Devices → Device detail → History

**Shows**:
- Connection start/end times
- Duration
- Connection source

---

## Connection Methods

### Web Connection

Connect directly from your browser:

1. Login to SPEAR dashboard
2. Go to Devices
3. Click on your device
4. Click "Connect" button
5. RustDesk web client opens

**Requirements**:
- Modern browser (Chrome, Firefox, Safari, Edge)
- WebRTC support

### Desktop Client

For better performance:

1. Download RustDesk client from rustdesk.com
2. Enter SPEAR server details
3. Enter your device ID
4. Enter device password
5. Connect

**SPEAR Server Settings**:
```
Server: 157.230.227.24
Key: RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=
```

### Mobile Connection

Connect from your phone:

1. Install RustDesk mobile app
2. Configure SPEAR server
3. Enter device ID and password
4. Tap connect

---

## Device Requirements

### For Remote Device (Being Controlled)

The Samsung Galaxy A14 devices SPEAR provides come pre-configured with:

- RustDesk app installed
- Unattended access enabled
- SPEAR server configured
- Auto-start on boot

### For Your Device (Controlling From)

Any device with:
- Internet connection
- Modern web browser OR RustDesk client
- Keyboard/mouse (for control)

---

## Unattended Access

### What Is It?

Unattended access means you can connect to your device without someone physically accepting the connection on the other end.

### How It's Configured

SPEAR devices are set up with:
- **Permanent password**: Stored securely
- **Auto-accept**: Connections accepted automatically
- **Auto-start**: RustDesk runs on device boot

### Security

- Only works with correct password
- Subscription must be active
- Connection logged for audit

---

## Common Issues

### Device Shows Offline

**Causes**:
- Device powered off
- No internet connection
- RustDesk app not running

**Solutions**:
1. Verify device is powered on
2. Check device internet (WiFi/mobile data)
3. Have someone open RustDesk app on device
4. Wait 1-2 minutes for status update

### Connection Timeout

**Causes**:
- Network firewall blocking
- Server issue
- Unstable internet

**Solutions**:
1. Try different network
2. Use mobile data instead of WiFi
3. Check spear-global.com is accessible
4. Contact support if persistent

### Slow/Laggy Connection

**Causes**:
- Slow internet on either end
- Distance from server
- Network congestion

**Solutions**:
1. Use wired connection if possible
2. Close other bandwidth-heavy apps
3. Try during off-peak hours
4. Lower quality settings (if available)

### "Access Denied" Error

**Causes**:
- Subscription expired/inactive
- Wrong device
- Password changed

**Solutions**:
1. Check subscription status in dashboard
2. Verify connecting to correct device
3. Contact support if subscription is active

---

## For Customer Support

### "I can't connect to my device"

Diagnostic checklist:
1. Is device online? (Check admin dashboard)
2. Is subscription active?
3. Is customer on working internet?
4. Has device been working before?

Resolution guide:
- If offline: Guide to check device power/internet
- If subscription issue: Help renew
- If first time: Walk through connection steps
- If persistent: Escalate to technical

### "Device shows online but won't connect"

Possible issues:
- RustDesk app crashed on device
- Password mismatch
- Network blocking ports

Solutions:
1. Ask if someone can restart RustDesk on device
2. Verify password in admin system
3. Suggest trying different network

### "Connection keeps dropping"

Causes: Usually network instability

Solutions:
1. Check both ends have stable internet
2. Try wired connection
3. Close background apps using bandwidth
4. If on corporate network, check firewall

---

## Technical Details

### Ports Used
| Port | Protocol | Purpose |
|------|----------|---------|
| 21116 | TCP | Signaling/NAT traversal |
| 21117 | TCP/UDP | Data relay |
| 21114 | TCP | API (internal) |

### Server Configuration
```
IP: 157.230.227.24
Key: RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=
```

### Device ID Format
- 9-digit number (e.g., 123456789)
- Unique per device
- Assigned during setup

---

## Related Documentation

- [Device Connection Troubleshooting](../../troubleshooting/device/connection-failed.md)
- [Device Offline Troubleshooting](../../troubleshooting/device/device-offline.md)
- [Device Status Reference](../../reference/device-status.md)
- [Client Dashboard](../client/dashboard.md)
