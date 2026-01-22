# CLAUDE.md - SPEAR Agents

This file documents the SPEAR AI Agents system built with Mastra, including architecture, tools, deployment, and how to make changes.

## Project Overview

SPEAR Agents is the AI assistant system for the SPEAR remote device management platform. It provides intelligent customer support, sales assistance, and internal operations capabilities through specialized AI agents.

**Tech Stack:**
- **Framework:** Mastra (AI agent framework)
- **Model:** Google Gemini 3 Pro Preview
- **Database:** PostgreSQL with pgvector extension (Railway)
- **Deployment:** Railway
- **Knowledge Base:** RAG with pgvector embeddings

## Architecture

### Two Repositories Working Together

```
/Users/coldgame/spear/
├── spear/                    # Main SPEAR app (Vercel)
│   └── src/app/api/agent/    # API endpoints for agents
└── spear-agents/             # AI Agents (Railway)
    └── src/mastra/           # Agent code
```

1. **SPEAR Main App** (`spear/`) - Deployed on Vercel at `spear-global.com`
   - Contains API endpoints the agents call
   - `/api/agent/devices` - Device lookup for agents
   - `/api/agent/subscription` - Subscription status lookup for agents
   - `/api/agent/tickets` - Support ticket creation and viewing for agents
   - `/api/agent/orders` - Order and shipping status lookup for agents
   - `/api/agent/coupons/validate` - Coupon code validation for agents
   - `/api/agent/billing` - Billing history and payment summary for agents
   - `/api/agent/resend-setup` - Resend welcome/setup email for agents
   - `/api/agent/cancel-request` - Submit cancellation request (creates ticket)
   - `/api/agent/health-check` - Comprehensive account health check
   - `/api/agent/onboarding` - Onboarding progress tracking (BYOD/Furnished)

2. **SPEAR Agents** (`spear-agents/`) - Deployed on Railway
   - Contains the Mastra agents and tools
   - Deployed at `spear-agents-production.up.railway.app`

### Agent Architecture

```
spearRouter (Main Entry Point)
    ├── salesAgent (Pre-sales, pricing, signup)
    ├── customerSupportAgent (Account issues, troubleshooting)
    └── internalOpsAgent (Admin operations, refunds)
```

## Key Files

### Agents
- `src/mastra/agents/index.ts` - Agent definitions and exports
- `src/mastra/agents/spear-router.ts` - Main routing agent
- `src/mastra/agents/customer-support.ts` - Support agent
- `src/mastra/agents/sales.ts` - Sales agent
- `src/mastra/agents/internal-ops.ts` - Admin operations agent

### Tools
- `src/mastra/tools/customer-tools.ts` - Customer-facing tools
- `src/mastra/tools/admin-tools.ts` - Admin-only tools
- `src/mastra/tools/index.ts` - Tool exports

### RAG / Knowledge Base
- `src/mastra/rag/ingest.ts` - Knowledge base ingestion script
- `src/mastra/rag/retrieval.ts` - RAG retrieval functions
- `src/mastra/rag/config.ts` - RAG configuration
- `knowledge-base/` - Markdown documentation for RAG

### Memory
- `src/mastra/shared/memory.ts` - Shared memory configuration with semantic recall

### Main Mastra Config
- `src/mastra/index.ts` - Main Mastra instance configuration

## Environment Variables

### Railway (spear-agents)
```env
DATABASE_URL=postgres://...@metro.proxy.rlwy.net:34125/railway  # pgvector DB
GOOGLE_GENERATIVE_AI_API_KEY=...                                 # Gemini API
SPEAR_API_URL=https://www.spear-global.com/api                  # SPEAR API
SPEAR_API_KEY=...                                                # API auth key
```

### Vercel (spear main app)
```env
SPEAR_AGENT_API_KEY=...  # Must match SPEAR_API_KEY in Railway
```

### Local Development (.env)
```env
GOOGLE_GENERATIVE_AI_API_KEY=...
SPEAR_API_URL=https://www.spear-global.com/api
SPEAR_API_KEY=...
DATABASE_URL=postgres://...@metro.proxy.rlwy.net:34125/railway
SPEAR_KB_PATH=./knowledge-base
SPEAR_RAG_INDEX=spear_kb
SPEAR_RAG_TOP_K=5
SPEAR_EMBED_MODEL=google/text-embedding-004
```

## Common Commands

### Development
```bash
pnpm dev          # Start Mastra dev server (localhost:4111)
pnpm build        # Build for production
pnpm start        # Start production server
```

### Knowledge Base / RAG
```bash
pnpm rag:ingest   # Ingest knowledge base into pgvector
```

### Deployment
```bash
git add . && git commit -m "message"
git push origin main   # Auto-deploys to Railway
```

## How to Make Changes

### Adding a New Tool

1. **Create the tool** in `src/mastra/tools/customer-tools.ts` or `admin-tools.ts`:
```typescript
export const myNewTool = createTool({
  id: "myNewTool",
  description: "What this tool does",
  inputSchema: z.object({
    param: z.string().describe("Parameter description"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.string().nullable(),
  }),
  execute: async ({ param }) => {
    // Tool logic here
    const data = await spearApi(`/endpoint?param=${param}`);
    return { success: true, data };
  },
});
```

2. **Export the tool** in `src/mastra/tools/index.ts`

3. **Add to agent** in the agent definition file

4. **If tool needs SPEAR API endpoint:**
   - Create endpoint in `spear/src/app/api/agent/[endpoint]/route.ts`
   - Use `requireAgentAuth(request)` for API key auth
   - Deploy SPEAR to Vercel first, then deploy agents to Railway

### Adding Knowledge Base Content

1. Add markdown files to `knowledge-base/docs/`
2. Run ingestion: `pnpm rag:ingest`
3. Push to Railway to update production

### Modifying Agent Behavior

1. Edit the agent file in `src/mastra/agents/`
2. Modify `instructions` for prompt changes
3. Modify `tools` array to add/remove tools
4. Push to Railway

## API Authentication

The agents authenticate with SPEAR API using Bearer token:

```typescript
// In spear-agents tools
const response = await fetch(`${SPEAR_API_URL}/agent/endpoint`, {
  headers: {
    "Authorization": `Bearer ${SPEAR_API_KEY}`,
  },
});
```

```typescript
// In spear API route
import { requireAgentAuth } from "@/lib/agent-auth";

export async function GET(request: NextRequest) {
  const authError = requireAgentAuth(request);
  if (authError) return authError;
  // ... handle request
}
```

## Database Architecture

### Two Databases on Railway

1. **Postgres** (`gondola.proxy.rlwy.net:31227`) - Regular Postgres (NOT USED by agents)
2. **pgvector** (`metro.proxy.rlwy.net:34125`) - Postgres + pgvector extension (USED by agents)

The agents use pgvector for:
- `PostgresStore` - Agent state and storage
- `PgVector` - RAG embeddings and semantic memory

**Important:** Always use the pgvector DATABASE_URL, not the regular Postgres one.

## Troubleshooting

### "pgvector not found" error
- Check DATABASE_URL points to pgvector DB (metro.proxy.rlwy.net), not regular Postgres (gondola.proxy.rlwy.net)

### Agent can't access SPEAR API
- Check SPEAR_API_KEY is set in Railway environment variables
- Check SPEAR_AGENT_API_KEY is set in Vercel environment variables
- Ensure both keys match

### Knowledge base not returning results
- Run `pnpm rag:ingest` to re-ingest
- Check DATABASE_URL points to pgvector
- Verify chunks were inserted: check logs for "Upserted X chunks"

### Changes not reflecting in production
- Push to git: `git push origin main`
- Railway auto-deploys on push
- Check Railway dashboard for deployment status
- If env vars changed, Railway will auto-redeploy

## Railway Dashboard

- **Project URL:** https://railway.com/project/99c80c32-42fb-45c9-9709-8bacc7585711
- **Services:**
  - spear-agents (main service)
  - Postgres (regular DB - not used by agents)
  - pgvector (vector DB - used by agents)

## Production URLs

- **Agents API:** https://spear-agents-production.up.railway.app
- **SPEAR Website:** https://spear-global.com
- **SPEAR API:** https://www.spear-global.com/api

## Current Tools

### Customer Tools (customer-tools.ts)
- `lookupCustomer` - Look up customer by email
- `getSubscriptionStatus` - Get subscription details by customer email
- `getDeviceStatus` - Get device info by customer email
- `getOrderStatus` - Get order/shipping status and tracking by email
- `validateCoupon` - Check if a coupon code is valid (don't give out codes!)
- `getBillingHistory` - Get billing history, invoices, and payment totals
- `resendSetupEmail` - Resend welcome/setup email to customer
- `requestCancellation` - Submit cancellation request (creates ticket for admin review)
- `checkFounderSlots` - Check founder pricing availability
- `checkRefundEligibility` - Check if order qualifies for refund
- `createSupportTicket` - Create support ticket by customer email (appears in admin dashboard)
- `getSupportTickets` - View customer's support tickets by email
- `sendPasswordReset` - Trigger password reset email
- `searchKnowledgeBase` - RAG search for policies/docs
- `checkAccountHealth` - Comprehensive account health check (subscription, devices, orders, issues)
- `getQuickDeviceInfo` - Quick RustDesk ID/password reference for customer devices
- `getOnboardingProgress` - Onboarding progress tracking with next steps (BYOD/Furnished)
- `troubleshootConnection` - Interactive connection troubleshooter with targeted diagnoses

### Admin Tools (admin-tools.ts)
- `getOrderDetails` - Get order information
- `processRefund` - Process a refund
- `extendSubscription` - Extend subscription period
- `cancelSubscription` - Cancel subscription
- `assignDevice` - Assign device to customer
- `getRevenueMetrics` - Get revenue data
- `listDisputes` - List payment disputes

## Future Development

### RustDesk Integration (Planned)
Connect agents to RustDesk to enable:
- Real-time device connection status check ("is my device online?")
- Remote connection troubleshooting
- Device connectivity diagnostics

This will require:
1. RustDesk API integration in SPEAR
2. New `/api/agent/rustdesk/status` endpoint
3. New `checkDeviceConnection` tool for agents
