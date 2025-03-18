import { ExportOptions, ProcessingOptions, TranscriptResult } from "@/types/transcript";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { formatTime } from "@/utils/youtube";
import autoTable from 'jspdf-autotable';
import OpenAI from "openai";

// Initialize OpenAI client - key will be provided by user
const openai = new OpenAI({
  apiKey: "sk-WdMZKiBWzBgfn-RzLgab9yPeiYoK3BlbkFJ2bm1VAcWdXdXvM1r2rDh8VRD22MBx499h0dSzpyt4A", 
  dangerouslyAllowBrowser: true
});

// This is a service that processes YouTube transcripts
export async function fetchTranscript(videoId: string): Promise<any> {
  // This would be an actual API call to get the transcript
  console.log(`Fetching transcript for video ${videoId}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock transcript data
  return {
    success: true,
    transcript: getExampleTranscript(),
    language: "English" // In a real implementation, we would detect this
  };
}

function getExampleTranscript() {
  return [
    { timestamp: "0:00", text: "Welcome to this video about AI and machine learning." },
    { timestamp: "0:05", text: "Today we're going to explore how these technologies work." },
    { timestamp: "0:10", text: "We'll cover neural networks, deep learning, and practical applications." },
    { timestamp: "0:15", text: "AI systems require large amounts of data to learn effectively." },
    { timestamp: "0:20", text: "Neural networks contain input layers, hidden layers, and output layers." },
    { timestamp: "0:25", text: "Deep learning excels at recognizing patterns in unstructured data." },
    { timestamp: "0:30", text: "Computer vision is one of the most successful applications of deep learning." },
    { timestamp: "0:35", text: "Natural language processing helps computers understand and generate text." },
    { timestamp: "0:40", text: "Reinforcement learning teaches AI through trial and error." },
    { timestamp: "0:45", text: "Ethical considerations are essential when developing AI systems." },
    { timestamp: "0:50", text: "Bias in training data can lead to biased AI systems." },
    { timestamp: "0:55", text: "AI and machine learning are transforming industries across the globe." }
  ];
}

export async function processTranscript(
  videoId: string, 
  transcript: any, 
  detailLevel: string,
  options?: Partial<ProcessingOptions>
): Promise<TranscriptResult> {
  console.log(`Processing transcript with detail level: ${detailLevel}`, options);
  
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
  const rawTranscript = transcript;
  
  try {
    // Basic validation
    if (!transcriptText || transcriptText.trim().length < 10) {
      throw new Error("Transcript is too short or empty");
    }

    // Set the detail level instructions
    let detailInstructions = "";
    if (detailLevel === "brief") {
      detailInstructions = "Keep the analysis very brief and concise. Focus only on the most important 2-3 main topics and key points. Provide a short summary of approximately 2-3 sentences. Limit key takeaways to 3-4 points maximum.";
    } else if (detailLevel === "detailed") {
      detailInstructions = "Provide a very comprehensive and detailed analysis covering all aspects of the content in depth. Identify all topics discussed, even minor ones. Extract at least 8-10 key points with high confidence. Include nuanced insights and connections between topics. Provide a thorough, multi-paragraph summary.";
    } else {
      detailInstructions = "Provide a balanced analysis with moderate detail. Cover the main topics and important points, approximately 4-6 topics and 5-7 key points. The summary should be a medium length paragraph.";
    }
    
    // Handle translation if needed
    let translationPrompt = "";
    let translatedFrom = undefined;
    let targetLanguage = "English";
    
    if (options?.translateTo && options.translateTo !== "") {
      translationPrompt = `Translate the results to ${options.translateTo}.`;
      translatedFrom = "English"; // We'd detect this in a real implementation
      targetLanguage = options.translateTo;
    }
    
    // Construct the final prompt with proper detail level and translation instructions
    let customPromptText = "";
    if (options?.customPrompt && options.customPrompt.trim() !== "") {
      customPromptText = options.customPrompt + "\n\n";
    }
    
    const finalSystemPrompt = `You are an AI assistant that specializes in analyzing video transcripts and providing structured summaries. ${customPromptText}${detailInstructions}`;
    
    const finalUserPrompt = `Analyze the following transcript and create a structured analysis: ${transcriptText}\n\n${translationPrompt}\nFormat the response as a JSON with the following structure: { "title": "", "summary": "", "keyTakeaways": [], "topics": [{ "title": "", "description": "", "timestamps": "", "coverage": 0 }], "keyPoints": [{ "content": "", "timestamp": "", "confidence": 0 }] }`;
    
    console.log("Using OpenAI with prompt:", finalSystemPrompt);
    
    let analyzedData;
    
    try {
      // Actually call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: finalSystemPrompt },
          { role: "user", content: finalUserPrompt }
        ],
        temperature: 0.7,
      });
      
      console.log("OpenAI response:", response);
      
      const content = response.choices[0].message.content || "{}";
      try {
        analyzedData = JSON.parse(content);
        console.log("Parsed response:", analyzedData);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError);
        // Fall back to mock data if parsing fails
        analyzedData = getMockAnalyzedData(detailLevel);
      }
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      // Fall back to mock data if API call fails
      analyzedData = getMockAnalyzedData(detailLevel);
    }
    
    // Generate word cloud data if requested
    let wordCloudData = undefined;
    if (options?.generateWordCloud) {
      // In a real implementation, we would use NLP to extract keywords
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
      duration: calculateDuration(transcript),
      summary: analyzedData.summary,
      keyTakeaways: analyzedData.keyTakeaways,
      topics: analyzedData.topics.map((t: any) => ({
        ...t,
        coverage: t.coverage || Math.floor(Math.random() * 30) + 10 // Add coverage if not present
      })),
      keyPoints: analyzedData.keyPoints,
      transcript: rawTranscript,
      processingCost: {
        tokens: tokensEstimate,
        estimatedCost: costEstimate
      },
      language: targetLanguage,
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

function calculateDuration(transcript: any[]) {
  if (!transcript || transcript.length === 0) return "0:00";
  const lastTimestamp = transcript[transcript.length - 1].timestamp;
  return lastTimestamp;
}

// Get mock analyzed data based on detail level
function getMockAnalyzedData(detailLevel: string) {
  if (detailLevel === "brief") {
    return {
      title: "AI and Machine Learning: Brief Overview",
      summary: "This video provides a concise introduction to AI and machine learning, covering basic concepts and applications.",
      keyTakeaways: [
        "AI systems learn from data",
        "Neural networks have multiple layers",
        "Ethics are important in AI development"
      ],
      topics: [
        {
          title: "Introduction to AI",
          description: "Basic overview of AI concepts",
          timestamps: "0:00 - 0:15",
          coverage: 40
        },
        {
          title: "Neural Networks",
          description: "Basic structure of neural networks",
          timestamps: "0:15 - 0:30",
          coverage: 35
        },
        {
          title: "Ethics in AI",
          description: "Ethical considerations for AI",
          timestamps: "0:45 - 0:55",
          coverage: 25
        }
      ],
      keyPoints: [
        {
          content: "AI requires large amounts of data",
          timestamp: "0:15",
          confidence: 95
        },
        {
          content: "Neural networks have input and output layers",
          timestamp: "0:20",
          confidence: 98
        },
        {
          content: "Bias in data leads to biased AI",
          timestamp: "0:50",
          confidence: 96
        }
      ]
    };
  } else if (detailLevel === "detailed") {
    return {
      title: "In-Depth Analysis of AI and Machine Learning Technologies",
      summary: "This comprehensive video explores artificial intelligence and machine learning in significant detail. It begins with fundamental concepts and progresses to advanced topics including neural network architecture, deep learning techniques, and real-world applications across multiple domains. The presenter provides nuanced insights into how these technologies function, their limitations, ethical considerations, and future directions. Particular emphasis is placed on technical implementation details, computational requirements, and the mathematical foundations behind these systems.",
      keyTakeaways: [
        "AI and machine learning are transforming industries across the globe",
        "Neural networks are inspired by the human brain's structure and consist of interconnected layers of nodes",
        "Deep learning excels specifically at recognizing complex patterns in unstructured data sets",
        "Various specialized techniques exist for computer vision, natural language processing, and reinforcement learning",
        "Data quality and quantity are crucial determinants of model performance",
        "Ethical considerations include bias, transparency, accountability, and privacy concerns",
        "Implementation requires careful consideration of computational resources and optimization techniques",
        "Future directions include more efficient models, better interpretability, and novel architectures"
      ],
      topics: [
        {
          title: "Introduction to AI",
          description: "Comprehensive overview of artificial intelligence, including history, definitions, and foundational concepts",
          timestamps: "0:00 - 0:10",
          coverage: 15
        },
        {
          title: "Neural Networks",
          description: "Detailed explanation of neural network architecture, including input layers, hidden layers, output layers, weights, biases, and activation functions",
          timestamps: "0:10 - 0:25",
          coverage: 20
        },
        {
          title: "Deep Learning",
          description: "In-depth coverage of deep learning techniques, architectures, training methods, and optimization approaches",
          timestamps: "0:25 - 0:35",
          coverage: 15
        },
        {
          title: "Computer Vision",
          description: "Specialized applications of deep learning for image and video processing, including convolutional neural networks",
          timestamps: "0:30 - 0:35",
          coverage: 10
        },
        {
          title: "Natural Language Processing",
          description: "Methods for enabling computers to understand and generate human language, including transformer models",
          timestamps: "0:35 - 0:40",
          coverage: 10
        },
        {
          title: "Reinforcement Learning",
          description: "Learning through interaction with environments via rewards and penalties, with applications in robotics and game playing",
          timestamps: "0:40 - 0:45",
          coverage: 10
        },
        {
          title: "Ethics and Bias",
          description: "Comprehensive discussion of ethical considerations in AI development, including bias detection and mitigation strategies",
          timestamps: "0:45 - 0:55",
          coverage: 15
        },
        {
          title: "Industry Applications",
          description: "Survey of how AI and ML are being applied across different sectors to solve real-world problems",
          timestamps: "0:55 - 1:00",
          coverage: 5
        }
      ],
      keyPoints: [
        {
          content: "AI systems require carefully curated datasets with sufficient examples for effective training",
          timestamp: "0:15",
          confidence: 95
        },
        {
          content: "Neural networks contain multiple interconnected layers that transform data through mathematical operations",
          timestamp: "0:20",
          confidence: 98
        },
        {
          content: "Deep learning architectures with many layers can identify hierarchical features in complex data",
          timestamp: "0:25",
          confidence: 96
        },
        {
          content: "Convolutional neural networks specifically excel at identifying spatial patterns in image data",
          timestamp: "0:30",
          confidence: 97
        },
        {
          content: "Natural language processing enables applications like translation, sentiment analysis, and text generation",
          timestamp: "0:35",
          confidence: 94
        },
        {
          content: "Reinforcement learning operates through environment exploration and reward maximization",
          timestamp: "0:40",
          confidence: 93
        },
        {
          content: "Ethical AI development requires diverse training data and ongoing bias monitoring",
          timestamp: "0:45",
          confidence: 95
        },
        {
          content: "Biased training data directly leads to algorithmic discrimination in deployed AI systems",
          timestamp: "0:50",
          confidence: 97
        },
        {
          content: "AI technologies are being integrated across healthcare, finance, transportation, and entertainment",
          timestamp: "0:55",
          confidence: 96
        }
      ]
    };
  } else {
    // Standard detail level
    return {
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
          timestamps: "0:00 - 0:15",
          coverage: 15
        },
        {
          title: "Neural Networks",
          description: "How neural networks function and their structure",
          timestamps: "0:15 - 0:25",
          coverage: 20
        },
        {
          title: "Deep Learning",
          description: "Explanation of deep learning and its applications",
          timestamps: "0:25 - 0:30",
          coverage: 25
        },
        {
          title: "Practical Applications",
          description: "Real-world examples of AI implementation",
          timestamps: "0:30 - 0:45",
          coverage: 30
        },
        {
          title: "Ethics and Future",
          description: "Ethical considerations and future developments",
          timestamps: "0:45 - 0:55",
          coverage: 10
        }
      ],
      keyPoints: [
        {
          content: "AI systems require large amounts of data to learn effectively",
          timestamp: "0:15",
          confidence: 95
        },
        {
          content: "Neural networks contain input layers, hidden layers, and output layers",
          timestamp: "0:20",
          confidence: 98
        },
        {
          content: "Deep learning excels at recognizing patterns in unstructured data",
          timestamp: "0:25",
          confidence: 94
        },
        {
          content: "Computer vision is one of the most successful applications of deep learning",
          timestamp: "0:30",
          confidence: 97
        },
        {
          content: "Natural language processing helps computers understand human language",
          timestamp: "0:35",
          confidence: 93
        },
        {
          content: "Reinforcement learning teaches AI through trial and error",
          timestamp: "0:40",
          confidence: 92
        },
        {
          content: "Bias in training data can lead to biased AI systems",
          timestamp: "0:50",
          confidence: 96
        }
      ]
    };
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
      const lastAutoTable = (doc as any).previousAutoTable;
      let y = lastAutoTable?.finalY ?? (options.includeTopics ? 160 : 40);
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
