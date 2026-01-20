import { Mastra } from "@mastra/core/mastra";
import { customerSupportAgent, internalOpsAgent, salesAgent } from "./agents";

export const mastra = new Mastra({
  agents: {
    customerSupport: customerSupportAgent,
    internalOps: internalOpsAgent,
    sales: salesAgent,
  },
});
        