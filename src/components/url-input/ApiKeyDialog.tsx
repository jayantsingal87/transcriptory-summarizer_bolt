
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { setYoutubeApiKey, setOpenAIApiKey, getYoutubeApiKey, getOpenAIApiKey } from "@/services/transcriptService";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const [youtubeApiKey, setYoutubeApiKeyState] = useState(() => getYoutubeApiKey() || "");
  const [openaiApiKey, setOpenaiApiKeyState] = useState(() => getOpenAIApiKey() || "");
  const { toast } = useToast();

  // Initialize API keys from localStorage on mount
  useEffect(() => {
    const storedYoutubeKey = localStorage.getItem("youtube_api_key");
    const storedOpenaiKey = localStorage.getItem("openai_api_key");
    
    if (storedYoutubeKey) {
      setYoutubeApiKeyState(storedYoutubeKey);
    }
    
    if (storedOpenaiKey) {
      setOpenaiApiKeyState(storedOpenaiKey);
    }
  }, []);

  const handleSaveApiKeys = () => {
    // Save to service
    setYoutubeApiKey(youtubeApiKey);
    setOpenAIApiKey(openaiApiKey);
    
    // Save to localStorage
    localStorage.setItem("youtube_api_key", youtubeApiKey);
    localStorage.setItem("openai_api_key", openaiApiKey);
    
    onOpenChange(false);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved and will be used for processing",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Keys</DialogTitle>
          <DialogDescription>
            Enter your API keys to use with TranscriptLens.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-api-key" className="flex items-center gap-1">
              YouTube API Key
              <Tooltip>
                <TooltipTrigger asChild>
                  <Lightbulb className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Required to fetch video details and transcripts from YouTube
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id="youtube-api-key"
              value={youtubeApiKey}
              onChange={(e) => setYoutubeApiKeyState(e.target.value)}
              placeholder="Enter YouTube API key"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="openai-api-key" className="flex items-center gap-1">
              OpenAI API Key
              <Tooltip>
                <TooltipTrigger asChild>
                  <Lightbulb className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Required for AI analysis of transcripts
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id="openai-api-key"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKeyState(e.target.value)}
              placeholder="Enter OpenAI API key"
              type="password"
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveApiKeys} className="btn-gradient">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
