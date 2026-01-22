# SPEAR Device Setup Guide

**Official Documentation for SPEAR AI Agent Knowledge Base**

This document contains the complete device setup instructions for SPEAR remote check-in devices. This information should be used by the SPEAR AI support agent to assist customers with device setup.

---

## Overview

SPEAR uses two devices to enable remote check-ins:

1. **Samsung Device** (Galaxy A14) - Placed at the patient's home, stays there 24/7
2. **Personal Phone** (iPhone/Android) - The caregiver's phone used to control the Samsung remotely

Both devices need RustDesk installed and configured with SPEAR server settings.

---

## Setup Flows

SPEAR has two setup flows based on order type, accessible from the **Unified Device Setup Page**:

- **URL**: `/onboarding/device-setup`
- **Furnished Flow**: `/onboarding/device-setup?type=furnished` (4 steps)
- **BYOD Flow**: `/onboarding/device-setup?type=byod` (7 steps)

### Flow Comparison

| Aspect | Furnished | BYOD |
|--------|-----------|------|
| **Steps** | 4 | 7 |
| **Pre-configuration** | RustDesk pre-installed | User installs everything |
| **Developer Options** | Already enabled | Required (tap Build Number 7x) |
| **Device Source** | SPEAR ships device | User provides device |
| **Complexity** | Low | High |
| **Target** | Home Care agencies | Tech-savvy users/DevOps |
| **Cost** | Device + Service | Service only |

---

## Furnished Device Flow (4 Steps)

If SPEAR shipped you a Samsung device, most configuration is already done.

### Step 1: Your Device Arrived
- Samsung Galaxy A14 pre-configured
- RustDesk pre-installed
- Developer Options enabled
- "Stay awake" is already on
- Accessibility permissions granted
- **"Most setup already done for you!"**

### Step 2: Place & Connect WiFi
1. Transport to patient's home
2. Go to **Settings > WiFi**
3. Connect to patient's WiFi network
4. Prefer **2.4GHz networks** (better range through walls)
5. Verify internet is working (open Chrome, load a page)

### Step 3: Set Up Your iPhone
1. Install RustDesk on iPhone from App Store
2. Open RustDesk > Settings > Scan QR Code
3. Scan the QR code from the setup page to auto-configure SPEAR server
4. Note the 9-digit Device ID from the Samsung
5. Set permanent password on Samsung: RustDesk > Settings > Security > Permanent Password
6. Enable "Remember Me" on iPhone for quick reconnection

### Step 4: Test & Verify
1. From your iPhone, enter the Samsung's 9-digit ID
2. Tap Connect and enter the password
3. Confirm you can see and control the Samsung screen
4. Test audio/notifications work correctly
5. **CRITICAL: Test while still at patient's home!**

---

## BYOD Flow (7 Steps)

If you're using your own Samsung device, you need the full setup.

### Step 1: Prepare Device
1. Power on Samsung phone
2. Ensure good WiFi signal
3. Note: You'll need the 9-digit Device ID from RustDesk app later

### Step 2: Enable Developer Options
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

## Device Pairing System (NEW)

SPEAR now includes an automatic device pairing system to simplify device registration.

### What is Device Pairing?

- Each user receives a unique **Pairing Code** (format: `SP429-A7X9`)
- Users link their device by entering their **9-digit RustDesk ID**
- **One device per user** - users can update their paired device anytime
- Admin dashboard shows unpaired devices report

### How to Pair Your Device

1. **Get Your Pairing Code**:
   - Log in to SPEAR dashboard
   - Go to **Devices** section
   - Your unique pairing code is displayed (e.g., `SP429-A7X9`)

2. **Link Your Device**:
   - Note your Samsung's 9-digit RustDesk ID (e.g., `123 456 789`)
   - Enter the ID in the pairing form
   - Click "Link Device"
   - Device is now paired to your account

3. **Update Device** (if needed):
   - If you need to change to a different device
   - Go to device settings
   - Click "Change Device"
   - Enter new 9-digit RustDesk ID
   - Old device is automatically unassigned

### Device Pairing Rules

- **One device per user**: Only one device can be paired at a time
- **9-digit ID required**: Must be exactly 9 digits
- **Unique devices**: Same device can't be paired to multiple users
- **Grandfathered devices**: Legacy devices are excluded from pairing requirements

### For Admins: Unpaired Devices Report

Access the unpaired devices report at `/admin/devices`:
- Shows total devices, paired count, unpaired count
- Lists devices needing attention
- Shows days since device was created
- Excludes grandfathered devices

---

## SPEAR Server Configuration

All devices must be configured with these server settings:

| Setting | Value |
|---------|-------|
| **ID Server** | `157.230.227.24` |
| **Relay Server** | `157.230.227.24` |
| **Key** | `RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=` |

### QR Code Configuration (Recommended)
RustDesk can scan a QR code to auto-configure these settings:
- Open RustDesk > Settings > Scan QR Code
- Point camera at the QR code shown on the setup page
- Server settings are applied automatically

### Manual Configuration (Fallback)
If QR code doesn't work:
1. Open RustDesk > Settings (gear icon)
2. Tap **ID/Relay Server**
3. Enter: `157.230.227.24` as the ID Server
4. Paste the Key: `RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=`
5. Tap **Apply**

---

## Samsung Device Setup Checklist

### For BYOD Users

- [ ] Developer Options enabled (tap Build Number 7 times)
- [ ] "Stay awake while charging" is ON
- [ ] RustDesk is installed
- [ ] Server settings configured (via QR or manual)
- [ ] Accessibility permission granted
- [ ] Battery optimization disabled
- [ ] Start on boot is enabled
- [ ] Auto-updates are disabled
- [ ] All sounds are OFF (optional - depends on use case)
- [ ] Location is ON (if required for check-in apps)

### For Furnished Device Users

- [ ] Device is powered on and charging
- [ ] Connected to patient's WiFi
- [ ] RustDesk is showing main screen
- [ ] 9-digit ID is noted
- [ ] Permanent password is set

### For All Users

- [ ] iPhone has RustDesk installed
- [ ] iPhone is configured with SPEAR server
- [ ] Test connection works before leaving
- [ ] Device is paired in SPEAR dashboard (new)

---

## Personal Phone Setup (iPhone/Android)

### Step 1: Download RustDesk

- **iPhone:** [App Store](https://apps.apple.com/app/rustdesk-remote-desktop/id1581225015)
- **Android:** [Play Store](https://play.google.com/store/apps/details?id=com.carriez.flutter_hbb)

### Step 2: Configure SPEAR Server

1. Open RustDesk on your iPhone/Android
2. Tap **Settings** (gear icon)
3. Tap **ID/Relay Server** or **Scan QR Code**
4. If scanning: Point at the QR code from setup page
5. If manual: Enter `157.230.227.24` and the key

**Without this step, you cannot connect to your Samsung device.**

### Step 3: Connect to Samsung Device

1. Look at the Samsung device - RustDesk shows a **9-digit ID** (like 123 456 789)
2. On your iPhone RustDesk, enter this ID in the "Remote ID" field
3. Tap **Connect**
4. Enter the permanent password
5. You're connected! You can now see and control the Samsung screen

### Step 4: Enable Quick Access

1. Enable "Remember Me" to save the password
2. Add the device to your favorites/recent list
3. **Pro tip:** Add spear-global.com to your iPhone home screen (Share > Add to Home Screen)

---

## Daily Check-In Process

1. Open RustDesk on your iPhone
2. Enter the Samsung's 9-digit ID (or select from history/favorites)
3. Tap **Connect** > Password auto-fills if saved
4. Open HHAeXchange on the Samsung and check in
5. Disconnect when done

---

## CRITICAL: Test Before Leaving

**ALWAYS test the connection while you're still at the patient's home with both phones in hand.**

- Make sure you can see and control the Samsung screen from your iPhone
- If something doesn't work, troubleshoot NOW while you're still there
- If you leave and something is wrong, you'll have to return to fix it

---

## Troubleshooting

### Device Shows "Offline"
- Check that the Samsung is plugged in and powered on
- Verify WiFi is connected and working
- Make sure RustDesk is open on the Samsung
- Check that "Stay awake" is enabled in Developer Options

### Can't Connect from iPhone
- Verify both devices have the same server settings
- Check that you entered the correct 9-digit ID
- Try closing and reopening RustDesk on both devices
- Verify your iPhone has internet connection

### Screen Goes Black/Turns Off
- Developer Options "Stay awake" may not be enabled
- Make sure the device is plugged in and charging
- RustDesk may have been closed - check if the app is still open

### Input Control Not Working
- Accessibility permission may not be granted
- Go to Samsung Settings > Accessibility > find RustDesk > Enable
- Restart RustDesk after granting permission

### Connection Drops Frequently
- WiFi signal may be weak - move device closer to router
- Battery optimization may be killing the app - set to Unrestricted
- Patient may have unplugged the device

### Password Issues
- Set a permanent password: RustDesk > Settings > Security > Permanent Password
- Contact SPEAR support if you need your device password reset

### Pairing Issues
- Ensure you're using exactly 9 digits for the RustDesk ID
- Check that the device isn't already paired to another user
- Verify your subscription is active

---

## API Endpoints for Device Pairing

### Client APIs
- `GET /api/device/pairing-code` - Get user's pairing code
- `POST /api/device/pair` - Pair device with code + 9-digit ID
- `PUT /api/device/pair` - Update paired device

### Admin APIs
- `GET /api/admin/devices/unpaired` - Unpaired devices report

---

## Support

For additional help:
- Visit: **spear-global.com/help**
- AI Support Chat: Available 24/7 on the help page
- Email: support@spear-global.com

---

*Last updated: January 2025*
*Version: 2.0 - Added Device Pairing System, Unified Setup Flow*
