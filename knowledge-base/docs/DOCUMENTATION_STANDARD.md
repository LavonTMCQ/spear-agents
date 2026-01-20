# SPEAR Documentation Standard

This document defines the strict format for all SPEAR documentation. All docs must follow this format to ensure consistency for both AI agents (Mastra) and human readers.

---

## Document Types

| Type | Purpose | Audience |
|------|---------|----------|
| `feature` | Describes a user-facing feature | All |
| `api` | API endpoint reference | Developers, AI |
| `process` | Business workflow documentation | Ops, AI |
| `guide` | Step-by-step instructions | Admins |
| `reference` | Quick lookup tables | All |
| `troubleshooting` | Problem/solution pairs | Support, AI |

---

## Required Document Structure

Every document MUST follow this exact structure:

```markdown
---
# YAML FRONTMATTER (Required)
id: unique-kebab-case-id
title: Human Readable Title
type: feature | api | process | guide | reference | troubleshooting
category: auth | payment | device | subscription | admin | client | support | system
audience: [customer-support, internal-ops, sales, admin, developer, ai-agent]
status: current | deprecated | beta
related: [other-doc-ids]
last_updated: YYYY-MM-DD
version: 1.0
---

# {title}

## Summary
<!-- 1-2 sentences. AI agents use this for quick context. -->

## Quick Reference
<!-- Machine-parseable block for AI agents -->
```yaml
what: One-line description of what this does
who: Who can access/use this
where: UI location or API endpoint
when: When this is used
why: Business purpose
```

## Overview
<!-- 2-3 paragraph human-friendly explanation -->

## Details
<!-- Main content - structure varies by document type -->

## Actions
<!-- What can be done - critical for AI agents -->
- **Action Name**: Description of what happens
  - Trigger: How to initiate
  - Result: What happens after
  - Permissions: Who can do this

## Examples
<!-- Real examples with actual values -->

## Related
<!-- Links to related documentation -->

## Troubleshooting
<!-- Common issues and solutions (if applicable) -->
```

---

## Frontmatter Field Definitions

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier, kebab-case (e.g., `payment-checkout-flow`) |
| `title` | string | Human-readable title |
| `type` | enum | Document type (see types above) |
| `category` | enum | Feature category |
| `audience` | array | Who this doc is for |
| `status` | enum | `current`, `deprecated`, or `beta` |
| `last_updated` | date | ISO date format |
| `version` | string | Semantic version |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `related` | array | IDs of related documents |
| `tags` | array | Searchable keywords |
| `prerequisites` | array | Required knowledge/access |
| `api_endpoints` | array | Related API endpoints |
| `ui_paths` | array | Related UI locations |

---

## Category Definitions

| Category | Description | Examples |
|----------|-------------|----------|
| `auth` | Authentication & authorization | Login, 2FA, password reset |
| `payment` | Payment processing | Checkout, refunds, disputes |
| `device` | Device management | RustDesk, device status, connections |
| `subscription` | Subscription lifecycle | Plans, billing, cancellation |
| `admin` | Admin-only features | Dashboard, client management |
| `client` | Client-facing features | Dashboard, profile, devices |
| `support` | Customer support | Tickets, help center |
| `system` | System-level features | Settings, integrations, health |

---

## Audience Definitions

| Audience | Description | Access Level |
|----------|-------------|--------------|
| `customer-support` | AI/human answering customer questions | Read customer data |
| `internal-ops` | AI/human managing operations | Full admin access |
| `sales` | AI/human handling sales inquiries | Read pricing, features |
| `admin` | Human admin team | Full access |
| `developer` | Technical integration | API access |
| `ai-agent` | Mastra AI agents | Varies by role |

---

## Content Guidelines

### For AI Agent Consumption

1. **Be explicit**: State facts directly, don't imply
2. **Use consistent terminology**: Same term = same meaning everywhere
3. **Include decision criteria**: When X, do Y
4. **Provide examples**: Real values, not placeholders
5. **State permissions clearly**: Who can do what

### For Human Readers

1. **Lead with the action**: What can they do?
2. **Use visual hierarchy**: Headers, lists, tables
3. **Include screenshots**: For UI features (path: `/docs/images/`)
4. **Link related docs**: Don't repeat, reference

---

## Action Documentation Format

Actions are critical for AI agents. Use this format:

```markdown
### Action: {Action Name}

**Description**: What this action does

**Trigger**:
- UI: Click [Button Name] at /path/to/page
- API: `POST /api/endpoint`
- Automated: Triggered by {event}

**Permissions**:
- Role: ADMIN | CLIENT
- Additional: {any special requirements}

**Input**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| field_name | string | Yes | What this field is |

**Output**:
| Field | Type | Description |
|-------|------|-------------|
| result | object | What is returned |

**Side Effects**:
- Creates/updates X in database
- Sends email to Y
- Triggers webhook Z

**Example**:
```json
{
  "input": { "field": "value" },
  "output": { "result": "success" }
}
```

**Error Handling**:
| Error | Cause | Resolution |
|-------|-------|------------|
| ERROR_CODE | Why it happens | How to fix |
```

---

## API Documentation Format

For API endpoints, use this structure:

```markdown
---
id: api-endpoint-name
title: Endpoint Name
type: api
category: {category}
audience: [developer, ai-agent]
status: current
last_updated: YYYY-MM-DD
version: 1.0
---

# {Endpoint Name}

## Summary
One sentence describing what this endpoint does.

## Quick Reference
```yaml
method: GET | POST | PUT | DELETE
path: /api/path
auth: required | optional | none
rate_limit: X requests per Y
```

## Endpoint Details

**URL**: `{METHOD} /api/path`

**Authentication**: Bearer token / Session cookie / None

**Headers**:
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

## Request

**Parameters**:
| Name | Location | Type | Required | Description |
|------|----------|------|----------|-------------|
| id | path | string | Yes | Resource ID |
| page | query | number | No | Page number |

**Body**:
```json
{
  "field": "type - description"
}
```

## Response

**Success (200)**:
```json
{
  "success": true,
  "data": {}
}
```

**Errors**:
| Status | Code | Message | Resolution |
|--------|------|---------|------------|
| 400 | INVALID_INPUT | Description | How to fix |
| 401 | UNAUTHORIZED | Not authenticated | Login first |
| 403 | FORBIDDEN | No permission | Check role |

## Example

**Request**:
```bash
curl -X POST https://spear-global.com/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "abc123"
  }
}
```
```

---

## Process Documentation Format

For business workflows:

```markdown
---
id: process-name
title: Process Name
type: process
category: {category}
audience: [internal-ops, ai-agent]
status: current
last_updated: YYYY-MM-DD
version: 1.0
---

# {Process Name}

## Summary
One sentence describing this business process.

## Quick Reference
```yaml
trigger: What starts this process
owner: Who is responsible
duration: How long it typically takes
automation: full | partial | manual
```

## Process Flow

### Step 1: {Step Name}
- **Actor**: Who performs this
- **Action**: What they do
- **System**: What the system does
- **Next**: What triggers the next step

### Step 2: {Step Name}
...

## Decision Points

| Condition | Path A | Path B |
|-----------|--------|--------|
| If X | Do Y | Do Z |

## Failure Handling

| Failure Point | Detection | Recovery |
|---------------|-----------|----------|
| Step fails | How we know | What to do |

## Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Success rate | 99% | Track |
```

---

## Troubleshooting Documentation Format

```markdown
---
id: troubleshoot-issue-name
title: Issue Name
type: troubleshooting
category: {category}
audience: [customer-support, ai-agent]
status: current
last_updated: YYYY-MM-DD
version: 1.0
---

# {Issue Name}

## Symptoms
- What the user sees/experiences
- Error messages they might report

## Quick Diagnosis
```yaml
check_first: Most common cause
ask_user: Key question to ask
lookup: What to check in admin
```

## Causes & Solutions

### Cause 1: {Most Common Cause}

**Diagnosis**: How to confirm this is the issue
**Solution**:
1. Step one
2. Step two
**Prevention**: How to prevent recurrence

### Cause 2: {Second Cause}
...

## Escalation

If none of the above works:
- **Escalate to**: {team/person}
- **Provide**: {what info to include}
- **SLA**: {expected response time}
```

---

## File Organization

```
/docs/
├── DOCUMENTATION_STANDARD.md    # This file
├── INDEX.md                     # Master index
├── GLOSSARY.md                  # Term definitions
│
├── features/                    # Feature documentation
│   ├── auth/
│   ├── payment/
│   ├── device/
│   ├── subscription/
│   ├── admin/
│   ├── client/
│   └── support/
│
├── api/                         # API reference
│   ├── auth/
│   ├── payment/
│   ├── device/
│   ├── admin/
│   └── client/
│
├── processes/                   # Business processes
│   ├── payment-flow.md
│   ├── subscription-lifecycle.md
│   ├── device-fulfillment.md
│   └── support-workflow.md
│
├── guides/                      # How-to guides
│   ├── admin/
│   └── operations/
│
├── troubleshooting/             # Problem/solution docs
│   ├── payment/
│   ├── device/
│   └── access/
│
└── reference/                   # Quick reference
    ├── pricing.md
    ├── error-codes.md
    └── status-codes.md
```

---

## Mastra Agent Configuration

When loading docs for Mastra agents, use these filters:

### Customer Support Agent
```yaml
filters:
  audience: [customer-support, ai-agent]
  type: [feature, troubleshooting, reference]
  category: [client, payment, subscription, device, support]
capabilities:
  - answer_questions
  - lookup_status
  - explain_features
  - troubleshoot_issues
```

### Internal Operations Agent
```yaml
filters:
  audience: [internal-ops, ai-agent]
  type: [feature, api, process, guide, troubleshooting]
  category: all
capabilities:
  - manage_subscriptions
  - process_refunds
  - manage_devices
  - resolve_disputes
  - access_admin_functions
```

### Sales/Onboarding Agent
```yaml
filters:
  audience: [sales, ai-agent]
  type: [feature, reference]
  category: [payment, subscription, device]
capabilities:
  - explain_pricing
  - describe_features
  - guide_signup
  - answer_pre_sales
```

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-20 | 1.0 | Initial documentation standard |
