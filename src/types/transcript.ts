
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
}
