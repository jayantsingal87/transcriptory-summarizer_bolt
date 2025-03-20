
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Key, Folder, PlaySquare, Play } from "lucide-react";
import { ProcessingOptions } from "@/types/transcript";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isValidYoutubeUrl, isPlaylistUrl, isPlaylistsPageUrl } from "@/utils/youtube";
import { getYoutubeApiKey, getOpenAIApiKey } from "@/services/transcriptService";
import { motion } from "framer-motion";

// Import new components
import { DetailLevelSelector } from "./url-input/DetailLevelSelector";
import { AdvancedOptions } from "./url-input/AdvancedOptions";
import { ApiKeyDialog } from "./url-input/ApiKeyDialog";
import { ExampleUrls } from "./url-input/ExampleUrls";

interface URLInputProps {
  onSubmit: (url: string, options: ProcessingOptions) => void;
  isLoading: boolean;
}

export function URLInput({ onSubmit, isLoading }: URLInputProps) {
  const [url, setUrl] = useState("");
  const [detailLevel, setDetailLevel] = useState<'brief' | 'standard' | 'detailed'>('standard');
  const [showOptions, setShowOptions] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [translateTo, setTranslateTo] = useState("");
  const [generateWordCloud, setGenerateWordCloud] = useState(false);
  const [estimateCost, setEstimateCost] = useState(false);
  const [showRawTranscript, setShowRawTranscript] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the URL is a valid YouTube URL (video or playlist)
    if (!isValidYoutubeUrl(url)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video, playlist, or channel playlists URL",
        variant: "destructive",
      });
      return;
    }

    // Check if we have API keys
    const youtubeApiKey = getYoutubeApiKey();
    const openaiApiKey = getOpenAIApiKey();

    if (!youtubeApiKey) {
      toast({
        title: "YouTube API Key Missing",
        description: "Please provide a YouTube API key in the settings",
        variant: "destructive",
      });
      setApiKeyDialogOpen(true);
      return;
    }

    if (!openaiApiKey) {
      toast({
        title: "OpenAI API Key Missing",
        description: "Please provide an OpenAI API key in the settings",
        variant: "destructive",
      });
      setApiKeyDialogOpen(true);
      return;
    }
    
    // Create processing options
    const options: ProcessingOptions = {
      detailLevel,
      customPrompt: customPrompt || undefined,
      translateTo: translateTo || undefined,
      generateWordCloud,
      estimateCostOnly: estimateCost,
      showRawTranscript
    };
    
    // Pass the URL directly instead of extracting the ID
    // The parent component will determine if it's a playlist or video
    onSubmit(url, options);
  };

  // Function for quick example URLs
  const setExampleUrl = (exampleUrl: string) => {
    setUrl(exampleUrl);
  };

  // Get icon for URL type
  const getUrlTypeIcon = () => {
    if (!url) return null;
    
    if (isPlaylistsPageUrl(url)) {
      return <Folder className="h-5 w-5 text-primary" />;
    } else if (isPlaylistUrl(url)) {
      return <Play className="h-5 w-5 text-primary" />;
    } else {
      return <PlaySquare className="h-5 w-5 text-primary" />;
    }
  };

  // Get action text based on URL type
  const getActionText = () => {
    if (isLoading) return "Processing...";
    if (estimateCost) return "Estimate Processing Cost";
    
    if (isPlaylistsPageUrl(url)) {
      return "Browse Channel Playlists";
    } else if (isPlaylistUrl(url)) {
      return "Select Videos from Playlist";
    } else {
      return "Analyze Transcript";
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-xl mx-auto card-gradient border shadow-md transform transition-all hover:shadow-lg">
        <CardContent className="pt-6">
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  placeholder="Paste YouTube video, playlist, or channel playlists URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white/80 dark:bg-gray-900/80 transition-all"
                  required
                />
                {url && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-shrink-0">
                        {getUrlTypeIcon()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isPlaylistsPageUrl(url) 
                          ? "Channel playlists URL detected" 
                          : isPlaylistUrl(url) 
                            ? "Playlist URL detected" 
                            : "Video URL detected"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              {/* Link to examples */}
              <ExampleUrls setExampleUrl={setExampleUrl} />
            </div>
            
            {/* Detail level selector */}
            <DetailLevelSelector 
              detailLevel={detailLevel}
              setDetailLevel={setDetailLevel}
            />
            
            <motion.div 
              className="flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowOptions(!showOptions)}
                  className="flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  {showOptions ? "Hide Options" : "Show Advanced Options"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setApiKeyDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Key className="h-4 w-4" />
                  API Keys
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="estimateCost"
                  checked={estimateCost}
                  onCheckedChange={setEstimateCost}
                />
                <Label htmlFor="estimateCost" className="text-sm">
                  Estimate cost only
                </Label>
              </div>
            </motion.div>
            
            {/* Advanced options */}
            {showOptions && (
              <AdvancedOptions
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                translateTo={translateTo}
                setTranslateTo={setTranslateTo}
                generateWordCloud={generateWordCloud}
                setGenerateWordCloud={setGenerateWordCloud}
                showRawTranscript={showRawTranscript}
                setShowRawTranscript={setShowRawTranscript}
              />
            )}
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                type="submit" 
                className="w-full btn-gradient" 
                disabled={isLoading}
              >
                {getActionText()}
              </Button>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>

      {/* API Keys Dialog */}
      <ApiKeyDialog
        open={apiKeyDialogOpen}
        onOpenChange={setApiKeyDialogOpen}
      />
    </TooltipProvider>
  );
}
