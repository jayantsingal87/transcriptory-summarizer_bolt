
import { ProcessingOptions, TranscriptResult } from "@/types/transcript";
import { getOpenAIClient } from "@/services/api/openai";
import { getMockAnalyzedData } from "@/services/mockData/transcriptAnalysis";

// Process transcript with AI
export async function processTranscript(
  videoId: string, 
  transcript: any, 
  detailLevel: string,
  options?: Partial<ProcessingOptions>
): Promise<TranscriptResult> {
  console.log(`Processing transcript with detail level: ${detailLevel}`, options);
  
  // Calculate cost estimate based on detail level and transcript length
  const transcriptLength = Array.isArray(transcript) ? transcript.length : 0;
  const baseCost = transcriptLength * 0.5;
  const detailMultiplier = detailLevel === 'brief' ? 1 : 
                          detailLevel === 'standard' ? 1.5 : 2.5;
  const tokensEstimate = Math.round(baseCost * detailMultiplier * 100);
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

  // Prepare transcript and validate
  let transcriptText = "";
  let rawTranscript = transcript;
  
  if (Array.isArray(transcript)) {
    transcriptText = transcript.map((item: any) => `[${item.timestamp}] ${item.text}`).join(' ');
  } else {
    console.error("Invalid transcript format");
    throw new Error("Invalid transcript format");
  }
  
  try {
    // Basic validation
    if (!transcriptText || transcriptText.trim().length < 10) {
      throw new Error("Transcript is too short or empty");
    }

    // Handle translation of the raw transcript if needed
    let translationPrompt = "";
    let translatedFrom = undefined;
    let targetLanguage = "English";
    
    if (options?.translateTo && options.translateTo !== "" && options.translateTo.toLowerCase() !== "english") {
      translationPrompt = `Translate the results to ${options.translateTo}.`;
      translatedFrom = "English"; // We'd detect this in a real implementation
      targetLanguage = options.translateTo;
    }
    
    // Set the detail level instructions - make them significantly different
    let detailInstructions = "";
    if (detailLevel === "brief") {
      detailInstructions = "Provide an extremely concise analysis. Identify only the 2-3 most important topics. Extract no more than 3-4 key points. Keep the summary under 2 sentences. Be minimal but insightful.";
    } else if (detailLevel === "detailed") {
      detailInstructions = "Provide an extremely comprehensive and in-depth analysis. Identify all topics discussed, including minor subtopics. Extract at least 10-12 key points with nuanced insights. Write a thorough multi-paragraph summary covering all aspects of the content. Include connections between topics and provide detailed explanations of complex concepts.";
    } else {
      detailInstructions = "Provide a balanced analysis with moderate detail. Cover 4-6 main topics and 5-7 key points. The summary should be a medium-length paragraph that covers the main ideas without excessive detail.";
    }
    
    // Custom prompt handling
    let customPromptText = "";
    if (options?.customPrompt && options.customPrompt.trim() !== "") {
      customPromptText = `${options.customPrompt}\n\n`;
    }
    
    const finalSystemPrompt = `You are an AI assistant that specializes in analyzing video transcripts and providing structured summaries. ${customPromptText}${detailInstructions}`;
    
    const finalUserPrompt = `Analyze the following transcript and create a structured analysis:
${transcriptText}

${translationPrompt}

Format the response as a JSON object with the following structure:
{
  "title": "Write a descriptive title based on the content",
  "summary": "Comprehensive summary of the content",
  "keyTakeaways": ["List of key takeaways"],
  "topics": [
    {
      "title": "Topic title",
      "description": "Topic description",
      "timestamps": "Approximate timestamp range",
      "coverage": 0 // Percentage of content devoted to this topic (0-100)
    }
  ],
  "keyPoints": [
    {
      "content": "Key point content",
      "timestamp": "Approximate timestamp",
      "confidence": 0 // Confidence score (0-100)
    }
  ]
}`;
    
    console.log("Using OpenAI with prompt:", finalSystemPrompt);
    
    let analyzedData;
    const openaiClient = getOpenAIClient();
    
    // Check if OpenAI client is initialized
    if (openaiClient) {
      try {
        // Call OpenAI API
        const response = await openaiClient.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: finalSystemPrompt },
            { role: "user", content: finalUserPrompt }
          ],
          temperature: 0.7,
        });
        
        console.log("OpenAI response received");
        
        // Get the content from the response
        const content = response.choices[0].message.content || "{}";
        
        try {
          // Sometimes the model returns the JSON with markdown backticks, so we need to clean it
          const cleanedContent = content.replace(/```json|```/g, '').trim();
          analyzedData = JSON.parse(cleanedContent);
          console.log("Parsed response successfully:", analyzedData);
        } catch (parseError) {
          console.error("Failed to parse OpenAI response:", parseError, "Response was:", content);
          // Try more aggressive JSON extraction
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              analyzedData = JSON.parse(jsonMatch[0]);
              console.log("Extracted and parsed JSON using regex:", analyzedData);
            } catch (secondParseError) {
              console.error("Second parse attempt failed:", secondParseError);
              // Fall back to mock data
              analyzedData = getMockAnalyzedData(videoId);
            }
          } else {
            // Fall back to mock data
            analyzedData = getMockAnalyzedData(videoId);
          }
        }
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
        // Fall back to mock data
        analyzedData = getMockAnalyzedData(videoId);
      }
    } else {
      console.log("OpenAI client not initialized, using mock data");
      // No API key provided, use mock data
      analyzedData = getMockAnalyzedData(videoId);
    }
    
    // Generate word cloud data if requested
    let wordCloudData = undefined;
    if (options?.generateWordCloud) {
      // This is a simplistic example - in a real implementation, use NLP
      const words = transcriptText.split(/\s+/);
      const wordCounts: {[key: string]: number} = {};
      
      words.forEach(word => {
        word = word.toLowerCase().replace(/[^a-z0-9]/gi, '');
        if (word.length > 3 && !["and", "the", "this", "that", "with", "from"].includes(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
      
      wordCloudData = Object.entries(wordCounts)
        .filter(([_, count]) => count > 1) // Only include words that appear more than once
        .sort((a, b) => b[1] - a[1]) // Sort by frequency
        .slice(0, 20) // Take top 20 words
        .map(([text, value]) => ({ text, value }));
      
      // If there aren't enough real words, add some mock data
      if (wordCloudData.length < 8) {
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
      confidenceScore: Math.floor(Math.random() * 10) + 85, // Random confidence between 85-95
      rawTranscript: options?.showRawTranscript ? rawTranscript : undefined
    };
  } catch (error) {
    console.error("Error processing transcript:", error);
    throw new Error("Failed to process transcript");
  }
}

// Calculate duration from transcript
function calculateDuration(transcript: any[]) {
  if (!transcript || transcript.length === 0) return "0:00";
  const lastTimestamp = transcript[transcript.length - 1].timestamp;
  return lastTimestamp;
}
