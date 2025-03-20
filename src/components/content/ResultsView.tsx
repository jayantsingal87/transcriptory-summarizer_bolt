
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { TranscriptResult, ExportOptions } from "@/types/transcript";
import { ArrowLeft } from "lucide-react";

interface ResultsViewProps {
  isLoading: boolean;
  result: TranscriptResult | null;
  videoId: string;
  playlistResults: TranscriptResult[];
  isPlaylistProcessing: boolean;
  currentPlaylistIndex: number;
  isCostEstimate: boolean;
  onExport: (options: ExportOptions) => void;
  onBackClick: () => void;
}

export function ResultsView({
  isLoading,
  result,
  videoId,
  playlistResults,
  isPlaylistProcessing,
  currentPlaylistIndex,
  isCostEstimate,
  onExport,
  onBackClick
}: ResultsViewProps) {
  const [currentResult, setCurrentResult] = useState<TranscriptResult | null>(result);
  const [currentVideoId, setCurrentVideoId] = useState<string>(videoId);

  // Update the local state when the props change
  useEffect(() => {
    setCurrentResult(result);
    setCurrentVideoId(videoId);
  }, [result, videoId]);

  const handlePlaylistItemSelect = (index: number) => {
    if (index >= 0 && index < playlistResults.length) {
      setCurrentResult(playlistResults[index]);
      setCurrentVideoId(playlistResults[index].videoId);
    }
  };

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <Button 
          variant="outline"
          onClick={onBackClick}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> New Analysis
        </Button>
      </div>
      
      {/* Playlist Navigation (if processing a playlist) */}
      {playlistResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Playlist Videos:</h3>
          <div className="flex flex-wrap gap-2">
            {playlistResults.map((item, index) => (
              <Button 
                key={index} 
                variant={currentResult?.videoId === item.videoId ? "default" : "outline"}
                size="sm"
                className={currentResult?.videoId === item.videoId ? "btn-gradient" : ""}
                onClick={() => handlePlaylistItemSelect(index)}
              >
                {index + 1}. {item.title ? (item.title.length > 20 ? item.title.substring(0, 20) + "..." : item.title) : `Video ${index + 1}`}
              </Button>
            ))}
            {isPlaylistProcessing && isLoading && (
              <div className="text-sm text-muted-foreground animate-pulse">
                Processing video {currentPlaylistIndex + 1}...
              </div>
            )}
          </div>
        </div>
      )}
      
      {(isLoading || currentResult) && (
        <div className="py-4">
          {isLoading && !playlistResults.length ? (
            <div className="text-center animate-pulse">
              <motion.p 
                className="text-lg mb-2"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isCostEstimate 
                  ? "Estimating processing cost..." 
                  : isPlaylistProcessing
                    ? `Processing playlist (video ${currentPlaylistIndex + 1})...`
                    : "Processing your transcript..."}
              </motion.p>
              <p className="text-sm text-muted-foreground">This may take a moment</p>
            </div>
          ) : (
            <ResultsDisplay 
              result={currentResult} 
              videoId={currentVideoId} 
              onExport={onExport} 
              isCostEstimate={isCostEstimate}
            />
          )}
        </div>
      )}
    </motion.div>
  );
}
