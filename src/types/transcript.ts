
export interface TranscriptSegment {
  timestamp: string;
  text: string;
}

export interface Topic {
  title: string;
  description: string;
  timestamps?: string;
  coverage: number;
}

export interface KeyPoint {
  content: string;
  timestamp?: string;
  confidence?: number;
}

export interface TranscriptResult {
  videoId: string;
  title: string;
  detailLevel: string;
  duration: string;
  summary: string;
  keyTakeaways: string[];
  topics: Topic[];
  keyPoints: KeyPoint[];
  transcript: TranscriptSegment[];
  processingCost?: {
    tokens: number;
    estimatedCost: string;
  };
  language?: string;
  translatedFrom?: string;
  customPromptUsed?: string;
  wordCloudData?: {
    text: string;
    value: number;
  }[];
  confidenceScore?: number;
}

export interface ProcessingOptions {
  detailLevel: 'brief' | 'standard' | 'detailed';
  customPrompt?: string;
  translateTo?: string;
  generateWordCloud?: boolean;
  estimateCostOnly?: boolean;
}

export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'word' | 'text';
  includeOriginalTranscript: boolean;
  includeTopics: boolean;
  includeKeyPoints: boolean;
  includeSummary: boolean;
}
