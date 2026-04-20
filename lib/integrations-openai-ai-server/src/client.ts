import OpenAI from "openai";

const xaiKey = process.env.XAI_API_KEY;
const replitKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const replitBase = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

if (!xaiKey && !replitKey) {
  throw new Error(
    "No AI API key found. Set XAI_API_KEY in your .env file (get one at console.x.ai).",
  );
}

export const openai = xaiKey
  ? new OpenAI({ apiKey: xaiKey, baseURL: "https://api.x.ai/v1" })
  : new OpenAI({ apiKey: replitKey!, baseURL: replitBase });

export const AI_MODEL = xaiKey ? "grok-3" : "gpt-4o";
