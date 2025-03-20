
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { URLInput } from "@/components/URLInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Footer } from "@/components/Footer";
import { PlaylistSelector } from "@/components/PlaylistSelector";
import { VideoSelector } from "@/components/VideoSelector";
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
import { Key, AlertCircle, Play, PlaySquare, LogIn } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { extractVideoId, isPlaylistUrl, isPlaylistsPageUrl } from "@/utils/youtube";
import { motion, AnimatePresence } from "framer-motion";

// Auth imports
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const DEFAULT_OPENAI_API_KEY = "sk-WdMZKiBWzBgfn-RzLgab9yPeiYoK3kZehWvbHYfFFQT3BlbkFJ2bm1VAcWdXdXvM1r2rDh8VRD22MBx499h0dSzpyt4A";
const CLERK_PUBLISHABLE_KEY = "pk_test_ZnVuZGFtZW50YWwtc2NvcnBpb24tNjkuY2xlcmsuYWNjb3VudHMuZGV2JA"; // Replace with your actual key

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [videoId, setVideoId] = useState("");
  const [isCostEstimate, setIsCostEstimate] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || DEFAULT_OPENAI_API_KEY);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const [isPlaylistProcessing, setIsPlaylistProcessing] = useState(false);
  const [playlistResults, setPlaylistResults] = useState<TranscriptResult[]>([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const { toast } = useToast();
  
  // New state for playlist and video selection
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

  const handlePlaylistItemSelect = (index: number) => {
    if (index >= 0 && index < playlistResults.length) {
      setResult(playlistResults[index]);
      setVideoId(playlistResults[index].videoId);
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
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          
          <div className="container px-4 py-8 md:py-12">
            {/* Authentication Area */}
            <div className="flex justify-end mb-4">
              <SignedIn>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Welcome back!</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
            
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
            
            <AnimatePresence mode="wait">
              {viewMode === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Example URLs - Updated to include playlists */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Example URLs to try:</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><PlaySquare className="h-3 w-3" /> <p>Videos:</p></div>
                      <p>• https://www.youtube.com/watch?v=dQw4w9WgXcQ (Rick Astley - Never Gonna Give You Up)</p>
                      <p>• https://www.youtube.com/watch?v=hLS3-RiokIw (AI Technology Explained)</p>
                      
                      <div className="flex items-center gap-1 mt-2"><Play className="h-3 w-3" /> <p>Playlists:</p></div>
                      <p>• https://www.youtube.com/playlist?list=PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF (Short Technology Videos)</p>
                      <p>• https://www.youtube.com/@TED/playlists (TED Channel Playlists)</p>
                    </div>
                  </div>
                  
                  <div className="mb-12">
                    <URLInput 
                      onSubmit={handleProcessTranscript} 
                      isLoading={isLoading} 
                    />
                  </div>
                </motion.div>
              )}
              
              {viewMode === "playlists" && (
                <motion.div
                  key="playlists"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Button 
                      variant="outline"
                      onClick={handleBackToInput}
                      className="flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back to Input
                    </Button>
                    <h2 className="text-xl font-semibold">Select a Playlist</h2>
                    <div></div> {/* Spacer for alignment */}
                  </div>
                  
                  <PlaylistSelector 
                    playlists={availablePlaylists}
                    isLoading={isLoadingPlaylists}
                    onPlaylistSelect={handlePlaylistSelect}
                  />
                </motion.div>
              )}
              
              {viewMode === "videos" && (
                <motion.div
                  key="videos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12"
                >
                  <VideoSelector 
                    videos={availableVideos}
                    isLoading={isLoadingVideos}
                    playlistTitle={selectedPlaylistTitle}
                    onBackClick={availablePlaylists.length > 0 ? handleBackToPlaylists : handleBackToInput}
                    onVideosSelect={handleVideosSelect}
                  />
                </motion.div>
              )}
              
              {viewMode === "results" && (
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
                      onClick={handleBackToInput}
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
                            variant={result?.videoId === item.videoId ? "default" : "outline"}
                            size="sm"
                            className={result?.videoId === item.videoId ? "btn-gradient" : ""}
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
                  
                  {(isLoading || result) && (
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
                          result={result} 
                          videoId={videoId} 
                          onExport={handleExport} 
                          isCostEstimate={isCostEstimate}
                        />
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    </ClerkProvider>
  );
};

export default Index;
