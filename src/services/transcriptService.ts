
import { ExportOptions, ProcessingOptions, TranscriptResult } from "@/types/transcript";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { formatTime } from "@/utils/youtube";
import autoTable from 'jspdf-autotable';
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: "sk-*****", // The key will be passed directly from the user
  dangerouslyAllowBrowser: true // Allow browser usage
});

// This is a service that processes YouTube transcripts
export async function fetchTranscript(videoId: string): Promise<any> {
  // This would be an actual API call to get the transcript
  console.log(`Fetching transcript for video ${videoId}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock data
  return {
    success: true,
    transcript: [
      { timestamp: "0:00", text: "Welcome to this video about AI and machine learning." },
      { timestamp: "0:05", text: "Today we're going to explore how these technologies work." },
      { timestamp: "0:10", text: "We'll cover neural networks, deep learning, and practical applications." },
      // Mock transcript data would continue...
    ]
  };
}

export async function processTranscript(
  videoId: string, 
  transcript: any, 
  detailLevel: string,
  options?: Partial<ProcessingOptions>
): Promise<TranscriptResult> {
  console.log(`Processing transcript with detail level: ${detailLevel}`);
  
  // Calculate cost estimate first
  const tokensEstimate = detailLevel === 'brief' ? 2500 : 
                        detailLevel === 'standard' ? 3500 : 5000;
  const costEstimate = `$${(tokensEstimate * 0.00002).toFixed(2)}`;
  
  // If only estimating cost, return early with estimate
  if (options?.estimateCostOnly) {
    return {
      videoId,
      title: '',
      detailLevel,
      duration: '',
      summary: '',
      keyTakeaways: [],
      topics: [],
      keyPoints: [],
      transcript: [],
      processingCost: {
        tokens: tokensEstimate,
        estimatedCost: costEstimate
      }
    };
  }

  // Prepare the text for processing
  const transcriptText = transcript.map((item: any) => item.text).join(' ');
  
  try {
    // Basic validation
    if (!transcriptText || transcriptText.trim().length < 10) {
      throw new Error("Transcript is too short or empty");
    }

    let analyzedData: any;
    
    // Use OpenAI API to analyze the transcript
    const customPrompt = options?.customPrompt || '';
    const promptPrefix = customPrompt ? 
      `${customPrompt}\n\nAnalyze the following transcript: ` : 
      "Analyze the following transcript and create a structured summary with topics, key points, and takeaways: ";
    
    // Set the detail level instructions
    let detailInstructions = "";
    if (detailLevel === "brief") {
      detailInstructions = "Keep the analysis brief and focus on the most important points only.";
    } else if (detailLevel === "detailed") {
      detailInstructions = "Provide a detailed analysis covering all aspects of the content in depth.";
    } else {
      detailInstructions = "Provide a balanced analysis with moderate detail.";
    }
    
    // Handle translation if needed
    let translationPrompt = "";
    let translatedFrom = undefined;
    if (options?.translateTo) {
      translationPrompt = `Translate the results to ${options.translateTo}.`;
      translatedFrom = "English"; // We'd detect this in a real implementation
    }
    
    // Combine everything into a final prompt
    const finalPrompt = `${promptPrefix} ${transcriptText}\n\n${detailInstructions}\n${translationPrompt}\nFormat the response as a JSON with the following structure: { "title": "", "summary": "", "keyTakeaways": [], "topics": [{ "title": "", "description": "", "timestamps": "" }], "keyPoints": [{ "content": "", "timestamp": "", "confidence": 0 }] }`;
    
    // MOCK API CALL for demo purposes - in a real implementation, this would be:
    /*
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI assistant that analyzes video transcripts and provides structured summaries." },
        { role: "user", content: finalPrompt }
      ],
      temperature: 0.7,
    });
    
    analyzedData = JSON.parse(response.choices[0].message.content || "{}");
    */
    
    // For now we'll just use mock data
    analyzedData = {
      title: "Understanding AI and Machine Learning: A Comprehensive Guide",
      summary: "This video provides a comprehensive overview of artificial intelligence and machine learning. The presenter explains key concepts including neural networks, deep learning, and various practical applications. The discussion covers how AI systems learn from data, the difference between supervised and unsupervised learning, and real-world examples of AI in action. The video also addresses common misconceptions about AI and discusses ethical considerations when implementing these technologies.",
      keyTakeaways: [
        "AI and machine learning are transforming industries across the globe",
        "Neural networks are inspired by the human brain's structure",
        "Deep learning is a subset of ML that uses multi-layered neural networks",
        "Data quality is crucial for effective AI model training",
        "Ethical considerations are essential when developing AI systems"
      ],
      topics: [
        {
          title: "Introduction to AI",
          description: "Overview of artificial intelligence and its history",
          timestamps: "0:00 - 2:30",
          coverage: 15
        },
        {
          title: "Neural Networks",
          description: "How neural networks function and their structure",
          timestamps: "2:31 - 5:45",
          coverage: 20
        },
        {
          title: "Deep Learning",
          description: "Explanation of deep learning and its applications",
          timestamps: "5:46 - 8:20",
          coverage: 25
        },
        {
          title: "Practical Applications",
          description: "Real-world examples of AI implementation",
          timestamps: "8:21 - 12:15",
          coverage: 30
        },
        {
          title: "Ethics and Future",
          description: "Ethical considerations and future developments",
          timestamps: "12:16 - 15:42",
          coverage: 10
        }
      ],
      keyPoints: [
        {
          content: "AI systems require large amounts of data to learn effectively",
          timestamp: "1:24",
          confidence: 95
        },
        {
          content: "Neural networks contain input layers, hidden layers, and output layers",
          timestamp: "3:52",
          confidence: 98
        },
        {
          content: "Deep learning excels at recognizing patterns in unstructured data",
          timestamp: "6:17",
          confidence: 94
        },
        {
          content: "Computer vision is one of the most successful applications of deep learning",
          timestamp: "9:03",
          confidence: 97
        },
        {
          content: "Bias in training data can lead to biased AI systems",
          timestamp: "13:29",
          confidence: 96
        }
      ]
    };
    
    // Generate word cloud data if requested
    let wordCloudData = undefined;
    if (options?.generateWordCloud) {
      // In a real implementation, we would use NLP to extract keywords
      // For now we'll use mock data
      wordCloudData = [
        { text: "AI", value: 100 },
        { text: "Machine Learning", value: 85 },
        { text: "Neural Networks", value: 70 },
        { text: "Deep Learning", value: 65 },
        { text: "Data", value: 50 },
        { text: "Ethics", value: 40 },
        { text: "Applications", value: 35 },
        { text: "Computer Vision", value: 30 }
      ];
    }
    
    // Return the processed data
    return {
      videoId,
      title: analyzedData.title,
      detailLevel,
      duration: "15:42", // This would be extracted from the video metadata
      summary: analyzedData.summary,
      keyTakeaways: analyzedData.keyTakeaways,
      topics: analyzedData.topics.map((t: any) => ({
        ...t,
        coverage: t.coverage || Math.floor(Math.random() * 30) + 10 // Add coverage if not present
      })),
      keyPoints: analyzedData.keyPoints,
      transcript: transcript,
      processingCost: {
        tokens: tokensEstimate,
        estimatedCost: costEstimate
      },
      language: options?.translateTo || "English",
      translatedFrom,
      customPromptUsed: options?.customPrompt,
      wordCloudData,
      confidenceScore: 92
    };
  } catch (error) {
    console.error("Error processing transcript:", error);
    throw new Error("Failed to process transcript");
  }
}

export async function exportResult(result: TranscriptResult, options: ExportOptions): Promise<Blob | string> {
  // Create a slight delay to simulate processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (options.format) {
    case 'pdf':
      return exportToPdf(result, options);
    case 'markdown':
      return exportToMarkdown(result, options);
    case 'word':
      return exportToWord(result, options);
    case 'text':
      return exportToText(result, options);
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
}

function exportToPdf(result: TranscriptResult, options: ExportOptions): Promise<Blob> {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text(result.title, 20, 20);
    
    // Summary
    if (options.includeSummary) {
      doc.setFontSize(14);
      doc.text("Summary", 20, 35);
      doc.setFontSize(10);
      doc.text(result.summary, 20, 45, { maxWidth: 170 });
    }
    
    // Topics
    if (options.includeTopics) {
      let y = options.includeSummary ? 100 : 40;
      doc.setFontSize(14);
      doc.text("Topics", 20, y);
      
      y += 10;
      autoTable(doc, {
        startY: y,
        head: [['Topic', 'Description', 'Timestamps']],
        body: result.topics.map(topic => [
          topic.title,
          topic.description,
          topic.timestamps || ''
        ]),
      });
    }
    
    // Key Points
    if (options.includeKeyPoints) {
      // Get the last auto table's final position
      // @ts-ignore - previousAutoTable is added by the autoTable plugin but not in the type definition
      let y = (doc as any).previousAutoTable?.finalY ?? (options.includeTopics ? 160 : 40);
      y += 10;
      
      doc.setFontSize(14);
      doc.text("Key Points", 20, y);
      
      y += 10;
      autoTable(doc, {
        startY: y,
        head: [['Point', 'Timestamp', 'Confidence']],
        body: result.keyPoints.map(point => [
          point.content,
          point.timestamp || '',
          point.confidence ? `${point.confidence}%` : ''
        ]),
      });
    }
    
    // Transcript (on a new page)
    if (options.includeOriginalTranscript) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Transcript", 20, 20);
      
      autoTable(doc, {
        startY: 30,
        head: [['Timestamp', 'Text']],
        body: result.transcript.map(segment => [
          segment.timestamp,
          segment.text
        ]),
      });
    }
    
    // Convert to blob
    const pdfBlob = doc.output('blob');
    resolve(pdfBlob);
  });
}

function exportToMarkdown(result: TranscriptResult, options: ExportOptions): string {
  let markdown = `# ${result.title}\n\n`;
  
  if (options.includeSummary) {
    markdown += `## Summary\n\n${result.summary}\n\n`;
    
    markdown += `### Key Takeaways\n\n`;
    result.keyTakeaways.forEach(takeaway => {
      markdown += `- ${takeaway}\n`;
    });
    markdown += '\n';
  }
  
  if (options.includeTopics) {
    markdown += `## Topics\n\n`;
    result.topics.forEach(topic => {
      markdown += `### ${topic.title}\n\n`;
      markdown += `${topic.description}\n\n`;
      if (topic.timestamps) {
        markdown += `*Timestamps: ${topic.timestamps}*\n\n`;
      }
    });
  }
  
  if (options.includeKeyPoints) {
    markdown += `## Key Points\n\n`;
    result.keyPoints.forEach(point => {
      markdown += `- ${point.content}`;
      if (point.timestamp) {
        markdown += ` (${point.timestamp})`;
      }
      markdown += '\n';
    });
    markdown += '\n';
  }
  
  if (options.includeOriginalTranscript) {
    markdown += `## Transcript\n\n`;
    result.transcript.forEach(segment => {
      markdown += `**${segment.timestamp}**: ${segment.text}\n\n`;
    });
  }
  
  return markdown;
}

function exportToWord(result: TranscriptResult, options: ExportOptions): string {
  // In a real implementation, this would generate a Word document
  // Here we'll just return XML that would be used to create a Word doc
  let xml = `<xml version="1.0">
  <w:document>
    <w:body>
      <w:p>
        <w:r>
          <w:t>${result.title}</w:t>
        </w:r>
      </w:p>`;
  
  // Add other sections based on options
  if (options.includeSummary) {
    xml += `
      <w:p>
        <w:r>
          <w:t>Summary</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:t>${result.summary}</w:t>
        </w:r>
      </w:p>`;
  }
  
  // Close the XML
  xml += `
    </w:body>
  </w:document>
</xml>`;
  
  return xml;
}

function exportToText(result: TranscriptResult, options: ExportOptions): string {
  let text = `${result.title}\n\n`;
  
  if (options.includeSummary) {
    text += `SUMMARY\n\n${result.summary}\n\n`;
    
    text += `KEY TAKEAWAYS\n\n`;
    result.keyTakeaways.forEach(takeaway => {
      text += `- ${takeaway}\n`;
    });
    text += '\n';
  }
  
  if (options.includeTopics) {
    text += `TOPICS\n\n`;
    result.topics.forEach(topic => {
      text += `${topic.title}\n`;
      text += `${topic.description}\n`;
      if (topic.timestamps) {
        text += `Timestamps: ${topic.timestamps}\n`;
      }
      text += '\n';
    });
  }
  
  if (options.includeKeyPoints) {
    text += `KEY POINTS\n\n`;
    result.keyPoints.forEach(point => {
      text += `- ${point.content}`;
      if (point.timestamp) {
        text += ` (${point.timestamp})`;
      }
      text += '\n';
    });
    text += '\n';
  }
  
  if (options.includeOriginalTranscript) {
    text += `TRANSCRIPT\n\n`;
    result.transcript.forEach(segment => {
      text += `[${segment.timestamp}] ${segment.text}\n`;
    });
  }
  
  return text;
}

// Utility function to download the exported content
export function downloadExport(content: Blob | string, filename: string, format: string): void {
  if (content instanceof Blob) {
    saveAs(content, filename);
  } else {
    const blob = new Blob([content], { type: `text/${format}` });
    saveAs(blob, filename);
  }
}
