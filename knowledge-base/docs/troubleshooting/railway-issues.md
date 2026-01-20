# Railway Database Issues Troubleshooting Guide

## Overview

This guide covers troubleshooting issues with Railway PostgreSQL database connectivity and deployment problems. Railway hosts the production database for SPEAR.

## ⚠️ Current Production Status

**Database**: Railway PostgreSQL (Production)
**Connection**: `postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway`
**Status**: ✅ Active and operational

## Common Railway Database Issues

### 1. Database Connection Failures

**Symptoms**:
- "Database connection failed" errors
- Prisma client connection timeouts
- 500 errors on database-dependent endpoints

**Diagnostic Steps**:
```bash
# Test database connectivity
npx prisma db pull

# Check database status
curl https://spear-global.com/api/health

# Test specific database endpoint
curl https://spear-global.com/api/test-db
```

**Solutions**:
1. **Verify Connection String**:
   ```bash
   # Check DATABASE_URL format
   echo $DATABASE_URL
   # Should be: postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway
   ```

2. **Check Railway Database Status**:
   - Login to Railway dashboard
   - Check database service status
   - Verify connection limits

3. **Test Connection**:
   ```bash
   # Direct connection test
   psql postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway -c "SELECT 1;"
   ```

### 2. Prisma Client Issues

**Symptoms**:
- "Cannot find module '@prisma/client'" errors
- Prisma client not generated
- Schema sync issues

**Solutions**:
1. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Push Schema Changes**:
   ```bash
   npx prisma db push
   ```

3. **Reset Database (CAUTION)**:
   ```bash
   # Only for development - DO NOT use in production
   npx prisma migrate reset
   ```

### 3. Environment Variable Issues

**Symptoms**:
- DATABASE_URL undefined
- Connection string format errors
- Environment variables not loading

**Solutions**:
1. **Verify Environment Variables**:
   ```bash
   # In Vercel
   vercel env ls
   
   # Check local environment
   echo $DATABASE_URL
   ```

2. **Update Environment Variables**:
   ```bash
   # Add to Vercel
   vercel env add DATABASE_URL production
   # Enter: postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway
   ```

### 4. Migration Issues

**Symptoms**:
- Schema out of sync
- Migration failures
- Database schema conflicts

**Solutions**:
1. **Check Migration Status**:
   ```bash
   npx prisma migrate status
   ```

2. **Apply Pending Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Generate New Migration**:
   ```bash
   npx prisma migrate dev --name migration-name
   ```

## Railway-Specific Issues

### 1. Connection Limits

**Issue**: Railway has connection limits
**Symptoms**: "Too many connections" errors
**Solution**: Use connection pooling

```typescript
// Prisma connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

### 2. Network Connectivity

**Issue**: Network timeouts or connectivity issues
**Symptoms**: Intermittent connection failures
**Solutions**:
1. Check Railway service status
2. Verify firewall settings
3. Test from different networks

### 3. Database Performance

**Issue**: Slow query performance
**Symptoms**: Long response times, timeouts
**Solutions**:
1. **Check Database Metrics**:
   - Login to Railway dashboard
   - Review database performance metrics
   - Check connection usage

2. **Optimize Queries**:
   ```typescript
   // Use indexes for frequent queries
   // Limit result sets
   // Use proper WHERE clauses
   ```

## Health Check Endpoints

### Database Health Check

**Endpoint**: `/api/health`
**Expected Response**:
```json
{
  "status": "healthy",
  "database": true,
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

### Database Test Endpoint

**Endpoint**: `/api/test-db`
**Expected Response**:
```json
{
  "success": true,
  "message": "Database connection successful",
  "data": {
    "userCount": 5,
    "orderCount": 12,
    "databaseUrl": "configured"
  }
}
```

## Monitoring and Maintenance

### 1. Regular Health Checks

```bash
# Daily health check
curl https://spear-global.com/api/health

# Database-specific check
curl https://spear-global.com/api/test-db
```

### 2. Database Backups

**Railway Automatic Backups**: Railway automatically creates backups
**Manual Backup**:
```bash
pg_dump postgresql://postgres:MZJFKNWbjshCnQHDbLsetLFvkpvUDtqh@gondola.proxy.rlwy.net:31227/railway > backup-$(date +%Y%m%d).sql
```

### 3. Performance Monitoring

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

## Emergency Procedures

### 1. Database Outage

**Immediate Actions**:
1. Check Railway service status
2. Verify network connectivity
3. Check application logs
4. Contact Railway support if needed

**Communication**:
- Update customers about service issues
- Provide estimated resolution time
- Monitor Railway status page

### 2. Data Corruption

**Recovery Steps**:
1. Stop application to prevent further damage
2. Restore from latest backup
3. Verify data integrity
4. Resume application services

### 3. Performance Degradation

**Investigation Steps**:
1. Check database metrics in Railway dashboard
2. Review slow query logs
3. Analyze connection usage
4. Optimize problematic queries

## Prevention Strategies

### 1. Connection Management

```typescript
// Proper connection handling
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

### 2. Query Optimization

```typescript
// Use proper indexing
// Limit result sets
const orders = await prisma.order.findMany({
  where: { status: 'active' },
  take: 50,
  orderBy: { createdAt: 'desc' }
});

// Use select to limit fields
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true }
});
```

### 3. Regular Maintenance

```bash
# Weekly database health check
npx prisma db pull
npx prisma generate

# Monthly performance review
# Check slow queries
# Review connection usage
# Optimize indexes if needed
```

## Contact and Support

### Railway Support
- **Dashboard**: https://railway.app
- **Status Page**: https://status.railway.app
- **Support**: Through Railway dashboard

### Internal Escalation
1. Check Railway status first
2. Review application logs
3. Test database connectivity
4. Contact Railway support if infrastructure issue
5. Implement temporary workarounds if possible

---

**CRITICAL REMINDER**: The Railway database contains production customer data and payment information. Always backup before making schema changes and test thoroughly in development first.
