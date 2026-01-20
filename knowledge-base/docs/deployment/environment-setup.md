# SPEAR Environment Setup Documentation

## Overview

SPEAR uses multiple environments for development, staging, and production. This document covers environment variable configuration, deployment procedures, and environment-specific considerations.

## Environment Architecture

```
Development (Local)     →  Staging (Vercel Preview)  →  Production (Vercel)
├── Local PostgreSQL    │  ├── Railway Database      │  ├── Railway Database
├── PayPal Sandbox      │  ├── PayPal Sandbox        │  ├── PayPal Production
└── Local Auth          │  └── Preview Auth          │  └── Production Auth
```

## Production Environment

### ⚠️ CRITICAL PRODUCTION CONFIGURATION

**Domain**: `spear-global.com`
**Hosting**: Vercel
**Database**: Railway PostgreSQL
**Payments**: PayPal Production

### Production Environment Variables

```bash
# Authentication
NEXTAUTH_SECRET=production-secret-key-here
NEXTAUTH_URL=https://spear-global.com

# Database (Railway Production)
DATABASE_URL=postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway

# PayPal Production (DO NOT CHANGE)
PAYPAL_CLIENT_ID=AXclM4bywjg_OwYBbpzek6HcjEo53xu9g7XmDSCDJ9ACnytqsPjAhAOgQmRz-DG7rj1M1cZjzibzlcqC
PAYPAL_CLIENT_SECRET=EIPpyba0p0N6aGPGWydTuQYPKZH8n7RhYA3-rQtRokeaUMrBO3cAlyh0DB38xF1Bl0jiaK9z3dneW0Wk
PAYPAL_ENVIRONMENT=production

# Optional: Webhook configuration
PAYPAL_WEBHOOK_ID=webhook-id-from-paypal-dashboard
```

### Setting Production Environment Variables

```bash
# Using Vercel CLI
vercel env add PAYPAL_CLIENT_ID production
# Enter the production client ID when prompted

vercel env add PAYPAL_CLIENT_SECRET production
# Enter the production client secret when prompted

vercel env add PAYPAL_ENVIRONMENT production
# Enter "production" when prompted

# Verify environment variables
vercel env ls
```

## Development Environment

### Local Development Setup

```bash
# Required for local development
NEXTAUTH_SECRET=local-development-secret
NEXTAUTH_URL=http://localhost:3000

# Database options
# Option 1: Use production database (read-only recommended)
DATABASE_URL=postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway

# Option 2: Local PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/spear_dev

# PayPal Sandbox for testing
PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-sandbox-client-secret
PAYPAL_ENVIRONMENT=sandbox
```

### Development Environment File

Create `.env.local`:

```bash
# Copy from template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

## Staging Environment

### Vercel Preview Deployments

**Purpose**: Test changes before production
**Database**: Railway (same as production)
**Payments**: PayPal Sandbox

```bash
# Staging environment variables
NEXTAUTH_SECRET=staging-secret-key
NEXTAUTH_URL=https://spear-production-preview-branch.vercel.app

# Database (same as production for data consistency)
DATABASE_URL=postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway

# PayPal Sandbox for safe testing
PAYPAL_CLIENT_ID=sandbox-client-id
PAYPAL_CLIENT_SECRET=sandbox-client-secret
PAYPAL_ENVIRONMENT=sandbox
```

## Environment Variable Management

### Security Best Practices

1. **Never Commit Secrets**: Use `.env.local` for local development
2. **Use Different Keys**: Each environment should have unique secrets
3. **Rotate Regularly**: Update secrets periodically
4. **Limit Access**: Only necessary team members should have access

### Environment Variable Validation

```typescript
// src/lib/env.ts - Environment validation
const requiredEnvVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'DATABASE_URL',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'PAYPAL_ENVIRONMENT'
];

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Validate PayPal environment
  if (!['sandbox', 'production'].includes(process.env.PAYPAL_ENVIRONMENT!)) {
    throw new Error('PAYPAL_ENVIRONMENT must be "sandbox" or "production"');
  }
}
```

## Database Configuration

### Railway PostgreSQL

**Production Database**:
- **Host**: `gondola.proxy.rlwy.net`
- **Port**: `31227`
- **Database**: `railway`
- **User**: `postgres`
- **Password**: `MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh`

### Connection String Format

```bash
# Standard PostgreSQL connection string
postgresql://[user]:[password]@[host]:[port]/[database]

# SPEAR production example
postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway
```

### Database Environment Considerations

```typescript
// Prisma configuration for different environments
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
```

## PayPal Configuration

### Production PayPal Setup

**Account**: SPEAR Business Account
**Environment**: Production
**Webhook URL**: `https://spear-global.com/api/paypal/webhook`

**Required PayPal Configuration**:
1. Business account verified
2. Webhook endpoint configured
3. Payment capture enabled
4. Subscription products created

### Sandbox PayPal Setup

**Purpose**: Development and testing
**Environment**: Sandbox
**Webhook URL**: `https://your-preview-url.vercel.app/api/paypal/webhook`

```bash
# Sandbox credentials (example)
PAYPAL_CLIENT_ID=sandbox-client-id-here
PAYPAL_CLIENT_SECRET=sandbox-client-secret-here
PAYPAL_ENVIRONMENT=sandbox
```

## Deployment Procedures

### Production Deployment

```bash
# 1. Ensure all changes are tested
pnpm build
pnpm test

# 2. Commit and push to main branch
git add .
git commit -m "feat: description of changes"
git push origin main

# 3. Deploy to production
vercel --prod

# 4. Verify deployment
curl https://spear-global.com/api/health
```

### Environment-Specific Deployment

```bash
# Deploy to preview (staging)
vercel

# Deploy specific branch to preview
vercel --target preview

# Deploy to production
vercel --prod
```

## Health Checks and Monitoring

### Environment Health Check

```typescript
// src/app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check PayPal configuration
    const paypalConfigured = !!(
      process.env.PAYPAL_CLIENT_ID &&
      process.env.PAYPAL_CLIENT_SECRET &&
      process.env.PAYPAL_ENVIRONMENT
    );
    
    // Check authentication
    const authConfigured = !!(
      process.env.NEXTAUTH_SECRET &&
      process.env.NEXTAUTH_URL
    );
    
    return NextResponse.json({
      status: 'healthy',
      environment: process.env.NODE_ENV,
      paypal: paypalConfigured,
      auth: authConfigured,
      database: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
```

### Monitoring Commands

```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Check build status
vercel inspect [deployment-url]

# Test health endpoint
curl https://spear-global.com/api/health
```

## Troubleshooting Environment Issues

### Common Environment Problems

1. **Missing Environment Variables**:
```bash
# Check if variables are set
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME production
```

2. **Database Connection Issues**:
```bash
# Test database connection
npx prisma db pull

# Check connection string format
echo $DATABASE_URL
```

3. **PayPal Configuration Issues**:
```bash
# Verify PayPal environment
echo $PAYPAL_ENVIRONMENT

# Test PayPal API connection
curl -X POST https://api.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -u "$PAYPAL_CLIENT_ID:$PAYPAL_CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

### Environment Debugging

```typescript
// Add environment debugging (remove in production)
console.log('Environment check:', {
  nodeEnv: process.env.NODE_ENV,
  nextAuthUrl: process.env.NEXTAUTH_URL,
  paypalEnv: process.env.PAYPAL_ENVIRONMENT,
  databaseConfigured: !!process.env.DATABASE_URL,
  timestamp: new Date().toISOString()
});
```

## Security Considerations

### Environment Security

1. **Secret Rotation**: Regularly update secrets
2. **Access Control**: Limit who can view/modify environment variables
3. **Audit Trail**: Log environment variable changes
4. **Backup**: Keep secure backup of environment configurations

### Production Security Checklist

- [ ] All secrets are unique and strong
- [ ] PayPal production credentials are correct
- [ ] Database connection is secure (SSL)
- [ ] NEXTAUTH_SECRET is cryptographically secure
- [ ] No development secrets in production
- [ ] Environment variables are not logged
- [ ] Webhook URLs use HTTPS

## Migration Procedures

### Environment Migration

```bash
# 1. Export current environment
vercel env pull .env.backup

# 2. Update environment variables
vercel env add NEW_VARIABLE production

# 3. Remove old variables
vercel env rm OLD_VARIABLE production

# 4. Redeploy to apply changes
vercel --prod
```

### Database Migration

```bash
# 1. Backup current database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# 2. Apply schema changes
npx prisma migrate deploy

# 3. Verify migration
npx prisma db pull
```

---

**CRITICAL REMINDER**: Always backup environment configurations and test changes in staging before applying to production. Environment misconfigurations can cause system outages.
