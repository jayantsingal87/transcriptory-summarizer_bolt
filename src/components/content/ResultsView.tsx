
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { TranscriptResult, ExportOptions } from "@/types/transcript";
import { ArrowLeft, Share2, MessageSquare, History } from "lucide-react";
import { SharingDialog } from "@/components/collaboration/SharingDialog";
import { CommentsPanel } from "@/components/collaboration/CommentsPanel";
import { VersionHistory } from "@/components/collaboration/VersionHistory";
import { HighlightProvider, HighlightControls } from "@/components/collaboration/HighlightManager";
import { TourButton } from "@/components/ui/guided-tour";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { showShortcutsToast } from "@/utils/toastUtils";

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
  const [showSharingDialog, setShowSharingDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);

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

  // Set up keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "s",
      description: "Start new analysis",
      action: onBackClick
    },
    {
      key: "e",
      description: "Export results",
      action: () => {
        if (currentResult) {
          onExport({
            format: "pdf",
            includeOriginalTranscript: true,
            includeTopics: true,
            includeKeyPoints: true,
            includeSummary: true
          });
        }
      }
    },
    {
      key: "?",
      description: "Show keyboard shortcuts",
      action: showShortcutsToast
    }
  ]);

  return (
    <HighlightProvider videoId={currentVideoId}>
      <motion.div
        key="results"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4 flex flex-wrap justify-between items-center gap-3">
          <Button 
            variant="outline"
            onClick={onBackClick}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> New Analysis
          </Button>
          
          <div className="flex flex-wrap gap-2">
            {!isLoading && currentResult && (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => setShowSharingDialog(true)}
                  id="share-button"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                
                <Button 
                  variant={showComments ? "default" : "outline"}
                  className={`flex items-center gap-1 ${showComments ? "bg-brand-600" : ""}`}
                  onClick={() => setShowComments(!showComments)}
                  id="comments-panel"
                >
                  <MessageSquare className="h-4 w-4" />
                  {showComments ? "Hide Comments" : "Comments"}
                </Button>
                
                <VersionHistory 
                  videoId={currentVideoId} 
                  result={currentResult} 
                />
                
                <div id="highlight-controls">
                  <HighlightControls />
                </div>
                
                <TourButton />
              </>
            )}
          </div>
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
        
        <div className={`grid ${showComments ? 'grid-cols-1 lg:grid-cols-3 gap-6' : 'grid-cols-1'}`}>
          <div className={showComments ? "lg:col-span-2" : ""}>
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
          </div>
          
          {showComments && currentResult && (
            <div className="lg:col-span-1">
              <CommentsPanel videoId={currentVideoId} />
            </div>
          )}
        </div>
        
        {/* Sharing Dialog */}
        {currentResult && (
          <SharingDialog 
            result={currentResult} 
            open={showSharingDialog} 
            onOpenChange={setShowSharingDialog} 
          />
        )}
      </motion.div>
    </HighlightProvider>
  );
}
