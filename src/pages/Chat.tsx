
import { useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";
import useChat from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";
import SyncIndicator from "@/components/SyncIndicator";

const Chat = () => {
  const { 
    chatSessions, 
    currentChat, 
    currentChatId, 
    isLoading, 
    isInitialized,
    sendMessage, 
    newChat, 
    loadChat, 
    deleteChat,
    userId,
    lastSynced
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    try {
      await sendMessage(content);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle creating a new chat
  const handleNewChat = async () => {
    try {
      await newChat();
    } catch (error) {
      console.error("Failed to create new chat:", error);
      toast({
        title: "Error",
        description: "Failed to create a new chat. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
          </div>
          <p className="text-sm text-muted-foreground">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        chatHistory={chatSessions.map(({ id, title }) => ({ id, title }))}
        onNewChat={handleNewChat}
        onSelectChat={loadChat}
        onDeleteChat={deleteChat}
        selectedChatId={currentChatId}
        userId={userId}
        syncIndicator={<SyncIndicator lastSynced={lastSynced ? new Date(lastSynced) : undefined} />}
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
