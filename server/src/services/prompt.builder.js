
const buildPrompt = (question, language = "JavaScript") => `
You are an expert DSA teacher. A student has asked about this problem:

"${question}"

Generate a complete learning response. You must respond with ONLY a valid JSON object.
No preamble, no explanation, no markdown code fences.
Start your response with { and end with }.
All fields must be present. Use empty string "" or [] if not applicable.

Generate all code examples in ${language}.

The JSON must follow this EXACT structure:

{
  "topic": "the DSA topic or pattern this belongs to",

  "firstPrinciples": [
    "Socratic question 1 to make student think",
    "Socratic question 2",
    "Socratic question 3"
  ],

  "hints": {
    "hint1": "first gentle hint without giving away solution",
    "hint2": "stronger hint — mention the data structure or technique",
    "pseudocode": "step by step pseudocode without actual code syntax"
  },

  "intuition": "the core insight — the aha moment in 2-3 sentences",

  "bruteForce": {
    "explanation": "why brute force works and why it is slow",
    "code": "complete working brute force code in ${language}",
    "time": "O(...) with brief reason",
    "space": "O(...) with brief reason"
  },

  "optimalSolutions": {
    "sameLogic": true,
    "solutions": [
      {
        "label": "Striver",
        "style": "Pattern-first, interview-ready",
        "explanation": "Start with: The intuition here is...",
        "code": "Clean concise ${language} code",
        "time": "O(...)",
        "space": "O(...)",
        "keyInsight": "one-liner"
      },
      {
        "label": "Love Babbar",
        "style": "Step-by-step, beginner-friendly",
        "dryRun": "Manual trace",
        "explanation": "Let us break this down step by step",
        "code": "${language} code with comments",
        "time": "O(...)",
        "space": "O(...)",
        "whatEachVariableDoes": "variable explanation"
      },
      {
        "label": "Official Docs",
        "style": "Formal, pseudocode-first",
        "pseudocode": "Formal pseudocode",
        "explanation": "Formal explanation",
        "code": "${language} code with JSDoc comments",
        "time": "Theta(...)",
        "space": "O(...)",
        "edgeCases": [],
        "correctnessProof": "proof"
      }
    ]
  },

  "traceTable": {
    "variables": ["col1", "col2", "col3"],
    "rows": []
  },

  "edgeCases": [
    "empty input",
    "single element",
    "all duplicates"
  ],

  "interviewTip": "interview approach",

  "explainBackPrompt": "Ask the student to explain the core idea"
}

Remember:
- Return ONLY JSON.
- No markdown.
- No explanations.
- No text before or after the JSON.
`;

module.exports = {
  buildPrompt,
};