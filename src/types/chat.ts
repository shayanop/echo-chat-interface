
export interface AIModel {
  id: string;
  name: string;
  description?: string;
  contextLength?: number;
  tags?: string[];
}

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  modelId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  messages: Message[];
  modelId: string;
  temperature?: number;
  maxTokens?: number;
  sessionId?: string;
}

export interface ChatResponse {
  id: string;
  message: Message;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
