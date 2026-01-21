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

SPEAR has two setup flows based on order type:

### Furnished Device (SPEAR Ships Samsung)
If SPEAR shipped you a Samsung device, most configuration is already done:
- RustDesk is pre-installed and configured
- Developer Options are enabled
- "Stay awake" is already on
- Accessibility permissions granted
- App is pinned

**You just need to:**
1. Place device at patient's home
2. Connect to patient's WiFi
3. Set up RustDesk on your iPhone
4. Test the connection

### BYOD (Bring Your Own Device)
If you're using your own Samsung device, you need the full setup:
1. Enable Developer Options (tap Build Number 7 times)
2. Enable "Stay awake while charging"
3. Install and configure RustDesk
4. Grant all permissions
5. Configure device settings (sounds off, location on, etc.)
6. Set up RustDesk on your iPhone
7. Test the connection

---

## SPEAR Server Configuration

All devices must be configured with these server settings:

| Setting | Value |
|---------|-------|
| **ID Server** | `157.230.227.24` |
| **Relay Server** | `157.230.227.24` |
| **Key** | `RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=` |

### QR Code Configuration
RustDesk can scan a QR code to auto-configure these settings:
- Open RustDesk → Settings → Scan QR Code
- Point camera at the QR code shown on the setup page

---

## Samsung Device Setup (At Patient's Home)

### Step 1: Enable Developer Options (CRITICAL)

Developer Options must be enabled to keep the screen on while charging.

1. Go to **Settings → About phone → Software information**
2. Tap **Build number** exactly **7 times**
3. You'll see "Developer mode has been enabled"
4. Go back to **Settings → Developer options**
5. Enable **"Stay awake"** (or "Keep screen on while charging")

**Why this matters:** Without this setting, the screen turns off after a few minutes and RustDesk may not work properly.

### Step 2: RustDesk Configuration

#### For BYOD (Bring Your Own Device):
1. Download RustDesk from Google Play Store
2. Open RustDesk → Settings (gear icon)
3. Tap **ID/Relay Server**
4. Enter: `157.230.227.24` as the ID Server
5. Paste the Key: `RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=`
6. Tap **Apply**

#### For Furnished Devices (SPEAR Ships):
RustDesk is pre-installed and configured. Just verify the server settings.

### Step 3: Grant RustDesk Permissions (CRITICAL)

1. Open RustDesk
2. When prompted for **Accessibility permission**, tap **Enable**
3. Grant the permission
4. **NEVER disable this permission** - input control won't work without it

### Step 4: Pin RustDesk App (Prevent Accidental Closure)

App pinning locks RustDesk on screen so it can't be accidentally closed.

1. Go to **Settings → Security → App pinning** (or "Pin windows")
2. Enable **App pinning**
3. Open RustDesk app
4. Tap the **Recent apps** button (square or three lines)
5. Tap the RustDesk **app icon** at the top of its card
6. Select **"Pin this app"**

### Step 5: Disable Battery Optimization

Prevent Android from killing RustDesk to save battery.

1. Go to **Settings → Apps → RustDesk → Battery**
2. Select **Unrestricted** (or "Don't optimize")

### Step 6: Enable Start on Boot

1. In RustDesk → Settings
2. Enable **"Start on boot"**

### Step 7: Turn OFF All Sounds (IMPORTANT)

The device shouldn't disturb the patient.

1. Go to **Settings → Sounds and vibration**
2. Set all volume sliders to **0** (Ringtone, Media, Notifications, System)
3. Enable **Silent mode** or **Do Not Disturb**
4. Turn off **vibration**

### Step 8: Turn ON Location Services (REQUIRED)

Location is needed so check-in apps know where the device is.

1. Go to **Settings → Location**
2. Turn **ON** Location services
3. Set to **High accuracy** mode
4. Grant location permission to HHAeXchange or check-in app

### Step 9: Disable Automatic App Updates

Prevent updates from interrupting RustDesk.

1. Open **Google Play Store**
2. Tap profile icon → **Settings**
3. Tap **Network preferences → Auto-update apps**
4. Select **"Don't auto-update apps"**

### Step 10: Place at Patient's Location

**Good locations:**
- Near the WiFi router (better signal)
- On a shelf or table (stable surface)
- Near a power outlet
- Somewhere discreet the patient won't move

**Avoid:**
- Basements or rooms far from router
- Near microwaves (interference)
- Anywhere it might get unplugged
- Direct sunlight (overheating)

### Step 11: Connect to WiFi

1. Go to **Settings → WiFi**
2. Connect to the patient's WiFi network
3. Prefer **2.4GHz networks** (better range through walls)
4. Verify internet is working (open Chrome, load a page)

### Step 12: Final Setup Checklist

- [ ] Device is plugged in and charging
- [ ] Developer Options enabled
- [ ] "Stay awake while charging" is ON
- [ ] RustDesk is open and showing the main screen
- [ ] RustDesk app is pinned
- [ ] Battery optimization is disabled
- [ ] Start on boot is enabled
- [ ] All sounds are OFF
- [ ] Location is ON
- [ ] Auto-updates are disabled
- [ ] Screen stays on (verify it doesn't turn off after a few minutes)

---

## Personal Phone Setup (iPhone/Android)

The caregiver's personal phone needs RustDesk to connect to the Samsung remotely.

### Step 1: Download RustDesk

- **iPhone:** [App Store](https://apps.apple.com/app/rustdesk-remote-desktop/id1581225015)
- **Android:** [Play Store](https://play.google.com/store/apps/details?id=com.carriez.flutter_hbb)

Or search "RustDesk" in your app store.

### Step 2: Configure SPEAR Server (CRITICAL)

1. Open RustDesk on your iPhone/Android
2. Tap **Settings** (gear icon)
3. Tap **ID/Relay Server**
4. Enter: `157.230.227.24` as the ID Server
5. Paste the Key: `RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=`
6. Tap **Apply** or **Save**

**Without this step, you cannot connect to your Samsung device.**

### Step 3: Connect to Samsung Device

1. Look at the Samsung device - RustDesk shows a **9-digit ID** (like 123 456 789)
2. On your iPhone RustDesk, enter this ID in the "Remote ID" field
3. Tap **Connect**
4. Enter the password if prompted
5. You're connected! You can now see and control the Samsung screen

### Alternative: Use SPEAR Web Dashboard

You can also connect through the web dashboard (no app needed):

1. Open **spear-global.com** in Safari/Chrome
2. Log in to your account
3. Go to **Dashboard → Devices**
4. Tap **Connect** on your device

**Pro tip:** Add spear-global.com to your iPhone home screen for quick access (Share → Add to Home Screen)

---

## Daily Check-In Process

1. Open RustDesk on your iPhone
2. Enter the Samsung's 9-digit ID (or select from history)
3. Tap **Connect** → Enter password if needed
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
- Go to Samsung Settings → Accessibility → find RustDesk → Enable
- Restart RustDesk after granting permission

### Connection Drops Frequently
- WiFi signal may be weak - move device closer to router
- Battery optimization may be killing the app - set to Unrestricted
- Patient may have unplugged the device

### Password Issues
- Contact SPEAR support if you need your device password reset
- You can set a permanent password in RustDesk → Settings → Security → Permanent Password

---

## Support

For additional help:
- Visit: **spear-global.com/help**
- AI Support Chat: Available 24/7 on the help page
- Email: support@spear-global.com

---

*Last updated: January 2025*
*Version: 1.0*
