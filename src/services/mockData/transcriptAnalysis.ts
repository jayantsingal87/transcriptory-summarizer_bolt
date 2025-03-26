import { Topic, KeyPoint, TranscriptResult } from "@/types/transcript";

// Get mock analyzed data based on detail level and video ID
export function getMockAnalyzedData(shareId: string): TranscriptResult | null {
  // Use the videoId to generate different mock data for different videos
  const uniqueId = getUniqueIdForVideo(shareId);
  
  if (shareId === "dQw4w9WgXcQ") {
    return getRickAstleyAnalysis();
  } else if (shareId === "hLS3-RiokIw") {
    return getAIExplainedAnalysis();
  } else if (shareId === "OJ8isyS9dGQ") {
    return getTedTalkAnalysis();
  } else if (uniqueId === "0") {
    return getStandardAIAnalysis();
  } else if (uniqueId === "1") {
    return getClimateChangeAnalysis();
  } else if (uniqueId === "2") {
    return getSpanishAIAnalysis();
  } else if (uniqueId === "3") {
    return getClimateChangeAnalysis();
  } else {
    return getStandardAIAnalysis();
  }
}

// Get a unique ID based on the video ID
function getUniqueIdForVideo(videoId: string): string {
  // Use last 3 characters of video ID to create a more unique example
  const uniqueChars = videoId.slice(-3);
  const charSum = uniqueChars.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (charSum % 4).toString(); // Return 0, 1, 2, or 3 to select different examples
}

// Mock data for Rick Astley video
export function getRickAstleyAnalysis(): TranscriptResult {
  const result: TranscriptResult = {
    videoId: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up",
    detailLevel: "standard",
    duration: "3:32",
    summary: "The song expresses a commitment to a relationship, promising loyalty and devotion.",
    keyTakeaways: [
      "The singer promises never to give up on or disappoint their partner",
      "The song emphasizes commitment and loyalty",
      "The lyrics express a desire to be understood"
    ],
    topics: [
      {
        title: "Declarations of Commitment",
        description: "Promises to never abandon or hurt the relationship",
        timestamps: "0:24 - 0:44",
        coverage: 60
      },
      {
        title: "Emotional Expression",
        description: "Sharing feelings and intentions",
        timestamps: "0:00 - 0:20",
        coverage: 40
      }
    ],
    keyPoints: [
      {
        content: "The relationship is based on mutual understanding of expectations",
        timestamp: "0:04",
        confidence: 90
      },
      {
        content: "The singer expresses a desire to communicate their feelings",
        timestamp: "0:16",
        confidence: 85
      },
      {
        content: "There is a repeated emphasis on not abandoning the partner",
        timestamp: "0:24",
        confidence: 95
      }
    ],
    transcript: [
      { timestamp: "0:00", text: "We're no strangers to love" },
      { timestamp: "0:04", text: "You know the rules and so do I" },
      { timestamp: "0:08", text: "A full commitment's what I'm thinking of" },
      { timestamp: "0:12", text: "You wouldn't get this from any other guy" },
      { timestamp: "0:16", text: "I just wanna tell you how I'm feeling" },
      { timestamp: "0:20", text: "Gotta make you understand" },
      { timestamp: "0:24", text: "Never gonna give you up" },
      { timestamp: "0:28", text: "Never gonna let you down" },
      { timestamp: "0:32", text: "Never gonna run around and desert you" },
      { timestamp: "0:36", text: "Never gonna make you cry" },
      { timestamp: "0:40", text: "Never gonna say goodbye" },
      { timestamp: "0:44", text: "Never gonna tell a lie and hurt you" }
    ]
  };
  return result;
}

// Mock data for AI Explained video
export function getAIExplainedAnalysis(): TranscriptResult {
  const result: TranscriptResult = {
    videoId: "hLS3-RiokIw",
    title: "The Evolution and Future of AI",
    detailLevel: "standard",
    duration: "10:25",
    summary: "This video discusses the rapid advancement of AI technology, focusing on large language models and their capabilities, while also addressing the ethical concerns and future developments in the field.",
    keyTakeaways: [
      "AI has evolved quickly in recent years, particularly with large language models",
      "These models raise important ethical questions around bias and misinformation",
      "Future AI will likely be more integrated into daily life and capable of reasoning"
    ],
    topics: [
      {
        title: "Current AI Capabilities",
        description: "Overview of recent AI advancements and language models",
        timestamps: "0:00 - 0:15",
        coverage: 40
      },
      {
        title: "Ethical Considerations",
        description: "Discussion of bias, misinformation, and other ethical concerns",
        timestamps: "0:20 - 0:25",
        coverage: 20
      },
      {
        title: "Future Developments",
        description: "Predictions about future AI capabilities and integration",
        timestamps: "0:25 - 0:35",
        coverage: 40
      }
    ],
    keyPoints: [
      {
        content: "AI technology has been evolving rapidly in recent years",
        timestamp: "0:05",
        confidence: 95
      },
      {
        content: "Large language models have changed how we interact with technology",
        timestamp: "0:10",
        confidence: 90
      },
      {
        content: "AI raises ethical concerns about bias and misinformation",
        timestamp: "0:20",
        confidence: 85
      }
    ],
    transcript: [
      { timestamp: "0:00", text: "Let's talk about the evolution of artificial intelligence." },
      { timestamp: "0:05", text: "AI technology has been evolving at an unprecedented rate in recent years." },
      { timestamp: "0:10", text: "Large language models have fundamentally changed how we interact with technology." },
      { timestamp: "0:15", text: "These models can generate text, translate languages, and answer questions." },
      { timestamp: "0:20", text: "However, AI raises important ethical concerns about bias and misinformation." },
      { timestamp: "0:25", text: "Looking to the future, we expect AI to become more integrated into daily life." },
      { timestamp: "0:30", text: "Researchers are developing models that can reason, plan, and solve complex problems." },
      { timestamp: "0:35", text: "But these advancements also come with risks that must be addressed." }
    ]
  };
  return result;
}

// Mock data for Ted Talk video
export function getTedTalkAnalysis(): TranscriptResult {
  const result: TranscriptResult = {
    videoId: "OJ8isyS9dGQ",
    title: "The Importance of Human Connection",
    detailLevel: "standard",
    duration: "15:42",
    summary: "This TED talk emphasizes the value of meaningful social connections in an increasingly digital world, highlighting research that shows strong social ties lead to better health outcomes while suggesting that technology can either help or hinder these essential connections.",
    keyTakeaways: [
      "Face-to-face interactions are increasingly important in our digital world",
      "Strong social connections are linked to better health and longevity",
      "Technology can either enhance or diminish our social connections depending on how we use it"
    ],
    topics: [
      {
        title: "The Value of Human Connection",
        description: "Introduction to the importance of social interaction",
        timestamps: "0:00 - 0:16",
        coverage: 30
      },
      {
        title: "Health Benefits of Social Ties",
        description: "Discussion of research linking social connections to health outcomes",
        timestamps: "0:16 - 0:32",
        coverage: 30
      },
      {
        title: "Technology and Connection",
        description: "Exploring how technology affects our social interactions",
        timestamps: "0:32 - 0:56",
        coverage: 40
      }
    ],
    keyPoints: [
      {
        content: "Face-to-face interaction is increasingly important in our digital world",
        timestamp: "0:08",
        confidence: 90
      },
      {
        content: "Meaningful social connections improve health outcomes",
        timestamp: "0:16",
        confidence: 95
      },
      {
        content: "Technology can either help or hinder our connections",
        timestamp: "0:40",
        confidence: 85
      }
    ],
    transcript: [
      { timestamp: "0:00", text: "Human connection remains vital in our increasingly digital world." },
      { timestamp: "0:08", text: "Face-to-face interaction is more important than ever as digital technology reduces these opportunities." },
      { timestamp: "0:16", text: "Research shows that meaningful social connections significantly improve health outcomes." },
      { timestamp: "0:24", text: "People with strong social networks tend to live longer and healthier lives." },
      { timestamp: "0:32", text: "Many people experience a 'connection deficit' in modern society." },
      { timestamp: "0:40", text: "Technology can either enhance or diminish our social connections depending on how we use it." },
      { timestamp: "0:48", text: "Even brief interactions with strangers can significantly boost our sense of belonging." },
      { timestamp: "0:56", text: "Taking breaks from digital devices to connect with others is beneficial for our wellbeing." }
    ]
  };
  return result;
}

// Mock data for standard AI video
export function getStandardAIAnalysis(): TranscriptResult {
  const result: TranscriptResult = {
    videoId: "ai-standard-123",
    title: "Understanding AI and Machine Learning: Core Concepts",
    detailLevel: "standard",
    duration: "8:45",
    summary: "This video provides an introduction to artificial intelligence and machine learning, covering neural networks, deep learning, and practical applications while highlighting ethical considerations in AI development.",
    keyTakeaways: [
      "AI systems require large amounts of data to learn effectively",
      "Neural networks consist of input, hidden, and output layers",
      "Ethical considerations, especially regarding bias, are crucial in AI development"
    ],
    topics: [
      {
        title: "Neural Network Basics",
        description: "Explanation of neural network structure and function",
        timestamps: "0:15 - 0:25",
        coverage: 30
      },
      {
        title: "AI Applications",
        description: "Overview of practical uses of AI and machine learning",
        timestamps: "0:30 - 0:40",
        coverage: 30
      },
      {
        title: "Ethical Considerations",
        description: "Discussion of ethical issues in AI development",
        timestamps: "0:45 - 0:55",
        coverage: 40
      }
    ],
    keyPoints: [
      {
        content: "AI systems need large amounts of data to learn effectively",
        timestamp: "0:15",
        confidence: 90
      },
      {
        content: "Neural networks have input, hidden, and output layers",
        timestamp: "0:20",
        confidence: 85
      },
      {
        content: "Ethical considerations are essential in AI development",
        timestamp: "0:45",
        confidence: 95
      }
    ],
    transcript: [
      { timestamp: "0:00", text: "Welcome to this introduction to AI and machine learning." },
      { timestamp: "0:15", text: "AI systems require large amounts of data to learn effectively." },
      { timestamp: "0:20", text: "Neural networks consist of input, hidden, and output layers." },
      { timestamp: "0:25", text: "Deep learning is particularly effective at recognizing patterns in unstructured data." },
      { timestamp: "0:30", text: "AI applications range from computer vision to natural language processing." },
      { timestamp: "0:35", text: "Machine learning is transforming industries worldwide." },
      { timestamp: "0:40", text: "Reinforcement learning teaches AI through trial and error processes." },
      { timestamp: "0:45", text: "Ethical considerations must be integrated into AI development from the beginning." },
      { timestamp: "0:50", text: "Biases in training data directly lead to biased AI systems and outputs." },
      { timestamp: "0:55", text: "Responsible AI development is crucial for societal benefit." }
    ]
  };
  return result;
}

// Mock data for climate change video
export function getClimateChangeAnalysis(): TranscriptResult {
  const result: TranscriptResult = {
    videoId: "climate-change-123",
    title: "Climate Change: Challenges and Solutions",
    detailLevel: "standard",
    duration: "12:30",
    summary: "This video discusses climate change as a major global challenge, explaining its causes, effects, and potential solutions including renewable energy and individual actions.",
    keyTakeaways: [
      "Climate change is primarily caused by greenhouse gas emissions from human activities",
      "Effects include rising sea levels, extreme weather events, and biodiversity loss",
      "Solutions include renewable energy adoption and reducing individual consumption"
    ],
    topics: [
      {
        title: "Climate Change Overview",
        description: "Introduction to climate change as a global challenge",
        timestamps: "0:00 - 0:15",
        coverage: 30
      },
      {
        title: "Causes and Effects",
        description: "Explanation of causes and major impacts of climate change",
        timestamps: "0:15 - 0:38",
        coverage: 40
      },
      {
        title: "Solutions",
        description: "Discussion of potential solutions and necessary actions",
        timestamps: "0:38 - 0:52",
        coverage: 30
      }
    ],
    keyPoints: [
      {
        content: "Climate change is one of our planet's biggest challenges",
        timestamp: "0:08",
        confidence: 95
      },
      {
        content: "Human activities and greenhouse gas emissions are the primary causes",
        timestamp: "0:22",
        confidence: 90
      },
      {
        content: "Renewable energy sources are crucial for reducing emissions",
        timestamp: "0:45",
        confidence: 85
      }
    ],
    transcript: [
      { timestamp: "0:00", text: "Climate change represents one of the most significant challenges facing our planet today." },
      { timestamp: "0:08", text: "Global temperatures have risen substantially over the past century due to human activities." },
      { timestamp: "0:15", text: "The scientific evidence for warming of the climate system is unequivocal." },
      { timestamp: "0:22", text: "Greenhouse gas emissions from human activities are the primary driver of climate change." },
      { timestamp: "0:30", text: "The effects include rising sea levels, increased frequency and intensity of extreme weather events." },
      { timestamp: "0:38", text: "There is strong scientific consensus on the need for immediate action." },
      { timestamp: "0:45", text: "Renewable energy sources are crucial for reducing carbon emissions." },
      { timestamp: "0:52", text: "Individual actions and reduced consumption can make a significant difference." }
    ]
  };
  return result;
}

// Mock data for Spanish AI video
export function getSpanishAIAnalysis(): TranscriptResult {
  const result: TranscriptResult = {
    videoId: "spanish-ai-123",
    title: "Inteligencia Artificial: Conceptos Básicos y Aplicaciones",
    detailLevel: "standard",
    duration: "9:15",
    summary: "Este video presenta una introducción a la inteligencia artificial, sus aplicaciones cotidianas y consideraciones éticas importantes.",
    keyTakeaways: [
      "La IA está transformando muchos aspectos de nuestra vida diaria",
      "El aprendizaje automático es fundamental para el desarrollo de la IA",
      "La ética en la IA es un tema crucial a considerar"
    ],
    topics: [
      {
        title: "Aplicaciones de la IA",
        description: "Ejemplos de uso de la IA en la vida cotidiana",
        timestamps: "0:00 - 0:22",
        coverage: 40
      },
      {
        title: "Tecnologías Fundamentales",
        description: "Explicación del aprendizaje automático y redes neuronales",
        timestamps: "0:22 - 0:38",
        coverage: 40
      },
      {
        title: "Consideraciones Éticas",
        description: "Discusión sobre aspectos éticos de la IA",
        timestamps: "0:38 - 0:45",
        coverage: 20
      }
    ],
    keyPoints: [
      {
        content: "La IA está transformando muchos aspectos de nuestra vida diaria",
        timestamp: "0:07",
        confidence: 90
      },
      {
        content: "Las redes neuronales imitan la estructura del cerebro humano",
        timestamp: "0:30",
        confidence: 85
      },
      {
        content: "La ética en la IA es un tema muy importante a considerar",
        timestamp: "0:45",
        confidence: 95
      }
    ],
    transcript: [
      { timestamp: "0:00", text: "La inteligencia artificial está transformando el mundo moderno." },
      { timestamp: "0:07", text: "La IA está transformando muchos aspectos de nuestra vida diaria, desde asistentes virtuales hasta vehículos autónomos." },
      { timestamp: "0:15", text: "El aprendizaje automático es el componente fundamental de la inteligencia artificial moderna." },
      { timestamp: "0:22", text: "Estos sistemas pueden aprender de los datos y mejorar con el tiempo." },
      { timestamp: "0:30", text: "Las redes neuronales artificiales imitan la estructura del cerebro humano para procesar información." },
      { timestamp: "0:38", text: "El procesamiento del lenguaje natural facilita la comunicación entre humanos y máquinas." },
      { timestamp: "0:45", text: "Las consideraciones éticas son esenciales para un desarrollo responsable de la IA." }
    ],
    language: "Spanish"
  };
  return result;
}
