
import { motion } from "framer-motion";
import { VideoSelector } from "@/components/VideoSelector";

interface VideosViewProps {
  videos: Array<{videoId: string, title: string, thumbnailUrl: string}>;
  isLoading: boolean;
  playlistTitle: string;
  onBackClick: () => void;
  onVideosSelect: (videoIds: string[]) => void;
}

export function VideosView({
  videos,
  isLoading,
  playlistTitle,
  onBackClick,
  onVideosSelect
}: VideosViewProps) {
  return (
    <motion.div
      key="videos"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-12"
    >
      <VideoSelector 
        videos={videos}
        isLoading={isLoading}
        playlistTitle={playlistTitle}
        onBackClick={onBackClick}
        onVideosSelect={onVideosSelect}
      />
    </motion.div>
  );
}
