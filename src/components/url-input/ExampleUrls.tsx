
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlaySquare, Play } from "lucide-react";

interface ExampleUrlsProps {
  setExampleUrl: (url: string) => void;
}

export function ExampleUrls({ setExampleUrl }: ExampleUrlsProps) {
  return (
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
      
      <motion.div 
        className="flex flex-wrap gap-2 text-xs mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-muted-foreground">Try quickly:</span>
        <Button 
          type="button" 
          variant="link" 
          size="sm" 
          className="h-auto p-0 text-xs"
          onClick={() => setExampleUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
        >
          Rick Astley
        </Button>
        <Button 
          type="button" 
          variant="link" 
          size="sm" 
          className="h-auto p-0 text-xs"
          onClick={() => setExampleUrl("https://www.youtube.com/playlist?list=PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF")}
        >
          Tech Playlist
        </Button>
        <Button 
          type="button" 
          variant="link" 
          size="sm" 
          className="h-auto p-0 text-xs"
          onClick={() => setExampleUrl("https://www.youtube.com/@TED/playlists")}
        >
          TED Playlists
        </Button>
      </motion.div>
    </div>
  );
}
