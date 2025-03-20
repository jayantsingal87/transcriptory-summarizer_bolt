
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ArrowLeft, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";

interface VideoItem {
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

interface VideoSelectorProps {
  videos: VideoItem[];
  isLoading: boolean;
  playlistTitle?: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideos, setSelectedVideos] = useState<Record<string, boolean>>({});
  
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelectAll = () => {
    const newSelectedVideos: Record<string, boolean> = {};
    filteredVideos.forEach(video => {
      newSelectedVideos[video.videoId] = true;
    });
    setSelectedVideos(newSelectedVideos);
  };
  
  const handleClearAll = () => {
    setSelectedVideos({});
  };
  
  const handleToggleVideo = (videoId: string) => {
    setSelectedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };
  
  const handleSubmit = () => {
    const selectedVideoIds = Object.entries(selectedVideos)
      .filter(([_, isSelected]) => isSelected)
      .map(([videoId]) => videoId);
      
    onVideosSelect(selectedVideoIds.length > 0 ? selectedVideoIds : videos.map(v => v.videoId));
  };
  
  const selectedCount = Object.values(selectedVideos).filter(Boolean).length;
  const allSelected = selectedCount === filteredVideos.length && filteredVideos.length > 0;
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBackClick}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        {playlistTitle && (
          <h2 className="text-xl font-semibold">{playlistTitle}</h2>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filteredVideos.length === 0}
            onClick={allSelected ? handleClearAll : handleSelectAll}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
          
          <Button 
            size="sm"
            disabled={isLoading || (selectedCount === 0 && videos.length > 0)}
            onClick={handleSubmit}
            className="btn-gradient"
          >
            {selectedCount > 0
              ? `Process ${selectedCount} Video${selectedCount > 1 ? 's' : ''}`
              : "Process All Videos"
            }
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/80 dark:bg-gray-900/80"
        />
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-[120px] h-[68px] bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <motion.div key={video.videoId} variants={item}>
                <Card 
                  className={`overflow-hidden hover:shadow-md transition-all cursor-pointer border-[1px] ${
                    selectedVideos[video.videoId] 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                  onClick={() => handleToggleVideo(video.videoId)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative w-[120px] h-[68px] bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PlaySquare className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <Checkbox 
                          checked={!!selectedVideos[video.videoId]} 
                          onCheckedChange={() => handleToggleVideo(video.videoId)}
                          className="mt-1"
                        />
                        <h3 className="font-medium line-clamp-2">{video.title}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No videos found matching "{searchQuery}"</p>
              {searchQuery && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </motion.div>
      )}
      
      {filteredVideos.length > 5 && (
        <div className="flex justify-center mt-4">
          <Button 
            onClick={handleSubmit} 
            className="btn-gradient"
            disabled={selectedCount === 0 && videos.length > 0}
          >
            {selectedCount > 0
              ? `Process ${selectedCount} Video${selectedCount > 1 ? 's' : ''}`
              : "Process All Videos"
            }
          </Button>
        </div>
      )}
    </div>
  );
}
