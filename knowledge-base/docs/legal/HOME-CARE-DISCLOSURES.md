# SPEAR Home Care Worker Disclosures

**Document:** Required disclosures for SPEAR Home Care product vertical
**Status:** DRAFT - Requires legal counsel review before implementation
**Created:** January 20, 2026

---

## Purpose

This document contains specific disclosures and acknowledgments required for users of the SPEAR Home Care product (`/hc`). These disclosures address the unique risks of:
- Placing devices in patients' homes
- Using SPEAR with third-party check-in apps (HHAeXchange, etc.)
- The critical "not proof of service" disclaimer

---

## Part 1: Onboarding Screen Content

These screens should appear during checkout or first login for all Home Care plan subscribers.

### Screen 1: Terms & Privacy (Required for All)

**Title:** Review & Accept

**Body:**
```
To use SPEAR, you must agree to our Terms of Service and acknowledge our Privacy Policy.

Please review these documents carefully before proceeding.
```

**Checkboxes:**
- [ ] I have read and agree to the Terms of Service [link]
- [ ] I have read and acknowledge the Privacy Policy [link]

**Button:** Continue

**Implementation Notes:**
- Cannot proceed without both boxes checked
- Log: timestamp, IP address, terms version, privacy version

---

### Screen 2: Service Understanding (Required for Home Care)

**Title:** Important: Understand What SPEAR Does

**Body:**
```
SPEAR gives you remote access to a phone device placed at your patient's home.

This means:
- You can control the SPEAR phone from your personal phone
- The SPEAR phone stays at the patient's location
- Check-in apps on the SPEAR phone will see that location

SPEAR does NOT:
- Prove you were physically present
- Guarantee your check-ins will be accepted
- Replace your employer's required documentation
```

**Checkbox:**
- [ ] I understand what SPEAR does and does not do

**Button:** Continue

---

### Screen 3: Not Proof of Service (CRITICAL - Required)

**Title:** Not Proof of Service

**Body:**
```
IMPORTANT DISCLAIMER

SPEAR is NOT proof that you:
- Were physically present at a location
- Provided any specific care or services
- Worked any specific hours
- Completed any required tasks

Check-in data from SPEAR may be:
- Inaccurate due to GPS, connectivity, or other issues
- Unavailable due to technical problems
- Different from what your employer expects

Your employer, agency, or payer may have their own requirements for verifying service delivery. SPEAR should not be your only documentation.

Do NOT rely solely on SPEAR for:
- Billing or invoicing
- Employment verification
- Compliance documentation
- Legal or audit purposes
```

**Checkbox:**
- [ ] I understand that SPEAR is not proof of service and I should not rely on it as my only documentation

**Button:** Continue

---

### Screen 4: In-Home Device Placement (Required)

**Title:** Your Responsibility for Device Placement

**Body:**
```
When you place a SPEAR device in someone else's home:

YOU are responsible for:
- Getting permission if required by your employer, agency, or patient
- Following any rules set by the property owner or resident
- Keeping the device secure and charged
- Retrieving the device if you stop caring for that patient

SPEAR is NOT responsible for:
- Any disputes about the device being in someone's home
- Any complaints from patients, families, or property owners
- Any issues with your employer related to device placement

We provide a notice you can share with patients, but using it is your choice. We do not verify that you obtained permission.
```

**Checkbox:**
- [ ] I understand I am responsible for ensuring my use of SPEAR in a patient's home is appropriate and permitted

**Button:** Continue

---

### Screen 5: Third-Party Apps (Required if using check-in apps)

**Title:** Third-Party Applications

**Body:**
```
If you use SPEAR with check-in apps like HHAeXchange:

- SPEAR is not affiliated with HHAeXchange or any other check-in service
- We cannot guarantee compatibility with any app
- Updates to those apps may affect how SPEAR works
- You must still follow all rules of those apps and your employer

If you have problems with a check-in app, contact that app's support - not SPEAR support.
```

**Checkbox:**
- [ ] I understand SPEAR is not affiliated with my check-in app and compatibility is not guaranteed

**Button:** Continue

---

### Screen 6: Final Confirmation (Required)

**Title:** You're Almost Ready

**Body:**
```
By proceeding, you confirm that you understand:

1. SPEAR provides remote device access only
2. SPEAR is NOT proof of service or attendance
3. You are responsible for device placement permissions
4. SPEAR is not affiliated with third-party check-in apps
5. You must follow your employer's policies

If you have any questions, contact support@spear-global.com before proceeding.
```

**Button:** Complete Setup

---

## Part 2: Patient/Care Recipient Notice (Optional Tool)

SPEAR provides this notice as a tool caregivers CAN use. It is NOT required by SPEAR, but may help users comply with their own obligations.

### Notice for Display or Sending

**Title:** Notice About Your Caregiver's Check-In Device

**Content:**
```
Your caregiver uses a service called SPEAR to help with work check-ins.

WHAT THIS MEANS:
A phone device may be placed in your home that your caregiver uses for work purposes. This device helps your caregiver complete their required check-ins.

WHAT SPEAR DOES NOT DO:
- Record audio or video of you
- Access your personal information
- Provide medical care or emergency services
- Monitor your activities

The device simply provides location information for check-in purposes.

QUESTIONS?
If you have questions about this device, please speak with your caregiver or their agency/employer.

If you have concerns about SPEAR specifically, you can learn more at spear-global.com or email privacy@spear-global.com.
```

### Acknowledgment Option (If caregiver wants to record acknowledgment)

**Content:**
```
I acknowledge that I have been informed about the SPEAR check-in device.

Name: ____________________
Relationship to patient: [ ] I am the patient [ ] I am authorized to make decisions
Date: ____________________
```

**Note to Users:**
```
Recording this acknowledgment is optional and is for your records only.
SPEAR does not require or store this acknowledgment.
This does not create any agreement between the patient and SPEAR.
```

---

## Part 3: In-App Reminders

These messages should appear at appropriate times during app use.

### On Remote Connection Start

**Quick Reminder (small banner):**
```
Remember: SPEAR is not proof of service. Keep other records as required by your employer.
```

### On Successful Check-In (if detectable)

**Quick Reminder (small banner):**
```
Check-in completed via SPEAR. This does not guarantee acceptance by your employer.
```

### Monthly Reminder (email or in-app)

**Subject:** Important Reminder About Your SPEAR Service

**Body:**
```
Hi [Name],

This is a friendly reminder about your SPEAR service:

SPEAR IS NOT PROOF OF SERVICE
- Remote check-ins do not prove physical presence
- Keep other documentation as required by your employer
- Technical issues can affect availability

DEVICE CARE
- Make sure your SPEAR device stays charged
- Check that WiFi connectivity is working
- Contact us if you have any technical issues

Questions? Contact support@spear-global.com

- The SPEAR Team
```

---

## Part 4: FAQ Page Content (for /hc/faq or integrated into /hc)

### Questions to Add

**Q: Can my employer see that I'm using SPEAR?**

A: SPEAR does not share your information with your employer. However, you should check your employer's policies about using tools like SPEAR. Some employers may have rules about how you complete check-ins. If you're unsure, ask your supervisor before using SPEAR.

---

**Q: Is using SPEAR considered fraud?**

A: SPEAR is a remote access tool - how you use it is your responsibility. Using SPEAR to check in when you are not actually providing care would be misuse and could violate your employer's policies, your professional obligations, and potentially laws against fraud. SPEAR is designed to help caregivers who ARE providing care but need flexibility with check-in timing. Always provide the care you're scheduled to provide.

---

**Q: What if my employer finds out I'm using SPEAR?**

A: You are responsible for complying with your employer's policies. Some employers may not have a problem with tools like SPEAR; others may prohibit them. We recommend reviewing your employer's policies or asking your supervisor if you're unsure.

---

**Q: Does SPEAR guarantee my check-ins will be accepted?**

A: No. SPEAR provides remote access to a device. Whether your check-ins are accepted depends on the check-in app, your employer's systems, and many other factors we don't control. Technical issues with connectivity, GPS, or the check-in app can all affect whether check-ins are recorded correctly.

---

**Q: What do I tell the patient about the phone?**

A: That's your decision. Many caregivers simply leave the device plugged in without detailed explanations. If asked, you can say it's for work. We provide a notice you can share if you prefer to be more transparent. You should follow your employer's guidance on communicating with patients.

---

**Q: Is this legal?**

A: SPEAR is a legal remote access tool. However, how you use any tool is your responsibility. We recommend:
- Following your employer's policies
- Being honest in your work documentation
- Actually providing the care you're scheduled to provide
- Checking with an attorney if you have legal questions about your specific situation

---

## Part 5: Database Schema for Consent Recording

Add to Prisma schema:

```prisma
model HCConsent {
  id                   String    @id @default(cuid())
  userId               String
  user                 User      @relation(fields: [userId], references: [id])

  // Terms acceptance
  termsVersion         String
  termsAcceptedAt      DateTime
  termsIpAddress       String?
  termsUserAgent       String?

  // Service understanding
  serviceUnderstandingAt DateTime?

  // Not proof of service acknowledgment
  notProofVersion      String?
  notProofAckedAt      DateTime?

  // In-home responsibility
  inhomeVersion        String?
  inhomeAckedAt        DateTime?

  // Third-party apps
  thirdPartyVersion    String?
  thirdPartyAckedAt    DateTime?

  // Final confirmation
  finalConfirmAt       DateTime?

  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  @@index([userId])
}
```

### What to Log

For each acknowledgment, store:
1. **User ID** - Who acknowledged
2. **Timestamp** - When they acknowledged (UTC)
3. **Version** - Version hash/ID of the text they agreed to
4. **IP Address** - Optional but helpful for disputes
5. **User Agent** - Optional, helps verify legitimacy

---

## Part 6: Implementation Checklist

### Phase 1: Critical (Before Launch/ASAP)
- [ ] Add "not proof of service" disclaimer to onboarding
- [ ] Add "not proof of service" to checkout confirmation
- [ ] Add database fields to track acknowledgments
- [ ] Update HC page with FAQ content

### Phase 2: Important (Within 30 Days)
- [ ] Implement full onboarding flow with all screens
- [ ] Add in-app reminders on connection start
- [ ] Create patient notice tool (optional for users)
- [ ] Set up monthly reminder emails

### Phase 3: Nice to Have
- [ ] Analytics on acknowledgment completion rates
- [ ] A/B test acknowledgment flow for completion
- [ ] Add ability to re-view acknowledgments

---

## Legal Review Checklist

Before implementing:
- [ ] Have attorney review "not proof of service" language
- [ ] Confirm acknowledgment flow creates valid consent record
- [ ] Verify disclaimers are sufficient for your liability protection
- [ ] Consider state-specific requirements (NY, CA, etc.)
- [ ] Review with employment law counsel re: check-in app use cases

---

**DISCLAIMER:** This document is provided for informational purposes only and does not constitute legal advice. Consult with a licensed attorney before implementing any legal documents.
