# SPEAR System Architecture Overview

## High-Level Architecture

SPEAR is a subscription-based remote access management platform built with a modern web stack and designed for scalability and security.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Admin Panel   │    │  Mobile Client  │
│  (spear-global  │    │   (/admin)      │    │   (Responsive)  │
│     .com)       │    │                 │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Next.js Frontend      │
                    │   (Vercel Deployment)     │
                    │                           │
                    │  - Authentication UI      │
                    │  - Payment Processing     │
                    │  - Subscription Mgmt      │
                    │  - Device Management      │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │    Next.js API Routes     │
                    │                           │
                    │  - /api/auth/*           │
                    │  - /api/payment/*        │
                    │  - /api/admin/*          │
                    │  - /api/paypal/*         │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
│   PostgreSQL      │   │   PayPal API      │   │   NextAuth.js     │
│   (Railway)       │   │   (Production)    │   │   (Sessions)      │
│                   │   │                   │   │                   │
│ - User accounts   │   │ - Payment proc.   │   │ - Authentication  │
│ - Subscriptions   │   │ - Webhooks        │   │ - Session mgmt    │
│ - Orders          │   │ - Subscription    │   │ - User sessions   │
│ - Device tracking │   │   management      │   │                   │
└───────────────────┘   └───────────────────┘   └───────────────────┘
```

## Core Components

### 1. Frontend Layer (Next.js 14)

**Location**: `src/app/`, `src/components/`

**Key Features**:
- Server-side rendering for SEO and performance
- TypeScript for type safety
- Tailwind CSS for responsive design
- Component-based architecture

**Critical Pages**:
- `/` - Landing page with pricing
- `/pricing` - Subscription plans
- `/checkout` - Payment processing
- `/admin` - Admin dashboard
- `/admin/clients` - Subscription management

### 2. API Layer (Next.js API Routes)

**Location**: `src/app/api/`

**Key Endpoints**:
```
/api/auth/*                 # NextAuth.js authentication
/api/payment/process        # Payment processing
/api/paypal/webhook         # PayPal webhook handler
/api/admin/subscriptions    # Admin subscription management
/api/test-payment          # Admin test payment system
```

### 3. Data Layer

**Database**: PostgreSQL on Railway
**ORM**: Prisma
**Location**: `prisma/schema.prisma`, `src/lib/prisma.ts`

**Key Tables**:
- `User` - User accounts and authentication
- `Account` - OAuth account linking
- `Session` - User sessions
- `Order` - Subscription orders and payments
- `VerificationToken` - Email verification

### 4. Payment System

**Provider**: PayPal (Production)
**Location**: `src/lib/payment/`

**Architecture**:
```
PaymentFactory
├── PayPalService (implements PaymentProvider)
├── Types and interfaces
└── Subscription management
```

### 5. Authentication System

**Provider**: NextAuth.js
**Strategy**: Database sessions
**Admin Control**: Email-based admin access

## Data Flow

### 1. User Registration & Payment Flow
```
User visits landing → Pricing page → Account creation → 
Checkout → PayPal payment → Webhook processing → 
Order creation → Admin notification → Device provisioning
```

### 2. Admin Management Flow
```
Admin login → Subscription monitor → View customer status → 
Manage device access → Cancel/reactivate subscriptions → 
Test payment system
```

### 3. Subscription Lifecycle
```
Payment received → Subscription active → 30-day period → 
Payment due → Past due (if unpaid) → Device access revoked → 
Admin intervention
```

## Security Architecture

### 1. Authentication Security
- Database-stored sessions (not JWT for security)
- Admin access restricted to specific email
- CSRF protection via NextAuth.js
- Secure cookie handling

### 2. Payment Security
- PayPal webhook signature verification
- Environment variable protection
- No sensitive data in client-side code
- Secure payment processing flow

### 3. Business Model Protection
- Server-side subscription validation
- Device access tied to payment status
- Admin-controlled device provisioning
- Automatic access revocation for non-payment

## Scalability Considerations

### 1. Database Design
- Indexed queries for performance
- Normalized schema for data integrity
- Prepared for horizontal scaling

### 2. API Design
- RESTful endpoints
- Proper error handling
- Rate limiting ready
- Webhook reliability

### 3. Frontend Performance
- Server-side rendering
- Component lazy loading
- Optimized bundle sizes
- CDN-ready assets

## Integration Points

### 1. External Services
- **PayPal**: Payment processing and webhooks
- **Railway**: Database hosting
- **Vercel**: Application hosting
- **Spaceship**: Domain management (spear-global.com)

### 2. Future Integrations
- **RustDesk**: Remote access server
- **DigitalOcean**: RustDesk server hosting
- **Email Service**: Customer notifications
- **Analytics**: Usage tracking

## Development Environment

### 1. Local Development
```bash
# Required tools
Node.js 18+
pnpm package manager
PostgreSQL (local or Railway)
```

### 2. Environment Variables
```bash
# Authentication
NEXTAUTH_SECRET=REPLACE_WITH_NEXTAUTH_SECRET

# Database
DATABASE_URL=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=REPLACE_WITH_PAYPAL_CLIENT_SECRET
```

### 3. Development Commands
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Prisma Studio
```

## Deployment Architecture

### 1. Production Environment
- **Frontend**: Vercel (spear-global.com)
- **Database**: Railway PostgreSQL
- **Domain**: Spaceship registrar
- **SSL**: Automatic via Vercel

### 2. CI/CD Pipeline
```
Git push → GitHub → Vercel build → 
Automatic deployment → Health checks
```

## Monitoring and Observability

### 1. Application Monitoring
- Vercel analytics and logs
- PayPal webhook logs
- Database query monitoring
- Error tracking via console logs

### 2. Business Metrics
- Subscription status dashboard
- Payment success rates
- Customer lifecycle tracking
- Device access monitoring

---

**Next Steps**: Review specific system documentation for detailed implementation details.
