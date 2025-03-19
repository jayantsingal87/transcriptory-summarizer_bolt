
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { URLInput } from "@/components/URLInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Footer } from "@/components/Footer";
import { downloadExport, exportResult, fetchTranscript, processTranscript, setOpenAIApiKey } from "@/services/transcriptService";
import { ExportOptions, ProcessingOptions, TranscriptResult } from "@/types/transcript";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [videoId, setVideoId] = useState("");
  const [isCostEstimate, setIsCostEstimate] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const { toast } = useToast();

  // Check if API key is valid on component mount
  useEffect(() => {
    if (apiKey) {
      const success = setOpenAIApiKey(apiKey);
      if (!success) {
        // If the saved API key is invalid, we'll prompt the user to enter a new one
        setApiKeyDialogOpen(true);
        toast({
          title: "API Key Error",
          description: "Your saved OpenAI API key appears to be invalid. Please enter a new one.",
          variant: "destructive"
        });
      }
    } else {
      // If no API key is saved, show the dialog
      setApiKeyDialogOpen(true);
    }
  }, []);

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
      setApiKeyDialogOpen(false);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved successfully.",
      });
    } else {
      setApiKeyError("Failed to initialize OpenAI client with this key");
    }
  };

  const handleProcessTranscript = async (vidId: string, options: ProcessingOptions) => {
    try {
      // Check if API key is set
      if (!apiKey && !options.estimateCostOnly) {
        setApiKeyDialogOpen(true);
        return;
      }
      
      setIsLoading(true);
      setVideoId(vidId);
      setIsCostEstimate(options.estimateCostOnly || false);
      
      if (options.estimateCostOnly) {
        // Only get cost estimate
        const costEstimate = await processTranscript(vidId, [], options.detailLevel, options);
        setResult(costEstimate);
        return;
      }
      
      // Fetch transcript
      const transcriptData = await fetchTranscript(vidId);
      
      // Process transcript
      if (transcriptData.success) {
        // Store raw transcript if the option is enabled
        const rawTranscript = options.showRawTranscript ? transcriptData.transcript : undefined;
        
        try {
          const processedData = await processTranscript(
            vidId, 
            transcriptData.transcript, 
            options.detailLevel,
            options
          );
          
          // Add raw transcript to the result if needed
          if (rawTranscript) {
            processedData.rawTranscript = rawTranscript;
          }
          
          setResult(processedData);
          
          // Show toast for successful processing
          toast({
            title: "Processing Complete",
            description: `Transcript analyzed with ${options.detailLevel} detail level`,
          });
        } catch (error) {
          console.error("Error processing transcript:", error);
          toast({
            title: "Processing Error",
            description: "There was an error analyzing the transcript. Please check your API key and try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error processing transcript:", error);
      toast({
        title: "Error",
        description: "Failed to process the transcript. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (options: ExportOptions) => {
    if (!result) return;
    
    try {
      setIsLoading(true);
      
      const exportedContent = await exportResult(result, options);
      const filename = `${result.title.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_transcript`;
      const fileExtension = options.format === 'pdf' ? 'pdf' : 
                           options.format === 'markdown' ? 'md' : 
                           options.format === 'word' ? 'docx' : 'txt';
      
      downloadExport(exportedContent, `${filename}.${fileExtension}`, options.format);
      
      toast({
        title: "Export Complete",
        description: `Your content has been exported as ${options.format.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export the content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        
        <div className="container px-4 py-8 md:py-12">
          {/* API Key Dialog */}
          <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="mb-4 flex items-center gap-2"
                onClick={() => setApiKeyDialogOpen(true)}
              >
                <Key className="h-4 w-4" />
                {apiKey ? "Change API Key" : "Set OpenAI API Key"}
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                    setApiKeyDialogOpen(false);
                    setApiKeyError("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleApiKeySave}>Save API Key</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Example URLs - Updated with real examples */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Example URLs to try:</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• https://www.youtube.com/watch?v=dQw4w9WgXcQ (Rick Astley - Never Gonna Give You Up)</p>
              <p>• https://www.youtube.com/watch?v=hLS3-RiokIw (AI Technology Explained)</p>
              <p>• https://www.youtube.com/watch?v=OJ8isyS9dGQ (TED Talk on Human Connection)</p>
            </div>
          </div>
          
          <div className="mb-12">
            <URLInput 
              onSubmit={handleProcessTranscript} 
              isLoading={isLoading} 
            />
          </div>
          
          {(isLoading || result) && (
            <div className="py-4">
              {isLoading ? (
                <div className="text-center animate-pulse-slow">
                  <p className="text-lg mb-2">
                    {isCostEstimate 
                      ? "Estimating processing cost..." 
                      : "Processing your transcript..."}
                  </p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              ) : (
                <ResultsDisplay 
                  result={result} 
                  videoId={videoId} 
                  onExport={handleExport} 
                  isCostEstimate={isCostEstimate}
                />
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
