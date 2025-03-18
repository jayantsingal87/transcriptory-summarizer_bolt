
import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { URLInput } from "@/components/URLInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Footer } from "@/components/Footer";
import { downloadExport, exportResult, fetchTranscript, processTranscript } from "@/services/transcriptService";
import { ExportOptions, ProcessingOptions, TranscriptResult } from "@/types/transcript";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [videoId, setVideoId] = useState("");
  const [isCostEstimate, setIsCostEstimate] = useState(false);
  const { toast } = useToast();

  const handleProcessTranscript = async (vidId: string, options: ProcessingOptions) => {
    try {
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
        const processedData = await processTranscript(
          vidId, 
          transcriptData.transcript, 
          options.detailLevel,
          options
        );
        
        setResult(processedData);
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
