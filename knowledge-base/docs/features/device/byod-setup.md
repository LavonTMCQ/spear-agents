---
id: feature-byod-setup
title: BYOD (Bring Your Own Device) Setup
type: feature
category: device
audience: [customer-support, sales, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [byod, setup, device, qr-code, rustdesk]
---

# BYOD (Bring Your Own Device) Setup

## Summary
How customers set up their own device for use with SPEAR instead of receiving one from us.

## Quick Reference
```yaml
what: Set up personal device for SPEAR
who: Customers with founder_byod plan or compatible device
where: /onboarding/byod-setup, /help
when: After subscription purchase
why: Use own device at lower cost ($100/month)
compatible: Samsung Galaxy A14, Samsung Galaxy A16
setup_method: QR code scan
```

---

## Overview

BYOD allows customers to use their own compatible device with SPEAR instead of receiving a pre-configured device. This is available with the Founder's BYOD plan at $100/month.

**Benefits**:
- Lower monthly cost
- Use existing device
- Same features as device-included plans

---

## Compatible Devices

### Tested & Supported

| Device | Status | Notes |
|--------|--------|-------|
| **Samsung Galaxy A14** | ✓ Fully supported | Primary device |
| **Samsung Galaxy A16** | ✓ Fully supported | Tested working |

### Requirements
- Android device (Samsung recommended)
- Internet connection (WiFi or cellular)
- Ability to install apps
- Camera for QR code scanning

---

## Setup Process

### Step 1: Purchase BYOD Plan

1. Go to spear-global.com/pricing
2. Select "Founder's BYOD" plan ($100/month)
3. Complete PayPal checkout
4. Receive confirmation email

### Step 2: Access Setup Page

After purchase:
1. Login to dashboard
2. Go to Devices section
3. Click "Set Up Your Device"
4. Or visit /onboarding/byod-setup

### Step 3: Scan QR Code

On your Samsung device:
1. Open camera app
2. Point at the QR code displayed on screen
3. Tap the notification/link that appears
4. This configures RustDesk automatically

**QR Code configures**:
- SPEAR server connection
- Security keys
- Auto-start settings

### Step 4: Install RustDesk (if needed)

If RustDesk isn't already installed:
1. QR code will prompt installation
2. Or download from Play Store
3. Search "RustDesk"
4. Install the app

### Step 5: Grant Permissions

RustDesk needs these permissions:
- **Screen recording**: To share your screen
- **Accessibility**: For remote control
- **Run in background**: Stay connected

Follow the on-screen prompts to enable each.

### Step 6: Verify Connection

1. Note your RustDesk ID (9 digits)
2. Return to SPEAR dashboard
3. Enter your RustDesk ID
4. Click "Verify Connection"
5. Device should show as "Online"

### Step 7: Test Remote Access

1. From another device, login to SPEAR
2. Go to Devices
3. Click on your device
4. Click "Connect"
5. Verify you can see and control the device

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

### If QR Code Doesn't Work

Manual configuration:
1. Open RustDesk app
2. Go to Settings (⚙️)
3. Tap "ID/Relay Server"
4. Enter:
   - ID Server: `157.230.227.24`
   - Relay Server: `157.230.227.24`
   - Key: `RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=`
5. Save settings

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
1. Go to Settings → Apps → RustDesk
2. Tap Permissions
3. Enable all required permissions
4. For Accessibility: Settings → Accessibility → RustDesk → Enable

### Connection Fails After Setup

**Solutions**:
1. Verify RustDesk ID entered correctly
2. Ensure device is powered on
3. Check device has internet
4. Verify subscription is active
5. Try reconnecting

---

## For Customer Support

### Customer Can't Set Up Device

**Questions to ask**:
1. "What device model do you have?"
2. "Were you able to scan the QR code?"
3. "Is RustDesk installed on your device?"
4. "What step are you stuck on?"

**Common issues**:
- Wrong device model → Check compatibility
- QR won't scan → Guide to manual setup
- Permissions not granted → Walk through settings
- ID not entered → Help verify device ID

### Customer Asks If Their Device Works

**Check**:
1. Is it Samsung Galaxy A14 or A16? → Supported
2. Other Samsung Android? → May work, not guaranteed
3. iPhone? → Not supported (RustDesk limitation)
4. Other Android? → May work, not guaranteed

**Script**:
> "We've tested and support Samsung Galaxy A14 and A16. Other Android devices may work but aren't officially supported. Would you like to try with your device?"

---

## Help Resources

Direct customers to:
- **Help Center**: /help
- **Knowledge Base**: /knowledge-base
- **Setup Guide**: /onboarding/byod-setup
- **Support**: support@spear-global.com

---

## Related Documentation

- [RustDesk Feature](./rustdesk.md)
- [Device Connection Troubleshooting](../../troubleshooting/device/connection-failed.md)
- [Pricing Reference](../../reference/pricing.md)
- [Business Rules](../../reference/business-rules.md)
