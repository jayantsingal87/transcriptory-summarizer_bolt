
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface Highlight {
  id: string;
  text: string;
  color: string;
  startOffset: number;
  endOffset: number;
  createdBy: string;
  timestamp: Date;
  notes?: string;
}

interface HighlightContextType {
  highlights: Highlight[];
  activeColor: string;
  setActiveColor: (color: string) => void;
  addHighlight: (text: string, startOffset: number, endOffset: number, notes?: string) => void;
  removeHighlight: (id: string) => void;
  isHighlightMode: boolean;
  toggleHighlightMode: () => void;
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export function useHighlights() {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error("useHighlights must be used within a HighlightProvider");
  }
  return context;
}

export function HighlightProvider({ children, videoId }: { children: ReactNode; videoId: string }) {
  const { toast } = useToast();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [activeColor, setActiveColor] = useState<string>("#FFDE59"); // Yellow default
  const [isHighlightMode, setIsHighlightMode] = useState(false);

  // Load highlights when videoId changes
  useEffect(() => {
    // This would fetch from API in a real app
    const savedHighlights: Highlight[] = [];
    setHighlights(savedHighlights);
  }, [videoId]);

  const toggleHighlightMode = () => {
    setIsHighlightMode(!isHighlightMode);
    
    if (!isHighlightMode) {
      toast({
        title: "Highlight mode activated",
        description: "Select text to highlight it",
      });
    }
  };

  const addHighlight = (text: string, startOffset: number, endOffset: number, notes?: string) => {
    const newHighlight: Highlight = {
      id: `highlight_${Date.now()}`,
      text,
      color: activeColor,
      startOffset,
      endOffset,
      createdBy: "current-user", // In a real app, get from auth
      timestamp: new Date(),
      notes
    };
    
    setHighlights(prev => [...prev, newHighlight]);
    
    toast({
      title: "Highlight added",
      description: notes ? "Highlight and note saved" : "Text highlighted",
    });
    
    // In a real app, save to API
  };

  const removeHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
    
    toast({
      title: "Highlight removed",
      description: "The highlight has been deleted",
    });
    
    // In a real app, delete from API
  };

  return (
    <HighlightContext.Provider
      value={{
        highlights,
        activeColor,
        setActiveColor,
        addHighlight,
        removeHighlight,
        isHighlightMode,
        toggleHighlightMode
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
}

interface HighlightableTextProps {
  text: string;
  className?: string;
}

export function HighlightableText({ text, className = "" }: HighlightableTextProps) {
  const { highlights, addHighlight, isHighlightMode, activeColor } = useHighlights();
  
  const handleSelection = () => {
    if (!isHighlightMode) return;
    
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();
    
    if (!selectedText) return;
    
    // In a real app, calculate accurate offsets based on DOM position
    const startOffset = 0;
    const endOffset = selectedText.length;
    
    addHighlight(selectedText, startOffset, endOffset);
    selection.removeAllRanges();
  };
  
  // Very simple highlight rendering - in a real app, this would be more complex
  // to handle overlapping highlights and accurate positioning
  const textWithHighlights = text;

  return (
    <div 
      className={`relative ${className} ${isHighlightMode ? 'cursor-text selection:bg-yellow-200' : ''}`}
      onMouseUp={handleSelection}
    >
      {textWithHighlights}
      
      {highlights.map((highlight) => (
        <motion.div
          key={highlight.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: highlight.color }}
        />
      ))}
    </div>
  );
}

export function HighlightControls() {
  const { activeColor, setActiveColor, isHighlightMode, toggleHighlightMode } = useHighlights();
  
  const colors = [
    { name: "Yellow", value: "#FFDE59" },
    { name: "Green", value: "#BEFF7A" },
    { name: "Blue", value: "#7DB9FF" },
    { name: "Pink", value: "#FFABF1" },
    { name: "Purple", value: "#D8B4FE" }
  ];
  
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
      <button
        onClick={toggleHighlightMode}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          isHighlightMode 
            ? 'bg-brand-500 text-white' 
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        {isHighlightMode ? "Exit Highlight Mode" : "Highlight Text"}
      </button>
      
      {isHighlightMode && (
        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-muted-foreground">Color:</span>
          <div className="flex gap-1">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setActiveColor(color.value)}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  activeColor === color.value ? 'transform scale-110 border-brand-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
