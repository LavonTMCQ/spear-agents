import type { MastraScorers } from "@mastra/core/evals";
import { supportScorers } from "./support";

export function getSupportScorers(): MastraScorers | undefined {
  if (process.env.SPEAR_SCORERS_ENABLED !== "true") {
    return undefined;
  }
  return supportScorers;
}
