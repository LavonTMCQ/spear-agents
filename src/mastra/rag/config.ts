export const RAG_INDEX = process.env.SPEAR_RAG_INDEX || "spear_kb";
export const RAG_TOP_K = Number(process.env.SPEAR_RAG_TOP_K || 5);
export const EMBED_MODEL = process.env.SPEAR_EMBED_MODEL || "google/text-embedding-004";
export const RERANK_MODEL = process.env.SPEAR_RERANK_MODEL || "";
export const KB_PATH = process.env.SPEAR_KB_PATH || "./knowledge-base";
