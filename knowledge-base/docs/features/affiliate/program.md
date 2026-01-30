---
id: affiliate-program
title: Affiliate Marketing Program
type: feature
category: client
audience: [customer-support, internal-ops, sales, admin, ai-agent]
status: current
related: [affiliate-commission-process, affiliate-api-endpoints, pricing-reference]
last_updated: 2026-01-30
version: 1.0
tags: [affiliate, referral, commission, payout, marketing]
priority: high
---

# Affiliate Marketing Program

## Summary
SPEAR's affiliate program allows clients to earn $25/month for each referred user who maintains an active subscription. Clients get a unique referral code, share it, and earn recurring commissions after the referred user's first renewal (30+ days).

## Quick Reference
```yaml
what: Recurring affiliate commission program for client referrals
who: Any SPEAR client can activate an affiliate profile
where: /dashboard/affiliate (client), /admin/affiliates (admin)
when: Available after any client activates their affiliate profile
why: Customer acquisition through existing client referrals
```

---

## Overview

The SPEAR Affiliate Program rewards existing clients for bringing in new subscribers. When a client shares their unique referral code (format: `SPEAR-XXXXXX`) and someone signs up using it, the affiliate earns $25/month for as long as that referred user stays subscribed.

Key safeguards:
- Commissions only begin after the referred user's **first successful renewal** (30+ days after signup)
- 7-day hold on all new commissions before approval
- $50 minimum payout threshold
- Admin manually processes payouts via PayPal
- Self-referrals are blocked

---

## How It Works

### For Clients (Affiliates)

1. **Activate**: Go to `/dashboard/affiliate` and click "Activate Affiliate Account"
2. **Share**: Copy your referral code (`SPEAR-XXXXXX`) or share link (`https://spear-global.com?ref=SPEAR-XXXXXX`)
3. **Earn**: When someone signs up with your code and stays subscribed past their first renewal, you earn $25/month
4. **Get Paid**: Once balance reaches $50, request a payout to your PayPal email

### Referral Code Flow

```
Referral link clicked → ?ref= saved to localStorage →
User signs up and pays → Referral record created →
First renewal (30 days) → Commission accrued ($25) →
7-day hold → Commission approved → Balance available →
Client requests payout ($50 min) → Admin sends via PayPal
```

### Commission Timeline Example

```
Day 0:   Referred user signs up and pays → No commission yet
Day 30:  First renewal payment → $25 commission created (pending)
Day 37:  7-day hold expires → Commission approved, added to balance
Day 60:  Second renewal → Another $25 (pending)
Day 67:  Approved → Balance now $50 → Can request payout
```

---

## Referral Statuses

| Status | Meaning | Commission? |
|--------|---------|-------------|
| `signed_up` | User signed up but hasn't paid | No |
| `subscribed` | User paid initial subscription | No (waiting for first renewal) |
| `active` | User has renewed at least once | Yes - $25/month on each renewal |
| `churned` | User cancelled or subscription suspended | No - commissions stop |

---

## Commission Rules

| Rule | Detail |
|------|--------|
| **Amount** | $25/month flat rate (configurable per affiliate via admin) |
| **Trigger** | PayPal renewal webhook (`PAYMENT.SALE.COMPLETED`) |
| **First Commission** | Only after referred user's first renewal (30+ days) |
| **Hold Period** | 7 days before approval (protects against refunds) |
| **Reversal** | Commission reversed if referred user gets a refund |
| **Churned Referral** | No new commissions; resumes if user re-subscribes |
| **Self-Referral** | Blocked - cannot use your own referral code |
| **Duplicate Referral** | One referrer per user (first code wins) |
| **Discount Independence** | $25 regardless of what referred user pays |

---

## Payout Rules

| Rule | Detail |
|------|--------|
| **Minimum Payout** | $50 |
| **Payout Method** | PayPal only |
| **PayPal Email** | Must be set in affiliate profile before requesting |
| **Processing** | Admin manually sends via PayPal, enters transaction ID |
| **One at a Time** | Cannot request new payout while one is pending/processing |

---

## Client Affiliate Dashboard

**Location**: `/dashboard/affiliate`

### 4 Tabs

1. **Overview** (default)
   - Referral code with copy button
   - Share link with copy button
   - Stats: Total Referrals, Active Subscribers, Total Earned, Pending Balance
   - "How it works" explanation
   - First-time visitors see "Activate Affiliate Account" button

2. **My Referrals**
   - Table of all referrals (privacy-safe: first name + last initial)
   - Columns: User, Signup Date, Status (badge), Commission Earned

3. **Earnings**
   - Monthly earnings breakdown
   - Columns: Month, Active Referrals, Commissions Earned, Status

4. **Payouts**
   - Current balance display
   - PayPal email setup/edit
   - "Request Payout" button (disabled if < $50 or no email)
   - Payout history: Date, Amount, Status, Completed Date

---

## Admin Affiliate Management

**Location**: `/admin/affiliates`

### 4 Tabs

1. **Affiliates** - All affiliates with stats, status toggle (active/suspended/banned)
2. **Pending Payouts** - Payout requests awaiting processing with "Process" button
3. **Payout History** - Completed payouts with PayPal transaction IDs
4. **Settings** - Default commission rate, minimum payout ($50), program enable/disable

---

## For AI Agents

### Customer Asks About Affiliate Program

**Script**:
> "SPEAR has an affiliate program where you can earn $25/month for each person you refer who stays subscribed. You can activate it from your dashboard under 'Affiliate Program'. You'll get a unique referral code to share. Once someone signs up with your code and their subscription renews after 30 days, you start earning. Payouts are via PayPal with a $50 minimum."

### Customer Asks About Referral Code

**Script**:
> "You can find your referral code at /dashboard/affiliate. It looks like SPEAR-XXXXXX. Share this code or the link - when someone signs up using it, you'll earn commissions on their renewals."

### Customer Asks When They Get Paid

**Script**:
> "Commissions are earned on each renewal of your referred users (starting from their first renewal at 30 days). There's a 7-day hold on new commissions. Once your balance reaches $50, you can request a payout to your PayPal email from the Payouts tab."

### Customer Reports Referral Not Tracked

**Troubleshooting**:
1. Verify they shared the correct referral code
2. Check if referred user used the link with `?ref=` parameter
3. Referral code must be in the URL when the referred user visits the site (saved to browser storage)
4. If code was shared verbally, referred user needs to enter it or use the link
5. Escalate to admin if referral should exist but doesn't

---

## Related Documentation

- [Affiliate Commission Process](../../processes/affiliate-commission.md)
- [Affiliate API Endpoints](../../api/affiliate/endpoints.md)
- [Pricing Reference](../../reference/pricing.md)
- [Payment Flow](../../processes/payment-flow.md)
- [Business Rules](../../reference/business-rules.md)
