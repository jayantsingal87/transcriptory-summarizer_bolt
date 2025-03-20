
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";

interface PlaylistItem {
  playlistId: string;
  title: string;
  thumbnailUrl: string;
}

interface PlaylistSelectorProps {
  playlists: PlaylistItem[];
  isLoading: boolean;
  onPlaylistSelect: (playlistId: string) => void;
}

export function PlaylistSelector({ playlists, isLoading, onPlaylistSelect }: PlaylistSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPlaylists = playlists.filter(playlist => 
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search playlists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/80 dark:bg-gray-900/80"
        />
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow animate-pulse">
              <CardContent className="p-4 h-[120px] flex items-center justify-center">
                <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist) => (
              <motion.div key={playlist.playlistId} variants={item}>
                <Card 
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] border-[1px] border-gray-200 dark:border-gray-800"
                  onClick={() => onPlaylistSelect(playlist.playlistId)}
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {playlist.thumbnailUrl ? (
                      <img 
                        src={playlist.thumbnailUrl} 
                        alt={playlist.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlaySquare className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-2">{playlist.title}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No playlists found matching "{searchQuery}"</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
