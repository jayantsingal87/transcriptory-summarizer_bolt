
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { extractVideoId, isValidYoutubeUrl } from "@/utils/youtube";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Globe, MessageSquare, Settings, FileText, Lightbulb, PlaySquare, Play } from "lucide-react";
import { ProcessingOptions } from "@/types/transcript";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isPlaylist } from "@/services/transcriptService";

const languages = [
  { value: "", label: "Original" },
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Italian", label: "Italian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Russian", label: "Russian" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
];

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
  const [languageOpen, setLanguageOpen] = useState(false);
  const [generateWordCloud, setGenerateWordCloud] = useState(false);
  const [estimateCost, setEstimateCost] = useState(false);
  const [showRawTranscript, setShowRawTranscript] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the URL is a valid YouTube URL (video or playlist)
    if (!isValidYoutubeUrl(url)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video or playlist URL",
        variant: "destructive",
      });
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

  // Determine if the current URL is a playlist
  const isPlaylistUrl = url ? isPlaylist(url) : false;

  return (
    <TooltipProvider>
      <Card className="w-full max-w-xl mx-auto card-gradient border shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  placeholder="Paste YouTube video or playlist URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white/80 dark:bg-gray-900/80 transition-all"
                  required
                />
                {url && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-shrink-0">
                        {isPlaylistUrl ? (
                          <Play className="h-5 w-5 text-primary" />
                        ) : (
                          <PlaySquare className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isPlaylistUrl ? "Playlist URL detected" : "Video URL detected"}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-muted-foreground">Examples:</span>
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm" 
                  className="h-auto p-0 text-xs"
                  onClick={() => setExampleUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
                >
                  Rick Astley
                </Button>
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm" 
                  className="h-auto p-0 text-xs"
                  onClick={() => setExampleUrl("https://www.youtube.com/watch?v=hLS3-RiokIw")}
                >
                  AI Explained
                </Button>
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm" 
                  className="h-auto p-0 text-xs"
                  onClick={() => setExampleUrl("https://www.youtube.com/playlist?list=PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF")}
                >
                  Tech Playlist
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="text-sm font-medium mb-2 w-full flex items-center gap-2">
                Detail Level:
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Lightbulb className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Brief: Concise 2-3 sentence summary<br />
                      Standard: Balanced overview with key points<br />
                      Detailed: Comprehensive in-depth analysis
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button
                type="button"
                variant={detailLevel === "brief" ? "default" : "outline"}
                size="sm"
                onClick={() => setDetailLevel("brief")}
                className={detailLevel === "brief" ? "btn-gradient" : ""}
              >
                Brief
              </Button>
              <Button
                type="button"
                variant={detailLevel === "standard" ? "default" : "outline"}
                size="sm"
                onClick={() => setDetailLevel("standard")}
                className={detailLevel === "standard" ? "btn-gradient" : ""}
              >
                Standard
              </Button>
              <Button
                type="button"
                variant={detailLevel === "detailed" ? "default" : "outline"}
                size="sm"
                onClick={() => setDetailLevel("detailed")}
                className={detailLevel === "detailed" ? "btn-gradient" : ""}
              >
                Detailed
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
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
            </div>
            
            {showOptions && (
              <div className="space-y-4 p-4 border rounded-md bg-white/50 dark:bg-gray-900/50">
                <div className="space-y-2">
                  <Label htmlFor="customPrompt" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> Custom Prompt
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lightbulb className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Add specific instructions for the AI, e.g., "Focus on technical terms" or "Explain concepts for beginners"
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Textarea
                    id="customPrompt"
                    placeholder="Add your custom instructions to guide the AI analysis..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-1">
                    <Globe className="h-4 w-4" /> Translate Results
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lightbulb className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Translate the analysis into another language (the original transcript remains unchanged)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={languageOpen}
                        className="w-full justify-between"
                      >
                        {translateTo
                          ? languages.find((language) => language.value === translateTo)?.label
                          : "Select language..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {languages.map((language) => (
                            <CommandItem
                              key={language.value}
                              value={language.value}
                              onSelect={(currentValue) => {
                                setTranslateTo(currentValue === translateTo ? "" : currentValue);
                                setLanguageOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  translateTo === language.value ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {language.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="wordCloud"
                    checked={generateWordCloud}
                    onCheckedChange={setGenerateWordCloud}
                  />
                  <Label htmlFor="wordCloud" className="flex items-center gap-1">
                    Generate Word Cloud
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lightbulb className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Creates a visual representation of the most common words in the transcript</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showRawTranscript"
                    checked={showRawTranscript}
                    onCheckedChange={setShowRawTranscript}
                  />
                  <Label htmlFor="showRawTranscript" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Show Raw Transcript
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lightbulb className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Displays the unprocessed transcript in its original language</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full btn-gradient" 
              disabled={isLoading}
            >
              {isLoading 
                ? isPlaylistUrl 
                  ? "Processing Playlist..." 
                  : "Processing..." 
                : estimateCost 
                  ? "Estimate Processing Cost" 
                  : isPlaylistUrl
                    ? "Analyze Playlist"
                    : "Analyze Transcript"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
