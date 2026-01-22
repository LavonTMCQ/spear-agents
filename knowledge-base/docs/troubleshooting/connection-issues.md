---
id: troubleshoot-connection
title: Connection Troubleshooting Guide
type: troubleshooting
category: technical
audience: [customer-support, ai-agent, customer]
status: current
last_updated: 2025-01-22
version: 1.0
tags: [connection, rustdesk, troubleshooting, wifi, offline]
---

# Connection Troubleshooting Guide

## Quick Diagnosis

When a customer reports connection issues, determine which scenario applies:

### Scenario A: Device Shows "Offline" in Dashboard
**Symptoms**: Device appears offline in SPEAR dashboard, can't connect
**Most Common Causes**:
1. Device is powered off or in sleep mode
2. Device lost WiFi connection
3. Device battery died
4. RustDesk app was closed or crashed

**Quick Fixes**:
1. Ask customer to physically check the device - is it powered on?
2. Check if device is connected to WiFi (look for WiFi icon)
3. Open RustDesk app on the device - it must be running
4. Restart the device if needed

### Scenario B: Connection Times Out
**Symptoms**: Clicking "Connect" starts but never completes, eventually times out
**Most Common Causes**:
1. Slow or unstable internet on either end
2. Firewall blocking connection
3. Device is behind restrictive network (hotel, hospital, corporate)

**Quick Fixes**:
1. Try connecting again - sometimes it works on retry
2. Check internet speed on both ends
3. If on restrictive network, try mobile hotspot instead
4. Restart RustDesk on the device

### Scenario C: Connection Drops Frequently
**Symptoms**: Connection works but disconnects randomly
**Most Common Causes**:
1. Unstable WiFi signal
2. Device going to sleep
3. Network congestion

**Quick Fixes**:
1. Move device closer to WiFi router
2. Disable battery optimization for RustDesk app
3. Set device to never sleep when plugged in
4. Try at different times when network less busy

### Scenario D: "Wrong Password" or "Access Denied"
**Symptoms**: Password rejected when trying to connect
**Most Common Causes**:
1. Password was changed on device
2. Typing error
3. Password in dashboard is outdated

**Quick Fixes**:
1. Check password on the device's RustDesk app directly
2. Copy-paste password instead of typing
3. If BYOD, customer may have changed it - they need to update in dashboard

---

## Step-by-Step Troubleshooting Flow

### Step 1: Verify Basic Requirements
- [ ] Device is powered on
- [ ] Device has internet connection (WiFi or mobile data)
- [ ] RustDesk app is open and running on device
- [ ] Customer has correct RustDesk ID and password

### Step 2: Check Device Status
- [ ] Look up device in SPEAR dashboard
- [ ] Note the status (online/offline/last seen)
- [ ] If offline, when was it last online?

### Step 3: Basic Troubleshooting
If device shows offline:
1. Customer should physically check the device
2. Open RustDesk app on the device
3. Verify WiFi is connected
4. Restart the device

If device shows online but won't connect:
1. Try connecting again
2. Check customer's internet connection
3. Try from different network if possible

### Step 4: Advanced Troubleshooting
If basic steps don't work:
1. Uninstall and reinstall RustDesk on device
2. Re-enter SPEAR server settings
3. Generate new password if needed
4. Check if other apps work (to rule out device issue)

### Step 5: Escalate if Needed
Create support ticket if:
- Problem persists after all troubleshooting steps
- Appears to be server-side issue
- Customer reports issue affecting multiple devices
- Device hardware may be faulty

---

## Common Error Messages

### "Waiting for remote to accept..."
- Remote device needs to have RustDesk open
- Check if device is online in dashboard
- Customer may have denied the connection

### "Connection closed by remote"
- Someone closed the connection on the device side
- RustDesk crashed or was force-closed
- Device went to sleep

### "Network error"
- Internet connection issue on either end
- Firewall may be blocking
- Try mobile hotspot to test

### "Timeout"
- Remote device not responding
- Network too slow
- Try again or check device

---

## BYOD-Specific Issues

### Wrong Server Configuration
If customer set up their own device, verify:
1. ID Server: relay.spear-global.com
2. Relay Server: relay.spear-global.com
3. API Server: (leave blank)
4. Key: (provided in setup email)

### RustDesk Version
- Must use RustDesk version 1.2 or higher
- Download from rustdesk.com (not app store versions)

### Permissions (Android)
RustDesk needs these permissions:
- Screen capture / Display over other apps
- Accessibility service (for remote control)
- Run in background (disable battery optimization)

---

## Prevention Tips for Customers

1. **Keep device plugged in** - Prevents battery death
2. **Stable WiFi location** - Don't move device around
3. **Disable sleep mode** - Or set long timeout
4. **Check daily** - Quick check that RustDesk is running
5. **Update contact info** - So we can reach them if issues

---

## When to Create a Support Ticket

Create ticket for customer if:
- Tried all troubleshooting steps without success
- Issue is recurring (3+ times in a week)
- Customer suspects device hardware issue
- Customer reports issue started after update
- Multiple customers reporting same issue (possible server problem)
