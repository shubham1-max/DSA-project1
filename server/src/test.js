// require("dotenv").config({
//   path: "../.env",
// });
require("dotenv").config()
const { GoogleGenAI } = require("@google/genai");
const { buildPrompt } = require("./services/prompt.builder");
const { aiResponseSchema } = require("./models/aiResponse.schema");

console.log("API KEY =", process.env.GEMINI_API_KEY);
console.log("Current Directory =", process.cwd());

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const QUESTIONS = [
  "find all duplicates in an array of integers",
  "check if a linked list has a cycle",
  "find the longest substring without repeating characters",
];

async function runTests() {
  for (const question of QUESTIONS) {
    console.log("\n\n─────────────────────────────────────");
    console.log(`Testing: "${question}"`);
    console.log("─────────────────────────────────────");

    let buffer = "";

    const stream = await client.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: buildPrompt(question, "JavaScript"),
      config: {
        responseMimeType: "application/json",
      },
    });

    process.stdout.write("Streaming: ");

    for await (const chunk of stream) {
      const text = chunk.text || "";

      process.stdout.write(".");
      buffer += text;
    }

    try {
      const parsed = aiResponseSchema.parse(JSON.parse(buffer));

      console.log("\n✅ PASS");
      console.log("   Topic      :", parsed.topic);
      console.log(
        "   Solutions  :",
        parsed.optimalSolutions.solutions.map((s) => s.label).join(" · "),
      );
      console.log("   TraceRows  :", parsed.traceTable.rows.length);
      console.log("   sameLogic  :", parsed.optimalSolutions.sameLogic);
    } catch (err) {
      console.log("\n❌ FAIL —", err.message);
      console.log("Raw response (first 300 chars):", buffer.slice(0, 300));
    }
  }
}

runTests();
