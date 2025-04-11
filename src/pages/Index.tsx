
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="glass-panel p-8 w-full max-w-md text-center space-y-8">
        <div className="flex items-center justify-center mb-6">
          <MessageSquare className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-4xl font-bold tracking-tight">Echo Chat</h1>
        </div>
        
        <p className="text-lg text-muted-foreground">
          Your personal AI assistant, ready to help with any task.
        </p>
        
        <div className="space-y-4 pt-4">
          <Button 
            className="w-full text-lg py-6" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-lg py-6" 
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-lg py-6" 
            onClick={() => navigate('/chat')}
          >
            Try Without Account
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mt-8">
        Powered by cutting-edge AI technology
      </p>
    </div>
  );
};

export default Index;
