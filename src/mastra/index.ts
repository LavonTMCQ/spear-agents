import { Mastra } from "@mastra/core/mastra";
import { PostgresStore } from "@mastra/pg";
import { DefaultExporter, Observability, SensitiveDataFilter } from "@mastra/observability";
import { customerSupportAgent, internalOpsAgent, salesAgent, spearRouter } from "./agents";
import { getSupportScorers } from "./scorers";
import { cantCheckInWorkflow } from "./workflows";

const databaseUrl = process.env.DATABASE_URL;

const storage = databaseUrl
  ? new PostgresStore({
      id: "spear-storage",
      connectionString: databaseUrl,
    })
  : undefined;

const scorers = getSupportScorers();

const observability =
  process.env.MASTRA_TRACING_ENABLED === "true"
    ? new Observability({
        configs: {
          default: {
            serviceName: process.env.MASTRA_TRACING_SERVICE_NAME || "spear-agents",
            exporters: [new DefaultExporter()],
            spanOutputProcessors: [new SensitiveDataFilter()],
          },
        },
      })
    : undefined;

export const mastra = new Mastra({
  ...(storage ? { storage } : {}),
  ...(scorers ? { scorers } : {}),
  ...(observability ? { observability } : {}),
  agents: {
    // Main router - use this as the entry point
    spear: spearRouter,
    // Individual agents (can still be accessed directly if needed)
    customerSupport: customerSupportAgent,
    internalOps: internalOpsAgent,
    sales: salesAgent,
  },
  workflows: {
    cantCheckIn: cantCheckInWorkflow,
  },
});
        
