
import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { URLInput } from "@/components/URLInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Footer } from "@/components/Footer";
import { fetchTranscript, processTranscript } from "@/services/transcriptService";
import { TranscriptResult } from "@/types/transcript";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [videoId, setVideoId] = useState("");

  const handleProcessTranscript = async (vidId: string, detailLevel: string) => {
    try {
      setIsLoading(true);
      setVideoId(vidId);
      
      // Fetch transcript
      const transcriptData = await fetchTranscript(vidId);
      
      // Process transcript
      if (transcriptData.success) {
        const processedData = await processTranscript(
          vidId, 
          transcriptData.transcript, 
          detailLevel
        );
        
        setResult(processedData);
      }
    } catch (error) {
      console.error("Error processing transcript:", error);
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
                  <p className="text-lg mb-2">Processing your transcript...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              ) : (
                <ResultsDisplay result={result} videoId={videoId} />
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
