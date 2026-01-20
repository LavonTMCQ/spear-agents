import { ModelRouterEmbeddingModel } from "@mastra/core/llm";
import { PgVector } from "@mastra/pg";
import { MastraAgentRelevanceScorer, rerankWithScorer } from "@mastra/rag";
import type { QueryResult } from "@mastra/core/vector";
import type { PGVectorFilter } from "@mastra/pg/dist/vector/filter";

import { EMBED_MODEL, RAG_INDEX, RAG_TOP_K, RERANK_MODEL } from "./config";

const databaseUrl = process.env.DATABASE_URL;

const vector = databaseUrl
  ? new PgVector({
      id: "spear-vector",
      connectionString: databaseUrl,
    })
  : undefined;

const embedder = new ModelRouterEmbeddingModel(EMBED_MODEL);

type RetrievalOptions = {
  topK?: number;
  filter?: PGVectorFilter;
};

export async function retrieveKnowledge(
  query: string,
  options: RetrievalOptions = {}
): Promise<QueryResult[]> {
  if (!vector) {
    return [];
  }

  const { embeddings } = await embedder.doEmbed({ values: [query] });
  const [queryVector] = embeddings;
  const topK = options.topK ?? RAG_TOP_K;

  const results = await vector.query({
    indexName: RAG_INDEX,
    queryVector,
    topK,
    filter: options.filter,
    includeVector: false,
  });

  if (!RERANK_MODEL) {
    return results;
  }

  const scorer = new MastraAgentRelevanceScorer("spear-rerank", RERANK_MODEL);
  return rerankWithScorer({
    results,
    query,
    scorer,
    options: { topK },
  });
}

export function formatRagContext(results: QueryResult[], limit = 5): string {
  const snippets = results
    .slice(0, limit)
    .map((result, index) => {
      const text = result.metadata?.text;
      if (!text) return null;
      const source = result.metadata?.source || result.metadata?.path || "kb";
      return `[#${index + 1}] ${source}\n${text}`;
    })
    .filter(Boolean);

  if (snippets.length === 0) {
    return "";
  }

  return `Knowledge base snippets:\n\n${snippets.join("\n\n")}`;
}
