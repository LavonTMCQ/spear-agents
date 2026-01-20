# SPEAR Database Schema Documentation

## Overview

SPEAR uses PostgreSQL hosted on Railway with Prisma as the ORM. The database schema is designed to support user authentication, subscription management, and payment tracking.

## Database Connection

**Host**: Railway PostgreSQL
**Connection**: `gondola.proxy.rlwy.net:31227`
**Database**: `railway`
**User**: `postgres`

```bash
# Connection string format
DATABASE_URL=postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway
```

## Schema Overview

```sql
-- Core tables and their relationships
User (1) ←→ (N) Session
User (1) ←→ (N) Account  
User (1) ←→ (N) Order
User (1) ←→ (0..1) VerificationToken
```

## Table Definitions

### User Table

**Purpose**: Store user accounts and authentication data

```sql
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,              -- bcrypt hashed password
  emailVerified TIMESTAMP,    -- Email verification status
  image TEXT,                 -- Profile image URL (future use)
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"(email);
```

**Key Fields**:
- `id`: Unique identifier (UUID format)
- `email`: User's email address (unique, used for login)
- `password`: bcrypt hashed password (12 salt rounds)
- `emailVerified`: Timestamp when email was verified
- `createdAt`: Account creation timestamp

**Critical Data**:
- Admin user: `quiseforeverphilly@gmail.com`
- All passwords are bcrypt hashed
- Email is the primary login identifier

### Session Table

**Purpose**: Store active user sessions (NextAuth.js database strategy)

```sql
CREATE TABLE "Session" (
  id TEXT PRIMARY KEY,
  sessionToken TEXT UNIQUE NOT NULL,
  userId TEXT NOT NULL,
  expires TIMESTAMP NOT NULL,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Indexes
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"(sessionToken);
CREATE INDEX "Session_userId_idx" ON "Session"(userId);
```

**Key Fields**:
- `sessionToken`: Unique session identifier
- `userId`: Reference to User table
- `expires`: Session expiration timestamp (30 days)

**Session Management**:
- Database sessions (not JWT) for security
- Automatic cleanup of expired sessions
- Session rotation on each request

### Account Table

**Purpose**: OAuth account linking (prepared for future OAuth providers)

```sql
CREATE TABLE "Account" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  providerAccountId TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  CONSTRAINT "Account_userId_fkey" FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX "Account_userId_idx" ON "Account"(userId);
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"(provider, providerAccountId);
```

**Current Usage**: Prepared for future OAuth integration (Google, GitHub)
**Future Use**: Link social media accounts to user profiles

### Order Table

**Purpose**: Track subscription orders and payment status

```sql
CREATE TABLE "Order" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  amount INTEGER NOT NULL,        -- Amount in cents (e.g., 19900 = $199.00)
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,           -- Order/subscription status
  paymentId TEXT,                 -- PayPal payment/order ID
  subscriptionPlan TEXT NOT NULL, -- Plan identifier (single-user, two-user)
  notes TEXT,                     -- JSON metadata
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  CONSTRAINT "Order_userId_fkey" FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE RESTRICT
);

-- Indexes
CREATE INDEX "Order_userId_idx" ON "Order"(userId);
CREATE INDEX "Order_status_idx" ON "Order"(status);
CREATE INDEX "Order_paymentId_idx" ON "Order"(paymentId);
CREATE INDEX "Order_createdAt_idx" ON "Order"(createdAt);
```

**Key Fields**:
- `amount`: Payment amount in cents (19900 = $199.00)
- `status`: Order status (pending, device_prep, shipped, active, cancelled)
- `paymentId`: PayPal payment identifier for tracking
- `subscriptionPlan`: Plan type (single-user, two-user, test-payment)
- `notes`: JSON metadata for additional information

**Order Statuses**:
- `pending`: Order created, payment not completed
- `device_prep`: Payment completed, preparing device
- `shipped`: Device shipped to customer
- `active`: Subscription active and device accessible
- `cancelled`: Subscription cancelled
- `test_payment`: Admin test payment
- `test_subscription`: Admin test subscription

### VerificationToken Table

**Purpose**: Email verification tokens (NextAuth.js requirement)

```sql
CREATE TABLE "VerificationToken" (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Indexes
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"(token);
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"(identifier, token);
```

**Usage**: Email verification workflow (future implementation)

## Data Relationships

### User → Orders (One-to-Many)

```sql
-- Get all orders for a user
SELECT * FROM "Order" WHERE userId = 'user-id';

-- Get user with their orders
SELECT u.*, o.* FROM "User" u
LEFT JOIN "Order" o ON u.id = o.userId
WHERE u.email = 'user@example.com';
```

### User → Sessions (One-to-Many)

```sql
-- Get active sessions for a user
SELECT * FROM "Session" 
WHERE userId = 'user-id' AND expires > NOW();

-- Clean up expired sessions
DELETE FROM "Session" WHERE expires < NOW();
```

## Critical Queries

### Admin Subscription Monitoring

```sql
-- Get all subscriptions with user details
SELECT 
  o.id,
  o.amount,
  o.currency,
  o.status,
  o.subscriptionPlan,
  o.paymentId,
  o.createdAt,
  u.email,
  u.name,
  u.createdAt as userCreatedAt
FROM "Order" o
JOIN "User" u ON o.userId = u.id
WHERE o.subscriptionPlan IN ('single-user', 'two-user')
ORDER BY o.createdAt DESC;
```

### Payment Status Tracking

```sql
-- Get orders by payment status
SELECT * FROM "Order" 
WHERE status = 'active' 
AND createdAt > NOW() - INTERVAL '30 days';

-- Get past due subscriptions (older than 30 days)
SELECT * FROM "Order"
WHERE status = 'active'
AND createdAt < NOW() - INTERVAL '30 days';
```

### User Account Management

```sql
-- Get user with subscription info
SELECT 
  u.*,
  o.subscriptionPlan,
  o.status as subscriptionStatus,
  o.amount,
  o.createdAt as subscriptionDate
FROM "User" u
LEFT JOIN "Order" o ON u.id = o.userId
WHERE u.email = 'customer@example.com';
```

## Data Migration Procedures

### Schema Updates

```bash
# 1. Update Prisma schema
# Edit prisma/schema.prisma

# 2. Generate migration
npx prisma migrate dev --name migration-name

# 3. Apply to production (CAREFUL!)
npx prisma migrate deploy
```

### Backup Procedures

```bash
# Create database backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup-20240120.sql
```

## Performance Considerations

### Indexing Strategy

**Existing Indexes**:
- Primary keys (automatic)
- Unique constraints (email, sessionToken)
- Foreign key indexes
- Order status and date indexes

**Query Optimization**:
- Use indexes for frequent queries
- Limit result sets with pagination
- Use prepared statements via Prisma

### Connection Pooling

**Prisma Configuration**:
```typescript
// src/lib/prisma.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

**Railway Limits**:
- Connection limit: 100 concurrent connections
- Use connection pooling for production
- Monitor connection usage

## Security Considerations

### Data Protection

1. **Password Security**: All passwords bcrypt hashed
2. **Session Security**: Database sessions with expiration
3. **PII Protection**: Minimal personal data storage
4. **Payment Security**: No credit card data stored

### Access Control

1. **Database Access**: Restricted to application only
2. **Admin Queries**: Logged and monitored
3. **Backup Security**: Encrypted backups
4. **Connection Security**: SSL/TLS required

## Troubleshooting

### Common Database Issues

1. **Connection Errors**
   - Check DATABASE_URL format
   - Verify Railway database status
   - Check connection limits

2. **Migration Failures**
   - Review migration SQL
   - Check for data conflicts
   - Backup before migrations

3. **Performance Issues**
   - Check slow query logs
   - Review index usage
   - Monitor connection pool

### Monitoring Queries

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('railway'));

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check active connections
SELECT count(*) FROM pg_stat_activity;
```

---

**CRITICAL REMINDER**: Always backup the database before schema changes. Test migrations in development first.
