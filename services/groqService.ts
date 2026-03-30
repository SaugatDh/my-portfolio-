import { apiFetch } from "../lib/api";

export async function sendMessageToGroq(message: string, conversationHistory: {role: string, content: string, response?: string}[] = []): Promise<string> {
  try {
    const response = await apiFetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, history: conversationHistory }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get response");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
}

export function hasGroqApiKey(): boolean {
  return true;
}