
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

const Chat = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Format timestamp
  const formatTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // Create a new chat session
  const handleNewChat = () => {
    const newChatId = uuidv4();
    setChatSessions((prev) => [
      ...prev,
      {
        id: newChatId,
        title: `New Chat ${prev.length + 1}`,
        messages: [],
      },
    ]);
    setCurrentChatId(newChatId);
  };

  // Initialize with a default chat if none exists
  useEffect(() => {
    if (chatSessions.length === 0) {
      handleNewChat();
    }
  }, [chatSessions]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSessions, currentChatId]);

  // Get current chat session
  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !currentChatId) return;

    // Add user message
    const userMessageId = uuidv4();
    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === currentChatId) {
          // Update chat title to first message if it's the first message
          const updatedTitle = 
            chat.messages.length === 0 
              ? content.slice(0, 20) + (content.length > 20 ? "..." : "") 
              : chat.title;
          
          return {
            ...chat,
            title: updatedTitle,
            messages: [
              ...chat.messages,
              {
                id: userMessageId,
                content,
                role: "user",
                timestamp: formatTime(),
              },
            ],
          };
        }
        return chat;
      })
    );

    // Simulate AI response
    setIsLoading(true);
    
    // Add a small delay to simulate processing
    setTimeout(() => {
      const assistantMessageId = uuidv4();
      setChatSessions((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: assistantMessageId,
                  content: "This is a simulated response. Your AI model will be integrated here.",
                  role: "assistant",
                  timestamp: formatTime(),
                },
              ],
            };
          }
          return chat;
        })
      );
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        chatHistory={chatSessions.map(({ id, title }) => ({ id, title }))}
        onNewChat={handleNewChat}
        onSelectChat={setCurrentChatId}
        selectedChatId={currentChatId}
      />

      <main className="flex-1 flex flex-col md:ml-72">
        <div className="flex-1 overflow-y-auto p-4 chat-container">
          {currentChat?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="assistant-message message-bubble">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Chat;
