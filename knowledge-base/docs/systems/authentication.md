# SPEAR Authentication System Documentation

## Overview

SPEAR uses NextAuth.js for authentication with a database session strategy. The system implements a two-tier access model: regular users and admin users, with special privileges for the admin account.

## ⚠️ CRITICAL ADMIN CONFIGURATION

### Admin Account (DO NOT MODIFY)

```typescript
// CRITICAL: Admin email - hardcoded for security
const ADMIN_EMAIL = "quiseforeverphilly@gmail.com";

// Admin access check pattern used throughout the application
if (session?.user?.email !== "quiseforeverphilly@gmail.com") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Admin Privileges**:
- Access to `/admin` dashboard
- Subscription monitoring and management
- Device access control
- Test payment system access
- User account management

## Authentication Architecture

### NextAuth.js Configuration

**Location**: `src/lib/auth.ts`

```typescript
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Custom authentication logic
        // Validates against database users
      }
    })
  ],
  session: {
    strategy: "database",  // CRITICAL: Database sessions for security
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    session: async ({ session, user }) => {
      // Attach user ID to session
      if (session?.user && user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
};
```

### Database Schema

**Tables Used**:
- `User` - User accounts and credentials
- `Account` - OAuth account linking (future use)
- `Session` - Active user sessions
- `VerificationToken` - Email verification tokens

```sql
-- User table (simplified)
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,  -- Hashed with bcrypt
  emailVerified TIMESTAMP,
  image TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Session table
CREATE TABLE "Session" (
  id TEXT PRIMARY KEY,
  sessionToken TEXT UNIQUE NOT NULL,
  userId TEXT NOT NULL,
  expires TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);
```

## User Registration Flow

### 1. Account Creation

**Endpoint**: `/api/auth/register`
**Location**: `src/app/api/auth/register/route.ts`

```typescript
// Registration process
1. Validate email format and password strength
2. Check if user already exists
3. Hash password with bcrypt
4. Create user record in database
5. Automatically sign in user
6. Redirect to pricing/checkout
```

### 2. Password Security

**Hashing**: bcrypt with salt rounds
**Requirements**: Minimum 8 characters (enforced client-side)
**Storage**: Never store plain text passwords

```typescript
import bcrypt from 'bcryptjs';

// Password hashing
const hashedPassword = await bcrypt.hash(password, 12);

// Password verification
const isValid = await bcrypt.compare(password, user.password);
```

## Login Flow

### 1. Credential Validation

**Location**: `src/app/(auth)/login/page.tsx`

```typescript
// Login process
1. User enters email and password
2. NextAuth.js validates credentials
3. Database lookup for user account
4. Password verification with bcrypt
5. Session creation in database
6. Redirect to dashboard or intended page
```

### 2. Session Management

**Strategy**: Database sessions (not JWT)
**Security**: Session tokens stored in database
**Expiration**: 30-day automatic expiration
**Cleanup**: Automatic cleanup of expired sessions

## Access Control

### 1. Route Protection

**Middleware**: `src/middleware.ts`

```typescript
// Protected routes
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/checkout'
];

// Admin-only routes
const adminRoutes = [
  '/admin',
  '/admin/clients'
];
```

### 2. API Endpoint Protection

**Pattern Used Throughout APIs**:

```typescript
// Standard auth check
const session = await auth();
if (!session || !session.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Admin-only check
if (session.user.email !== "quiseforeverphilly@gmail.com") {
  return NextResponse.json({ error: "Admin access required" }, { status: 401 });
}
```

### 3. Component-Level Protection

**Client-Side Protection**:

```typescript
// useSession hook for client components
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();

if (status === "loading") return <Loading />;
if (status === "unauthenticated") return <LoginPrompt />;
```

**Server-Side Protection**:

```typescript
// Server components and API routes
import { auth } from "@/lib/auth";

const session = await auth();
if (!session) redirect("/login");
```

## User Roles and Permissions

### 1. Regular Users

**Permissions**:
- Create account and login
- View own subscription status
- Access assigned devices (future)
- Update profile information
- Make payments

**Restrictions**:
- Cannot access admin functions
- Cannot view other users' data
- Cannot manage subscriptions

### 2. Admin User

**Email**: `quiseforeverphilly@gmail.com`

**Permissions**:
- All regular user permissions
- Access admin dashboard
- View all user accounts
- Monitor all subscriptions
- Manage device access
- Cancel/reactivate subscriptions
- Access test payment system
- View system analytics

## Security Considerations

### 1. Session Security

**Database Sessions**: More secure than JWT tokens
**CSRF Protection**: Built into NextAuth.js
**Secure Cookies**: HTTPOnly, Secure, SameSite
**Session Rotation**: New session token on each request

### 2. Password Security

**Hashing**: bcrypt with 12 salt rounds
**No Plain Text**: Passwords never stored in plain text
**Validation**: Client and server-side validation
**Reset Flow**: Secure password reset (future implementation)

### 3. Admin Security

**Single Admin**: Only one admin email allowed
**Hardcoded Check**: Admin email hardcoded in code
**No Role Escalation**: No way to promote users to admin
**Audit Trail**: All admin actions logged

## Environment Variables

### Required Authentication Variables

```bash
# NextAuth.js configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://spear-global.com

# Database connection
DATABASE_URL=postgresql://...
```

### Security Best Practices

1. **NEXTAUTH_SECRET**: Use strong, random secret
2. **NEXTAUTH_URL**: Must match production domain
3. **Database**: Use connection pooling for performance
4. **Environment**: Never commit secrets to git

## Troubleshooting

### Common Authentication Issues

1. **Login Fails**
   - Check password hashing compatibility
   - Verify database connection
   - Check user exists in database

2. **Session Not Persisting**
   - Verify NEXTAUTH_SECRET is set
   - Check database session table
   - Verify cookie settings

3. **Admin Access Denied**
   - Confirm exact email match
   - Check session data
   - Verify admin check logic

### Testing Authentication

1. **User Registration**
   - Test with valid email formats
   - Verify password hashing
   - Check database user creation

2. **Login Flow**
   - Test with correct credentials
   - Verify session creation
   - Check redirect behavior

3. **Admin Access**
   - Test admin email login
   - Verify admin route access
   - Check admin API endpoints

## Future Enhancements

### Planned Features

1. **Email Verification**: Verify email addresses on registration
2. **Password Reset**: Secure password reset flow
3. **Two-Factor Auth**: Optional 2FA for admin account
4. **OAuth Providers**: Google/GitHub login options
5. **Audit Logging**: Track all authentication events

### Migration Considerations

1. **User Data**: Preserve existing user accounts
2. **Sessions**: Handle session migration carefully
3. **Admin Access**: Maintain admin privileges
4. **Password Hashes**: Ensure bcrypt compatibility

---

**CRITICAL REMINDER**: Never modify the admin email check without understanding the security implications. The admin account has full system access.
