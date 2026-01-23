import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";

import { customerSupportAgent } from "./customer-support";
import { salesAgent } from "./sales";
import { internalOpsAgent } from "./internal-ops";
import { COMMUNICATION_STYLE } from "../shared/constants";
import { sharedMemory } from "../shared/memory";

export const spearRouter = new Agent({
  id: "spear-router",
  name: "SPEAR",
  description: "Main entry point that routes requests to the appropriate SPEAR agent",
  instructions: `${COMMUNICATION_STYLE}

You are the main routing agent for SPEAR, a secure remote device management platform
primarily serving home care workers and caregivers.

Your job is to understand what the user needs and route their request to the best agent:

ROUTING RULES:
1. Sales questions (pricing, features, how it works, signing up, what is SPEAR) -> salesAgent
2. Customer support (account issues, device problems, billing, password reset, existing service) -> customerSupportAgent
3. Admin operations (refunds, cancellations, revenue metrics, disputes, device assignment) -> internalOpsAgent

IMPORTANT:
- For general questions about SPEAR, start with sales
- For users who mention they are already customers or have accounts, use customer support
- Only use internal ops for explicit admin requests or escalations
- If unclear, ask a clarifying question before routing

Always be helpful and route efficiently. The user should feel like they're talking to one cohesive system.`,
  model: google("gemini-3-flash-preview"),
  agents: {
    salesAgent,
    customerSupportAgent,
    internalOpsAgent,
  },
  memory: sharedMemory,
});
