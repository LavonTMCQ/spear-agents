import "dotenv/config";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { embedMany } from "ai";
import { ModelRouterEmbeddingModel } from "@mastra/core/llm";
import { MDocument } from "@mastra/rag";
import { PgVector } from "@mastra/pg";

import { EMBED_MODEL, KB_PATH, RAG_INDEX } from "./config";

const databaseUrl = process.env.DATABASE_URL;
const embedder = new ModelRouterEmbeddingModel(EMBED_MODEL);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return [fullPath];
    })
  );
  return files.flat();
}

function makeId(value: string): string {
  return createHash("sha1").update(value).digest("hex");
}

function isTextFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return [".md", ".mdx", ".txt"].includes(ext);
}

export async function ingestKnowledgeBase(): Promise<void> {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for RAG ingestion.");
  }

  const root = path.resolve(KB_PATH);
  const allFiles = await walk(root);
  const files = allFiles.filter(isTextFile);

  if (files.length === 0) {
    console.log(`No knowledge base files found in ${root}`);
    return;
  }

  const vector = new PgVector({
    id: "spear-vector",
    connectionString: databaseUrl,
  });

  const chunkTexts: string[] = [];
  const chunkMeta: Record<string, unknown>[] = [];
  const chunkIds: string[] = [];

  for (const filePath of files) {
    const content = await readFile(filePath, "utf-8");
    const relativePath = path.relative(root, filePath);
    const ext = path.extname(filePath).toLowerCase();

    const doc =
      ext === ".md" || ext === ".mdx"
        ? MDocument.fromMarkdown(content, { source: relativePath })
        : MDocument.fromText(content, { source: relativePath });

    const chunks = await doc.chunk({
      strategy: ext === ".md" || ext === ".mdx" ? "semantic-markdown" : "recursive",
      maxSize: 800,
      overlap: 120,
      extract: { metadata: true },
    });

    chunks.forEach((chunk, index) => {
      const text = chunk.text.trim();
      if (!text) return;
      chunkTexts.push(text);
      chunkIds.push(makeId(`${relativePath}:${index}`));
      chunkMeta.push({
        ...chunk.metadata,
        source: relativePath,
        text,
      });
    });
  }

  if (chunkTexts.length === 0) {
    console.log("No chunkable content found.");
    return;
  }

  // Google API limits batches to 100 embeddings
  const BATCH_SIZE = 100;
  const embeddings: number[][] = [];

  for (let i = 0; i < chunkTexts.length; i += BATCH_SIZE) {
    const batch = chunkTexts.slice(i, i + BATCH_SIZE);
    console.log(`Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunkTexts.length / BATCH_SIZE)} (${batch.length} chunks)...`);
    const { embeddings: batchEmbeddings } = await embedMany({
      model: embedder,
      values: batch,
    });
    embeddings.push(...batchEmbeddings);
  }

  const existingIndexes = await vector.listIndexes();
  if (!existingIndexes.includes(RAG_INDEX)) {
    await vector.createIndex({
      indexName: RAG_INDEX,
      dimension: embeddings[0]?.length || 768,
      metric: "cosine",
    });
  }

  await vector.upsert({
    indexName: RAG_INDEX,
    vectors: embeddings,
    ids: chunkIds,
    metadata: chunkMeta,
  });

  await vector.disconnect();
  console.log(`Upserted ${chunkTexts.length} chunks into ${RAG_INDEX}`);
}

if (process.argv[1] && process.argv[1].includes("ingest")) {
  ingestKnowledgeBase().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
