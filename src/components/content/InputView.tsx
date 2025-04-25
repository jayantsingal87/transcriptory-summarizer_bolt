
import { motion } from "framer-motion";
import { URLInput } from "@/components/URLInput";
import { ProcessingOptions } from "@/types/transcript";
import { ExampleUrls } from "@/components/url-input/ExampleUrls";

interface InputViewProps {
  onSubmit: (url: string, options: ProcessingOptions) => void;
  isLoading: boolean;
}

export function InputView({ onSubmit, isLoading }: InputViewProps) {
  const handleExampleUrlClick = (url: string) => {
    // Create a temporary URLInput component and call its setExampleUrl method
    const tempInput = document.createElement("input");
    tempInput.value = url;
    
    // Pass the URL and default options to onSubmit
    onSubmit(url, {
      detailLevel: "standard",
      estimateCostOnly: false,
      generateWordCloud: false,
      showRawTranscript: false
    });
  };
  
  return (
    <motion.div
      key="input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <ExampleUrls setExampleUrl={handleExampleUrlClick} />
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
