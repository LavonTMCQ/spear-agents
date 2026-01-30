# SPEAR System Overview & Critical Information

## 🎯 MISSION CRITICAL SUMMARY

SPEAR is a subscription-based remote access management platform that generates revenue through monthly subscriptions. This document provides essential information for maintaining system integrity and business continuity.

## ⚠️ CRITICAL BUSINESS RULES (DO NOT MODIFY)

### Pricing Structure
```typescript
// REVENUE-CRITICAL PRICING (verified 2024-01-20)
const PRICING = {
  singleUser: {
    regular: 29900,      // $299.00/month
    withSPEARMINT: 19900 // $199.00/month (after $100 discount)
  },
  twoUser: {
    regular: 59800,      // $598.00/month  
    grandfathered: 29800 // $298.00/month (ALL current customers)
  }
};
```

### Admin Access
- **ONLY ADMIN**: `quiseforeverphilly@gmail.com`
- **Admin Dashboard**: `/admin/clients`
- **Test Payments**: `/api/test-payment` (admin only)

### Payment Configuration
```bash
# PayPal Production (LIVE MONEY - DO NOT CHANGE)
PAYPAL_CLIENT_ID=AXclM4bywjg_OwYBbpzek6HcjEo53xu9g7XmDSCDJ9ACnytqsPjAhAOgQmRz-DG7rj1M1cZjzibzlcqC
PAYPAL_CLIENT_SECRET=REPLACE_WITH_PAYPAL_CLIENT_SECRET
PAYPAL_ENVIRONMENT=production
```

## 🏗️ SYSTEM ARCHITECTURE

### Technology Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL (Railway)
- **Payments**: PayPal Production
- **Hosting**: Vercel (spear-global.com)
- **Authentication**: NextAuth.js (database sessions)

### Key Components
```
User Interface → Authentication → Payment Processing → Subscription Management → Device Access Control
```

## 💰 REVENUE PROTECTION SYSTEM

### Subscription Lifecycle
1. **Payment Received** → Subscription Active (30 days)
2. **Payment Due** → Grace Period (7 days)
3. **Payment Overdue** → Device Access Revoked
4. **Admin Intervention** → Manual Resolution

### Affiliate Marketing System
- **Program**: Clients earn $25/month per active referred subscriber
- **Referral Codes**: Format `SPEAR-XXXXXX`, unique per affiliate
- **Commission Trigger**: Only on renewals (not initial payment), first commission after 30+ days
- **7-Day Hold**: Commissions held 7 days before approval (fraud protection)
- **Payout**: $50 minimum, manual PayPal payout by admin
- **Client Dashboard**: `/dashboard/affiliate` (activate, track referrals, view earnings, request payouts)
- **Admin Dashboard**: `/admin/affiliates` (manage affiliates, process payouts, configure settings)
- **Safeguards**: Self-referral blocked, duplicate referral prevention, commission reversal on refunds

### Device Access Control
```typescript
// Business rule: Access tied to payment status
function getDeviceAccess(subscriptionStatus: string): 'active' | 'revoked' {
  switch (subscriptionStatus) {
    case 'active': return 'active';
    case 'past_due': return 'active'; // 7-day grace period
    case 'unpaid':
    case 'cancelled': return 'revoked';
    default: return 'revoked'; // Fail secure
  }
}
```

## 🔐 SECURITY ARCHITECTURE

### Authentication Security
- Database sessions (not JWT) for security
- Admin access hardcoded to specific email
- CSRF protection via NextAuth.js
- Secure password hashing (bcrypt, 12 rounds)

### Payment Security
- PayPal webhook signature verification
- No credit card data stored locally
- Environment variable protection
- Secure payment processing flow

### Business Model Protection
- Server-side subscription validation
- Automatic access revocation for non-payment
- Admin-controlled device provisioning
- Audit trail for all admin actions

## 📊 ADMIN MONITORING SYSTEM

### Subscription Monitor (`/admin/clients`)
- **Real-time Status**: Active, past due, unpaid, cancelled
- **Payment Verification**: Direct PayPal status checking
- **Device Control**: Revoke/restore access instantly
- **Test System**: Safe payment testing ($0.01-$10.00)

### Key Admin Functions
```typescript
// Critical admin capabilities
- Monitor all customer subscriptions
- Check payment status with PayPal
- Cancel/reactivate subscriptions
- Test payment integration
- View subscription analytics
```

## 🚨 EMERGENCY PROCEDURES

### Payment System Down
1. Check PayPal service status
2. Verify environment variables
3. Test with admin test payment system
4. Check Vercel deployment logs
5. Review recent code changes

### Incorrect Customer Charges
1. Check order records in database
2. Review PayPal transaction details
3. Issue refund through PayPal
4. Update order status
5. Fix underlying pricing issue

### Database Issues
1. Check Railway database status
2. Verify connection string
3. Review recent migrations
4. Restore from backup if needed

## 🧪 TESTING PROCEDURES

### Before Any Deployment
```bash
# 1. Test payment flow
Login as admin → /admin/clients → Test Payments → Create $1.00 test

# 2. Test pricing logic
Single User: $299 → $199 with SPEARMINT ✓
Two User: $598 → $298 grandfathered ✓

# 3. Test mobile interface
Check input visibility on actual mobile devices

# 4. Test admin functions
Verify subscription monitoring and management
```

### Critical Test Cases
- Payment amount accuracy
- Coupon application logic
- Mobile input visibility
- Admin access controls
- Database connectivity
- Webhook processing

## 📁 DOCUMENTATION STRUCTURE

```
docs/
├── README.md                    # Documentation overview
├── SYSTEM_OVERVIEW.md          # This file - critical summary
├── architecture/               # System design
│   ├── overview.md
│   └── database-schema.md
├── systems/                    # Core systems
│   ├── payment-system.md
│   ├── authentication.md
│   └── subscription-management.md
├── api/                        # API documentation
│   └── admin-endpoints.md
├── troubleshooting/            # Problem solving
│   ├── payment-issues.md
│   └── mobile-ui-issues.md
├── deployment/                 # Operations
│   └── environment-setup.md
└── development/                # Developer resources
    └── onboarding.md
```

## 🎯 QUICK REFERENCE

### Essential URLs
- **Production**: https://spear-global.com
- **Admin Dashboard**: https://spear-global.com/admin/clients
- **Health Check**: https://spear-global.com/api/health

### Essential Commands
```bash
# Local development
pnpm dev

# Database management
pnpm db:studio

# Production deployment
vercel --prod

# Environment variables
vercel env ls
```

### Essential Files
- **Payment Logic**: `src/lib/payment/providers/paypal-service.ts`
- **Pricing Config**: `src/lib/payment/types.ts`
- **Admin Dashboard**: `src/app/admin/clients/page.tsx`
- **Database Schema**: `prisma/schema.prisma`
- **Auth Config**: `src/lib/auth.ts`
- **Affiliate Logic**: `src/lib/affiliate/` (commission.ts, referral.ts, utils.ts)
- **Affiliate Client Page**: `src/app/dashboard/affiliate/page.tsx`
- **Affiliate Admin Page**: `src/app/admin/affiliates/page.tsx`

## 🔄 MAINTENANCE SCHEDULE

### Daily
- Monitor subscription status
- Check payment processing
- Review error logs

### Weekly
- Test payment system
- Verify mobile interface
- Check database performance

### Monthly
- Review subscription metrics
- Update documentation
- Security audit
- Backup verification

## 📞 ESCALATION PROCEDURES

### System Outage
1. Check Vercel status
2. Check Railway database
3. Check PayPal service
4. Review recent deployments
5. Rollback if necessary

### Payment Issues
1. Use admin test payment system
2. Check PayPal dashboard
3. Verify environment variables
4. Test with small amounts
5. Contact PayPal support if needed

### Customer Issues
1. Check subscription status in admin dashboard
2. Verify payment history
3. Check device access status
4. Use admin tools to resolve
5. Document resolution

## 🎯 SUCCESS METRICS

### Technical Health
- Payment success rate > 95%
- Page load time < 3 seconds
- Mobile usability score > 90%
- Zero critical security issues

### Business Health
- Monthly recurring revenue growth
- Customer churn rate < 5%
- Support ticket volume
- Device access uptime > 99%

---

## 🚨 FINAL REMINDERS

1. **NEVER modify payment logic without testing**
2. **ALWAYS use admin test payment system first**
3. **BACKUP database before schema changes**
4. **TEST mobile interface on real devices**
5. **VERIFY admin access after auth changes**
6. **DOCUMENT all system modifications**

**This system handles real customer payments and subscriptions. Prioritize stability and data integrity over development speed.**
