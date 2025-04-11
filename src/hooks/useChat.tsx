import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ChatSession, Message } from "@/types/chat";
import { 
  getChatSessions, 
  saveChatSession, 
  addMessageToSession, 
  deleteChatSession,
  getChatSessionById
} from "@/lib/storage";
import { sendChatRequest } from "@/services/api";
import { getDefaultModel } from "@/lib/models";

export const useChat = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize chat sessions from storage
  useEffect(() => {
    const savedSessions = getChatSessions();
    setChatSessions(savedSessions);
    
    // Set current chat to the most recent one or create a new one
    if (savedSessions.length > 0) {
      // Sort by updated date and get the most recent
      const sortedSessions = [...savedSessions].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setCurrentChatId(sortedSessions[0].id);
    } else {
      handleNewChat();
    }
  }, []);
  
  // Create a new chat session
  const handleNewChat = useCallback(() => {
    const defaultModel = getDefaultModel();
    const newChatId = uuidv4();
    const newChat: ChatSession = {
      id: newChatId,
      title: `New Chat`,
      messages: [],
      modelId: defaultModel.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveChatSession(newChat);
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    
    return newChatId;
  }, []);
  
  // Load a specific chat session
  const loadChat = useCallback((chatId: string) => {
    const chat = getChatSessionById(chatId);
    if (chat) {
      setCurrentChatId(chatId);
      return true;
    }
    return false;
  }, []);
  
  // Delete a chat session
  const deleteChat = useCallback((chatId: string) => {
    deleteChatSession(chatId);
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    
    // If we deleted the current chat, select another one or create a new one
    if (chatId === currentChatId) {
      const remainingSessions = getChatSessions();
      if (remainingSessions.length > 0) {
        setCurrentChatId(remainingSessions[0].id);
      } else {
        handleNewChat();
      }
    }
  }, [currentChatId, handleNewChat]);
  
  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentChatId) return;
    
    // Find current chat
    const currentChat = chatSessions.find(chat => chat.id === currentChatId);
    if (!currentChat) return;
    
    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: "user",
      timestamp: new Date().toISOString()
    };
    
    // Add user message to the chat
    const updatedChat = addMessageToSession(currentChatId, userMessage);
    
    // Update title for new chats
    if (updatedChat.messages.length === 1) {
      const newTitle = content.length > 30 
        ? content.substring(0, 30) + "..." 
        : content;
      
      const chatWithTitle = {
        ...updatedChat,
        title: newTitle
      };
      
      saveChatSession(chatWithTitle);
      setChatSessions(prev => 
        prev.map(chat => chat.id === currentChatId ? chatWithTitle : chat)
      );
    } else {
      // Otherwise just update local state with the new message
      setChatSessions(prev => 
        prev.map(chat => chat.id === currentChatId ? updatedChat : chat)
      );
    }
    
    // Send request to AI service
    setIsLoading(true);
    try {
      const modelId = currentChat.modelId || getDefaultModel().id;
      const response = await sendChatRequest({
        messages: [...updatedChat.messages],
        modelId,
        sessionId: currentChatId
      });
      
      // Add AI response to chat
      const assistantMessage = response.message;
      const finalChat = addMessageToSession(currentChatId, assistantMessage);
      
      setChatSessions(prev => 
        prev.map(chat => chat.id === currentChatId ? finalChat : chat)
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // You could add error handling here
    } finally {
      setIsLoading(false);
    }
  }, [currentChatId, chatSessions]);
  
  // Get current chat
  const currentChat = chatSessions.find(chat => chat.id === currentChatId);
  
  return {
    chatSessions,
    currentChat,
    currentChatId,
    isLoading,
    sendMessage,
    newChat: handleNewChat,
    loadChat,
    deleteChat
  };
};

export default useChat;
