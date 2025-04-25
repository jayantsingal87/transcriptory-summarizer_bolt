
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlaySquare, Play, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExampleUrlsProps {
  setExampleUrl: (url: string) => void;
}

export function ExampleUrls({ setExampleUrl }: ExampleUrlsProps) {
  return (
    <Card className="border shadow-sm bg-gradient-to-b from-white to-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <span>Example URLs to try</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-medium">
              <PlaySquare className="h-4 w-4" /> 
              <p>Single Videos</p>
            </div>
            <ul className="grid gap-2 pl-6 text-sm text-muted-foreground">
              <li className="flex items-center justify-between group">
                <span>Rick Astley - Never Gonna Give You Up</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setExampleUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
                >
                  Try <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </li>
              <li className="flex items-center justify-between group">
                <span>AI Technology Explained</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setExampleUrl("https://www.youtube.com/watch?v=hLS3-RiokIw")}
                >
                  Try <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Play className="h-4 w-4" /> 
              <p>Playlists</p>
            </div>
            <ul className="grid gap-2 pl-6 text-sm text-muted-foreground">
              <li className="flex items-center justify-between group">
                <span>Short Technology Videos</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setExampleUrl("https://www.youtube.com/playlist?list=PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF")}
                >
                  Try <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </li>
              <li className="flex items-center justify-between group">
                <span>TED Channel Playlists</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setExampleUrl("https://www.youtube.com/@TED/playlists")}
                >
                  Try <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
          <span className="text-xs text-muted-foreground self-center">Quick access:</span>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => setExampleUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
          >
            Rick Astley
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => setExampleUrl("https://www.youtube.com/playlist?list=PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF")}
          >
            Tech Playlist
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => setExampleUrl("https://www.youtube.com/@TED/playlists")}
          >
            TED Playlists
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
