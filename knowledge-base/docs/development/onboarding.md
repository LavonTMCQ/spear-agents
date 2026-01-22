# SPEAR Developer Onboarding Guide

## Welcome to SPEAR Development

This guide will help you set up your development environment and understand the SPEAR codebase safely. SPEAR is a subscription-based remote access management platform with critical payment and authentication systems.

## ⚠️ CRITICAL WARNINGS - READ FIRST

### DO NOT MODIFY WITHOUT UNDERSTANDING:
1. **Payment Logic** (`src/lib/payment/`) - Affects customer billing
2. **Admin Authentication** - Only `quiseforeverphilly@gmail.com` has admin access
3. **Pricing Structure** - $299→$199 SPEARMINT, $298 grandfathered two-user
4. **Database Schema** - Changes require careful migration
5. **Environment Variables** - Production PayPal credentials are live

### ALWAYS TEST BEFORE DEPLOYING:
- Use admin test payment system for payment testing
- Test mobile interface on actual devices
- Verify admin functionality access
- Check database migrations in development first

## Prerequisites

### Required Software

```bash
# Node.js (version 18 or higher)
node --version  # Should be 18.x or higher

# pnpm package manager (preferred over npm)
npm install -g pnpm
pnpm --version

# Git
git --version

# PostgreSQL (for local development, optional)
psql --version
```

### Required Accounts

1. **GitHub Access**: Repository access to SPEAR codebase
2. **Vercel Account**: For deployment (if needed)
3. **Railway Account**: For database access (if needed)
4. **PayPal Developer Account**: For payment testing (sandbox)

## Environment Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/sydwymon/spear.git
cd spear

# Install dependencies
pnpm install
```

### 2. Environment Variables

Create `.env.local` file in project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

**Required Environment Variables**:

```bash
# Database (use Railway production or local PostgreSQL)
DATABASE_URL=postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway

# NextAuth.js
NEXTAUTH_SECRET=REPLACE_WITH_NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000

# PayPal (use sandbox for development)
PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=REPLACE_WITH_PAYPAL_CLIENT_SECRET
PAYPAL_ENVIRONMENT=sandbox
```

### 3. Database Setup

**Option A: Use Production Database (Recommended)**
```bash
# Use Railway production database (read-only for development)
DATABASE_URL=postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create local database
createdb spear_dev

# Update DATABASE_URL
DATABASE_URL=postgresql://username:password@localhost:5432/spear_dev

# Run migrations
pnpm db:push
```

### 4. Start Development Server

```bash
# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

## Project Structure

### Key Directories

```
spear/
├── src/
│   ├── app/                    # Next.js 14 app router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   └── checkout/          # Payment processing
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   └── payment/          # Payment-specific components
│   └── lib/                   # Utility libraries
│       ├── auth.ts           # Authentication configuration
│       ├── payment/          # Payment system
│       └── prisma.ts         # Database client
├── prisma/
│   └── schema.prisma         # Database schema
├── docs/                     # Technical documentation
└── public/                   # Static assets
```

### Critical Files to Understand

1. **Payment System**:
   - `src/lib/payment/types.ts` - Pricing and coupon definitions
   - `src/lib/payment/providers/paypal-service.ts` - PayPal integration
   - `src/app/api/paypal/webhook/route.ts` - Webhook handling

2. **Authentication**:
   - `src/lib/auth.ts` - NextAuth.js configuration
   - `src/app/api/auth/register/route.ts` - User registration

3. **Admin System**:
   - `src/app/admin/clients/page.tsx` - Subscription management
   - `src/app/api/admin/subscriptions/route.ts` - Admin API

4. **Database**:
   - `prisma/schema.prisma` - Database schema
   - `src/lib/prisma.ts` - Database client

## Development Workflow

### 1. Making Changes

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# Test thoroughly

# Commit changes
git add .
git commit -m "feat: descriptive commit message"

# Push to GitHub
git push origin feature/your-feature-name

# Create pull request
```

### 2. Testing Changes

**Payment Testing**:
```bash
# Login as admin
# Go to http://localhost:3000/admin/clients
# Use "Test Payments" tab to test PayPal integration
```

**Authentication Testing**:
```bash
# Test user registration
# Test login/logout
# Test admin access (quiseforeverphilly@gmail.com)
```

**Database Testing**:
```bash
# View database
pnpm db:studio

# Check schema changes
pnpm db:push
```

### 3. Code Style

**TypeScript Standards**:
```typescript
// Use proper typing
interface PaymentRequest {
  amount: { amount: number; currency: string };
  customer: CustomerInfo;
}

// Use async/await
const result = await processPayment(request);

// Handle errors properly
try {
  const payment = await createPayment(data);
} catch (error) {
  console.error('Payment creation failed:', error);
  throw new Error('Payment processing failed');
}
```

**React/Next.js Patterns**:
```typescript
// Use server components when possible
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// Use client components for interactivity
"use client";
import { useState } from "react";

export default function InteractiveComponent() {
  const [state, setState] = useState(initialValue);
  // ...
}
```

## Understanding the Business Logic

### Pricing Structure (CRITICAL)

```typescript
// Single User Plan
regularPrice: $299/month
withSPEARMINT: $199/month (after $100 discount)

// Two User Bundle
regularPrice: $598/month
grandfatheredPrice: $298/month (early customers only)
```

### User Flow

```
1. User visits landing page
2. Views pricing plans
3. Creates account
4. Selects plan and enters billing info
5. Completes PayPal payment
6. Admin receives notification
7. Admin ships device to customer
8. Customer receives device and gains access
```

### Admin Responsibilities

```
1. Monitor subscription payments
2. Manage device access based on payment status
3. Handle customer support issues
4. Ship devices to new customers
5. Revoke access for non-paying customers
```

## Common Development Tasks

### 1. Adding New Features

**Before Starting**:
- Review existing code patterns
- Check if similar functionality exists
- Plan database schema changes
- Consider payment implications

**Implementation**:
- Follow existing code structure
- Add proper TypeScript types
- Include error handling
- Add tests if applicable

### 2. Modifying Payment Logic

**⚠️ EXTREME CAUTION REQUIRED**

```typescript
// Always test with admin test payment system
// Never modify pricing without understanding business impact
// Check both frontend and backend calculations
// Verify coupon logic
// Test grandfathered pricing
```

### 3. Database Changes

```bash
# 1. Modify prisma/schema.prisma
# 2. Generate migration
pnpm db:push

# 3. Test in development
# 4. Backup production database
# 5. Apply to production carefully
```

### 4. Adding API Endpoints

```typescript
// Follow existing patterns
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Business logic
    const result = await processRequest();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## Debugging and Troubleshooting

### 1. Common Issues

**Build Errors**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check TypeScript errors
pnpm type-check
```

**Database Issues**:
```bash
# Reset database schema
pnpm db:push --force-reset

# View database
pnpm db:studio
```

**Payment Issues**:
- Check environment variables
- Verify PayPal credentials
- Test with admin test payment system
- Review webhook logs

### 2. Logging and Monitoring

```typescript
// Add comprehensive logging
console.log('Debug info:', {
  userId: user.id,
  action: 'payment_attempt',
  amount: amount,
  timestamp: new Date().toISOString()
});

// Error logging
console.error('Error occurred:', {
  error: error.message,
  stack: error.stack,
  context: additionalContext
});
```

## Getting Help

### 1. Documentation Resources

- **Technical Docs**: `/docs` folder in repository
- **API Documentation**: `/docs/api/`
- **Troubleshooting**: `/docs/troubleshooting/`

### 2. Code Review Process

- All changes require pull request review
- Payment-related changes require extra scrutiny
- Test thoroughly before requesting review
- Include test results in PR description

### 3. Emergency Contacts

- **System Issues**: Check Vercel and Railway status
- **Payment Issues**: Use admin test payment system first
- **Database Issues**: Backup before making changes

## Next Steps

1. **Read System Documentation**: Start with `/docs/architecture/overview.md`
2. **Understand Payment System**: Review `/docs/systems/payment-system.md`
3. **Learn Authentication**: Study `/docs/systems/authentication.md`
4. **Practice with Test System**: Use admin test payment functionality
5. **Make First Contribution**: Start with small, non-critical changes

---

**Remember**: SPEAR handles real customer payments and subscriptions. Always prioritize system stability and data integrity over speed of development.
