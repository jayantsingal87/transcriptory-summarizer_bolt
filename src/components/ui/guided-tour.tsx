import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { getSinglePreference, setSinglePreference } from "@/services/preferences/userPreferences";

interface TourStep {
  title: string;
  content: ReactNode;
  elementSelector?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface TourContextType {
  startTour: (tourId: string, steps?: TourStep[]) => void;
  isTourActive: boolean;
  endTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}

export function TourProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [currentTour, setCurrentTour] = useState<string | null>(null);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const TOURS = {
    'main-features': [
      {
        title: "Welcome to TranscriptLens",
        content: "This tour will guide you through the main features of our application.",
        position: "bottom",
      },
      {
        title: "URL Input",
        content: "Start by pasting a YouTube URL here to analyze its transcript.",
        elementSelector: "#url-input",
        position: "bottom",
      },
      {
        title: "Detail Level",
        content: "Choose how detailed you want the analysis to be.",
        elementSelector: "#detail-level-selector",
        position: "right",
      },
      {
        title: "Advanced Options",
        content: "Configure additional settings like translations and visualizations.",
        elementSelector: "#advanced-options-button",
        position: "right",
      },
      {
        title: "Results View",
        content: "After processing, review the summary, topics, key points, and full transcript in these tabs.",
        elementSelector: "#results-tabs",
        position: "top",
      },
    ],
    'collaboration-features': [
      {
        title: "Collaboration Features",
        content: "Learn how to collaborate with others on your transcript analysis.",
        position: "bottom",
      },
      {
        title: "Sharing",
        content: "Share your analysis with others via email, link, or embed code.",
        elementSelector: "#share-button",
        position: "left",
      },
      {
        title: "Comments",
        content: "Add comments to discuss specific parts of the analysis.",
        elementSelector: "#comments-panel",
        position: "right",
      },
      {
        title: "Highlighting",
        content: "Highlight important parts of the text for reference.",
        elementSelector: "#highlight-controls",
        position: "top",
      },
      {
        title: "Version History",
        content: "Track changes and restore previous versions if needed.",
        elementSelector: "#version-history-button",
        position: "left",
      },
    ],
  };

  const startTour = (tourId: string, customSteps?: TourStep[]) => {
    // Check if user has dismissed this tour before
    const dismissedTours = getSinglePreference('dismissedTours') || [];
    if (Array.isArray(dismissedTours) && dismissedTours.includes(tourId)) return;
    
    const tourSteps = customSteps || (TOURS as any)[tourId];
    if (!tourSteps) {
      console.error(`Tour ${tourId} not found`);
      return;
    }
    
    setCurrentTour(tourId);
    setSteps(tourSteps);
    setCurrentStep(0);
    setShowDialog(true);
    
    toast({
      title: "Guided Tour Started",
      description: "Follow along to learn about key features",
    });
  };

  const endTour = (dismiss = false) => {
    if (dismiss && currentTour) {
      // Save that user has dismissed this tour
      const dismissedTours = getSinglePreference('dismissedTours') || [];
      const updatedDismissedTours = Array.isArray(dismissedTours) ? [...dismissedTours, currentTour] : [currentTour];
      setSinglePreference('dismissedTours', updatedDismissedTours);
    }
    
    setCurrentTour(null);
    setSteps([]);
    setCurrentStep(0);
    setTargetElement(null);
    setShowDialog(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (!steps.length || !currentTour) return;
    
    const step = steps[currentStep];
    if (step.elementSelector) {
      const element = document.querySelector(step.elementSelector) as HTMLElement;
      setTargetElement(element);
    } else {
      setTargetElement(null);
    }
  }, [currentStep, steps, currentTour]);

  return (
    <TourContext.Provider
      value={{
        startTour,
        isTourActive: !!currentTour,
        endTour: () => endTour(true),
      }}
    >
      {children}
      
      {/* Dialog for tour steps without specific target elements */}
      <Dialog open={showDialog} onOpenChange={(open) => !open && endTour()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{steps[currentStep]?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {steps[currentStep]?.content}
          </div>
          <DialogFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => endTour(true)}
                size="sm"
              >
                Skip Tour
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button onClick={nextStep} size="sm">
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  "Finish"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tooltips for tour steps with target elements */}
      <AnimatePresence>
        {currentTour && targetElement && !showDialog && (
          <TooltipOverlay
            targetElement={targetElement}
            position={steps[currentStep]?.position || "bottom"}
            title={steps[currentStep]?.title}
            content={steps[currentStep]?.content}
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={nextStep}
            onPrev={prevStep}
            onClose={() => endTour(true)}
          />
        )}
      </AnimatePresence>
    </TourContext.Provider>
  );
}

interface TooltipOverlayProps {
  targetElement: HTMLElement;
  position: 'top' | 'right' | 'bottom' | 'left';
  title: string;
  content: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

function TooltipOverlay({
  targetElement,
  position,
  title,
  content,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
}: TooltipOverlayProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    function updatePosition() {
      if (!targetElement) return;
      
      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 280;
      const tooltipHeight = 180;
      const spacing = 12;
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = rect.top - tooltipHeight - spacing;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + spacing;
          break;
        case 'bottom':
          top = rect.bottom + spacing;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - spacing;
          break;
      }
      
      // Adjust if tooltip goes outside viewport
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      
      if (left < 10) left = 10;
      if (left + tooltipWidth > viewport.width - 10) left = viewport.width - tooltipWidth - 10;
      if (top < 10) top = 10;
      if (top + tooltipHeight > viewport.height - 10) top = viewport.height - tooltipHeight - 10;
      
      setCoords({ top, left });
    }
    
    updatePosition();
    
    // Highlight the target element
    if (targetElement) {
      targetElement.classList.add('tour-highlight');
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      if (targetElement) {
        targetElement.classList.remove('tour-highlight');
      }
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetElement, position]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 shadow-lg border rounded-lg bg-background w-[280px]"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{title}</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-sm mb-4">{content}</div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={currentStep === 0}
              className="h-7 text-xs px-2"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Prev
            </Button>
            <Button
              size="sm"
              onClick={onNext}
              className="h-7 text-xs px-2"
            >
              {currentStep < totalSteps - 1 ? (
                <>
                  Next
                  <ArrowRight className="h-3 w-3 ml-1" />
                </>
              ) : (
                "Finish"
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TourButton() {
  const { startTour } = useTour();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => startTour('main-features')}
      className="flex items-center gap-1"
    >
      <HelpCircle className="h-4 w-4" />
      Guided Tour
    </Button>
  );
}
