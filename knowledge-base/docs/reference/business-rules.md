---
id: reference-business-rules
title: Business Rules & Policies
type: reference
category: system
audience: [customer-support, internal-ops, sales, admin, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [business, rules, policies, refunds, shipping, support]
priority: high
---

# Business Rules & Policies

## Summary
Critical business rules, policies, and contact information for SPEAR operations.

## Quick Reference
```yaml
support_email: support@spear-global.com
enterprise_email: contact@spear-global.com
support_hours: 24/7 (AI agent), 24/7 (human escalation)
phone: None
refund_window: 7 days after delivery
founder_spots: 100 total (check API for remaining)
```

---

## Contact Information

| Purpose | Contact |
|---------|---------|
| **Customer Support** | support@spear-global.com |
| **Enterprise Inquiries** | contact@spear-global.com |
| **Phone** | Not available |

### Support Hours
- **AI Agent**: 24/7 availability
- **Human Escalation**: 24/7 (dev team handles escalated issues)

---

## Target Market

### Primary Market: Home Care Workers

SPEAR is primarily designed for **home care workers and caregivers**.

**Primary Use Case**:
> Allow caregivers to take patients with them on vacation or travel where they won't be able to check in seamlessly at the normal location.

**Key Value Proposition**:
- Patients can travel with caregivers
- Check-ins happen remotely via SPEAR device
- Compliance maintained regardless of location
- Peace of mind for caregivers and families

### Secondary Markets

- **Businesses**: Can be accommodated
- **Individuals**: No restrictions on who can use SPEAR
- **Enterprise**: Contact contact@spear-global.com for custom arrangements

**Sales Guidance**: We accommodate everyone. No restrictions on customer type.

---

## Founder's Pricing Program

### Overview
- **Price**: $100/month (locked forever)
- **Total Spots**: 100
- **Status**: Limited availability

### Agent Instructions
The agent MUST check how many founder spots remain before quoting this pricing:
```
GET /api/founder-slots
Returns: { available: true/false, remaining: number }
```

**If spots available**:
> "We have founder's pricing available at $100/month, locked in forever. There are [X] spots remaining out of 100."

**If spots full**:
> "Our founder's pricing spots are currently full. Standard pricing is $299/month, or $199 with code SPEARMINT."

### Grandfathered Customers
Existing founder's tier customers keep their $100/month pricing permanently, regardless of future price changes.

---

## Refund Policy

### Automatic Approval (Agent Can Process)

**Within 7 days of delivery**:
- Full refund available
- No questions asked
- Agent/ops can process immediately

**Conditions for auto-refund**:
1. Within 7 days of delivery date
2. Device returned in working condition (if applicable)
3. One refund per customer

### Manual Approval Required

**After 7 days of delivery**:
- Must escalate to admin (Cash)
- Case-by-case basis
- Agent should NOT promise refund

**Agent Script (after 7 days)**:
> "Refunds after the 7-day window require manager approval. I'll escalate this request and someone will follow up within 24 hours."

### Refund Timeline
- Processing: 1-3 business days
- Appears in account: 5-10 business days (PayPal)

---

## Device Replacement Policy

### Customer Responsibility
Once a device is received **in working condition**, the customer is responsible for it.

**SPEAR is NOT responsible for**:
- Lost devices
- Stolen devices
- Damaged devices (drops, water, etc.)
- Devices not returned

### Replacement Process

| Item | Details |
|------|---------|
| **Fee** | $100 |
| **Timeframe** | 5 days |
| **Process** | Customer pays → New device shipped |

**Agent Script**:
> "Since you received the device in working condition, replacement would be $100 with delivery in about 5 days. Would you like me to help you set that up?"

### Exceptions
- Device arrived damaged → Free replacement
- Device defective within 30 days → Free replacement (verify with admin)

---

## Shipping Policy

### Carriers
- USPS
- UPS
- FedEx

(Carrier selected based on destination and availability)

### Delivery Timeframes

| Destination | Timeframe |
|-------------|-----------|
| **Domestic (US)** | 5 days |
| **International** | 14 days |

### International Shipping
- Yes, we ship internationally
- 14-day delivery estimate
- Customer responsible for any customs/duties

---

## Compatible Devices (BYOD)

### Tested & Working
| Device | Status |
|--------|--------|
| Samsung Galaxy A14 | ✓ Primary device |
| Samsung Galaxy A16 | ✓ Tested working |

### BYOD Setup
- QR code setup available
- Link customers to help pages at /help
- Help center at /knowledge-base

**Agent Script for BYOD**:
> "You can use your own Samsung Galaxy A14 or A16. We have a QR code setup process that makes it easy. I can direct you to our help page for step-by-step instructions."

---

## Escalation Policy

### When to Escalate

**Always escalate**:
- Refund requests after 7 days
- Legal/compliance questions
- Abuse/fraud suspicions
- Technical issues agent can't resolve
- Enterprise pricing requests

### Escalation Path
1. AI Agent attempts resolution
2. If unresolved → Create support ticket
3. Dev team reviews and responds
4. For refunds after 7 days → Goes to Cash (admin)

### Escalation Contacts
- **General**: support@spear-global.com
- **Enterprise**: contact@spear-global.com
- **Internal**: Dev team via support ticket system

---

## Sales Rules

### Pricing Promises
- **Can quote**: Published pricing, active coupons
- **Cannot promise**: Custom pricing (send to contact@spear-global.com)
- **Must check**: Founder's slot availability before quoting $100/month

### Competitor Questions
- Don't disparage competitors
- Focus on SPEAR's value: simplicity, home care focus, travel flexibility
- If asked directly, say: "I focus on what SPEAR offers rather than comparing to others"

### Commitments
- Don't promise features that don't exist
- Don't guarantee delivery dates (use "typically" or "estimated")
- Don't promise refunds outside policy

---

## Known Issues

**Current Status**: No known bugs or issues.

If issues arise, they will be documented here for agent awareness.

---

## Special Customer Handling

### Grandfathered Pricing
Some customers have legacy pricing. Check customer record for:
- `planType: founder_*` → $100/month pricing
- Special notes in account

### Enterprise Customers
Any enterprise inquiry should go to contact@spear-global.com.

**Agent Script**:
> "For enterprise or volume pricing, our team can create a custom arrangement. Please email contact@spear-global.com and they'll get back to you within 1 business day."

---

## Quick Decision Tree

### Customer Wants Refund
```
Is it within 7 days of delivery?
  → Yes: Process refund (auto-approve)
  → No: Escalate to admin, don't promise outcome
```

### Customer Asks About Pricing
```
Check founder spots available?
  → Available: Quote $100/month founder's pricing
  → Full: Quote $299 (or $199 with SPEARMINT)

Is this enterprise?
  → Yes: Direct to contact@spear-global.com
```

### Device Issue
```
Was device working when received?
  → No: Free replacement
  → Yes: $100 replacement fee

Is it within 30 days?
  → Possible defect: Verify with admin
```

---

## Agent Reminders

1. **Always check founder slots** before quoting $100/month
2. **7-day refund window** from delivery, not purchase
3. **No phone support** - email only
4. **24/7 support** via AI and human escalation
5. **Home care workers** are our primary audience
6. **$100 device replacement** fee after delivery
7. **International shipping** is 14 days

---

## Related Documentation

- [Pricing Reference](./pricing.md)
- [Refund Process](../processes/refund-process.md)
- [Shipping & Fulfillment](../processes/device-fulfillment.md)
- [Support Workflow](../processes/support-workflow.md)
