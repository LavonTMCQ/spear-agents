---
id: feature-byod-setup
title: BYOD (Bring Your Own Device) Setup
type: feature
category: device
audience: [customer-support, sales, ai-agent]
status: current
last_updated: 2025-01-21
version: 2.0
tags: [byod, setup, device, qr-code, rustdesk, pairing, onboarding]
---

# BYOD (Bring Your Own Device) Setup

## Summary
How customers set up their own device for use with SPEAR instead of receiving one from us. BYOD follows a 7-step process compared to the 4-step furnished device flow.

## Quick Reference
```yaml
what: Set up personal device for SPEAR
who: Customers with founder_byod plan or compatible device
where: /onboarding/device-setup?type=byod
legacy_url: /onboarding/byod-setup (redirects to unified page)
when: After subscription purchase
why: Use own device at lower cost ($100/month)
compatible: Samsung Galaxy A14, Samsung Galaxy A16
setup_method: QR code scan + 7-step process
steps: 7 (vs 4 for furnished)
```

---

## Overview

BYOD allows customers to use their own compatible device with SPEAR instead of receiving a pre-configured device. This is available with the Founder's BYOD plan at $100/month.

### BYOD vs Furnished Comparison

| Aspect | BYOD | Furnished |
|--------|------|-----------|
| **Steps** | 7 | 4 |
| **Pre-configuration** | User installs everything | RustDesk pre-installed |
| **Developer Options** | Required (tap Build Number 7x) | Already enabled |
| **Device Source** | User provides device | SPEAR ships device |
| **Complexity** | High | Low |
| **Target** | Tech-savvy users/DevOps | Home Care agencies |
| **Cost** | Service only | Device + Service |

**Benefits**:
- Lower monthly cost
- Use existing device
- Same features as device-included plans

---

## Compatible Devices

### Tested & Supported

| Device | Status | Notes |
|--------|--------|-------|
| **Samsung Galaxy A14** | Fully supported | Primary device |
| **Samsung Galaxy A16** | Fully supported | Tested working |

### Requirements
- Android device (Samsung recommended)
- Internet connection (WiFi or cellular)
- Ability to install apps
- Camera for QR code scanning

---

## 7-Step BYOD Setup Process

### Step 1: Prepare Device
1. Power on Samsung phone
2. Ensure good WiFi signal
3. Note: You'll need the 9-digit Device ID from RustDesk app later

### Step 2: Enable Developer Options (CRITICAL)
1. Go to **Settings > About phone > Software information**
2. Tap **Build number** exactly **7 times**
3. You'll see "Developer mode has been enabled"
4. Go back to **Settings > Developer options**
5. Enable **"Stay awake"** (Keep screen on while charging)
6. Set **"Stay on locked screen"** timeout to maximum

**Why this matters:** Without this setting, the screen turns off after a few minutes and RustDesk may not work properly.

### Step 3: RustDesk Setup
1. Download RustDesk APK from official RustDesk website or Play Store
2. Install the application
3. Grant all requested permissions:
   - **Accessibility permission** (CRITICAL for input control)
   - **Screen recording** permission
   - **Run in background** permission
4. Run through initial setup

### Step 4: Device Settings
1. **Disable auto-update**:
   - Open Google Play Store
   - Tap profile icon > Settings
   - Tap **Network preferences > Auto-update apps**
   - Select **"Don't auto-update apps"**
2. **Allow notifications**: Ensure RustDesk can show notifications
3. **Enable "Start on Boot"**: RustDesk > Settings > Enable "Start on boot"
4. **Disable battery optimization**: Settings > Apps > RustDesk > Battery > Unrestricted

### Step 5: Place & Connect WiFi
1. Transport to patient's home
2. Connect to home WiFi (prefer 2.4GHz)
3. Verify stable connection
4. **Good locations:**
   - Near the WiFi router (better signal)
   - On a shelf or table (stable surface)
   - Near a power outlet
   - Somewhere discreet the patient won't move
5. **Avoid:**
   - Basements or rooms far from router
   - Near microwaves (interference)
   - Direct sunlight (overheating)

### Step 6: Set Up iPhone
1. Install RustDesk on iPhone from App Store
2. Open RustDesk > Settings > Scan QR Code
3. Scan the QR code to add SPEAR server configuration
4. On Samsung: RustDesk > Settings > Security > Set **Permanent Password**
5. On iPhone: Enter Samsung's 9-digit ID
6. Connect and enable **"Remember Me"** for quick access

### Step 7: Test & Verify
1. Confirm remote access works from iPhone
2. Test screen control (taps, swipes)
3. Verify audio/notifications
4. Test opening apps on the Samsung
5. **CRITICAL: Always test before leaving patient's home!**

---

## Device Pairing (NEW)

After completing the 7-step setup, users should pair their device in the SPEAR dashboard.

### How to Pair

1. Log in to SPEAR dashboard
2. Go to **Devices** section
3. Your unique pairing code is displayed (e.g., `SP429-A7X9`)
4. Enter your Samsung's 9-digit RustDesk ID
5. Click "Link Device"

### Pairing Rules

- **One device per user**: Only one device can be paired at a time
- **9-digit ID required**: Must be exactly 9 digits
- **Unique devices**: Same device can't be paired to multiple users
- **Device replacement**: Users can update to a different device anytime

---

## QR Code Setup

### What the QR Code Does

The setup QR code automatically configures:
```
Server: 157.230.227.24
Key: RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=
Auto-start: Enabled
Unattended access: Enabled
```

### IMPORTANT: Security Rules for AI Agent

**NEVER display the RustDesk server key in chat messages.** The key is sensitive configuration data.

Instead, when customers ask about RustDesk setup or server configuration:
1. **Link them to the Device Setup page**: `https://spear-global.com/onboarding/device-setup`
2. Tell them the QR code is available on that page
3. The setup page shows both the QR code AND manual configuration instructions
4. Customers can scan the QR code directly from the setup page on their phone

**What to say:**
> "You can find the QR code and server configuration on our device setup page. Visit spear-global.com/onboarding/device-setup and you'll see the QR code to scan with RustDesk."

**What NOT to do:**
- Do not paste the server key in chat
- Do not try to show the QR code in chat (it won't render)
- Do not give partial key information

### Where Customers Find the QR Code

- **Device Setup Page**: /onboarding/device-setup (primary location)
- **Welcome Email**: Contains link to setup page
- **Dashboard**: Device section has setup instructions

### If QR Code Doesn't Work

Manual configuration:
1. Open RustDesk app
2. Go to Settings (gear icon)
3. Tap "ID/Relay Server"
4. Enter:
   - ID Server: `157.230.227.24`
   - Relay Server: `157.230.227.24`
   - Key: `RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=`
5. Save settings

---

## Setup Checklist

### Samsung Device
- [ ] Developer Options enabled (tap Build Number 7 times)
- [ ] "Stay awake while charging" is ON
- [ ] RustDesk is installed
- [ ] Server settings configured (via QR or manual)
- [ ] Accessibility permission granted
- [ ] Battery optimization disabled
- [ ] Start on boot is enabled
- [ ] Auto-updates are disabled
- [ ] Device placed at patient's home
- [ ] Connected to patient's WiFi

### iPhone/Personal Phone
- [ ] RustDesk installed
- [ ] SPEAR server configured
- [ ] Samsung's 9-digit ID saved
- [ ] Permanent password configured
- [ ] "Remember Me" enabled

### SPEAR Dashboard
- [ ] Device paired using pairing code
- [ ] Connection tested and verified

---

## Troubleshooting

### QR Code Won't Scan

**Solutions**:
1. Ensure good lighting
2. Hold camera steady
3. Make sure entire QR code is visible
4. Try different distance (closer/further)
5. Use manual setup instead

### RustDesk Won't Install

**Solutions**:
1. Check device storage space
2. Ensure Play Store access
3. Try downloading APK directly from rustdesk.com
4. Check Android version compatibility

### Device Shows Offline

**Solutions**:
1. Open RustDesk app on device
2. Check internet connection
3. Verify server settings are correct
4. Wait 1-2 minutes for status update
5. Contact support if persists

### Can't Grant Permissions

**Solutions**:
1. Go to Settings > Apps > RustDesk
2. Tap Permissions
3. Enable all required permissions
4. For Accessibility: Settings > Accessibility > RustDesk > Enable

### Connection Fails After Setup

**Solutions**:
1. Verify RustDesk ID entered correctly
2. Ensure device is powered on
3. Check device has internet
4. Verify subscription is active
5. Try reconnecting

### Pairing Issues

**Solutions**:
1. Ensure you're using exactly 9 digits
2. Check device isn't already paired to another user
3. Verify subscription is active
4. Contact support if error persists

---

## For Customer Support

### Customer Can't Set Up Device

**Questions to ask**:
1. "What device model do you have?"
2. "What step are you stuck on?" (1-7)
3. "Is RustDesk installed on your device?"
4. "Did you enable Developer Options?"
5. "Can you see a 9-digit ID in RustDesk?"

**Common issues by step**:
- Step 2: Developer Options not found → Guide through settings path
- Step 3: Permissions not granted → Walk through accessibility settings
- Step 4: "Start on boot" not working → Check it's inside RustDesk app, not system settings
- Step 6: QR won't scan → Guide to manual server setup
- Step 7: Connection fails → Verify both devices have same server settings

### Customer Asks If Their Device Works

**Check**:
1. Is it Samsung Galaxy A14 or A16? → Supported
2. Other Samsung Android? → May work, not guaranteed
3. iPhone? → Not supported (RustDesk limitation)
4. Other Android? → May work, not guaranteed

**Script**:
> "We've tested and support Samsung Galaxy A14 and A16. Other Android devices may work but aren't officially supported. Would you like to try with your device?"

---

## API Endpoints

### Client APIs
- `GET /api/device/pairing-code` - Get user's pairing code
- `POST /api/device/pair` - Pair device with 9-digit ID
- `PUT /api/device/pair` - Update paired device

### Device Submissions (Optional)
- `GET /api/device-submissions` - List user's submissions
- `POST /api/device-submissions` - Submit device for admin approval

---

## Help Resources

Direct customers to:
- **Setup Page**: /onboarding/device-setup?type=byod
- **Help Center**: /help
- **Knowledge Base**: /knowledge-base
- **Support**: support@spear-global.com

---

## Related Documentation

- [Furnished Device Setup](./furnished-setup.md)
- [Device Pairing System](./device-pairing.md)
- [RustDesk Feature](./rustdesk.md)
- [Device Connection Troubleshooting](../../troubleshooting/device/connection-failed.md)
- [Pricing Reference](../../reference/pricing.md)
- [Business Rules](../../reference/business-rules.md)
