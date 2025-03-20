
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProgressIndicatorProps {
  visible: boolean;
  title?: string;
  description?: string;
  progress?: number;
  showPercentage?: boolean;
  indeterminate?: boolean;
  phase?: string;
  className?: string;
}

export function ProgressIndicator({
  visible,
  title = "Processing",
  description = "Please wait while we process your request",
  progress = 0,
  showPercentage = true,
  indeterminate = false,
  phase,
  className = "",
}: ProgressIndicatorProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`bg-background/90 backdrop-blur-sm border rounded-lg p-6 shadow-lg max-w-md mx-auto ${className}`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`${indeterminate ? "animate-spin" : ""}`}>
              <Loader2 className="h-10 w-10 text-brand-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
              
              {phase && (
                <div className="mt-2 text-sm font-medium text-brand-600">{phase}</div>
              )}
            </div>
            
            <div className="w-full">
              {indeterminate ? (
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                  />
                </div>
              ) : (
                <>
                  <Progress value={progress} className="h-2" />
                  {showPercentage && (
                    <p className="text-xs text-right mt-1">{Math.round(progress)}%</p>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
