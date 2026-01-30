---
id: affiliate-program
title: Affiliate Marketing Program
type: feature
category: client
audience: [customer-support, internal-ops, sales, admin, ai-agent]
status: current
related: [affiliate-commission-process, affiliate-api-endpoints, pricing-reference]
last_updated: 2026-01-30
version: 2.0
tags: [affiliate, referral, commission, payout, marketing, tiers, milestones]
priority: high
---

# Affiliate Marketing Program

## Summary
SPEAR's affiliate program has two tiers: **General** (self-signup, $25 one-time per activation with milestone bonuses and tier progression) and **Private** (admin-assigned partners, $25/month recurring on renewals). All new affiliates start as General. Admin can upgrade specific people to Private.

## Quick Reference
```yaml
what: Dual-tier affiliate commission program (general + private)
who: Any SPEAR client can self-signup (general), admin assigns private partners
where: /dashboard/affiliate (client), /admin/affiliates (admin)
when: Available after any client activates their affiliate profile
why: Customer acquisition through referrals with scalable rewards
```

---

## Overview

The SPEAR Affiliate Program rewards clients for bringing in new subscribers. There are two affiliate types:

### General Affiliates (Self-Signup)
- **Commission**: $25 one-time per activation (when referred user's first payment is captured)
- **Hold Period**: 15 days before commission is approved
- **Tier Progression**: Standard -> Caregiver Ambassador -> Captain (auto-upgrades based on activations)
- **Milestone Bonuses**: One-time cash bonuses at 3, 5, 10, and 25 activations

### Private Affiliates (Admin-Assigned)
- **Commission**: $25/month recurring on each referred subscriber's renewal
- **Hold Period**: 7 days before commission is approved
- **No Tiers or Milestones**: Flat recurring model

### Shared Rules
- $50 minimum payout threshold
- Admin manually processes payouts via PayPal
- Self-referrals are blocked
- One referrer per user (first code wins)

---

## Affiliate Types Comparison

| | General | Private |
|---|---|---|
| **Who** | Self-signup (everyone) | Admin-assigned partners |
| **Commission** | $25 one-time per activation | $25/month recurring per subscriber |
| **Trigger** | First payment captured | Each renewal webhook |
| **Hold Period** | 15 days | 7 days |
| **Milestones** | Yes (3/5/10/25) | No |
| **Tiers** | Standard / Ambassador / Captain | No |

---

## Tier Progression (General Affiliates Only)

Tiers auto-upgrade based on total activations. Admin can also manually set tier.

| Tier | Activations | Benefits |
|------|------------|----------|
| **Standard** | 0-2 | $25 one-time per activation |
| **Caregiver Ambassador** | 3+ | Same $25 + milestone bonus eligibility |
| **Captain** | 10+ | All bonuses + priority support |

### Milestone Bonuses (One-Time Awards)

| Activations Reached | Bonus |
|---------------------|-------|
| 3 | +$25 |
| 5 | +$75 |
| 10 | +$250 |
| 25 | +$1,000 |

Milestones are awarded automatically when the activation threshold is reached. Each milestone can only be earned once (duplicate protection via database constraint).

---

## What Counts as "Activated"

A referral is "activated" when the **referred user's first payment is captured**. This happens at checkout when the PayPal payment goes through (either one-time or subscription).

- Activation = instant at payment capture (no waiting period for the count)
- The 15-day hold only affects when the commission becomes withdrawable, not the activation count
- Refunds reverse the activation: commission reversed, totalActivations decremented, tier recalculated
- Each referred user can only count as one activation (unique constraint)

---

## How It Works

### For General Affiliates

1. **Activate**: Go to `/dashboard/affiliate` and click "Activate Affiliate Account"
2. **Share**: Copy your referral code (`SPEAR-XXXXXX`) or share link (`https://spear-global.com?ref=SPEAR-XXXXXX`)
3. **Earn**: When someone signs up with your code and pays, you earn $25 instantly (pending 15-day hold)
4. **Level Up**: Hit activation milestones for bonus rewards and tier upgrades
5. **Get Paid**: Once balance reaches $50, request a payout to your PayPal email

### For Private Affiliates

1. **Admin activates** your profile and sets type to "private"
2. **Share**: Same referral code and link system
3. **Earn**: $25/month recurring on each referred subscriber's renewal (starting from first renewal at 30 days)
4. **Get Paid**: Once balance reaches $50, request a payout

### Referral Code Flow (General)

```
Referral link clicked → ?ref= saved to localStorage →
User signs up and pays → Referral record created →
$25 one-time commission created (pending) →
totalActivations incremented → tier recalculated →
milestone check (bonus if threshold reached) →
15-day hold → Cron approves commission → Balance available →
Client requests payout ($50 min) → Admin sends via PayPal
```

### Referral Code Flow (Private)

```
Referral link clicked → ?ref= saved to localStorage →
User signs up and pays → Referral record created →
First renewal (30 days) → $25 commission created (pending) →
7-day hold → Commission approved → Balance available →
Each subsequent renewal → Another $25 commission
```

### Commission Timeline Example (General)

```
Day 0:   Referred user signs up and pays → $25 commission (pending), activation counted
Day 3:   Second referral pays → Another $25 (pending), 2 activations total
Day 7:   Third referral pays → $25 + $25 milestone bonus (pending), tier → Ambassador
Day 15:  First commission approved → Balance: $25
Day 18:  Second commission approved → Balance: $50 → Can request payout
Day 22:  Third commission + milestone approved → Balance: $100
```

### Commission Timeline Example (Private)

```
Day 0:   Referred user signs up and pays → No commission yet
Day 30:  First renewal payment → $25 commission created (pending)
Day 37:  7-day hold expires → Commission approved, added to balance
Day 60:  Second renewal → Another $25 (pending)
Day 67:  Approved → Balance now $50 → Can request payout
```

---

## Referral Statuses

| Status | Meaning | General Commission? | Private Commission? |
|--------|---------|---------------------|---------------------|
| `signed_up` | User signed up but hasn't paid | No | No |
| `subscribed` | User paid initial subscription | Yes - $25 one-time | No (waiting for renewal) |
| `active` | User has renewed at least once | Already earned | Yes - $25/month on renewals |
| `churned` | User cancelled or suspended | Already earned (unless refunded) | No - commissions stop |

---

## Commission Rules

### General Affiliates

| Rule | Detail |
|------|--------|
| **Amount** | $25 one-time per activation (configurable via admin settings) |
| **Trigger** | First payment capture (not renewals) |
| **Commission Type** | `one_time` |
| **Hold Period** | 15 days before approval |
| **Reversal** | Commission reversed on refund; activation count decremented; tier recalculated |
| **Milestones** | Auto-awarded at 3/5/10/25 activations; commission type `milestone_bonus` |
| **Self-Referral** | Blocked |
| **Duplicate Referral** | One referrer per user (first code wins) |

### Private Affiliates

| Rule | Detail |
|------|--------|
| **Amount** | $25/month flat rate per active subscriber (configurable per affiliate) |
| **Trigger** | PayPal renewal webhook (`PAYMENT.SALE.COMPLETED`) |
| **Commission Type** | `recurring` |
| **First Commission** | Only after referred user's first renewal (30+ days) |
| **Hold Period** | 7 days before approval |
| **Reversal** | Commission reversed on refund |
| **Churned Referral** | No new commissions; resumes if user re-subscribes |
| **Self-Referral** | Blocked |
| **Duplicate Referral** | One referrer per user (first code wins) |

---

## Payout Rules

| Rule | Detail |
|------|--------|
| **Minimum Payout** | $50 |
| **Payout Method** | PayPal only |
| **PayPal Email** | Must be set in affiliate profile before requesting |
| **Processing** | Admin manually sends via PayPal, enters transaction ID |
| **One at a Time** | Cannot request new payout while one is pending/processing |
| **Includes** | Regular commissions + milestone bonuses |

---

## Client Affiliate Dashboard

**Location**: `/dashboard/affiliate`

The dashboard adapts based on affiliate type (general or private).

### Activation Screen (First Visit)
- "Activate Affiliate Account" button
- General messaging: "Earn $25 per activation + milestone bonuses"
- Tier progression preview (Standard -> Ambassador -> Captain)

### 4 Tabs

1. **Overview** (default, type-adaptive)
   - Referral code with copy button
   - Share link with copy button
   - **General**: Total Activations stat, tier badge, milestone progress bar, "Earn $25 when your referral activates"
   - **Private**: Active Subscribers stat, "Earn $25/month per active subscriber"
   - "How it works" explanation (adapts to type)

2. **My Referrals**
   - Table of all referrals (privacy-safe: first name + last initial)
   - **General**: "Activation Bonus" column ($25 one-time)
   - **Private**: "Commission Earned" column (recurring total)

3. **Earnings**
   - Monthly earnings breakdown
   - **General**: Shows commission type badges (one-time / milestone bonus)
   - **Private**: Existing monthly recurring view

4. **Payouts**
   - Current balance display
   - PayPal email setup/edit
   - "Request Payout" button (disabled if < $50 or no email)
   - Payout history: Date, Amount, Status, Completed Date

---

## Admin Affiliate Management

**Location**: `/admin/affiliates`

### 4 Tabs

1. **Affiliates** - All affiliates with:
   - **Type** column: Private (purple badge) / General (blue badge) with dropdown to change
   - **Tier** column: Standard/Ambassador/Captain badge with dropdown (general only, N/A for private)
   - Referral count (shows activation count for general)
   - Total earned, pending balance, status toggle
2. **Pending Payouts** - Payout requests awaiting processing with "Process" button
3. **Payout History** - Completed payouts with PayPal transaction IDs
4. **Settings** - Two sections:
   - **Private**: Commission rate, min payout, program enable/disable
   - **General**: Commission rate, hold period (days), self-signup enable/disable

---

## For AI Agents

### Customer Asks About Affiliate Program

**Script**:
> "SPEAR has an affiliate program where you can earn $25 for each person you refer who signs up and pays. You can activate it from your dashboard under 'Affiliate Program'. You'll get a unique referral code to share. When someone signs up with your code, you earn $25 per activation. Plus, there are milestone bonuses - earn extra rewards when you hit 3, 5, 10, and 25 referrals. Payouts are via PayPal with a $50 minimum."

### Customer Asks About Tiers and Milestones

**Script**:
> "Our affiliate program has three tiers based on your total activations. Everyone starts at Standard. At 3 activations you become a Caregiver Ambassador with a $25 bonus. At 5 you get a $75 bonus. At 10 activations you reach Captain tier with a $250 bonus. And at 25 activations there's a $1,000 bonus. Tiers upgrade automatically as you earn more referrals."

### Customer Asks About Referral Code

**Script**:
> "You can find your referral code at /dashboard/affiliate. It looks like SPEAR-XXXXXX. Share this code or the link - when someone signs up using it and pays, you'll earn a $25 activation bonus."

### Customer Asks When They Get Paid

**Script**:
> "You earn $25 each time someone you referred signs up and makes their first payment. There's a 15-day hold on new commissions for security. Once your balance reaches $50, you can request a payout to your PayPal email from the Payouts tab."

### Customer Reports Referral Not Tracked

**Troubleshooting**:
1. Verify they shared the correct referral code
2. Check if referred user used the link with `?ref=` parameter
3. Referral code must be in the URL when the referred user visits the site (saved to browser storage)
4. Referred user can also enter the code manually on the checkout page
5. If code was shared verbally, referred user needs to enter it at checkout or use the link
6. Escalate to admin if referral should exist but doesn't

---

## Related Documentation

- [Affiliate Commission Process](../../processes/affiliate-commission.md)
- [Affiliate API Endpoints](../../api/affiliate/endpoints.md)
- [Pricing Reference](../../reference/pricing.md)
- [Payment Flow](../../processes/payment-flow.md)
- [Business Rules](../../reference/business-rules.md)
