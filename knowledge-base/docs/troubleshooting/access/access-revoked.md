---
id: troubleshoot-access-revoked
title: Access Revoked
type: troubleshooting
category: access
audience: [customer-support, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [access, revoked, subscription, payment, device]
---

# Access Revoked

## Symptoms
- Customer can't connect to their device
- Dashboard shows "Subscription Inactive"
- "Access denied" or "Subscription required" error
- Previously working device connection now fails
- Email notification about access being revoked

## Quick Diagnosis
```yaml
check_first: Subscription status in /admin/clients
ask_user: "Have you received any emails about your subscription recently?"
lookup: Check subscription.status and currentPeriodEnd
```

---

## Causes & Solutions

### Cause 1: Subscription Expired (Payment Failed)

**Diagnosis**:
- Subscription status is `inactive`
- Payment failed and grace period ended
- Check order history for failed payments

**Solution**:
1. Confirm payment failure in admin
2. Explain grace period has ended
3. Help customer update payment method
4. Process new payment to restore access

**Timeline**:
```
Day 0: Payment failed
Day 1-7: Grace period (access maintained)
Day 7+: Access revoked
```

**Customer Message**:
> "I see that your recent payment didn't go through, and after the 7-day grace period, access was paused. Let's get your payment method updated so we can restore your access right away."

**Resolution**:
1. Customer updates PayPal
2. New payment processed
3. Subscription reactivated
4. Device access restored immediately

---

### Cause 2: Subscription Cancelled

**Diagnosis**:
- Subscription status is `cancelled`
- Customer requested cancellation
- `cancelledAt` date has passed

**Solution**:
1. Verify cancellation in admin
2. Confirm this was customer's intent
3. Offer reactivation if they want to return

**Customer Message**:
> "I can see your subscription was cancelled and has now ended. If you'd like to continue using SPEAR, I can help you set up a new subscription."

**Resolution**:
1. Customer decides to resubscribe
2. Process new payment
3. Create new subscription
4. Access restored

---

### Cause 3: Admin Revoked Access

**Diagnosis**:
- Status changed by admin
- Possible fraud/abuse case
- Check audit logs for reason

**Solution**:
1. Review audit logs
2. Understand reason for revocation
3. If legitimate customer, investigate
4. Escalate if unclear

**Customer Message** (if legitimate):
> "I see there's a note on your account. Let me look into this and get back to you."

**Customer Message** (if fraud confirmed):
> "I apologize, but there's an issue with your account that prevents us from continuing service. Please contact support for more information."

---

### Cause 4: Technical Sync Issue

**Diagnosis**:
- Subscription shows active in admin
- But device access isn't working
- Possible sync issue between systems

**Solution**:
1. Verify subscription is truly active
2. Check device assignment
3. Force sync RustDesk status
4. Manually restore if needed

**Customer Message**:
> "I see your subscription is active. There seems to be a technical issue. Let me fix this for you - it should just take a moment."

**Resolution**:
1. Admin forces sync
2. Verifies device assignment
3. Tests connection
4. Confirms with customer

---

### Cause 5: Grace Period Ended Today

**Diagnosis**:
- Access was just revoked (within 24 hours)
- Payment failed 7 days ago
- Customer may not have seen warnings

**Solution**:
1. Explain the timeline
2. Offer immediate restoration with payment
3. Can extend grace if requested (admin)

**Customer Message**:
> "It looks like your access was just paused today after the payment grace period ended. If you update your payment method now, we can restore your access immediately."

---

## Restoration Process

### For Payment Issues

1. **Verify Identity**: Confirm customer owns account
2. **Update Payment**: Guide to PayPal update
3. **Process Payment**: Charge for new period
4. **Restore Access**: Subscription → active
5. **Confirm**: Test device connection

### For Errors

1. **Verify Subscription**: Check should be active
2. **Check Device**: Verify assignment
3. **Sync Systems**: Force RustDesk sync
4. **Restore Access**: Manual if needed
5. **Test**: Confirm customer can connect

---

## Admin Actions

### Check Full Status
```
1. /admin/clients → Find customer
2. View:
   - Subscription status
   - Last payment date
   - Current period end
   - Any notes
```

### Review Audit Log
```
1. /admin/audit-logs
2. Filter by user ID
3. Check for:
   - cancellation
   - payment_failed
   - manual_revoke
```

### Restore Access Manually
```
1. /admin/clients → Find customer
2. Edit subscription
3. Set status = "active"
4. Extend currentPeriodEnd if needed
5. Save (requires payment or override)
```

### Extend Grace Period
```
1. /admin/clients → Find customer
2. If past_due, can extend before revocation
3. Add days to current period
4. Document reason
```

---

## Prevention Messages

For customers with failing payments, proactive communication:

**Day 1** (Payment Failed):
> "Your recent payment didn't go through. Please update your payment method to avoid any interruption to your service."

**Day 4** (Mid-Grace):
> "Reminder: Your payment is still pending. You have 3 days to update your payment method before access is paused."

**Day 6** (Final Warning):
> "Final notice: Your access will be paused tomorrow if payment isn't updated. Please update now to keep your devices connected."

---

## Quick Response Templates

### Initial Response
> "I understand you're having trouble accessing your device. Let me look into your account right away."

### Payment Issue Found
> "I see that your payment didn't process and the grace period has ended. The good news is we can restore your access as soon as we update your payment method. Would you like to do that now?"

### Cancellation Found
> "It looks like your subscription was cancelled and has now ended. If you'd like to start using SPEAR again, I can help you set up a new subscription."

### Technical Issue
> "Your subscription is active, so this looks like a technical issue on our end. Let me fix this for you right now."

### Successful Restoration
> "Great news - your access has been restored! You should be able to connect to your device now. Please try connecting and let me know if you have any issues."

---

## Escalation

If access revocation reason is unclear:
- **Escalate to**: Ops/Admin team
- **Provide**:
  - Customer email
  - Subscription status
  - Audit log findings
  - Customer's claim
- **SLA**: 4 hours

---

## Related Documentation

- [Subscription Lifecycle](../../processes/subscription-lifecycle.md)
- [Failed Payment Troubleshooting](../payment/failed-payment.md)
- [Subscription Management](../../features/subscription/management.md)
- [Device Connection Issues](../device/connection-failed.md)
