
import { motion } from "framer-motion";
import { URLInput } from "@/components/URLInput";
import { ProcessingOptions } from "@/types/transcript";
import { PlaySquare, Play } from "lucide-react";

interface InputViewProps {
  onSubmit: (url: string, options: ProcessingOptions) => void;
  isLoading: boolean;
}

export function InputView({ onSubmit, isLoading }: InputViewProps) {
  return (
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
          onSubmit={onSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </motion.div>
  );
}
