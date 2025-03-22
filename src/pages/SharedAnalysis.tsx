
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Share2, MessageSquare, ArrowLeft } from "lucide-react";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CommentsPanel } from "@/components/collaboration/CommentsPanel";
import { TranscriptResult } from "@/types/transcript";
import { getMockAnalyzedData } from "@/services/transcriptService";
import { HighlightProvider, HighlightControls } from "@/components/collaboration/HighlightManager";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { showShortcutsToast } from "@/utils/toastUtils";

interface SharedAnalysisProps {
  embed?: boolean;
}

export default function SharedAnalysis({ embed = false }: SharedAnalysisProps) {
  const { shareId } = useParams<{ shareId: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [showComments, setShowComments] = useState(false);

  // Set up keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "?",
      description: "Show keyboard shortcuts",
      action: showShortcutsToast
    }
  ]);

  useEffect(() => {
    // In a real app, this would fetch the shared analysis from an API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      if (shareId) {
        const mockData = getMockAnalyzedData(shareId);
        if (mockData) {
          setResult(mockData);
        }
      }
      setLoading(false);
    }, 1000);
  }, [shareId]);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${embed ? 'p-2' : 'p-4 md:p-8'}`}>
        <div className="max-w-4xl mx-auto py-12">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-center p-8">
                <motion.p 
                  className="text-lg mb-2"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Loading shared analysis...
                </motion.p>
                <Progress value={70} className="h-1 max-w-md mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`min-h-screen bg-gray-50 ${embed ? 'p-2' : 'p-4 md:p-8'}`}>
        {!embed && <Header />}
        <div className="max-w-md mx-auto py-12">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This shared analysis could not be found. It may have expired or been deleted.</p>
              <Button onClick={handleBackToHome}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        {!embed && <Footer />}
      </div>
    );
  }

  return (
    <HighlightProvider videoId={result.videoId}>
      <div className={`min-h-screen bg-gradient-to-b from-white to-gray-50 ${embed ? 'p-2' : ''}`}>
        {!embed && <Header />}
        
        <main className={`container ${embed ? 'p-2' : 'px-4 py-8 md:py-12'}`}>
          {!embed && (
            <div className="mb-4 flex justify-between items-center">
              <Button 
                variant="outline"
                onClick={handleBackToHome}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> 
                Back to Home
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant={showComments ? "default" : "outline"}
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  {showComments ? "Hide Comments" : "Show Comments"}
                </Button>
                <HighlightControls />
              </div>
            </div>
          )}
          
          <div className={`grid ${showComments ? 'grid-cols-1 lg:grid-cols-3 gap-6' : 'grid-cols-1'}`}>
            <div className={showComments ? "lg:col-span-2" : ""}>
              <ResultsDisplay 
                result={result} 
                videoId={result.videoId} 
                onExport={() => {
                  toast({
                    title: "Export not available",
                    description: "Exporting is not available for shared analyses",
                  });
                }}
              />
            </div>
            
            {showComments && (
              <div className="lg:col-span-1">
                <CommentsPanel videoId={result.videoId} />
              </div>
            )}
          </div>
        </main>
        
        {!embed && <Footer />}
      </div>
    </HighlightProvider>
  );
}
