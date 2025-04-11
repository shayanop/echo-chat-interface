
import { cn } from "@/lib/utils";
import { MessageRole } from "@/types/chat";

interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: string;
}

const ChatMessage = ({ content, role, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4",
      role === "user" ? "justify-end" : "justify-start"
    )}>
      <div
        className={cn(
          "message-bubble",
          role === "user" ? "user-message" : 
          role === "assistant" ? "assistant-message" : 
          "system-message"
        )}
      >
        <div className="text-sm md:text-base whitespace-pre-wrap">{content}</div>
        {timestamp && (
          <div className="text-xs text-muted-foreground mt-1">
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
