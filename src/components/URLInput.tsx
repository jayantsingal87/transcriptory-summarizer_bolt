
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { extractVideoId } from "@/utils/youtube";

interface URLInputProps {
  onSubmit: (videoId: string, detailLevel: string) => void;
  isLoading: boolean;
}

export function URLInput({ onSubmit, isLoading }: URLInputProps) {
  const [url, setUrl] = useState("");
  const [detailLevel, setDetailLevel] = useState("standard");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(videoId, detailLevel);
  };

  return (
    <Card className="w-full max-w-xl mx-auto card-gradient border shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Paste YouTube video URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white/80 dark:bg-gray-900/80 transition-all"
              required
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="text-sm font-medium mb-2 w-full">Detail Level:</div>
            <Button
              type="button"
              variant={detailLevel === "brief" ? "default" : "outline"}
              size="sm"
              onClick={() => setDetailLevel("brief")}
              className={detailLevel === "brief" ? "btn-gradient" : ""}
            >
              Brief
            </Button>
            <Button
              type="button"
              variant={detailLevel === "standard" ? "default" : "outline"}
              size="sm"
              onClick={() => setDetailLevel("standard")}
              className={detailLevel === "standard" ? "btn-gradient" : ""}
            >
              Standard
            </Button>
            <Button
              type="button"
              variant={detailLevel === "detailed" ? "default" : "outline"}
              size="sm"
              onClick={() => setDetailLevel("detailed")}
              className={detailLevel === "detailed" ? "btn-gradient" : ""}
            >
              Detailed
            </Button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full btn-gradient" 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Structure Transcript"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
