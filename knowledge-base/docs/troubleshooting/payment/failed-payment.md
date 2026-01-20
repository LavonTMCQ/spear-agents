---
id: troubleshoot-failed-payment
title: Failed Payment
type: troubleshooting
category: payment
audience: [customer-support, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [payment, failed, declined, paypal, billing]
---

# Failed Payment

## Symptoms
- Customer reports payment was declined
- Customer says "my card was charged but payment failed"
- Customer can't complete checkout
- Email notification about payment failure
- Subscription shows "past_due" status

## Quick Diagnosis
```yaml
check_first: PayPal account balance or linked card
ask_user: "Did you see an error message? What did it say?"
lookup: /admin/orders - search by email, check payment status
```

---

## Causes & Solutions

### Cause 1: Insufficient Funds (Most Common)

**Diagnosis**:
- Customer's PayPal balance or linked card lacks funds
- PayPal may show "declined" reason

**Solution**:
1. Ask customer to verify PayPal balance
2. Suggest adding funds or using different payment method
3. Have them retry checkout

**Customer Message**:
> "It looks like the payment couldn't be completed. Please check your PayPal balance or try a different payment method linked to your PayPal account."

**Prevention**: None (customer-side issue)

---

### Cause 2: PayPal Account Issue

**Diagnosis**:
- Customer's PayPal account has restrictions
- Unverified PayPal account
- PayPal security hold

**Solution**:
1. Ask customer to log into PayPal directly
2. Check for any alerts or verification requirements
3. Resolve PayPal-side issues first
4. Retry payment

**Customer Message**:
> "There may be an issue with your PayPal account. Please log into PayPal.com directly to check for any alerts or verification requirements, then try again."

**Prevention**: None (customer-side issue)

---

### Cause 3: Card Declined by Bank

**Diagnosis**:
- Customer's bank blocked the transaction
- International transaction block
- Fraud prevention trigger

**Solution**:
1. Ask customer to contact their bank
2. Authorize the transaction with bank
3. Or use a different card/PayPal balance
4. Retry payment

**Customer Message**:
> "Your bank may have declined this transaction for security reasons. Please contact your bank to authorize the payment, or try using a different payment method."

**Prevention**: None (bank-side issue)

---

### Cause 4: PayPal Service Outage

**Diagnosis**:
- Multiple customers reporting issues simultaneously
- PayPal API returning errors
- Check PayPal status page

**Solution**:
1. Check [PayPal Status](https://www.paypal-status.com/)
2. If outage, inform customer
3. Ask them to try again later
4. Consider offering alternative (rare)

**Customer Message**:
> "PayPal is currently experiencing some issues. Please wait a few minutes and try again. We apologize for the inconvenience."

**Prevention**: Monitor PayPal status

---

### Cause 5: Duplicate Payment Prevention

**Diagnosis**:
- Customer tried multiple times quickly
- System detected potential duplicate
- Previous attempt may have succeeded

**Solution**:
1. Check `/admin/orders` for successful payments
2. If payment exists, show existing order
3. If no payment, clear browser cache and retry

**Customer Message**:
> "I can see there may have been multiple payment attempts. Let me check if any of them went through..."

**Prevention**: Clear UI feedback on payment status

---

### Cause 6: Expired Session

**Diagnosis**:
- Customer took too long at checkout
- PayPal session expired
- Token became invalid

**Solution**:
1. Refresh the checkout page
2. Start payment process again
3. Complete within PayPal timeout window

**Customer Message**:
> "The payment session may have expired. Please refresh the page and try the checkout process again."

**Prevention**: Add session timeout warnings

---

### Cause 7: Coupon Validation Failed

**Diagnosis**:
- Invalid or expired coupon code
- Coupon already used
- Error during coupon application

**Solution**:
1. Verify coupon code is correct
2. Check if coupon is still active in `/admin/coupons`
3. Try without coupon to isolate issue
4. Apply valid coupon

**Customer Message**:
> "The discount code may be invalid or expired. Please double-check the code, or try completing checkout without the discount to see if that works."

**Prevention**: Clear coupon validation feedback

---

## Admin Actions

### Lookup Payment Status
1. Go to `/admin/orders`
2. Search by customer email
3. Check `paymentStatus` field:
   - `pending` - Payment not completed
   - `completed` - Payment successful
   - `failed` - Payment declined
   - `refunded` - Payment was refunded

### Check PayPal Transaction
1. Log into PayPal Business Dashboard
2. Go to Activity > All Transactions
3. Search by customer email or amount
4. View transaction details and decline reason

### Manual Order Creation (Rare)
If payment went through PayPal but order wasn't created:
1. Verify payment in PayPal
2. Get transaction/capture ID
3. Create order manually in admin
4. Link to existing user

---

## Escalation

If none of the above works:
- **Escalate to**: Admin/Ops team
- **Provide**: Customer email, error message, PayPal transaction ID (if any)
- **SLA**: 24 hours

---

## Quick Response Templates

### Initial Response
> "I'm sorry you're having trouble with your payment. Let me help you figure out what's happening."

### Asking for Details
> "Can you tell me what error message you saw? Also, were you charged on PayPal even though the checkout didn't complete?"

### Resolution Confirmed
> "Great news - I can see your payment went through successfully! You should now have full access. Please try logging in again."

### Need to Retry
> "Based on what I'm seeing, I'd recommend trying the payment again. [Specific guidance based on cause]"

---

## Related Documentation

- [Payment Flow](../../processes/payment-flow.md)
- [Duplicate Charge](./duplicate-charge.md)
- [Coupon Issues](./coupon-issues.md)
- [Refund Process](../../processes/refund-process.md)

---

*Last verified: 2025-01-20*
