
import { ChatSession, Message } from "@/types/chat";
import { fetchChatSessions, saveChatSessionToServer, deleteChatSessionFromServer } from "@/services/api";

const STORAGE_KEY = "echo-chat-sessions";
const USER_ID_KEY = "echo-chat-user-id";

// Generate or retrieve a persistent user ID for anonymous users
export const getUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    // Generate a random user ID for new users
    userId = Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

/**
 * Saves chat sessions to localStorage and attempts to save to server
 */
export const saveChatSessions = async (chatSessions: ChatSession[]): Promise<void> => {
  try {
    // Save to localStorage as backup
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSessions));
    
    // Try to save each session to server
    const userId = getUserId();
    for (const session of chatSessions) {
      await saveChatSessionToServer(session, userId);
    }
  } catch (error) {
    console.error("Failed to save chat sessions:", error);
  }
};

/**
 * Retrieves chat sessions from localStorage and merges with server data
 */
export const getChatSessions = async (): Promise<ChatSession[]> => {
  try {
    // Get sessions from localStorage
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    const localSessions: ChatSession[] = savedSessions ? JSON.parse(savedSessions) : [];
    
    // Try to get sessions from server
    const userId = getUserId();
    const serverSessions = await fetchChatSessions(userId);
    
    // Merge sessions, with server sessions taking precedence
    const sessionMap = new Map<string, ChatSession>();
    
    // Add local sessions first
    localSessions.forEach(session => {
      sessionMap.set(session.id, session);
    });
    
    // Then add/override with server sessions
    serverSessions.forEach(session => {
      sessionMap.set(session.id, session);
    });
    
    return Array.from(sessionMap.values());
  } catch (error) {
    console.error("Failed to retrieve chat sessions:", error);
    
    // Fallback to local storage only
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEY);
      return savedSessions ? JSON.parse(savedSessions) : [];
    } catch (innerError) {
      console.error("Failed to retrieve local chat sessions:", innerError);
      return [];
    }
  }
};

/**
 * Gets a specific chat session by ID
 */
export const getChatSessionById = async (sessionId: string): Promise<ChatSession | undefined> => {
  const sessions = await getChatSessions();
  return sessions.find((session) => session.id === sessionId);
};

/**
 * Saves a new or updated chat session
 */
export const saveChatSession = async (session: ChatSession): Promise<void> => {
  const sessions = await getChatSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);
  
  const updatedSession = {
    ...session,
    updatedAt: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = updatedSession;
  } else {
    sessions.push({
      ...updatedSession,
      createdAt: new Date().toISOString(),
    });
  }
  
  await saveChatSessions(sessions);
};

/**
 * Adds a message to a chat session
 */
export const addMessageToSession = async (sessionId: string, message: Message): Promise<ChatSession> => {
  const sessions = await getChatSessions();
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
  await saveChatSessions(sessions);
  
  return updatedSession;
};

/**
 * Deletes a chat session
 */
export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const sessions = await getChatSessions();
  const updatedSessions = sessions.filter((s) => s.id !== sessionId);
  await saveChatSessions(updatedSessions);
  
  // Try to delete from server
  const userId = getUserId();
  await deleteChatSessionFromServer(sessionId, userId);
};

/**
 * Clears all chat sessions
 */
export const clearAllChatSessions = async (): Promise<void> => {
  await saveChatSessions([]);
};
