# SPEAR Railway & Vercel Deployment Guide

## Overview

This guide provides instructions for deploying the SPEAR application using Railway for the database and Vercel for the frontend. This is a legacy deployment guide - current production uses Railway PostgreSQL with Vercel hosting.

## ⚠️ Current Production Status

**Current Production Setup:**
- **Frontend**: Vercel (spear-global.com)
- **Database**: Railway PostgreSQL
- **Payments**: PayPal Production
- **Domain**: spear-global.com

**This guide is for reference only. See [Environment Setup](environment-setup.md) for current deployment procedures.**

## Prerequisites

- Railway account
- Vercel account
- PostgreSQL database on Railway
- PayPal production account
- Admin access credentials

## Database Configuration

### Railway PostgreSQL (Current Production)

**Connection Details:**
- Host: gondola.proxy.rlwy.net
- Port: 31227
- Username: postgres
- Password: MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh
- Database: railway
- Connection URL: postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway

## Environment Variables

### Required for Production

```bash
# Authentication
NEXTAUTH_SECRET=REPLACE_WITH_NEXTAUTH_SECRET
NEXTAUTH_URL=https://spear-global.com

# Database
DATABASE_URL=postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway

# PayPal Production
PAYPAL_CLIENT_ID=AXclM4bywjg_OwYBbpzek6HcjEo53xu9g7XmDSCDJ9ACnytqsPjAhAOgQmRz-DG7rj1M1cZjzibzlcqC
PAYPAL_CLIENT_SECRET=REPLACE_WITH_PAYPAL_CLIENT_SECRET
PAYPAL_ENVIRONMENT=production
```

### Generate NEXTAUTH_SECRET

```bash
node scripts/generate-nextauth-secret.js
```

## Deployment Steps

### 1. Vercel Frontend Deployment

1. Create new project on Vercel
2. Connect GitHub repository
3. Configure environment variables (see above)
4. Deploy application

### 2. Database Migrations

After deployment, run database migrations:

```bash
# Using Vercel CLI
vercel run npx prisma migrate deploy

# Or using Railway CLI
railway run npx prisma migrate deploy
```

### 3. Verification

1. Run environment verification:
   ```bash
   node scripts/verify-env-vars.js
   ```

2. Test application functionality:
   - Admin access (quiseforeverphilly@gmail.com)
   - Payment processing
   - Subscription management
   - Mobile interface

## Configuration Files

### Vercel Configuration (vercel.json)

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### Railway Configuration (railway.json)

```json
{
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

## Troubleshooting

### Database Connection Issues

1. Verify DATABASE_URL environment variable
2. Check database accessibility
3. Ensure schema migrations are applied
4. Test connection with Prisma Studio

### Payment Integration Issues

1. Verify PayPal credentials in Vercel environment
2. Check PayPal account status and permissions
3. Test with admin test payment system
4. Review webhook configuration

### Authentication Issues

1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches deployment domain
3. Test admin access with correct email
4. Verify session configuration

## Maintenance

### Database Backups

Railway automatically creates backups. Manual backup:

```bash
railway run pg_dump -U postgres -d railway > backup.sql
```

### Monitoring

- Use Vercel analytics for frontend monitoring
- Use Railway metrics for database monitoring
- Monitor PayPal webhook delivery
- Track payment success rates

## Security Considerations

1. **Environment Variables**: Secure all sensitive variables
2. **HTTPS**: Ensure all production traffic uses HTTPS
3. **API Keys**: Regularly rotate PayPal credentials
4. **Access Control**: Maintain proper admin/user separation
5. **Database**: Use connection pooling and SSL

## Migration from Legacy Setup

### Previous Configuration (Reference)

**Legacy Environment Variables:**
```bash
# Old RustDesk configuration (no longer used)
RUSTDESK_ANDROID_DEVICE_ID=1681512408
RUSTDESK_ANDROID_PASSWORD=REPLACE_WITH_RUSTDESK_ANDROID_PASSWORD

# Old Stripe configuration (replaced by PayPal)
STRIPE_SECRET_KEY=REPLACE_WITH_STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Migration Notes

1. **Payment System**: Migrated from Stripe to PayPal
2. **Remote Access**: Using RustDesk Pro server
3. **Pricing**: Updated to current structure ($299→$199 SPEARMINT)
4. **Admin System**: Centralized to single admin account

## Current vs Legacy

### Current Production (2024)
- **Database**: Railway PostgreSQL
- **Frontend**: Vercel (spear-global.com)
- **Payments**: PayPal Production
- **Admin**: quiseforeverphilly@gmail.com
- **Pricing**: $299/$199 single-user, $298 grandfathered two-user

### Legacy Setup (Reference)
- **Database**: Railway PostgreSQL
- **Frontend**: Vercel (spear-app.vercel.app)
- **Payments**: Stripe/Square (deprecated)
- **Remote Access**: RustDesk Pro
- **Pricing**: $350 basic, $300 additional device

---

**Note**: This guide is maintained for historical reference. For current deployment procedures, see the [Environment Setup Guide](environment-setup.md) and [System Overview](../SYSTEM_OVERVIEW.md).
