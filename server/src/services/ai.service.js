const { GoogleGenAI } = require("@google/genai");
const { buildPrompt } = require("./prompt.builder");
const { aiResponseSchema } = require("../models/aiResponse.schema");

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Called by problem.controller.js
// Streams Gemini tokens to SSE response
// Returns the parsed+validated aiResponse object

const streamSolution = async (question, language = "C++", res) => {
  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let buffer = "";

  try {
    // Gemini streaming call
    const stream = await client.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: buildPrompt(question, language),
      config: {
        responseMimeType: "application/json",
      },
    });

    // Stream each token to client
    for await (const chunk of stream) {
      const text = chunk.text || "";

      buffer += text;

      res.write(
        `data: ${JSON.stringify({
          token: text,
        })}\n\n`,
      );
    }

    // Validate final JSON
    let parsed;

    try {
      parsed = aiResponseSchema.parse(JSON.parse(buffer));
    } catch (parseErr) {
      res.write(
        `data: ${JSON.stringify({
          error: "AI returned invalid response",
          retry: true,
        })}\n\n`,
      );

      res.end();
      return null;
    }

    // Send validated result
    res.write(
      `data: ${JSON.stringify({
        done: true,
        data: parsed,
      })}\n\n`,
    );

    res.end();

    return parsed;
  } catch (err) {
    console.error("[aiService] Stream error:", err.message);

    res.write(
      `data: ${JSON.stringify({
        error: "Streaming failed. Please try again.",
        retry: true,
      })}\n\n`,
    );

    res.end();

    return null;
  }
};

module.exports = {
  streamSolution,
};
