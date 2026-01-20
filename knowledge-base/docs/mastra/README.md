# SPEAR Mastra Agent Configurations

This directory contains configuration files for Mastra AI agents that power SPEAR's customer support, internal operations, and sales/onboarding automation.

## Agent Types

| Agent | Purpose | Access Level |
|-------|---------|--------------|
| **Customer Support** | Answer questions, troubleshoot issues | Read-only customer data |
| **Internal Ops** | Manage subscriptions, devices, refunds | Full admin actions |
| **Sales/Onboarding** | Pre-sales questions, guide signups | Read pricing, features |

## Files

| File | Purpose |
|------|---------|
| `customer-support-agent.yaml` | Customer support agent config |
| `internal-ops-agent.yaml` | Internal operations agent config |
| `sales-agent.yaml` | Sales/onboarding agent config |
| `shared-tools.yaml` | Shared tool definitions |
| `knowledge-base.yaml` | Documentation loading config |

## Quick Start

### 1. Load Documentation
```typescript
import { loadKnowledgeBase } from './knowledge-base';

const docs = await loadKnowledgeBase({
  agentType: 'customer-support',
  includeTypes: ['feature', 'troubleshooting', 'reference']
});
```

### 2. Configure Agent
```typescript
import { CustomerSupportAgent } from './agents/customer-support';

const agent = new CustomerSupportAgent({
  knowledgeBase: docs,
  tools: loadTools('customer-support')
});
```

### 3. Run Agent
```typescript
const response = await agent.respond({
  query: "I can't connect to my device",
  context: { customerId: '123' }
});
```

## Documentation Structure

The agents load documentation from `/docs/` following this structure:

```
/docs/
├── INDEX.md                    # Master index
├── GLOSSARY.md                 # Term definitions
├── features/                   # Feature documentation
├── api/                        # API reference
├── processes/                  # Business processes
├── troubleshooting/            # Problem/solution docs
└── reference/                  # Quick reference
```

## Permissions Model

| Agent | Can Read | Can Write | Can Action |
|-------|----------|-----------|------------|
| Support | Customer data, subscriptions | Support tickets | Escalate |
| Ops | All data | Orders, subscriptions, devices | Full CRUD |
| Sales | Pricing, features | None | None |

## Integration

### With SPEAR Backend
Agents can call SPEAR APIs using the defined tools:
- `lookupCustomer` - Get customer info
- `getDeviceStatus` - Check device status
- `getSubscriptionStatus` - Check subscription
- `createSupportTicket` - Create ticket
- `processRefund` - Process refund (ops only)

### With External Systems
- PayPal API (via SPEAR backend)
- RustDesk API (via SPEAR backend)

## Testing

```bash
# Test customer support agent
pnpm test:agent customer-support

# Test with sample queries
pnpm test:agent:queries
```
