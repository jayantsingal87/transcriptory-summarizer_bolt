
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Search, CheckCircle, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface VideoSelectorProps {
  videos: Array<{videoId: string, title: string, thumbnailUrl: string}>;
  isLoading: boolean;
  playlistTitle: string;
  onBackClick: () => void;
  onVideosSelect: (videoIds: string[]) => void;
}

export function VideoSelector({
  videos,
  isLoading,
  playlistTitle,
  onBackClick,
  onVideosSelect
}: VideoSelectorProps) {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVideos, setFilteredVideos] = useState(videos);

  // Filter videos when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos);
    }
  }, [searchTerm, videos]);

  // Reset selection when videos change
  useEffect(() => {
    setSelectedVideos([]);
  }, [videos]);

  const toggleVideoSelection = (videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== videoId));
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
    }
  };

  const selectAllVideos = () => {
    if (selectedVideos.length === filteredVideos.length) {
      // Deselect all if all are selected
      setSelectedVideos([]);
    } else {
      // Select all filtered videos
      setSelectedVideos(filteredVideos.map(video => video.videoId));
    }
  };

  const handleSubmit = () => {
    if (selectedVideos.length === 0) {
      return; // Prevent submission with no videos selected
    }
    onVideosSelect(selectedVideos);
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto card-gradient border shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackClick}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <h2 className="text-xl font-semibold">{playlistTitle}</h2>
            <div className="w-16"></div> {/* Spacer for visual balance */}
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium">
              {isLoading ? 'Loading videos...' : `${filteredVideos.length} videos available`}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllVideos}
              disabled={filteredVideos.length === 0}
              className="flex items-center gap-1"
            >
              {selectedVideos.length === filteredVideos.length && filteredVideos.length > 0 
                ? "Deselect All" 
                : "Select All"}
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos..."
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-opacity-50 border-t-primary rounded-full mx-auto mb-4"></div>
              <p>Loading videos from playlist...</p>
            </div>
          ) : (
            <>
              {filteredVideos.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No videos found matching your search.</p>
                </div>
              ) : (
                <motion.div 
                  className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredVideos.map((video) => (
                    <motion.div
                      key={video.videoId}
                      variants={itemVariants}
                      onClick={() => toggleVideoSelection(video.videoId)}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                        selectedVideos.includes(video.videoId) ? "bg-gray-100 dark:bg-gray-800" : ""
                      )}
                    >
                      <div className="flex-shrink-0">
                        {selectedVideos.includes(video.videoId) ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 rounded-md overflow-hidden w-24 h-14 bg-gray-200">
                        <img 
                          src={video.thumbnailUrl || "/placeholder.svg"} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}

          <div className="flex justify-between items-center pt-4">
            <span className="text-sm text-muted-foreground">
              {selectedVideos.length} videos selected
            </span>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleSubmit} 
                disabled={selectedVideos.length === 0 || isLoading}
                className="btn-gradient"
              >
                Analyze Selected Videos ({selectedVideos.length})
              </Button>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
