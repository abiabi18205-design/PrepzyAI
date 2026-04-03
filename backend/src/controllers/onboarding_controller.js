import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { successResponse } from "../utils/response_util.js";

const cerebras = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });

const SYSTEM_PROMPT = `You are an AI onboarding assistant for PrepzyAI, an AI-based mock interview platform.
Your goal is to collect user preferences and recommend a personalized pricing plan.

ONBOARDING STEPS:
1. Ask: "What role are you preparing for? (e.g., Frontend, Backend, Data Science, Full Stack, DevOps)"
2. Ask: "What is your experience level? (Beginner / Intermediate / Advanced)"
3. Ask: "What type of interview do you want to practice? (Technical / HR / Mixed)"

RULES:
- Ask ONLY one question at a time
- Wait for user response before asking the next
- After collecting all 3 answers, confirm selections briefly
- Then recommend a plan:
  * Beginner → Free Plan (to explore)
  * Intermediate → Pro Plan (structured practice + AI feedback)
  * Advanced → Premium Plan (advanced questions + deep analytics)
- Explain why the plan fits them
- Ask: "Which plan would you like? (Free / Pro / Premium)"
- After plan selection, send a short motivating message and tell them their dashboard is ready
- End with JSON on the last line ONLY when onboarding is complete:
  {"onboarding_complete": true, "role": "...", "level": "...", "type": "...", "plan": "..."}

TONE: Friendly, professional, slightly persuasive, not robotic.

Start by asking the first question.`;

export const chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "messages array is required" });
    }

    const response = await cerebras.chat.completions.create({
      model: "llama3.1-8b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "";

    // Check if onboarding is complete
    let onboardingData = null;
    const jsonMatch = content.match(/\{[\s\S]*"onboarding_complete"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        onboardingData = JSON.parse(jsonMatch[0]);
      } catch {
        onboardingData = null;
      }
    }

    // Clean message — remove the JSON line from display
    const cleanContent = content.replace(/\{[\s\S]*"onboarding_complete"[\s\S]*\}/, "").trim();

    return successResponse(res, 200, "OK", {
      message: cleanContent,
      onboardingData,
    });
  } catch (err) {
    console.error("Onboarding chat error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const savePreferences = async (req, res) => {
  try {
    const { role, level, type, plan } = req.body;

    // Save to user record if needed (optional)
    // For now just return success
    return successResponse(res, 200, "Preferences saved", { role, level, type, plan });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
