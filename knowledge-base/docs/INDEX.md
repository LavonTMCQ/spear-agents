# SPEAR Documentation Index

> **Last Updated**: 2025-01-20 | **Version**: 1.0 | **Status**: Active

---

## Quick Navigation

| I need to... | Go to |
|--------------|-------|
| Understand what SPEAR does | [Platform Overview](#platform-overview) |
| Know business rules & policies | [Business Rules](./reference/business-rules.md) |
| Help a customer | [Customer Support](#customer-support-quick-start) |
| Manage subscriptions | [Subscription Management](#subscription-management) |
| Handle payment issues | [Payment Troubleshooting](#payment-issues) |
| Process a refund | [Refund Process](./processes/refund-process.md) |
| Manage devices | [Device Management](#device-management) |
| Help with BYOD setup | [BYOD Setup](./features/device/byod-setup.md) |
| Pair a device | [Device Pairing](./features/device/device-pairing.md) |
| Furnished device setup | [Device Setup Guide](./features/DEVICE_SETUP_GUIDE.md) |
| Use the admin dashboard | [Admin Guide](#admin-dashboard) |
| Integrate with API | [API Reference](#api-reference) |
| Understand business processes | [Processes](#business-processes) |

---

## Platform Overview

### What is SPEAR?

**SPEAR** (Secure Platform for Extended Augmented Reality) is a remote device management platform **primarily for home care workers and caregivers**.

**Primary Use Case**: Allow caregivers to take patients with them on vacation or travel where they won't be able to check in seamlessly at the normal location.

- **Secure Remote Access**: Control devices remotely via RustDesk integration
- **Subscription Management**: Monthly billing with PayPal
- **Device Lifecycle Management**: From procurement to customer delivery
- **Compliance Verification**: Location and device status verification
- **Travel Flexibility**: Check-ins work from anywhere

### Key Numbers

| Metric | Value |
|--------|-------|
| Monthly Subscription | $100-$299/month |
| Founder's Pricing | $100/month (100 spots total) |
| Primary Devices | Samsung Galaxy A14, A16 |
| Payment Provider | PayPal (production) |
| Remote Access | RustDesk |
| Support Email | support@spear-global.com |
| Enterprise Email | contact@spear-global.com |
| Domestic Shipping | 5 days |
| International Shipping | 14 days |
| Refund Window | 7 days from delivery (auto-approve) |

### User Roles

| Role | Access | Description |
|------|--------|-------------|
| **ADMIN** | Full | Platform management, all features |
| **CLIENT** | Limited | Own devices, subscription, profile |

**Admin Account**: `quiseforeverphilly@gmail.com` (hardcoded)

---

## Customer Support Quick Start

### Common Customer Questions

| Question | Answer Location |
|----------|-----------------|
| "How do I connect to my device?" | [Device Connection Guide](./features/device/connection.md) |
| "My payment failed" | [Payment Troubleshooting](./troubleshooting/payment/failed-payment.md) |
| "I can't log in" | [Login Issues](./troubleshooting/access/login-issues.md) |
| "How do I cancel?" | [Subscription Cancellation](./features/subscription/cancellation.md) |
| "Where is my device?" | [Order Tracking](./features/orders/tracking.md) |
| "What's included?" | [Pricing Reference](./reference/pricing.md) |

### Customer Lookup

To find customer information:
1. Go to `/admin/clients`
2. Search by email or name
3. View subscription status, orders, devices

---

## Documentation by Category

### Authentication & Access
| Document | Type | Description |
|----------|------|-------------|
| [Login](./features/auth/login.md) | Feature | Email/password and social login |
| [Password Reset](./features/auth/password-reset.md) | Feature | Password recovery flow |
| [Two-Factor Auth](./features/auth/2fa.md) | Feature | Admin 2FA setup |
| [Clerk Integration](./features/auth/clerk.md) | Feature | Google/Apple social login |

### Payment & Billing
| Document | Type | Description |
|----------|------|-------------|
| [Checkout Flow](./features/payment/checkout.md) | Feature | Payment process |
| [PayPal Integration](./features/payment/paypal.md) | Feature | PayPal payment handling |
| [Refunds](./features/payment/refunds.md) | Process | How refunds work |
| [Disputes](./features/payment/disputes.md) | Process | Chargeback handling |
| [Coupons](./features/payment/coupons.md) | Feature | Discount codes |

### Subscription Management
| Document | Type | Description |
|----------|------|-------------|
| [Subscription Lifecycle](./processes/subscription-lifecycle.md) | Process | Full subscription journey |
| [Plan Types](./reference/pricing.md) | Reference | Available plans |
| [Cancellation](./features/subscription/cancellation.md) | Feature | How to cancel |
| [Grace Period](./features/subscription/grace-period.md) | Feature | 7-day payment grace |
| [Dunning](./processes/dunning.md) | Process | Failed payment recovery |

### Device Management
| Document | Type | Description |
|----------|------|-------------|
| [Device Lifecycle](./processes/device-lifecycle.md) | Process | Device journey |
| [RustDesk Connection](./features/device/rustdesk.md) | Feature | Remote access |
| [Device Status](./reference/device-status.md) | Reference | Status codes |
| [BYOD Setup](./features/device/byod-setup.md) | Feature | Bring your own device (7 steps) |
| [Furnished Setup](./features/device/furnished-setup.md) | Feature | SPEAR-shipped device (4 steps) |
| [Device Pairing](./features/device/device-pairing.md) | Feature | Self-service device registration |
| [Device Setup Guide](./features/DEVICE_SETUP_GUIDE.md) | Guide | Complete setup documentation |

### Admin Dashboard
| Document | Type | Description |
|----------|------|-------------|
| [Dashboard Overview](./guides/admin/dashboard.md) | Guide | Admin dashboard tour |
| [Client Management](./guides/admin/clients.md) | Guide | Managing customers |
| [Order Fulfillment](./guides/admin/orders.md) | Guide | Processing orders |
| [Revenue Analytics](./guides/admin/revenue.md) | Guide | Financial reports |
| [Support Tickets](./guides/admin/tickets.md) | Guide | Handling support |

### Client Dashboard
| Document | Type | Description |
|----------|------|-------------|
| [Client Dashboard](./features/client/dashboard.md) | Feature | Client home |
| [My Devices](./features/client/devices.md) | Feature | Device management |
| [My Subscription](./features/client/subscription.md) | Feature | Subscription view |
| [Profile Settings](./features/client/profile.md) | Feature | Account settings |

---

## API Reference

### Authentication APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| [/api/auth/[...nextauth]](./api/auth/nextauth.md) | GET/POST | NextAuth handler |
| [/api/auth/register](./api/auth/register.md) | POST | User registration |
| [/api/auth/forgot-password](./api/auth/forgot-password.md) | POST | Password reset request |
| [/api/auth/reset-password](./api/auth/reset-password.md) | POST | Complete password reset |
| [/api/clerk/webhook](./api/auth/clerk-webhook.md) | POST | Clerk user sync |

### Payment APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| [/api/paypal/create-payment](./api/payment/create-payment.md) | POST | Start PayPal checkout |
| [/api/paypal/capture-payment](./api/payment/capture-payment.md) | POST | Capture payment |
| [/api/paypal/webhook](./api/payment/webhook.md) | POST | PayPal webhooks |
| [/api/coupons/validate](./api/payment/validate-coupon.md) | POST | Validate coupon |

### Subscription APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| [/api/client/subscription](./api/subscription/client-subscription.md) | GET/POST | Client subscription |
| [/api/subscription](./api/subscription/status.md) | GET | Subscription status |
| [/api/subscription/reactivate](./api/subscription/reactivate.md) | POST | Reactivate subscription |

### Device APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| [/api/devices](./api/device/list.md) | GET | List user devices |
| [/api/devices/assign](./api/device/assign.md) | POST | Assign device |
| [/api/rustdesk/status](./api/device/rustdesk-status.md) | GET | RustDesk health |

### Admin APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| [/api/admin/clients](./api/admin/clients.md) | GET | List clients |
| [/api/admin/orders](./api/admin/orders.md) | GET | List orders |
| [/api/admin/orders/[id]](./api/admin/order-detail.md) | GET/POST | Order management |
| [/api/admin/orders/[id]/refund](./api/admin/refund.md) | POST | Process refund |
| [/api/admin/revenue](./api/admin/revenue.md) | GET | Revenue analytics |
| [/api/admin/devices](./api/admin/devices.md) | GET | Device inventory |
| [/api/admin/subscriptions](./api/admin/subscriptions.md) | GET | Subscription management |

---

## Business Processes

| Process | Description | Document |
|---------|-------------|----------|
| **Payment Flow** | User checkout to subscription activation | [payment-flow.md](./processes/payment-flow.md) |
| **Subscription Lifecycle** | Signup → Billing → Renewal/Cancellation | [subscription-lifecycle.md](./processes/subscription-lifecycle.md) |
| **Device Fulfillment** | Order → Ship → Deliver → Activate | [device-fulfillment.md](./processes/device-fulfillment.md) |
| **Refund Processing** | Request → Review → Process → Notify | [refund-process.md](./processes/refund-process.md) |
| **Dispute Handling** | Chargeback → Investigation → Resolution | [dispute-handling.md](./processes/dispute-handling.md) |
| **Support Workflow** | Ticket → Triage → Resolve → Close | [support-workflow.md](./processes/support-workflow.md) |

---

## Troubleshooting

### Payment Issues
| Issue | Document |
|-------|----------|
| Payment failed | [failed-payment.md](./troubleshooting/payment/failed-payment.md) |
| Duplicate charge | [duplicate-charge.md](./troubleshooting/payment/duplicate-charge.md) |
| Coupon not working | [coupon-issues.md](./troubleshooting/payment/coupon-issues.md) |
| Refund not received | [refund-delay.md](./troubleshooting/payment/refund-delay.md) |

### Device Issues
| Issue | Document |
|-------|----------|
| Can't connect | [connection-failed.md](./troubleshooting/device/connection-failed.md) |
| Device offline | [device-offline.md](./troubleshooting/device/device-offline.md) |
| Slow connection | [slow-connection.md](./troubleshooting/device/slow-connection.md) |

### Access Issues
| Issue | Document |
|-------|----------|
| Can't log in | [login-issues.md](./troubleshooting/access/login-issues.md) |
| 2FA not working | [2fa-issues.md](./troubleshooting/access/2fa-issues.md) |
| Access revoked | [access-revoked.md](./troubleshooting/access/access-revoked.md) |

---

## Reference

| Reference | Description |
|-----------|-------------|
| [Pricing](./reference/pricing.md) | Plans, prices, discounts |
| [Error Codes](./reference/error-codes.md) | API error reference |
| [Device Status](./reference/device-status.md) | Device state definitions |
| [Order Status](./reference/order-status.md) | Order state definitions |
| [Subscription Status](./reference/subscription-status.md) | Subscription states |
| [Glossary](./GLOSSARY.md) | Term definitions |

---

## For AI Agents (Mastra)

### Agent Types

| Agent | Purpose | Docs Filter |
|-------|---------|-------------|
| **Customer Support** | Answer questions, troubleshoot | `audience: customer-support` |
| **Internal Ops** | Manage platform operations | `audience: internal-ops` |
| **Sales** | Pre-sales, onboarding | `audience: sales` |

### Loading Documentation

```yaml
# Customer Support Agent
load_docs:
  filters:
    audience: [customer-support, ai-agent]
    type: [feature, troubleshooting, reference]
  priority:
    - troubleshooting/*
    - features/client/*
    - reference/*

# Internal Ops Agent
load_docs:
  filters:
    audience: [internal-ops, ai-agent]
    type: all
  priority:
    - processes/*
    - guides/admin/*
    - api/admin/*

# Sales Agent
load_docs:
  filters:
    audience: [sales, ai-agent]
    type: [feature, reference]
  priority:
    - reference/pricing.md
    - features/subscription/*
    - features/device/*
```

### Key Files for Agents

| Agent | Must-Load Files |
|-------|-----------------|
| All | `GLOSSARY.md`, `reference/pricing.md` |
| Support | `troubleshooting/*`, `features/client/*` |
| Ops | `processes/*`, `guides/admin/*` |
| Sales | `reference/pricing.md`, `features/subscription/*` |

---

## Documentation Maintenance

### Adding New Documentation

1. Follow [DOCUMENTATION_STANDARD.md](./DOCUMENTATION_STANDARD.md)
2. Use correct frontmatter
3. Add to this INDEX.md
4. Test AI agent loading

### Updating Documentation

1. Update `last_updated` in frontmatter
2. Increment version if major change
3. Note changes in doc changelog

---

## Quick Links

- **Production Site**: https://www.spear-global.com
- **Admin Dashboard**: https://www.spear-global.com/admin
- **Login**: https://www.spear-global.com/login
- **Support**: https://www.spear-global.com/support

---

*Documentation follows [DOCUMENTATION_STANDARD.md](./DOCUMENTATION_STANDARD.md)*
