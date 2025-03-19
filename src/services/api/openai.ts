
import OpenAI from "openai";

// Initialize OpenAI with user-provided API key
let openaiClient: OpenAI | null = null;
let openaiApiKey = "";

// Function to set the API key
export function setOpenAIApiKey(apiKey: string) {
  if (!apiKey) {
    openaiClient = null;
    openaiApiKey = "";
    return false;
  }
  
  try {
    openaiApiKey = apiKey;
    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    return true;
  } catch (error) {
    console.error("Error initializing OpenAI client:", error);
    openaiClient = null;
    openaiApiKey = "";
    return false;
  }
}

// Function to get current OpenAI API key
export function getOpenAIApiKey(): string {
  return openaiApiKey;
}

// Function to get the OpenAI client instance
export function getOpenAIClient(): OpenAI | null {
  return openaiClient;
}
