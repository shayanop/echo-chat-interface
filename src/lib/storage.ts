
import { ChatSession, Message } from "@/types/chat";

const STORAGE_KEY = "echo-chat-sessions";

/**
 * Saves chat sessions to localStorage
 */
export const saveChatSessions = (chatSessions: ChatSession[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSessions));
  } catch (error) {
    console.error("Failed to save chat sessions:", error);
  }
};

/**
 * Retrieves chat sessions from localStorage
 */
export const getChatSessions = (): ChatSession[] => {
  try {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    return savedSessions ? JSON.parse(savedSessions) : [];
  } catch (error) {
    console.error("Failed to retrieve chat sessions:", error);
    return [];
  }
};

/**
 * Gets a specific chat session by ID
 */
export const getChatSessionById = (sessionId: string): ChatSession | undefined => {
  const sessions = getChatSessions();
  return sessions.find((session) => session.id === sessionId);
};

/**
 * Saves a new or updated chat session
 */
export const saveChatSession = (session: ChatSession): void => {
  const sessions = getChatSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = {
      ...session,
      updatedAt: new Date().toISOString()
    };
  } else {
    sessions.push({
      ...session,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  saveChatSessions(sessions);
};

/**
 * Adds a message to a chat session
 */
export const addMessageToSession = (sessionId: string, message: Message): ChatSession => {
  const sessions = getChatSessions();
  const sessionIndex = sessions.findIndex((s) => s.id === sessionId);
  
  if (sessionIndex === -1) {
    throw new Error(`Chat session with ID ${sessionId} not found`);
  }
  
  const updatedSession = {
    ...sessions[sessionIndex],
    messages: [...sessions[sessionIndex].messages, message],
    updatedAt: new Date().toISOString()
  };
  
  sessions[sessionIndex] = updatedSession;
  saveChatSessions(sessions);
  
  return updatedSession;
};

/**
 * Deletes a chat session
 */
export const deleteChatSession = (sessionId: string): void => {
  const sessions = getChatSessions();
  const updatedSessions = sessions.filter((s) => s.id !== sessionId);
  saveChatSessions(updatedSessions);
};

/**
 * Clears all chat sessions
 */
export const clearAllChatSessions = (): void => {
  saveChatSessions([]);
};
