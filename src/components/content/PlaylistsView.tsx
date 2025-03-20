
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlaylistSelector } from "@/components/PlaylistSelector";
import { ArrowLeft } from "lucide-react";

interface PlaylistsViewProps {
  playlists: Array<{playlistId: string, title: string, thumbnailUrl: string}>;
  isLoading: boolean;
  onPlaylistSelect: (playlistId: string) => void;
  onBackClick: () => void;
}

export function PlaylistsView({ 
  playlists, 
  isLoading, 
  onPlaylistSelect, 
  onBackClick 
}: PlaylistsViewProps) {
  return (
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
          onClick={onBackClick}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Input
        </Button>
        <h2 className="text-xl font-semibold">Select a Playlist</h2>
        <div></div> {/* Spacer for alignment */}
      </div>
      
      <PlaylistSelector 
        playlists={playlists}
        isLoading={isLoading}
        onPlaylistSelect={onPlaylistSelect}
      />
    </motion.div>
  );
}
