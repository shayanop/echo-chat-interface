
import { useState, useEffect } from 'react';
import { Check, Cloud, CloudOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SyncIndicatorProps {
  lastSynced?: Date;
}

const SyncIndicator = ({ lastSynced }: SyncIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const getTimeAgo = () => {
    if (!lastSynced) return 'Never synced';
    
    const seconds = Math.floor((new Date().getTime() - lastSynced.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {isOnline ? (
              <Cloud className="h-3 w-3" />
            ) : (
              <CloudOff className="h-3 w-3" />
            )}
            <span>{isOnline ? 'Connected' : 'Offline'}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Status: {isOnline ? 'Connected to server' : 'Working offline'}</p>
          <p>Last synced: {lastSynced ? getTimeAgo() : 'Never'}</p>
          {!isOnline && <p>Changes will sync when you reconnect</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SyncIndicator;
