
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Key, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { setOpenAIApiKey } from "@/services/transcriptService";

interface APIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function APIKeyDialog({ open, onOpenChange }: APIKeyDialogProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [apiKeyError, setApiKeyError] = useState("");
  const { toast } = useToast();

  const handleApiKeySave = () => {
    if (!apiKey.trim()) {
      setApiKeyError("API key cannot be empty");
      return;
    }
    
    if (!apiKey.trim().startsWith("sk-")) {
      setApiKeyError("Invalid API key format. OpenAI keys start with 'sk-'");
      return;
    }
    
    const success = setOpenAIApiKey(apiKey);
    
    if (success) {
      localStorage.setItem("openai_api_key", apiKey);
      setApiKeyError("");
      onOpenChange(false);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved successfully.",
      });
    } else {
      setApiKeyError("Failed to initialize OpenAI client with this key");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="mb-4 flex items-center gap-2"
        >
          <Key className="h-4 w-4" />
          {apiKey ? "Change API Key" : "Set OpenAI API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to process transcripts using AI. 
            Your key will be stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full"
            />
            {apiKeyError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{apiKeyError}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>You can get an API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">OpenAI dashboard</a>.</p>
            <p className="mt-1">Your key is saved only in your browser's local storage.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              setApiKeyError("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleApiKeySave}>Save API Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
