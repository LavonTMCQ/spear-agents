import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";

import { customerSupportAgent } from "./customer-support";
import { salesAgent } from "./sales";
import { internalOpsAgent } from "./internal-ops";
import { sharedMemory } from "../shared/memory";

export const spearRouter = new Agent({
  id: "spear-router",
  name: "SPEAR",
  description: "Routes requests to the appropriate SPEAR agent",
  instructions: `You route user requests to the right SPEAR agent. Be fast and direct.

ROUTING:
- Sales (pricing, features, signup, "what is SPEAR") -> salesAgent
- Support (account issues, devices, billing, passwords) -> customerSupportAgent
- Admin (refunds, cancellations, metrics, disputes) -> internalOpsAgent

Default to sales for general questions. Use support if they mention being a customer.
Route quickly. Do not add extra commentary.`,
  model: google("gemini-3.0-flash"),
  agents: {
    salesAgent,
    customerSupportAgent,
    internalOpsAgent,
  },
  memory: sharedMemory,
});
