
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DetailLevelSelectorProps {
  detailLevel: "brief" | "standard" | "detailed";
  setDetailLevel: (level: "brief" | "standard" | "detailed") => void;
}

export function DetailLevelSelector({ detailLevel, setDetailLevel }: DetailLevelSelectorProps) {
  return (
    <motion.div 
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="text-sm font-medium mb-2 w-full flex items-center gap-2">
        Detail Level:
        <Tooltip>
          <TooltipTrigger asChild>
            <Lightbulb className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              Brief: Concise 2-3 sentence summary<br />
              Standard: Balanced overview with key points<br />
              Detailed: Comprehensive in-depth analysis
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
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
    </motion.div>
  );
}
