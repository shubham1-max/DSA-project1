
const { z } = require("zod");

const aiResponseSchema = z.object({
  topic: z.string(),

  firstPrinciples: z.array(z.string()),

  hints: z.object({
    hint1: z.string(),
    hint2: z.string(),
    hint3: z.string(),
  }),

  intuition: z.string(),

  bruteForce: z.object({
    idea: z.string(),
    timeComplexity: z.string(),
    spaceComplexity: z.string(),
    code: z.string(),
  }),

  optimalSolutions: z.object({
    sameLogic: z.string(),

    solutions: z.array(
      z.object({
        title: z.string(),
        approach: z.string(),
        timeComplexity: z.string(),
        spaceComplexity: z.string(),
        code: z.string(),
      })
    ).min(1).max(3),
  }),

  traceTable: z.object({
    variables: z.array(z.string()),

    rows: z.array(
      z.record(z.any())
    ),
  }),

  edgeCases: z.array(z.string()),

  interviewTip: z.string(),

  explainBackPrompt: z.string(),
});

module.exports = {
  aiResponseSchema,
};