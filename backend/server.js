const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;
const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "qwen2.5:1.5b-instruct";

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors());
app.use(express.json());

// --------------------------------------------------
// Load VITA Yoga Knowledge Base
// --------------------------------------------------

const knowledgePath = path.join(
  __dirname,
  "..",
  "data",
  "yoga_knowledge.json"
);

let yogaKnowledge;

try {
  yogaKnowledge = JSON.parse(
    fs.readFileSync(knowledgePath, "utf-8")
  );

  console.log(
    `Loaded ${yogaKnowledge.poses.length} yoga poses from knowledge base.`
  );
} catch (error) {
  console.error("Failed to load yoga knowledge:", error.message);
  process.exit(1);
}

// --------------------------------------------------
// Find relevant yoga poses
// --------------------------------------------------

function findRelevantPoses(message) {
  const text = message.toLowerCase();

  const matches = yogaKnowledge.poses.filter((pose) => {
    const name = pose.name.toLowerCase();
    const sanskrit = pose.sanskrit_name.toLowerCase();
    const id = pose.id.toLowerCase();

    return (
      text.includes(name) ||
      text.includes(sanskrit) ||
      text.includes(id.replace("_", " "))
    );
  });

  return matches;
}

// --------------------------------------------------
// Convert pose information into AI context
// --------------------------------------------------

function createYogaContext(poses) {
  return poses
    .map((pose) => {
      return `
POSE: ${pose.name}
SANSKRIT NAME: ${pose.sanskrit_name}
CATEGORY: ${pose.category}
DIFFICULTY: ${pose.difficulty}

DESCRIPTION:
${pose.description}

STEPS:
${pose.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

BREATHING:
${pose.breathing}

BENEFITS:
${pose.benefits.map((item) => `- ${item}`).join("\n")}

COMMON MISTAKES:
${pose.common_mistakes.map((item) => `- ${item}`).join("\n")}

BEGINNER MODIFICATIONS:
${pose.beginner_modifications.map((item) => `- ${item}`).join("\n")}

PRECAUTIONS:
${pose.precautions.map((item) => `- ${item}`).join("\n")}

SUGGESTED HOLD:
${pose.suggested_hold}
`;
    })
    .join("\n-----------------------------\n");
}

// --------------------------------------------------
// System prompt
// --------------------------------------------------

function createSystemPrompt(context) {
  return `
You are VITA Yoga Assistant, a helpful and beginner-friendly yoga assistant.

Your job is to answer questions about yoga clearly, simply, and safely.

IMPORTANT RULES:

1. Use the supplied VITA yoga knowledge as your primary factual source.

2. Do NOT invent pose-specific facts when the supplied knowledge does not contain them.

3. If the user's question is about one of the supported poses, answer using the relevant pose information.

4. If the question is not covered by the supplied knowledge, clearly say that VITA currently has limited knowledge about that topic instead of making up information.

5. Explain yoga instructions in simple beginner-friendly language.

6. When explaining a pose, prefer this structure when appropriate:
   - What it is
   - How to perform it
   - Breathing
   - Benefits
   - Common mistakes
   - Beginner modification
   - Precautions

7. Never diagnose injuries or medical conditions.

8. Never claim that yoga cures a disease or medical condition.

9. If someone reports significant pain, injury, dizziness, or another concerning symptom, advise them to stop the activity and seek appropriate professional guidance.

10. Do not unnecessarily make every answer extremely long.

11. Do not mention that you are using a JSON file, knowledge base, Ollama, Qwen, or an AI model unless the user specifically asks about the technology.

VITA CURRENT YOGA KNOWLEDGE:

${context}
`;
}

// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "VITA backend is running",
    model: MODEL,
    yogaPoses: yogaKnowledge.poses.length
  });
});

// --------------------------------------------------
// Chat API
// --------------------------------------------------

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    console.log(`User: ${message}`);

    // Find poses related to the question
    let relevantPoses = findRelevantPoses(message);

    // If no exact pose is mentioned, provide compact knowledge
    // about all five supported poses.
    if (relevantPoses.length === 0) {
      relevantPoses = yogaKnowledge.poses;
    }

    const yogaContext = createYogaContext(relevantPoses);

    const systemPrompt = createSystemPrompt(yogaContext);

    // ------------------------------------------------
    // Send request to Ollama
    // ------------------------------------------------

    const ollamaResponse = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,

        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],

        stream: false,

        options: {
          temperature: 0.2,
          top_p: 0.8
        }
      })
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();

      console.error("Ollama error:", errorText);

      return res.status(500).json({
        error: "Ollama could not generate a response."
      });
    }

    const data = await ollamaResponse.json();

    const answer =
      data.message?.content ||
      "Sorry, I couldn't generate an answer right now.";

    console.log(`VITA AI: ${answer}`);

    res.json({
      answer,
      model: MODEL,
      matchedPoses: relevantPoses.map((pose) => pose.name)
    });

  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      error: "Something went wrong while processing your question."
    });
  }
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`VITA backend running on http://localhost:${PORT}`);
  console.log(`Using Ollama model: ${MODEL}`);
});