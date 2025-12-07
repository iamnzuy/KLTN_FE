import { ChatbotRequest, ChatbotResponse } from '../types';

// Use Next.js API route as proxy to avoid CORS issues
const CHATBOT_API_URL = '/api/chatbot';

export async function sendChatMessage(
  request: ChatbotRequest
): Promise<ChatbotResponse> {
  try {
    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API error response:', errorData);
      throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
    }

    const data: ChatbotResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

