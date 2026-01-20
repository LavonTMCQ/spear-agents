# SPEAR Technical Documentation

## Overview

SPEAR is a remote access management application that provides secure device access through a subscription-based business model. This documentation system preserves critical institutional knowledge and ensures system integrity.

## Documentation Structure

```
docs/
├── README.md                    # This file - documentation overview
├── SYSTEM_OVERVIEW.md          # Mission-critical system summary
├── architecture/                # System architecture and design
│   ├── overview.md             # High-level system architecture
│   ├── database-schema.md      # Database design and relationships
│   └── application-flowchart.md # Application structure flowchart
├── systems/                    # Core system documentation
│   ├── payment-system.md       # PayPal integration and pricing
│   ├── authentication.md       # Auth system and user roles
│   └── subscription-management.md # Subscription lifecycle
├── api/                        # API documentation
│   └── admin-endpoints.md      # Admin-only API endpoints
├── deployment/                 # Deployment and operations
│   ├── environment-setup.md    # Environment variables and config
│   ├── railway-vercel-deployment.md # Railway/Vercel deployment
│   └── rustdesk-deployment.md  # RustDesk server deployment
├── troubleshooting/            # Common issues and solutions
│   ├── payment-issues.md       # Payment-related problems
│   ├── mobile-ui-issues.md     # Mobile interface problems
│   └── railway-issues.md       # Railway database troubleshooting
└── development/                # Developer resources
    └── onboarding.md          # New developer setup and guidelines
```

## Critical System Overview

### Business Model
- **Single User Plan**: $299/month → $199/month with SPEARMINT coupon
- **Two User Bundle**: $598/month → $298/month (grandfathered for early customers)
- **Admin Control**: Complete subscription and device access management

### Technology Stack
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL on Railway
- **Payments**: PayPal production integration
- **Deployment**: Vercel with custom domain (spear-global.com)
- **Authentication**: NextAuth.js with database sessions

### Key Integrations
- **PayPal**: Production payment processing with webhooks
- **Railway**: PostgreSQL database hosting
- **Vercel**: Application hosting and deployment
- **RustDesk**: Remote access infrastructure (future integration)

## Quick Reference

### Admin Access
- **Admin Email**: `quiseforeverphilly@gmail.com`
- **Admin Dashboard**: `/admin`
- **Subscription Monitor**: `/admin/clients`

### Critical Environment Variables
```bash
# PayPal Production
PAYPAL_CLIENT_ID=AXclM4bywjg_OwYBbpzek6HcjEo53xu9g7XmDSCDJ9ACnytqsPjAhAOgQmRz-DG7rj1M1cZjzibzlcqC
PAYPAL_CLIENT_SECRET=EIPpyba0p0N6aGPGWydTuQYPKZH8n7RhYA3-rQtRokeaUMrBO3cAlyh0DB38xF1Bl0jiaK9z3dneW0Wk
PAYPAL_ENVIRONMENT=production

# Database
DATABASE_URL=postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway
```

### Pricing Structure (CRITICAL - DO NOT MODIFY WITHOUT UNDERSTANDING)
```typescript
// Single User Plan
regularPrice: 29900 cents ($299.00)
withSPEARMINT: 19900 cents ($199.00) // $100 discount

// Two User Bundle  
regularPrice: 59800 cents ($598.00)
grandfatheredPrice: 29800 cents ($298.00) // Early customers only
```

## Documentation Principles

1. **Preserve Institutional Knowledge**: Document WHY decisions were made, not just WHAT was implemented
2. **Prevent Breaking Changes**: Clearly mark critical systems and their dependencies
3. **Enable Safe Extension**: Provide patterns and guidelines for adding new features
4. **Facilitate Onboarding**: Make it easy for new developers to understand the system
5. **Maintain Accuracy**: Keep documentation updated with code changes

## Getting Started

1. **New Developers**: Start with [Developer Onboarding](development/onboarding.md)
2. **System Overview**: Read [Architecture Overview](architecture/overview.md)
3. **Critical Systems**: Review [Payment System](systems/payment-system.md) and [Authentication](systems/authentication.md)
4. **Deployment**: Follow [Environment Setup](deployment/environment-setup.md)

## ⚠️ CRITICAL WARNINGS

### DO NOT MODIFY WITHOUT UNDERSTANDING:
- Payment pricing logic in `src/lib/payment/` - affects revenue
- Admin authentication checks - affects security
- Database schema changes - affects data integrity
- Environment variables - affects production functionality

### ALWAYS TEST BEFORE DEPLOYING:
- Payment flows with test payments
- Admin functionality access
- Mobile interface on actual devices
- Database migrations in staging first

## Support and Maintenance

For questions about this documentation or the SPEAR system:
1. Check the troubleshooting guides first
2. Review the specific system documentation
3. Test changes in development environment
4. Use the admin test payment system for payment testing

---

**Last Updated**: 2024-01-20  
**Version**: 1.0  
**Maintainer**: SPEAR Development Team
