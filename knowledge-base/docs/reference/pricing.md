---
id: pricing-reference
title: Pricing Reference
type: reference
category: subscription
audience: [customer-support, internal-ops, sales, admin, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [pricing, plans, subscriptions, coupons, discounts]
---

# Pricing Reference

## Summary
Complete pricing information for SPEAR subscriptions, including plans, discounts, and billing.

## Quick Reference
```yaml
what: Subscription pricing and plans
who: All customers
where: /pricing, /checkout
when: During signup or plan changes
why: Revenue model for device management service
```

---

## Current Plans

### Founder's Tier (Limited Availability)

These prices are **locked forever** for early adopters.

| Plan | First Month | Recurring | What's Included |
|------|-------------|-----------|-----------------|
| **Founder's BYOD** | $100 | $100/month | Use your own device, full platform access |
| **Founder's Device** | $200 | $100/month | Device included ($100 device fee + $100 service) |

**Note**: First month of "Founder's Device" includes $100 one-time device fee.

### Founder's Tier Availability

**IMPORTANT**: Only 100 founder's pricing spots available.

Before quoting founder's pricing, agents MUST check availability:
```
GET /api/founder-slots
Returns: { available: boolean, remaining: number }
```

- If spots remain: Quote $100/month founder's pricing
- If full: Quote standard pricing ($299 or $199 with SPEARMINT)

### Standard Pricing

| Plan | Monthly | With SPEARMINT | What's Included |
|------|---------|----------------|-----------------|
| **Single User** | $299 | $199 | 1 device, full access |
| **Two User Bundle** | $598 | $298 | 2 devices (grandfathered) |

---

## Active Coupons

| Code | Discount | Valid For | Notes |
|------|----------|-----------|-------|
| **SPEARMINT** | $100 off | All plans | General discount code |
| **INSIDER2024** | $289 off | All plans | Special promotional code |

### Coupon Application
- Applied at checkout before payment
- One coupon per order
- Discount applies to first payment only (unless recurring coupon)
- Validated via `/api/coupons/validate`

---

## Billing Details

### Payment Method
- **Primary**: PayPal (production environment)
- **Backup**: Stripe, Square (configured but not primary)

### Billing Cycle
- **Frequency**: Monthly
- **Billing Date**: Same day each month as signup
- **Currency**: USD

### Grace Period
- **Duration**: 7 days after failed payment
- **Access**: Maintained during grace period
- **Retries**: Multiple dunning attempts

### Auto-Renewal
- Subscriptions auto-renew monthly
- Customer can cancel anytime
- Access continues until current period ends

---

## What's Included

### All Plans Include

| Feature | Description |
|---------|-------------|
| **Remote Access** | Full RustDesk remote desktop access |
| **Device Management** | Status monitoring, connection history |
| **Support** | Email support, ticket system |
| **Dashboard** | Personal dashboard with device controls |
| **Mobile Access** | Connect from any device |

### Device-Included Plans Also Include

| Feature | Description |
|---------|-------------|
| **Samsung Galaxy A14** | Pre-configured device |
| **Shipping** | Free shipping to US addresses |
| **Setup** | Device arrives ready to use |

---

## Common Pricing Questions

### "What's the cheapest option?"
Founder's BYOD at $100/month if they have their own compatible device.

### "What's included in the $200 first month?"
$100 for the device (one-time) + $100 for the first month of service.

### "Do coupons apply to recurring payments?"
Standard coupons apply to first payment only. Check specific coupon terms.

### "Can I switch plans?"
Contact support. Plan changes take effect at next billing cycle.

### "What happens if I cancel?"
Access continues until the current billing period ends. No partial refunds.

---

## Price Calculation Examples

### Example 1: Founder's Device (New Customer)
```
First Month: $200 ($100 device + $100 service)
Month 2+: $100/month
Annual Cost: $200 + ($100 × 11) = $1,300
```

### Example 2: Standard with SPEARMINT
```
First Month: $299 - $100 = $199
Month 2+: $299/month
Annual Cost: $199 + ($299 × 11) = $3,488
```

### Example 3: Founder's BYOD
```
Every Month: $100
Annual Cost: $1,200
```

---

## For AI Agents

### Answering Pricing Questions

When asked about pricing:
1. Identify customer type (new vs existing)
2. Check if they have their own device (BYOD eligibility)
3. Mention Founder's pricing if slots available
4. Always mention SPEARMINT coupon for standard pricing

### Decision Tree

```
Is customer a founder?
  → Yes: Offer Founder's pricing ($100-$200/month)
  → No: Offer Standard pricing ($299/month or $199 with SPEARMINT)

Does customer have their own device?
  → Yes: BYOD option available
  → No: Device-included plan recommended
```

### Key Phrases

- "Starting at $100/month for founders with their own device"
- "Standard pricing is $299/month, or $199 with code SPEARMINT"
- "Device-included plans start at $200 for the first month"
- "All plans include full remote access and support"

---

## Related Documentation

- [Subscription Lifecycle](../processes/subscription-lifecycle.md)
- [Checkout Flow](../features/payment/checkout.md)
- [Coupon Validation](../api/payment/validate-coupon.md)

---

*Pricing current as of 2025-01-20. Check with admin for any changes.*
