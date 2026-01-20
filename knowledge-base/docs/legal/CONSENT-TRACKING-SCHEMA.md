# Consent Tracking Database Schema

**Document:** Database schema for recording user consent and acknowledgments
**Status:** DRAFT - Requires implementation
**Created:** January 20, 2026

---

## Purpose

This document defines the database schema and API patterns for tracking user consent to terms, disclosures, and acknowledgments. Proper consent recording is essential for:

1. **Legal Enforceability** - Proving users agreed to terms
2. **Regulatory Compliance** - ROSCA, CCPA, state laws
3. **Dispute Resolution** - Evidence if users claim they didn't agree
4. **Audit Trail** - Tracking what users agreed to and when

---

## Part 1: Prisma Schema Additions

Add to `prisma/schema.prisma`:

```prisma
// ============================================
// CONSENT & ACKNOWLEDGMENT TRACKING
// ============================================

// Legal document versions (ToS, Privacy, etc.)
model LegalDocumentVersion {
  id          String   @id @default(cuid())
  documentType String  // 'terms', 'privacy', 'subscription', 'hc_disclosures'
  version     String   // Semantic version like '1.0.0' or date-based '2026-01-20'
  contentHash String   // SHA-256 hash of document content for verification
  effectiveAt DateTime // When this version became active
  createdAt   DateTime @default(now())

  consents    UserConsent[]

  @@unique([documentType, version])
  @@index([documentType])
}

// Main consent record - tracks each user's agreement to legal documents
model UserConsent {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Terms of Service
  termsVersionId  String?
  termsVersion    LegalDocumentVersion? @relation(fields: [termsVersionId], references: [id])
  termsAcceptedAt DateTime?

  // Privacy Policy
  privacyVersionId  String?
  privacyAcceptedAt DateTime?

  // Subscription/Billing Policy
  billingVersionId  String?
  billingAcceptedAt DateTime?

  // Metadata for verification
  ipAddress         String?
  userAgent         String?
  acceptanceMethod  String?  // 'checkout', 'registration', 'update_prompt'

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId])
}

// Home Care specific acknowledgments
model HCUserAcknowledgment {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Service understanding
  serviceUnderstandingAckedAt DateTime?
  serviceUnderstandingVersion String?

  // NOT proof of service - CRITICAL
  notProofOfServiceAckedAt    DateTime?
  notProofOfServiceVersion    String?

  // In-home device placement responsibility
  inhomeResponsibilityAckedAt DateTime?
  inhomeResponsibilityVersion String?

  // Third-party app disclaimer
  thirdPartyAppsAckedAt       DateTime?
  thirdPartyAppsVersion       String?

  // Final confirmation
  finalConfirmationAt         DateTime?

  // Metadata
  ipAddress                   String?
  userAgent                   String?

  createdAt                   DateTime @default(now())
  updatedAt                   DateTime @updatedAt

  @@unique([userId])
  @@index([userId])
}

// Audit log for consent events (immutable record)
model ConsentAuditLog {
  id            String   @id @default(cuid())
  userId        String?  // Nullable for anonymous events
  eventType     String   // 'terms_accepted', 'privacy_accepted', 'consent_revoked', etc.
  documentType  String?  // 'terms', 'privacy', 'hc_not_proof', etc.
  documentVersion String?

  // Event metadata
  ipAddress     String?
  userAgent     String?
  sessionId     String?

  // Additional context (JSON)
  metadata      Json?

  createdAt     DateTime @default(now())

  @@index([userId])
  @@index([eventType])
  @@index([createdAt])
}
```

---

## Part 2: API Endpoints

### Record Consent on Registration/Checkout

**Endpoint:** `POST /api/consent/accept`

**Request Body:**
```json
{
  "consents": [
    { "type": "terms", "version": "2026-01-20" },
    { "type": "privacy", "version": "2026-01-20" },
    { "type": "subscription", "version": "2026-01-20" }
  ],
  "acceptanceMethod": "checkout"
}
```

**Implementation:**
```typescript
// src/app/api/consent/accept/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { consents, acceptanceMethod } = body;

  const ipAddress = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';

  // Create or update consent record
  const consentData: any = {
    userId: session.user.id,
    ipAddress,
    userAgent,
    acceptanceMethod,
  };

  for (const consent of consents) {
    const docVersion = await prisma.legalDocumentVersion.findFirst({
      where: { documentType: consent.type, version: consent.version }
    });

    if (consent.type === 'terms') {
      consentData.termsVersionId = docVersion?.id;
      consentData.termsAcceptedAt = new Date();
    } else if (consent.type === 'privacy') {
      consentData.privacyVersionId = docVersion?.id;
      consentData.privacyAcceptedAt = new Date();
    } else if (consent.type === 'subscription') {
      consentData.billingVersionId = docVersion?.id;
      consentData.billingAcceptedAt = new Date();
    }

    // Create audit log entry
    await prisma.consentAuditLog.create({
      data: {
        userId: session.user.id,
        eventType: `${consent.type}_accepted`,
        documentType: consent.type,
        documentVersion: consent.version,
        ipAddress,
        userAgent,
      }
    });
  }

  const record = await prisma.userConsent.upsert({
    where: { userId: session.user.id },
    update: consentData,
    create: consentData,
  });

  return NextResponse.json({ success: true, consentId: record.id });
}
```

### Record HC-Specific Acknowledgments

**Endpoint:** `POST /api/consent/hc-acknowledge`

**Request Body:**
```json
{
  "acknowledgments": [
    { "type": "service_understanding", "version": "1.0" },
    { "type": "not_proof_of_service", "version": "1.0" },
    { "type": "inhome_responsibility", "version": "1.0" },
    { "type": "third_party_apps", "version": "1.0" }
  ]
}
```

**Implementation:**
```typescript
// src/app/api/consent/hc-acknowledge/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { acknowledgments } = body;

  const ipAddress = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const now = new Date();

  const ackData: any = {
    userId: session.user.id,
    ipAddress,
    userAgent,
  };

  for (const ack of acknowledgments) {
    switch (ack.type) {
      case 'service_understanding':
        ackData.serviceUnderstandingAckedAt = now;
        ackData.serviceUnderstandingVersion = ack.version;
        break;
      case 'not_proof_of_service':
        ackData.notProofOfServiceAckedAt = now;
        ackData.notProofOfServiceVersion = ack.version;
        break;
      case 'inhome_responsibility':
        ackData.inhomeResponsibilityAckedAt = now;
        ackData.inhomeResponsibilityVersion = ack.version;
        break;
      case 'third_party_apps':
        ackData.thirdPartyAppsAckedAt = now;
        ackData.thirdPartyAppsVersion = ack.version;
        break;
      case 'final_confirmation':
        ackData.finalConfirmationAt = now;
        break;
    }

    // Create audit log
    await prisma.consentAuditLog.create({
      data: {
        userId: session.user.id,
        eventType: `hc_${ack.type}_acknowledged`,
        documentType: `hc_${ack.type}`,
        documentVersion: ack.version,
        ipAddress,
        userAgent,
      }
    });
  }

  const record = await prisma.hCUserAcknowledgment.upsert({
    where: { userId: session.user.id },
    update: ackData,
    create: ackData,
  });

  return NextResponse.json({ success: true, acknowledgmentId: record.id });
}
```

### Check Consent Status

**Endpoint:** `GET /api/consent/status`

**Response:**
```json
{
  "hasValidConsent": true,
  "terms": {
    "accepted": true,
    "acceptedAt": "2026-01-20T10:30:00Z",
    "currentVersion": "2026-01-20",
    "needsUpdate": false
  },
  "privacy": {
    "accepted": true,
    "acceptedAt": "2026-01-20T10:30:00Z",
    "currentVersion": "2026-01-20",
    "needsUpdate": false
  },
  "hcAcknowledgments": {
    "completed": true,
    "notProofOfService": true,
    "inhomeResponsibility": true,
    "thirdPartyApps": true
  }
}
```

---

## Part 3: Middleware for Consent Enforcement

```typescript
// src/middleware/consent-check.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PROTECTED_ROUTES = ['/dashboard', '/remote-connect', '/devices'];
const CONSENT_ROUTE = '/consent-required';

export async function consentMiddleware(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // Skip if not a protected route
  if (!PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if user has valid consent
  const consent = await prisma.userConsent.findUnique({
    where: { userId: session.user.id },
    include: { termsVersion: true }
  });

  // Get current required version
  const currentTerms = await prisma.legalDocumentVersion.findFirst({
    where: { documentType: 'terms' },
    orderBy: { effectiveAt: 'desc' }
  });

  // If no consent or outdated consent, redirect to consent page
  if (!consent?.termsAcceptedAt ||
      consent.termsVersion?.version !== currentTerms?.version) {
    return NextResponse.redirect(new URL(CONSENT_ROUTE, request.url));
  }

  return NextResponse.next();
}
```

---

## Part 4: Version Management

### Seeding Document Versions

```typescript
// scripts/seed-legal-versions.ts

import { prisma } from '../src/lib/prisma';
import * as crypto from 'crypto';
import * as fs from 'fs';

async function seedLegalVersions() {
  // Read current terms content and hash it
  const termsContent = fs.readFileSync('./legal/terms-of-service.md', 'utf-8');
  const termsHash = crypto.createHash('sha256').update(termsContent).digest('hex');

  await prisma.legalDocumentVersion.upsert({
    where: {
      documentType_version: {
        documentType: 'terms',
        version: '2026-01-20'
      }
    },
    update: { contentHash: termsHash },
    create: {
      documentType: 'terms',
      version: '2026-01-20',
      contentHash: termsHash,
      effectiveAt: new Date('2026-01-20'),
    }
  });

  // Similar for privacy policy, subscription policy, HC disclosures
  console.log('Legal document versions seeded');
}

seedLegalVersions();
```

---

## Part 5: Reporting & Admin

### Admin API: Get User Consent History

**Endpoint:** `GET /api/admin/consent/[userId]`

**Response:**
```json
{
  "userId": "user_123",
  "currentConsent": {
    "termsVersion": "2026-01-20",
    "termsAcceptedAt": "2026-01-20T10:30:00Z",
    "privacyVersion": "2026-01-20",
    "privacyAcceptedAt": "2026-01-20T10:30:00Z",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "hcAcknowledgments": {
    "notProofOfService": "2026-01-20T10:35:00Z",
    "inhomeResponsibility": "2026-01-20T10:36:00Z"
  },
  "auditLog": [
    {
      "eventType": "terms_accepted",
      "documentVersion": "2026-01-20",
      "timestamp": "2026-01-20T10:30:00Z",
      "ipAddress": "192.168.1.1"
    }
  ]
}
```

### Export Consent Data (for legal requests)

```typescript
// scripts/export-user-consent.ts

async function exportUserConsent(userId: string) {
  const consent = await prisma.userConsent.findUnique({
    where: { userId },
    include: { termsVersion: true }
  });

  const hcAcks = await prisma.hCUserAcknowledgment.findUnique({
    where: { userId }
  });

  const auditLog = await prisma.consentAuditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  });

  return {
    userId,
    consent,
    hcAcknowledgments: hcAcks,
    auditTrail: auditLog,
    exportedAt: new Date().toISOString()
  };
}
```

---

## Part 6: Data Retention

### Retention Policy

| Data Type | Retention Period | Rationale |
|-----------|-----------------|-----------|
| Active consent records | Duration of account | Legal requirement |
| Consent audit logs | 7 years after account deletion | Statute of limitations |
| Legal document versions | Indefinite | Reference for old consents |
| HC acknowledgments | Duration of account | Operational need |

### Cleanup Script

```typescript
// scripts/cleanup-old-consent-logs.ts

async function cleanupOldConsentLogs() {
  const sevenYearsAgo = new Date();
  sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);

  // Only delete logs for deleted users older than 7 years
  const deletedUserIds = await prisma.user.findMany({
    where: { deletedAt: { lt: sevenYearsAgo } },
    select: { id: true }
  });

  if (deletedUserIds.length > 0) {
    await prisma.consentAuditLog.deleteMany({
      where: {
        userId: { in: deletedUserIds.map(u => u.id) },
        createdAt: { lt: sevenYearsAgo }
      }
    });
  }

  console.log(`Cleaned up consent logs for ${deletedUserIds.length} deleted users`);
}
```

---

## Implementation Checklist

### Database
- [ ] Add Prisma schema changes
- [ ] Run `prisma db push` or create migration
- [ ] Seed initial document versions

### API Routes
- [ ] Create `/api/consent/accept`
- [ ] Create `/api/consent/hc-acknowledge`
- [ ] Create `/api/consent/status`
- [ ] Create `/api/admin/consent/[userId]`

### Frontend
- [ ] Add consent collection UI to registration
- [ ] Add consent collection UI to checkout
- [ ] Add HC acknowledgment flow to HC onboarding
- [ ] Add consent update prompt component

### Testing
- [ ] Test consent recording
- [ ] Test consent verification
- [ ] Test audit log creation
- [ ] Test admin export functionality

---

**DISCLAIMER:** This document is provided for technical guidance only and does not constitute legal advice. Consult with a licensed attorney before implementing consent collection systems.
