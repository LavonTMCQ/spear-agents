import { Memory } from "@mastra/memory";
import { PgVector } from "@mastra/pg";
import { ModelRouterEmbeddingModel } from "@mastra/core/llm";

const databaseUrl = process.env.DATABASE_URL;
const embedModel = process.env.SPEAR_EMBED_MODEL || "google/text-embedding-004";
const embedder = new ModelRouterEmbeddingModel(embedModel);

const vector = databaseUrl
  ? new PgVector({
      id: "spear-vector",
      connectionString: databaseUrl,
    })
  : undefined;

const workingMemoryTemplate = `# Customer Profile
- Account name:
- Primary admin:
- Plan:
- Device count:
- BYOD or device included:
- Preferred contact method:
- Known issues:
- Last resolution:
`;

export const sharedMemory = new Memory({
  ...(vector ? { vector, embedder } : {}),
  options: {
    lastMessages: 20,
    workingMemory: {
      enabled: true,
      scope: "resource",
      template: workingMemoryTemplate,
    },
    semanticRecall: vector
      ? {
          topK: 5,
          messageRange: 2,
          scope: "resource",
        }
      : false,
  },
});
