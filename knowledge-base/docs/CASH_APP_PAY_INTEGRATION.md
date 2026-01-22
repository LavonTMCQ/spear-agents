# Cash App Pay Integration Guide for SPEAR

## Executive Summary

This document outlines the options and requirements for integrating Cash App Pay as a payment method for SPEAR subscriptions. Cash App Pay allows customers with Cash App accounts to pay directly from their Cash App balance or linked payment methods.

**Key Benefits:**
- Large user base (50+ million active users in the US)
- Lower friction for Cash App users
- QR code payments (desktop) and in-app approval (mobile)
- Competitive transaction fees (2.75%)

**Limitations:**
- US-only (matches SPEAR's market)
- USD currency only

---

## Integration Options

There are **three main paths** to integrate Cash App Pay:

| Option | Complexity | Time to Implement | Best For |
|--------|-----------|-------------------|----------|
| **1. Stripe Integration** | Low | 1-2 days | Already have Stripe configured |
| **2. Square Web Payments SDK** | Medium | 3-5 days | Want direct Square/Cash App relationship |
| **3. Direct Partner API** | High | 2-4 weeks | Large PSPs, custom requirements |

---

## Option 1: Stripe Integration (Recommended)

Since SPEAR already has Stripe configured as a backup payment provider, this is the **fastest and easiest** path.

### Requirements
- Active Stripe account (US-based)
- Stripe API keys configured
- USD transactions only

### How It Works
1. Customer selects Cash App Pay at checkout
2. **Desktop**: QR code displays, customer scans with Cash App
3. **Mobile**: Customer redirected to Cash App for approval
4. Payment confirmed, customer returned to SPEAR

### Implementation Steps

#### 1. Enable Cash App Pay in Stripe Dashboard
Navigate to **Settings > Payment Methods** and enable "Cash App Pay"

#### 2. Server-Side: Create PaymentIntent

```typescript
// src/lib/payment/stripe-cashapp.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCashAppPaymentIntent(
  amount: number,
  customerId?: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    payment_method_types: ['cashapp'],
    customer: customerId,
    metadata: {
      platform: 'SPEAR',
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}
```

#### 3. Client-Side: Payment Element

```tsx
// src/components/payment/CashAppPayButton.tsx
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CashAppPayForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          paymentMethodOrder: ['cashapp', 'card'],
        }}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg"
      >
        {loading ? 'Processing...' : 'Pay with Cash App'}
      </button>
    </form>
  );
}

export function CashAppPayButton({ amount }: { amount: number }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/stripe/create-cashapp-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  if (!clientSecret) {
    return <div>Loading payment options...</div>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#00D632', // Cash App green
          },
        },
      }}
    >
      <CashAppPayForm clientSecret={clientSecret} />
    </Elements>
  );
}
```

### Stripe Fees for Cash App Pay
- **2.9% + $0.30** per transaction (standard Stripe pricing)
- No additional fees from Cash App when using Stripe

---

## Option 2: Square Web Payments SDK

Cash App is owned by Block (formerly Square), so there's native integration via Square's Web Payments SDK.

### Requirements
- Square Developer account
- Square Application ID and Location ID
- US-based business

### Implementation Steps

#### 1. Install Dependencies

```bash
pnpm add react-square-web-payments-sdk
```

#### 2. Create Square Payment Component

```tsx
// src/components/payment/SquareCashAppPay.tsx
'use client';

import {
  PaymentForm,
  CashAppPay,
} from 'react-square-web-payments-sdk';

interface SquareCashAppPayProps {
  amount: string; // e.g., "199.00"
  onSuccess: (token: string) => void;
  onError: (error: Error) => void;
}

export function SquareCashAppPay({
  amount,
  onSuccess,
  onError,
}: SquareCashAppPayProps) {
  return (
    <PaymentForm
      applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
      locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
      cardTokenizeResponseReceived={async (token) => {
        if (token.status === 'OK' && token.token) {
          onSuccess(token.token);
        } else {
          onError(new Error(token.errors?.[0]?.message || 'Payment failed'));
        }
      }}
      createPaymentRequest={() => ({
        countryCode: 'US',
        currencyCode: 'USD',
        total: {
          amount,
          label: 'SPEAR Subscription',
        },
      })}
    >
      <CashAppPay
        redirectURL={`${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`}
        referenceId={`spear-${Date.now()}`}
      />
    </PaymentForm>
  );
}
```

#### 3. Server-Side: Process Payment

```typescript
// src/app/api/square/create-payment/route.ts
import { Client, Environment } from 'square';
import { randomUUID } from 'crypto';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: Environment.Production,
});

export async function POST(request: Request) {
  const { token, amount, userId } = await request.json();

  try {
    const { result } = await client.paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId: token,
      amountMoney: {
        amount: BigInt(Math.round(amount * 100)),
        currency: 'USD',
      },
      note: `SPEAR Subscription - User ${userId}`,
    });

    return Response.json({
      success: true,
      paymentId: result.payment?.id,
    });
  } catch (error) {
    console.error('Square payment error:', error);
    return Response.json(
      { success: false, error: 'Payment failed' },
      { status: 500 }
    );
  }
}
```

### Square Fees for Cash App Pay
- **2.6% + $0.10** per transaction (in-person)
- **2.9% + $0.30** per transaction (online)

---

## Option 3: Direct Cash App Pay Partner API

This is the most complex option, intended for Payment Service Providers (PSPs) and large e-commerce platforms.

### Requirements for Partnership
1. **Contact Cash App Pay Partner Engineering Team** for approval
2. Provide business details and use case
3. Complete partner onboarding process

### What Cash App Provides After Approval
- Developer account with API credentials
- Client ID (application identifier)
- API Key (client secret)
- Sandbox environment access

### Required Information from You
| Item | Description |
|------|-------------|
| App Display Name | Your brand name shown to customers |
| App Icon | 512x512 PNG for authorization screens |
| SFTP Server Details | For settlement reconciliation reports |
| Bank Account Details | For ACH settlement deposits |

### API Structure

The Partner API consists of three components:

1. **Network API** - Server-to-server payment processing
2. **Management API** - Credential rotation, webhooks, API keys
3. **Pay Kit SDK** - JavaScript frontend components

### Settlement Process
- Cash App settles via ACH batch processing
- Daily reconciliation reports uploaded to your SFTP server
- Net settlement (refunds/disputes reduce payouts)

### When to Choose Direct API
- Processing >$1M/month in payments
- Need custom payment flow control
- Building a payment platform for other merchants
- Require direct relationship with Cash App

---

## Fee Comparison

| Provider | Transaction Fee | Monthly Fee |
|----------|-----------------|-------------|
| Cash App Business (Direct) | 2.75% | $0 |
| Via Stripe | 2.9% + $0.30 | $0 |
| Via Square | 2.9% + $0.30 | $0 |
| PayPal (current) | 2.9% + $0.49 | $0 |

**Note:** At SPEAR's $199/month subscription:
- Cash App Direct: $5.47 per transaction
- Via Stripe: $6.07 per transaction
- PayPal: $6.26 per transaction

---

## Recommended Approach for SPEAR

### Phase 1: Stripe Integration (Immediate)
1. Enable Cash App Pay in Stripe Dashboard
2. Add Cash App Pay as payment option at checkout
3. Test in Stripe test mode
4. Deploy to production

**Estimated effort:** 1-2 days

### Phase 2: Evaluate Direct Integration (Future)
Once SPEAR reaches significant transaction volume (>$50k/month), evaluate:
- Direct Cash App Business account for lower fees
- Square integration for Block ecosystem benefits

---

## Testing Cash App Pay

### Stripe Test Mode
- Use Stripe test API keys
- Cash App Pay shows approval/decline simulation page
- No real Cash App account needed

### Square Sandbox
- Use sandbox credentials from Square Developer Dashboard
- Scan QR codes with smartphone camera (not Cash App)
- Approve via sandbox web portal

### Direct API Sandbox
- Download Cash App Sandbox app
- Use test credentials provided by Cash App
- QR codes rotate every 30 seconds

---

## Security Considerations

1. **Never expose API keys client-side**
2. **Verify webhook signatures** for payment confirmations
3. **Store payment tokens securely** (encrypted at rest)
4. **Implement idempotency keys** to prevent duplicate charges
5. **Handle chargebacks** - Cash App disputes work like credit card chargebacks

---

## Environment Variables Needed

### For Stripe Integration
```env
# Add to existing Stripe config
STRIPE_SECRET_KEY=REPLACE_WITH_STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### For Square Integration
```env
SQUARE_ACCESS_TOKEN=xxx
NEXT_PUBLIC_SQUARE_APP_ID=xxx
NEXT_PUBLIC_SQUARE_LOCATION_ID=xxx
```

### For Direct API
```env
CASHAPP_CLIENT_ID=xxx
CASHAPP_API_KEY=xxx
CASHAPP_ENVIRONMENT=production
```

---

## Next Steps

1. **Decide on integration path** (Stripe recommended for speed)
2. **Set up Cash App Business account** at [cash.app/business](https://cash.app/business)
3. **Enable Cash App Pay** in chosen payment processor
4. **Implement checkout integration**
5. **Test thoroughly** before production launch

---

## Resources

### Official Documentation
- [Cash App Pay Partner API](https://developers.cash.app/cash-app-pay-partner-api/guides/welcome)
- [Cash App Pay Integration Basics](https://developers.cash.app/cash-app-pay-partner-api/guides/technical-guides/cash-app-pay-integration-basics)
- [Partner Onboarding Requirements](https://developers.cash.app/cash-app-pay-partner-api/guides/partnerships/partner-onboarding-requirements)

### Payment Processor Docs
- [Stripe - Cash App Pay](https://docs.stripe.com/payments/cash-app-pay/accept-a-payment)
- [Square - Add Cash App Pay](https://developer.squareup.com/docs/web-payments/add-cash-app-pay)
- [React Square Web Payments SDK](https://react-square-payments.weareseeed.com/docs/cash-app-pay/usage)

### Business Resources
- [Cash App for Business](https://cash.app/help/us/en-us/6502-what-is-cash-for-business)
- [Cash App Business Fees Guide](https://www.hostmerchantservices.com/articles/cash-app-business-account-fee/)
- [Cash App Business Review](https://www.merchantmaverick.com/reviews/square-cash-app-review/)

---

*Document created: January 2025*
*Last updated: January 2025*
