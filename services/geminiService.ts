import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION, FAQ_ANSWERS } from '../constants';

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const initializeAI = () => {
  if (!ai && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const createChatSession = (): Chat | null => {
  initializeAI();
  if (!ai) return null;

  try {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to create chat session:", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<GenerateContentResponse> | null> => {
  if (!chatSession) {
    createChatSession();
  }

  if (!chatSession) {
    console.error("Chat session not initialized");
    return null;
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return null;
  }
};

export const hasApiKey = (): boolean => {
  return !!process.env.API_KEY;
};

const findBestMatch = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  const patterns: Record<string, string[]> = {
    skills: ['skill', 'tech', 'technology', 'expert', 'stack', 'know'],
    projects: ['project', 'work', 'built', 'created', 'made', 'portfolio'],
    experience: ['experience', 'job', 'work', 'career', 'role', 'company', 'intern'],
    education: ['education', 'degree', 'college', 'school', 'university', 'study', 'academic'],
    contact: ['contact', 'email', 'reach', 'linkedin', 'github', 'connect']
  };

  for (const [key, keywords] of Object.entries(patterns)) {
    if (keywords.some(keyword => lowerInput.includes(keyword))) {
      return FAQ_ANSWERS[key];
    }
  }

  return FAQ_ANSWERS.default;
};

export const getFallbackResponse = async (message: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return findBestMatch(message);
};