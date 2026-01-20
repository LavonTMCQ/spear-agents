---
id: glossary
title: SPEAR Glossary
type: reference
category: system
audience: [customer-support, internal-ops, sales, admin, developer, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
---

# SPEAR Glossary

> Standardized definitions for all SPEAR terminology. Use these exact definitions for consistency.

---

## A

### Active (Device Status)
A device that is online, assigned to a customer, and available for remote connection.

### Active (Subscription Status)
A subscription with a valid payment and not past the current billing period end date.

### Admin
A user with the ADMIN role. Currently only `quiseforeverphilly@gmail.com`. Has full platform access.

### Assigned (Device Status)
A device that has been linked to a customer order but may not yet be shipped.

---

## B

### Billing Cycle
The recurring payment period. SPEAR uses **monthly** billing cycles.

### BYOD (Bring Your Own Device)
A subscription option where customers use their own device instead of receiving one from SPEAR. Lower monthly cost ($100/month for founders).

---

## C

### Capture (Payment)
The act of collecting funds from a customer's PayPal account after they approve a payment. Distinct from authorization.

### Chargeback
A payment dispute initiated by the customer through their bank or PayPal. Also called a **Dispute**.

### Clerk
Third-party authentication service used for Google and Apple social login.

### Client
A user with the CLIENT role. Regular customers who have subscriptions and devices.

### Coupon
A discount code that reduces the subscription price. Examples: SPEARMINT ($100 off), INSIDER2024 ($289 off).

### Current Period End
The date when the current billing period ends and renewal payment is due.

---

## D

### Dashboard (Admin)
The administrative interface at `/admin` for managing the platform.

### Dashboard (Client)
The customer interface at `/dashboard` for viewing devices and subscription.

### Delivered (Order Status)
An order where the device has been confirmed delivered to the customer.

### Device
A physical device (usually Samsung Galaxy A14) managed through the SPEAR platform.

### Device Prep (Order Status)
Initial order status where the device is being prepared for assignment.

### Dispute
A PayPal chargeback or payment contestation. Managed at `/admin/disputes`.

### Dunning
The process of attempting to collect failed payments through retry attempts.

---

## E

### Emergency Admin Access
A hardcoded bypass allowing the admin email to access the system even if normal authentication fails.

---

## F

### Founder's Tier
Special pricing available to early customers. Locked at $100/month for BYOD or $200 first month + $100/month for device included.

### Fulfillment
The process of preparing and shipping an order to a customer.

---

## G

### Grace Period
A 7-day period after a failed payment before subscription access is revoked.

### Grandfathered
Legacy pricing or features preserved for existing customers when pricing changes.

---

## I

### Inactive (Device Status)
A device that exists in the system but is not currently active or available.

### Inactive (Subscription Status)
A subscription that has been cancelled or expired.

---

## M

### MRR (Monthly Recurring Revenue)
Total predictable monthly revenue from all active subscriptions.

---

## N

### NextAuth
The authentication library used for email/password login and session management.

---

## O

### Offline (Device Status)
A device that is assigned but not currently connected to the RustDesk network.

### Order
A record of a customer purchase, including payment details and fulfillment status.

### Order Status
The current stage of an order in the fulfillment pipeline: `device_prep` → `device_assigned` → `shipped` → `delivered` → `connected` → `active`

---

## P

### Past Due (Subscription Status)
A subscription where payment has failed but is within the grace period.

### PayPal
The primary payment processor for SPEAR subscriptions.

### Pending (Device Status)
A device that has been added to the system but not yet configured or assigned.

---

## R

### Refund
A return of payment to a customer, processed through PayPal.

### Remote Access
The ability to view and control a device from a different location using RustDesk.

### RustDesk
Open-source remote desktop software used by SPEAR for device connections.

### RustDesk ID
The unique identifier for a device in the RustDesk system.

---

## S

### Session
An authenticated user login period, managed by NextAuth with database sessions.

### Shipped (Order Status)
An order where the device has been sent to the customer with tracking.

### SPEAR
**S**ecure **P**latform for **E**xtended **A**ugmented **R**eality. The product name.

### Subscription
A recurring billing agreement giving access to SPEAR services and device management.

### Subscription Status
The current state of a subscription: `active`, `past_due`, `cancelled`, `inactive`, `trialing`

---

## T

### Tracking Number
The shipping carrier's tracking identifier for a shipped device.

### Trialing (Subscription Status)
A subscription in a trial period (if applicable).

### Two-Factor Authentication (2FA)
An additional security layer using TOTP codes. Required for admin access.

---

## U

### Unattended Access
A RustDesk configuration allowing connection without manual approval on the device.

---

## W

### Webhook
An automated HTTP callback triggered by events (e.g., PayPal payment completion).

---

## Status Code Quick Reference

### Device Status Codes
| Status | Meaning |
|--------|---------|
| `pending` | Not yet configured |
| `active` | Online and available |
| `inactive` | Not currently active |
| `offline` | Not connected to network |
| `available` | Ready for assignment |
| `assigned` | Linked to customer |
| `shipped` | In transit |
| `delivered` | Received by customer |

### Order Status Codes
| Status | Meaning |
|--------|---------|
| `device_prep` | Preparing device |
| `device_assigned` | Device linked to order |
| `shipped` | In transit |
| `delivered` | Customer received |
| `connected` | First connection made |
| `active` | Fully operational |

### Subscription Status Codes
| Status | Meaning |
|--------|---------|
| `active` | Paid and valid |
| `past_due` | Payment failed, in grace period |
| `cancelled` | Customer cancelled |
| `inactive` | Expired or terminated |
| `trialing` | In trial period |

### Payment Status Codes
| Status | Meaning |
|--------|---------|
| `pending` | Awaiting payment |
| `completed` | Payment successful |
| `failed` | Payment failed |
| `refunded` | Payment returned |
| `disputed` | Under dispute |

---

## Pricing Quick Reference

### Current Plans

| Plan | Monthly | Notes |
|------|---------|-------|
| Founder's BYOD | $100 | Bring your own device |
| Founder's Device | $200 first, then $100 | Device included |
| Standard | $299 | With SPEARMINT coupon: $199 |

### Active Coupons

| Code | Discount | Notes |
|------|----------|-------|
| SPEARMINT | $100 off | General discount |
| INSIDER2024 | $289 off | Special promo |

---

*Use these definitions consistently across all documentation and communications.*
