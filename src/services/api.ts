
import { v4 as uuidv4 } from 'uuid';
import { ChatRequest, ChatResponse, Message } from "@/types/chat";
import { getModelById } from "@/lib/models";

// Base URL for your Ollama server - will need to be configured
const API_BASE_URL = ""; // TO BE FILLED by the user with their Ollama server URL
const API_KEY = ""; // TO BE FILLED if needed

/**
 * Sends a chat request to the AI model server
 */
export const sendChatRequest = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    // In real implementation, this would make an actual API call
    // For now, create a simulated response
    
    if (!API_BASE_URL) {
      console.warn("API_BASE_URL is not set. Using simulated response.");
      return simulateResponse(request);
    }
    
    const model = getModelById(request.modelId);
    if (!model) {
      throw new Error(`Model ${request.modelId} not found`);
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }
    
    // This is where the actual API call would be made
    // const response = await fetch(`${API_BASE_URL}/api/chat`, {
    //   method: 'POST',
    //   headers,
    //   body: JSON.stringify({
    //     model: model.id,
    //     messages: request.messages.map(({ content, role }) => ({ content, role })),
    //     temperature: request.temperature || 0.7,
    //     max_tokens: request.maxTokens,
    //     stream: false
    //   }),
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API request failed with status ${response.status}`);
    // }
    
    // const data = await response.json();
    // return {
    //   id: data.id || uuidv4(),
    //   message: {
    //     id: uuidv4(),
    //     content: data.choices[0].message.content,
    //     role: 'assistant',
    //     timestamp: new Date().toISOString(),
    //     model: model.id
    //   },
    //   usage: data.usage
    // };
    
    // For now, return simulated response
    return simulateResponse(request);
    
  } catch (error) {
    console.error("Error sending chat request:", error);
    throw error;
  }
};

/**
 * Helper function to simulate a response during development
 */
const simulateResponse = (request: ChatRequest): ChatResponse => {
  const lastMessage = request.messages[request.messages.length - 1];
  
  let responseContent = "I'm a simulated response from your Ollama model. This is a placeholder until you connect to your real API.";
  
  if (lastMessage.content.toLowerCase().includes("hello") || lastMessage.content.toLowerCase().includes("hi")) {
    responseContent = "Hello! I'm your AI assistant. How can I help you today?";
  } else if (lastMessage.content.toLowerCase().includes("help")) {
    responseContent = "I'm here to assist you. What do you need help with?";
  } else if (lastMessage.content.toLowerCase().includes("bye")) {
    responseContent = "Goodbye! Have a great day!";
  }
  
  return {
    id: uuidv4(),
    message: {
      id: uuidv4(),
      content: responseContent,
      role: "assistant",
      timestamp: new Date().toISOString(),
      model: request.modelId
    },
    usage: {
      promptTokens: 20,
      completionTokens: 30,
      totalTokens: 50
    }
  };
};
