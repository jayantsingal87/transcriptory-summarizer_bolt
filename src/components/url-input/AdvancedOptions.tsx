
import { useState } from "react";
import { Lightbulb, MessageSquare, Globe, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { ProcessingOptions } from "@/types/transcript";

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

interface AdvancedOptionsProps {
  customPrompt: string;
  setCustomPrompt: (value: string) => void;
  translateTo: string;
  setTranslateTo: (value: string) => void;
  generateWordCloud: boolean;
  setGenerateWordCloud: (value: boolean) => void;
  showRawTranscript: boolean;
  setShowRawTranscript: (value: boolean) => void;
}

export function AdvancedOptions({
  customPrompt,
  setCustomPrompt,
  translateTo,
  setTranslateTo,
  generateWordCloud,
  setGenerateWordCloud,
  showRawTranscript,
  setShowRawTranscript
}: AdvancedOptionsProps) {
  const [languageOpen, setLanguageOpen] = useState(false);

  return (
    <motion.div 
      className="space-y-4 p-4 border rounded-md bg-white/50 dark:bg-gray-900/50"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
    >
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
    </motion.div>
  );
}
