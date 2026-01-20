# SPEAR Subscription, Billing & Refund Policy

**Document:** Standalone subscription and refund policy for SPEAR Platform
**Status:** DRAFT - Requires legal counsel review before implementation
**Created:** January 20, 2026

---

## Purpose

This document provides a clear, ROSCA-compliant subscription and refund policy. It should be:
1. Linked from Terms of Service
2. Displayed during checkout (summary)
3. Available as standalone page at `/subscription-policy` or `/billing`

---

## Policy Content (Customer-Facing)

### SPEAR SUBSCRIPTION & BILLING POLICY

**Effective Date:** [Date]

This policy explains how billing works for SPEAR subscriptions, including auto-renewal, cancellation, and refunds.

---

### 1. Subscription Plans & Pricing

**Enterprise Plans:**
| Plan | Price | Details |
|------|-------|---------|
| Single User | $199-$299/month | Remote device management |
| Two User Bundle | Starting at $298/month | Two-user access |

**Home Care Plans (Founder's Pricing):**
| Plan | First Month | Monthly After |
|------|-------------|---------------|
| Service Only (BYOD) | $100 | $100 |
| With Device | $200 ($100 device + $100 service) | $100 |

Promotional codes may reduce these prices. Current pricing is displayed during checkout.

---

### 2. Automatic Renewal

**YOUR SUBSCRIPTION WILL AUTOMATICALLY RENEW**

Unless you cancel, your subscription will automatically renew each month at the then-current price. By subscribing, you authorize SPEAR to charge your payment method on file for each renewal period.

**What to Expect:**
- You will be charged on the same day each month (e.g., if you subscribed on the 15th, you'll be charged on the 15th of each month)
- We will send a reminder email 7 days before your renewal date
- If your payment fails, we will attempt to charge again and notify you
- After multiple failed payments, your service may be suspended

---

### 3. How to Cancel

You may cancel your subscription at any time using any of these methods:

**Option 1: Online (Easiest)**
1. Log in to your account at spear-global.com
2. Go to **Settings** > **Subscription**
3. Click **"Cancel Subscription"**
4. Confirm your cancellation

**Option 2: Email**
Send an email to **support@spear-global.com** with:
- Subject: "Cancel My Subscription"
- Your account email address
- Confirmation that you want to cancel

We will process your cancellation and send confirmation within 1 business day.

**What Happens After Cancellation:**
- Your access continues until the end of your current billing period
- You will not be charged again after cancellation
- Any devices you purchased are yours to keep
- Your account data will be retained for 30 days, then deleted

---

### 4. Refund Policy

**Service Refunds:**

| Situation | Refund? |
|-----------|---------|
| First 30 days of service | Yes - Full refund of service fees |
| After 30 days | No - Service fees are non-refundable |
| Partial month after cancellation | No - No prorated refunds |
| Service outage or technical issues | Case-by-case, contact support |

**Device Refunds:**

The one-time device fee ($100) is **non-refundable**. When you purchase a device, you are buying the physical hardware, which is yours to keep regardless of your subscription status.

**How to Request a Refund:**
1. Email **support@spear-global.com** within 30 days of your first charge
2. Include "Refund Request" in the subject line
3. Provide your account email and reason for refund
4. Refunds are processed within 5-10 business days to your original payment method

---

### 5. Price Changes

We may change our prices at any time. If we do:
- Existing subscribers will receive at least 30 days' notice before any price increase affects their renewal
- You can cancel before the new price takes effect
- The new price will apply to your next billing cycle after the notice period

---

### 6. Failed Payments

If your payment fails:
- We will attempt to charge your payment method again
- We will send you an email notification
- You will have 7 days to update your payment information
- If payment is not received within 7 days, your service may be suspended
- After 14 days without payment, your subscription may be cancelled

---

### 7. Pausing Your Subscription

We do not currently offer subscription pausing. If you need to temporarily stop service:
- Cancel your subscription
- Re-subscribe when you're ready to resume
- Your account data will be retained for 30 days after cancellation

---

### 8. Account Credits

If you receive account credit (for service issues, promotions, etc.):
- Credits will be applied to your next billing cycle
- Credits cannot be exchanged for cash
- Credits expire 12 months after issuance
- Unused credits are forfeited upon account closure

---

### 9. Questions?

**Email:** support@spear-global.com
**Website:** spear-global.com/contact

---

## Checkout Display Requirements (ROSCA Compliance)

During checkout, BEFORE the user submits payment, display:

```
SUBSCRIPTION SUMMARY

Plan: [Plan Name]
Price: $[XX]/month
First charge: $[XX] today
Next charge: $[XX] on [Date]

AUTOMATIC RENEWAL: Your subscription will automatically renew each
month at $[XX] until you cancel. You can cancel anytime in your
account settings or by emailing support@spear-global.com.

REFUNDS: 30-day money-back guarantee on service.
Device purchases are non-refundable.

[ ] I agree to the Subscription & Billing Policy [link]

[SUBSCRIBE NOW - $XX]
```

**Critical Elements:**
1. Clear statement that it auto-renews
2. Price stated before payment button
3. How to cancel clearly stated
4. Checkbox acknowledgment before payment

---

## California-Specific Requirements

For California residents, additional auto-renewal law requirements:

1. **Clear and Conspicuous Disclosure** - Auto-renewal terms must be displayed clearly before purchase
2. **Affirmative Consent** - User must actively acknowledge auto-renewal terms
3. **Confirmation Email** - Send email after purchase confirming:
   - The auto-renewal terms
   - The cancellation policy
   - Information on how to cancel
4. **Easy Cancellation** - Cancellation must be at least as easy as sign-up

**Post-Purchase Confirmation Email Template:**

```
Subject: Your SPEAR Subscription Confirmation

Hi [Name],

Thank you for subscribing to SPEAR!

SUBSCRIPTION DETAILS:
- Plan: [Plan Name]
- Amount: $[XX]/month
- Billing date: [Date] of each month
- Next charge: [Date]

AUTOMATIC RENEWAL
Your subscription will automatically renew each month at the
then-current rate until you cancel.

HOW TO CANCEL
You can cancel anytime by:
1. Logging into spear-global.com and going to Settings > Subscription
2. Emailing support@spear-global.com

Cancellation takes effect at the end of your current billing period.

Questions? Contact support@spear-global.com

- The SPEAR Team
```

---

## New York-Specific Requirements

For New York residents, under NY General Business Law Section 527-a:

1. **Clear Disclosure** - Must clearly disclose automatic renewal before transaction
2. **Cancellation Mechanism** - Must provide cancellation method that is "cost-effective, timely, and easy to use"
3. **Confirmation** - Must provide confirmation of automatic renewal to consumer

The policy above satisfies these requirements when implemented correctly.

---

## Implementation Checklist

### Database Changes
- [ ] Add `subscription_confirmation_sent` timestamp to User
- [ ] Add `renewal_reminder_sent` timestamp to Subscription
- [ ] Create `RefundRequest` model to track refund requests

### Email Templates
- [ ] Subscription confirmation email
- [ ] Renewal reminder email (7 days before)
- [ ] Payment failed email
- [ ] Cancellation confirmation email
- [ ] Refund processed email

### UI Changes
- [ ] Add subscription summary to checkout page
- [ ] Add cancellation flow in user settings
- [ ] Display clear pricing before payment
- [ ] Add checkbox acknowledgment

### Legal Pages
- [ ] Create `/subscription-policy` page (or `/billing`)
- [ ] Link from Terms of Service
- [ ] Link from footer

---

## Legal Review Checklist

- [ ] Verify ROSCA compliance for all states you operate in
- [ ] Verify California Auto-Renewal Law compliance
- [ ] Verify New York General Business Law Section 527-a compliance
- [ ] Confirm refund policy language with counsel
- [ ] Review "no prorated refunds" position
- [ ] Verify 7-day renewal reminder is sufficient

---

**DISCLAIMER:** This document is provided for informational purposes only and does not constitute legal advice. Consult with a licensed attorney before implementing any legal documents.
