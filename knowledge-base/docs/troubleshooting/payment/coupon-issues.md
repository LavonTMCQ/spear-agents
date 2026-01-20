---
id: troubleshoot-coupon-issues
title: Coupon Issues
type: troubleshooting
category: payment
audience: [customer-support, ai-agent]
status: current
last_updated: 2025-01-20
version: 1.0
tags: [coupon, discount, code, payment, checkout]
---

# Coupon Issues

## Symptoms
- Coupon code not accepting at checkout
- "Invalid coupon" error
- Discount not showing in total
- Coupon worked before but not now
- Price doesn't change after applying coupon

## Quick Diagnosis
```yaml
check_first: Is the coupon code spelled correctly?
ask_user: "What coupon code are you trying to use?"
lookup: /admin/coupons - verify coupon exists and is active
```

---

## Causes & Solutions

### Cause 1: Typo in Coupon Code (Most Common)

**Diagnosis**:
- Code doesn't match exactly
- Case sensitivity issue
- Extra spaces

**Solution**:
1. Verify exact coupon code spelling
2. Check for extra spaces before/after
3. Note: Codes are usually case-insensitive, but verify

**Common Codes**:
| Code | Discount | Notes |
|------|----------|-------|
| SPEARMINT | $100 off | General use |
| INSIDER2024 | $289 off | Special promo |

**Customer Message**:
> "Let me verify the coupon code. The code should be entered exactly as shown - SPEARMINT (one word, all caps). Please try entering it again."

**Prevention**: Show coupon code clearly in marketing

---

### Cause 2: Coupon Expired

**Diagnosis**:
- Coupon had an expiration date
- Expiration has passed
- Check `expiresAt` in admin

**Solution**:
1. Check coupon in `/admin/coupons`
2. If expired, inform customer
3. Offer alternative coupon if available

**Customer Message**:
> "I'm sorry, but that coupon code has expired. Let me check if we have any current promotions available for you."

**Prevention**: Clear expiration dates in marketing

---

### Cause 3: Coupon Usage Limit Reached

**Diagnosis**:
- Coupon has max uses
- Limit has been reached
- Check `usageCount` vs `maxUses` in admin

**Solution**:
1. Verify in `/admin/coupons`
2. If limit reached, inform customer
3. Offer alternative or extend limit (admin)

**Customer Message**:
> "That coupon code has reached its usage limit. Let me see if there's another offer we can apply to your order."

**Prevention**: Monitor usage, extend limits proactively

---

### Cause 4: Coupon Already Used by Customer

**Diagnosis**:
- Single-use per customer coupon
- Customer already used it before
- Check order history

**Solution**:
1. Check customer's order history
2. Verify coupon was used previously
3. Explain one-time use policy

**Customer Message**:
> "It looks like you've already used this coupon on a previous order. Unfortunately, this code can only be used once per customer."

**Prevention**: Clear terms on coupon usage

---

### Cause 5: Coupon Not Valid for Selected Plan

**Diagnosis**:
- Coupon restricted to certain plans
- Customer selected different plan
- Check coupon restrictions

**Solution**:
1. Check coupon's applicable plans
2. If restricted, explain which plans it works for
3. Help customer choose applicable plan or proceed without

**Customer Message**:
> "This coupon is valid for [specific plan]. If you'd like to use this discount, you'll need to select that plan. Otherwise, I can help you complete your order without the coupon."

**Prevention**: Clear coupon applicability in marketing

---

### Cause 6: Coupon Code Deactivated

**Diagnosis**:
- Admin disabled the coupon
- Coupon `isActive: false`
- Marketing campaign ended

**Solution**:
1. Check coupon status in admin
2. If deactivated, inform customer
3. Check for replacement promotions

**Customer Message**:
> "I apologize, but that promotion has ended. Let me check if we have any current offers available."

**Prevention**: Update marketing when deactivating coupons

---

### Cause 7: Technical Validation Error

**Diagnosis**:
- System error during validation
- API failure
- Intermittent issue

**Solution**:
1. Ask customer to try again
2. Check server logs if persistent
3. Escalate if continues

**Customer Message**:
> "There seems to be a technical issue. Please try applying the coupon again. If it still doesn't work, let me know and I'll help resolve this."

**Prevention**: Monitor coupon API errors

---

### Cause 8: Coupon Applied But Price Didn't Update

**Diagnosis**:
- UI not refreshing
- Calculation issue
- Display bug

**Solution**:
1. Refresh the checkout page
2. Re-enter coupon
3. Verify final price at PayPal

**Customer Message**:
> "Sometimes the display doesn't update immediately. Please refresh the page and try applying the coupon again. You can also verify the discount when you reach PayPal checkout."

**Prevention**: Improve UI feedback on coupon application

---

## Admin Actions

### Verify Coupon Details
1. Go to `/admin/coupons`
2. Search for the coupon code
3. Check:
   - `isActive`: Should be true
   - `expiresAt`: Not in the past
   - `usageCount` vs `maxUses`: Count below limit
   - `applicablePlans`: Correct plan types

### Create New Coupon
If needed for a customer:
1. Go to `/admin/coupons`
2. Click "Create Coupon"
3. Enter code, amount, restrictions
4. Provide to customer

### Extend/Reactivate Coupon
If coupon should be valid:
1. Find coupon in admin
2. Update `expiresAt` to future date
3. Or set `isActive: true`
4. Save changes

### Check Coupon Usage History
1. Go to `/admin/orders`
2. Filter by coupon code
3. See all orders using that coupon
4. Verify customer's previous usage

---

## Coupon Validation Flow

```
Customer enters code
        ↓
API: POST /api/coupons/validate
        ↓
Check: Code exists?
  No → "Invalid coupon code"
        ↓
Check: Is active?
  No → "Coupon is no longer active"
        ↓
Check: Not expired?
  No → "Coupon has expired"
        ↓
Check: Usage limit?
  Exceeded → "Coupon usage limit reached"
        ↓
Check: Valid for plan?
  No → "Coupon not valid for this plan"
        ↓
Success → Apply discount to total
```

---

## Quick Response Templates

### Initial Response
> "I'm sorry you're having trouble with the coupon code. Let me help you get that working."

### Asking for Code
> "Could you tell me the exact coupon code you're trying to use? I'll check its status for you."

### Code is Valid
> "That coupon should be working. Let's try a few things: First, please refresh the checkout page and enter the code again."

### Code is Invalid/Expired
> "I checked and unfortunately [that code has expired / that code is no longer active / that's not a valid code]. Let me see if there's another promotion I can offer you."

### Offering Alternative
> "While that coupon isn't available, I can offer you [alternative discount] instead. Would you like me to provide that code?"

---

## Related Documentation

- [Pricing Reference](../../reference/pricing.md)
- [Failed Payment Troubleshooting](./failed-payment.md)
- [Payment Flow](../../processes/payment-flow.md)
- [Coupon Validation API](../../api/payment/paypal.md#post-apicouponsvalidate)
