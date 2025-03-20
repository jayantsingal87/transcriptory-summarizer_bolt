
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { TranscriptResult, ProcessingOptions, ExportOptions } from "@/types/transcript";
import { useToast } from "@/components/ui/use-toast";
import { InputView } from "./InputView";
import { PlaylistsView } from "./PlaylistsView";
import { VideosView } from "./VideosView";
import { ResultsView } from "./ResultsView";
import { AuthStatus } from "../auth/AuthWrapper";
import { APIKeyDialog } from "../settings/APIKeyDialog";
import { 
  downloadExport, 
  exportResult, 
  fetchTranscript, 
  processTranscript, 
  setOpenAIApiKey, 
  isPlaylist,
  isPlaylistsPage,
  extractChannelIdFromPlaylistsPage,
  extractPlaylistId, 
  fetchPlaylistItems,
  fetchChannelPlaylists 
} from "@/services/transcriptService";
import { extractVideoId } from "@/utils/youtube";

const DEFAULT_OPENAI_API_KEY = "sk-WdMZKiBWzBgfn-RzLgab9yPeiYoK3kZehWvbHYfFFQT3BlbkFJ2bm1VAcWdXdXvM1r2rDh8VRD22MBx499h0dSzpyt4A";

export function MainContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [videoId, setVideoId] = useState("");
  const [isCostEstimate, setIsCostEstimate] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || DEFAULT_OPENAI_API_KEY);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [isPlaylistProcessing, setIsPlaylistProcessing] = useState(false);
  const [playlistResults, setPlaylistResults] = useState<TranscriptResult[]>([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const { toast } = useToast();
  
  // State for playlist and video selection
  const [inputUrl, setInputUrl] = useState("");
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions | null>(null);
  const [viewMode, setViewMode] = useState<"input" | "playlists" | "videos" | "results">("input");
  const [availablePlaylists, setAvailablePlaylists] = useState<Array<{playlistId: string, title: string, thumbnailUrl: string}>>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [selectedPlaylistTitle, setSelectedPlaylistTitle] = useState("");
  const [availableVideos, setAvailableVideos] = useState<Array<{videoId: string, title: string, thumbnailUrl: string}>>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

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
      } else {
        // Save the API key
        localStorage.setItem("openai_api_key", apiKey);
        toast({
          title: "API Key Set",
          description: "Your OpenAI API key has been set successfully.",
        });
      }
    } else {
      // If no API key is saved, show the dialog
      setApiKeyDialogOpen(true);
    }
  }, []);

  const handleFetchPlaylistsFromChannel = async (url: string) => {
    try {
      setIsLoadingPlaylists(true);
      setViewMode("playlists");
      
      // Extract channel ID or handle
      const channelId = extractChannelIdFromPlaylistsPage(url);
      if (!channelId) {
        toast({
          title: "Invalid Channel URL",
          description: "Could not extract channel information from the provided URL.",
          variant: "destructive"
        });
        setIsLoadingPlaylists(false);
        setViewMode("input");
        return;
      }
      
      // Fetch playlists for this channel
      const playlists = await fetchChannelPlaylists(channelId);
      setAvailablePlaylists(playlists);
      
      toast({
        title: "Playlists Loaded",
        description: `Found ${playlists.length} playlists. Select one to continue.`,
      });
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast({
        title: "Error",
        description: "Failed to fetch playlists from this channel.",
        variant: "destructive"
      });
      setViewMode("input");
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const handlePlaylistSelect = async (playlistId: string) => {
    try {
      setIsLoadingVideos(true);
      setSelectedPlaylistId(playlistId);
      
      // Find the playlist title
      const playlist = availablePlaylists.find(p => p.playlistId === playlistId);
      setSelectedPlaylistTitle(playlist?.title || "Playlist");
      
      // Fetch videos in this playlist
      const videos = await fetchPlaylistItems(playlistId);
      setAvailableVideos(videos);
      setViewMode("videos");
      
      toast({
        title: "Videos Loaded",
        description: `Found ${videos.length} videos in this playlist. Select which to analyze.`,
      });
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
      toast({
        title: "Error",
        description: "Failed to fetch videos from this playlist.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleVideosSelect = async (videoIds: string[]) => {
    if (!processingOptions) {
      toast({
        title: "Error",
        description: "Processing options not set.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setIsPlaylistProcessing(true);
      setPlaylistResults([]);
      setCurrentPlaylistIndex(0);
      setViewMode("results");
      
      if (videoIds.length === 0) {
        toast({
          title: "No Videos Selected",
          description: "Please select at least one video to analyze.",
          variant: "destructive"
        });
        setIsLoading(false);
        setIsPlaylistProcessing(false);
        return;
      }
      
      toast({
        title: "Processing Videos",
        description: `Processing ${videoIds.length} selected videos. This may take some time.`,
      });
      
      // Process each selected video
      const results: TranscriptResult[] = [];
      
      for (let i = 0; i < videoIds.length; i++) {
        try {
          const videoId = videoIds[i];
          setCurrentPlaylistIndex(i);
          
          // Find video title
          const videoTitle = availableVideos.find(v => v.videoId === videoId)?.title || "";
          
          // Fetch transcript for this video
          const transcriptData = await fetchTranscript(videoId);
          
          if (transcriptData.success) {
            // Process transcript
            const processedData = await processTranscript(
              videoId,
              transcriptData.transcript,
              processingOptions.detailLevel,
              processingOptions
            );
            
            // Add video title if not in the processed data
            if (!processedData.title && (transcriptData.title || videoTitle)) {
              processedData.title = transcriptData.title || videoTitle;
            }
            
            // Add raw transcript if needed
            if (processingOptions.showRawTranscript && transcriptData.transcript) {
              processedData.rawTranscript = transcriptData.transcript;
            }
            
            results.push(processedData);
            
            // Update playlist results to show progress
            setPlaylistResults([...results]);
            
            toast({
              title: `Processed ${i + 1} of ${videoIds.length}`,
              description: `Completed: ${processedData.title || videoTitle}`,
            });
          }
        } catch (error) {
          console.error(`Error processing video ${videoIds[i]}:`, error);
          // Continue with the next video
        }
      }
      
      // Show the first result
      if (results.length > 0) {
        setResult(results[0]);
        setVideoId(results[0].videoId);
        setIsCostEstimate(false);
      }
      
      toast({
        title: "Video Processing Complete",
        description: `Successfully processed ${results.length} out of ${videoIds.length} videos.`,
      });
    } catch (error) {
      console.error("Error processing videos:", error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing the videos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsPlaylistProcessing(false);
    }
  };

  const handlePlaylistProcessing = async (url: string, options: ProcessingOptions) => {
    try {
      setIsLoadingVideos(true);
      
      // Extract playlist ID
      const playlistId = extractPlaylistId(url);
      if (!playlistId) {
        toast({
          title: "Invalid Playlist URL",
          description: "Could not extract playlist ID from the provided URL.",
          variant: "destructive"
        });
        setIsLoadingVideos(false);
        return;
      }
      
      // Fetch playlist items
      const videos = await fetchPlaylistItems(playlistId);
      
      if (videos.length === 0) {
        toast({
          title: "Empty Playlist",
          description: "The playlist does not contain any videos.",
          variant: "destructive"
        });
        setIsLoadingVideos(false);
        return;
      }
      
      // Set available videos for selection
      setAvailableVideos(videos);
      setSelectedPlaylistId(playlistId);
      setSelectedPlaylistTitle("YouTube Playlist");
      setProcessingOptions(options);
      setViewMode("videos");
      
      toast({
        title: "Playlist Loaded",
        description: `Found ${videos.length} videos in this playlist. Select which to analyze.`,
      });
    } catch (error) {
      console.error("Error processing playlist:", error);
      toast({
        title: "Playlist Processing Error",
        description: "An error occurred while loading the playlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleProcessTranscript = async (url: string, options: ProcessingOptions) => {
    try {
      // Reset previous results
      setResult(null);
      setPlaylistResults([]);
      setIsPlaylistProcessing(false);
      setInputUrl(url);
      setProcessingOptions(options);
      
      // Check if API key is set
      if (!apiKey && !options.estimateCostOnly) {
        setApiKeyDialogOpen(true);
        return;
      }
      
      // Handle different URL types
      if (isPlaylistsPage(url)) {
        // It's a channel playlists page
        await handleFetchPlaylistsFromChannel(url);
        return;
      } else if (isPlaylist(url)) {
        // It's a playlist
        await handlePlaylistProcessing(url, options);
        return;
      }
      
      // It's a single video
      setIsLoading(true);
      setIsCostEstimate(options.estimateCostOnly || false);
      setViewMode("results");
      
      const vidId = extractVideoId(url);
      if (!vidId) {
        toast({
          title: "Invalid YouTube URL",
          description: "Could not extract video ID from the provided URL.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      setVideoId(vidId);
      
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
          
          // Add video title if not in the processed data
          if (!processedData.title && transcriptData.title) {
            processedData.title = transcriptData.title;
          }
          
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

  const handleBackToInput = () => {
    setViewMode("input");
    setAvailablePlaylists([]);
    setAvailableVideos([]);
    setSelectedPlaylistId("");
  };

  const handleBackToPlaylists = () => {
    setViewMode("playlists");
    setAvailableVideos([]);
    setSelectedPlaylistId("");
  };

  return (
    <div className="container px-4 py-8 md:py-12">
      {/* Authentication Area */}
      <AuthStatus />
      
      {/* API Key Dialog */}
      <APIKeyDialog 
        open={apiKeyDialogOpen} 
        onOpenChange={setApiKeyDialogOpen} 
      />
      
      <AnimatePresence mode="wait">
        {viewMode === "input" && (
          <InputView 
            onSubmit={handleProcessTranscript} 
            isLoading={isLoading} 
          />
        )}
        
        {viewMode === "playlists" && (
          <PlaylistsView 
            playlists={availablePlaylists}
            isLoading={isLoadingPlaylists}
            onPlaylistSelect={handlePlaylistSelect}
            onBackClick={handleBackToInput}
          />
        )}
        
        {viewMode === "videos" && (
          <VideosView 
            videos={availableVideos}
            isLoading={isLoadingVideos}
            playlistTitle={selectedPlaylistTitle}
            onBackClick={availablePlaylists.length > 0 ? handleBackToPlaylists : handleBackToInput}
            onVideosSelect={handleVideosSelect}
          />
        )}
        
        {viewMode === "results" && (
          <ResultsView 
            isLoading={isLoading}
            result={result}
            videoId={videoId}
            playlistResults={playlistResults}
            isPlaylistProcessing={isPlaylistProcessing}
            currentPlaylistIndex={currentPlaylistIndex}
            isCostEstimate={isCostEstimate}
            onExport={handleExport}
            onBackClick={handleBackToInput}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
