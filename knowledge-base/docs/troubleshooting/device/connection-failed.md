---
id: troubleshoot-connection-failed
title: Device Connection Failed
type: troubleshooting
category: device
audience: [customer-support, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [device, connection, rustdesk, remote, offline]
---

# Device Connection Failed

## Symptoms
- Customer can't connect to their device
- "Connection failed" or "Timeout" error
- Device shows as "offline" in dashboard
- RustDesk shows "Connection refused"
- Remote screen won't display

## Quick Diagnosis
```yaml
check_first: Is device showing "online" in admin dashboard?
ask_user: "Is your device powered on and connected to the internet?"
lookup: /admin/devices - check device status and last seen time
```

---

## Causes & Solutions

### Cause 1: Device is Offline (Most Common)

**Diagnosis**:
- Device status shows "offline" in admin
- Last seen time is hours/days ago
- Device may be powered off or disconnected

**Solution**:
1. Ask customer to verify device is powered on
2. Check device has internet connection (WiFi or mobile data)
3. Open RustDesk app on device to confirm it's running
4. Wait 1-2 minutes for status to update

**Customer Message**:
> "Your device appears to be offline. Please make sure it's powered on and connected to the internet. If RustDesk isn't open on the device, please open it and wait about a minute for it to reconnect."

**Prevention**: Enable auto-start for RustDesk on device

---

### Cause 2: RustDesk App Not Running

**Diagnosis**:
- Device has internet but shows offline
- RustDesk was closed or crashed
- Device restarted and RustDesk didn't auto-start

**Solution**:
1. Ask customer (or someone with physical access) to open RustDesk app
2. Verify the RustDesk ID matches what's in the system
3. Wait for connection to establish

**Customer Message**:
> "The RustDesk app may have closed on your device. Can you or someone with access to the device open the RustDesk app? Once it's running, you should be able to connect within a minute."

**Prevention**: Configure RustDesk for unattended access with auto-start

---

### Cause 3: Wrong Device ID

**Diagnosis**:
- Customer trying to connect to wrong device
- RustDesk ID in system doesn't match actual device
- Device was replaced or re-provisioned

**Solution**:
1. Verify RustDesk ID on physical device
2. Compare to ID in `/admin/devices`
3. Update system if IDs don't match
4. Retry connection

**Customer Message**:
> "Let me verify we have the correct device ID. Can you open RustDesk on your device and tell me the ID number shown (usually 9 digits)?"

**Prevention**: Verify ID during device setup

---

### Cause 4: Subscription Expired

**Diagnosis**:
- Customer subscription is `inactive` or `cancelled`
- Access was revoked due to non-payment
- Customer may not realize subscription lapsed

**Solution**:
1. Check subscription status in `/admin/clients`
2. If expired, inform customer
3. Offer to help reactivate subscription
4. Access restored upon payment

**Customer Message**:
> "I see that your subscription is currently inactive. Once we get that renewed, your device access will be restored immediately. Would you like me to help you with that?"

**Prevention**: Better renewal reminders

---

### Cause 5: Firewall Blocking Connection

**Diagnosis**:
- Device shows online but connection times out
- Corporate network or strict firewall
- Ports blocked on customer's network

**Solution**:
1. Try connecting from different network
2. Check if ports 21116-21117 are accessible
3. Use mobile data instead of corporate WiFi
4. Contact IT if corporate environment

**Required Ports**:
- TCP 21116 (signaling)
- TCP/UDP 21117 (relay)

**Customer Message**:
> "This might be a network issue. If you're on a corporate or restricted network, try connecting from a different network or using mobile data. Some networks block the ports needed for remote access."

**Prevention**: Document network requirements

---

### Cause 6: Password Changed or Incorrect

**Diagnosis**:
- Prompted for password but it doesn't work
- Unattended access password was changed
- Password was reset on device

**Solution**:
1. Verify password in admin records
2. If using unattended access, check device settings
3. Reset password on device if needed
4. Update password in system

**Customer Message**:
> "There may be an issue with the device password. Do you remember if the password was changed recently? We may need to reset it on the device."

**Prevention**: Store passwords securely in admin system

---

### Cause 7: RustDesk Server Issue

**Diagnosis**:
- Multiple customers reporting connection issues
- RustDesk server may be down
- Check server health status

**Solution**:
1. Check RustDesk server status (admin)
2. If server issue, inform customer
3. Estimated resolution time
4. Server recovery is admin responsibility

**Customer Message**:
> "We're experiencing a temporary issue with our connection servers. Our team is working on it. Please try again in about [timeframe]. We apologize for the inconvenience."

**Prevention**: Server monitoring and alerts

---

### Cause 8: Device Hardware Issue

**Diagnosis**:
- Device consistently offline
- Physical damage or malfunction
- Device may need replacement

**Solution**:
1. Attempt physical inspection (if possible)
2. Verify device powers on
3. Check for damage
4. Initiate replacement if needed

**Customer Message**:
> "It sounds like there may be a hardware issue with your device. Let me help you start the replacement process."

**Prevention**: Quality control, device warranties

---

## Admin Actions

### Check Device Status
1. Go to `/admin/devices`
2. Search by RustDesk ID or customer email
3. Check `status` field:
   - `active` / `online` - Device is connected
   - `offline` - Device not connected
   - `pending` - Not yet set up
   - `inactive` - Disabled

### Check Last Connection
Look at `lastSeen` or `lastCheckIn` timestamp to understand when device was last online.

### Verify RustDesk Server
```
GET /api/rustdesk/status
```
Returns server health information.

### Force Device Sync
```
POST /api/admin/rustdesk/sync
```
Refreshes device status from RustDesk server.

---

## Connection Testing Checklist

For customer support to work through:

- [ ] Is device powered on?
- [ ] Does device have internet access?
- [ ] Is RustDesk app open on device?
- [ ] Does RustDesk ID match our records?
- [ ] Is subscription active?
- [ ] Can customer connect from different network?
- [ ] Is customer using correct password?

---

## Escalation

If basic troubleshooting fails:
- **Escalate to**: Ops/Technical team
- **Provide**:
  - Customer email
  - Device RustDesk ID
  - Steps already tried
  - Error messages
- **SLA**: 4 hours for device issues

---

## Quick Response Templates

### Initial Response
> "I'm sorry you're having trouble connecting to your device. Let's figure out what's happening."

### Checking Status
> "I'm checking your device status now. One moment please..."

### Device Offline
> "I can see your device is showing as offline. This usually means it needs to reconnect. Let me walk you through a few quick steps."

### Issue Resolved
> "Your device should be ready to connect now. Please try connecting again and let me know if it works!"

### Need Escalation
> "This seems to need a deeper look from our technical team. I'm escalating this now and someone will follow up within [timeframe]."

---

## Related Documentation

- [Device Offline](./device-offline.md)
- [Slow Connection](./slow-connection.md)
- [RustDesk Setup Guide](../../features/device/rustdesk.md)
- [Device Status Reference](../../reference/device-status.md)

---

*Last verified: 2025-01-20*
