
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
          <TooltipContent side="right" className="max-w-xs p-4 bg-white/90 backdrop-blur-sm border border-brand-100">
            <p className="font-medium mb-1 text-brand-800">Select analysis depth:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-bold mt-0.5">B</div>
                <div>
                  <span className="font-medium text-gray-800">Brief</span>
                  <p className="text-gray-600">Concise 2-3 sentence summary</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-xs font-bold mt-0.5">S</div>
                <div>
                  <span className="font-medium text-gray-800">Standard</span>
                  <p className="text-gray-600">Balanced overview with key points</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full text-xs font-bold mt-0.5">D</div>
                <div>
                  <span className="font-medium text-gray-800">Detailed</span>
                  <p className="text-gray-600">Comprehensive in-depth analysis</p>
                </div>
              </li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full">
        <Button
          type="button"
          variant={detailLevel === "brief" ? "default" : "ghost"}
          size="sm"
          onClick={() => setDetailLevel("brief")}
          className={`flex-1 ${detailLevel === "brief" ? "btn-gradient" : "hover:bg-white"}`}
        >
          Brief
        </Button>
        <Button
          type="button"
          variant={detailLevel === "standard" ? "default" : "ghost"}
          size="sm"
          onClick={() => setDetailLevel("standard")}
          className={`flex-1 ${detailLevel === "standard" ? "btn-gradient" : "hover:bg-white"}`}
        >
          Standard
        </Button>
        <Button
          type="button"
          variant={detailLevel === "detailed" ? "default" : "ghost"}
          size="sm"
          onClick={() => setDetailLevel("detailed")}
          className={`flex-1 ${detailLevel === "detailed" ? "btn-gradient" : "hover:bg-white"}`}
        >
          Detailed
        </Button>
      </div>
    </motion.div>
  );
}
