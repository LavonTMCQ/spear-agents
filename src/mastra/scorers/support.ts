import { createScorer } from "@mastra/core/evals";

export const supportResponseQualityScorer = createScorer({
  id: "support-response-quality",
  description: "Basic quality check for support responses (non-empty and actionable).",
  type: "agent",
})
  .generateScore(({ run }) => {
    const text = String((run.output as any)?.text || "").trim();
    if (!text) return 0;
    const hasAction = /next step|please|try|check|restart|verify|open/i.test(text);
    return hasAction ? 1 : 0;
  })
  .generateReason(({ run }) => {
    const text = String((run.output as any)?.text || "").trim();
    if (!text) return "No response text was generated.";
    return "Response contains actionable guidance.";
  });

export const supportScorers = {
  supportResponseQuality: {
    scorer: supportResponseQualityScorer,
    sampling: { type: "ratio", rate: 0.2 },
  },
};
