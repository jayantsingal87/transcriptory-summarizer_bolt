
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { extractVideoId } from "@/utils/youtube";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Globe, MessageSquare, Settings } from "lucide-react";
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

const languages = [
  { value: "", label: "Original" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

interface URLInputProps {
  onSubmit: (videoId: string, options: ProcessingOptions) => void;
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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
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
      estimateCostOnly: estimateCost
    };
    
    onSubmit(videoId, options);
  };

  return (
    <Card className="w-full max-w-xl mx-auto card-gradient border shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Paste YouTube video URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white/80 dark:bg-gray-900/80 transition-all"
              required
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="text-sm font-medium mb-2 w-full">Detail Level:</div>
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
                <Label htmlFor="wordCloud">Generate Word Cloud</Label>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full btn-gradient" 
            disabled={isLoading}
          >
            {isLoading 
              ? "Processing..." 
              : estimateCost 
                ? "Estimate Processing Cost" 
                : "Structure Transcript"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
