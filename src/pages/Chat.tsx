
import { useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";
import useChat from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const { 
    chatSessions, 
    currentChat, 
    currentChatId, 
    isLoading, 
    sendMessage, 
    newChat, 
    loadChat, 
    deleteChat 
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
  const handleNewChat = () => {
    try {
      newChat();
    } catch (error) {
      console.error("Failed to create new chat:", error);
      toast({
        title: "Error",
        description: "Failed to create a new chat. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        chatHistory={chatSessions.map(({ id, title }) => ({ id, title }))}
        onNewChat={handleNewChat}
        onSelectChat={loadChat}
        onDeleteChat={deleteChat}
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
