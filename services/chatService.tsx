const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Sends a user message to the backend API and returns the response
 * @param message - The user's message to send to the chatbot
 * @returns A promise that resolves with the chatbot's response text
 */
export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error in chat service:', error);
    throw error;
  }
}

/**
 * Clears the chat history on the server (if your API supports this)
 * @returns A promise that resolves when the history is cleared
 */
export async function clearChatHistory(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/chat/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    return;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
}