import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';

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