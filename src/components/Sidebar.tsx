
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  MessageSquare, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SyncIndicator from "./SyncIndicator";

interface SidebarProps {
  chatHistory: { id: string; title: string }[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat?: (id: string) => void;
  selectedChatId?: string;
  userId?: string;
}

const Sidebar = ({ 
  chatHistory, 
  onNewChat, 
  onSelectChat,
  onDeleteChat,
  selectedChatId,
  userId 
}: SidebarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  const handleLogout = () => {
    // Will implement actual logout later
    navigate("/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 left-4 md:hidden z-30"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-card border-r z-20 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-xl font-bold">Echo Chat</h1>
            </div>
            <SyncIndicator />
          </div>

          <Button 
            onClick={onNewChat} 
            className="mb-6 mt-2"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> New Chat
          </Button>

          <div className="flex-1 overflow-y-auto py-2 space-y-1">
            {chatHistory.map((chat) => (
              <div 
                key={chat.id}
                className="relative flex items-center"
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                <Button
                  variant={selectedChatId === chat.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm h-auto py-3 px-3 overflow-hidden"
                  onClick={() => onSelectChat(chat.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </Button>
                
                {onDeleteChat && hoveredChatId === chat.id && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete chat</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            {userId && (
              <div className="px-2 py-1 text-xs text-muted-foreground">
                Device ID: {userId.substring(0, 8)}...
              </div>
            )}
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-5 w-5" /> Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" /> Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
