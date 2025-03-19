
import { Topic, KeyPoint, TranscriptResult } from "@/types/transcript";

// Get mock analyzed data based on detail level and video ID
export function getMockAnalyzedData(detailLevel: string, videoId: string) {
  // Use the videoId to generate different mock data for different videos
  const uniqueId = getUniqueIdForVideo(videoId);
  
  if (videoId === "dQw4w9WgXcQ") {
    return getRickAstleyAnalysis(detailLevel);
  } else if (videoId === "hLS3-RiokIw") {
    return getAIExplainedAnalysis(detailLevel);
  } else if (videoId === "OJ8isyS9dGQ") {
    return getTedTalkAnalysis(detailLevel);
  } else if (uniqueId === "0") {
    return getStandardAIAnalysis(detailLevel);
  } else if (uniqueId === "1") {
    return getClimateChangeAnalysis(detailLevel);
  } else if (uniqueId === "2") {
    return getSpanishAIAnalysis(detailLevel);
  } else if (uniqueId === "3") {
    return getClimateChangeAnalysis(detailLevel);
  } else {
    return getStandardAIAnalysis(detailLevel);
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
export function getRickAstleyAnalysis(detailLevel: string) {
  if (detailLevel === "brief") {
    return {
      title: "Rick Astley - Never Gonna Give You Up",
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
      ]
    };
  } else {
    return {
      title: "Rick Astley's 'Never Gonna Give You Up': A Song of Unwavering Commitment",
      summary: "Rick Astley's iconic song 'Never Gonna Give You Up' centers on themes of devotion, commitment, and emotional honesty in a relationship. The lyrics establish a foundation of mutual understanding and rules between two people, with the singer emphasizing complete dedication. The chorus features a series of promises never to abandon, disappoint, or hurt the other person. The song's memorable hook and straightforward message of loyalty have contributed to its enduring popularity and later cultural significance as an internet meme.",
      keyTakeaways: [
        "The song expresses commitment to a long-term relationship",
        "The singer promises never to abandon or hurt their partner",
        "There's an emphasis on emotional honesty and understanding",
        "The relationship is presented as having established 'rules' both parties understand",
        "Repeated declarations of loyalty form the core message",
        "The singer wants to clearly communicate their feelings and intentions"
      ],
      topics: [
        {
          title: "Relationship Foundation",
          description: "Establishment of mutual understanding and commitment",
          timestamps: "0:00 - 0:12",
          coverage: 25
        },
        {
          title: "Emotional Expression",
          description: "The singer's desire to communicate their feelings",
          timestamps: "0:16 - 0:20",
          coverage: 15
        },
        {
          title: "Promises of Loyalty",
          description: "Repeated commitments never to abandon or hurt the partner",
          timestamps: "0:24 - 0:44",
          coverage: 60
        }
      ],
      keyPoints: [
        {
          content: "The song begins by establishing familiarity with love and relationship expectations",
          timestamp: "0:00",
          confidence: 90
        },
        {
          content: "There's a reference to 'rules' both people in the relationship understand",
          timestamp: "0:04",
          confidence: 95
        },
        {
          content: "The singer expresses commitment as their primary intention",
          timestamp: "0:08",
          confidence: 85
        },
        {
          content: "The singer feels a need to express their feelings explicitly",
          timestamp: "0:16",
          confidence: 80
        },
        {
          content: "The chorus contains multiple promises never to disappoint or abandon",
          timestamp: "0:24",
          confidence: 95
        },
        {
          content: "The song emphasizes emotional safety in the relationship",
          timestamp: "0:36",
          confidence: 85
        }
      ]
    };
  }
}

// Mock data for AI Explained video
export function getAIExplainedAnalysis(detailLevel: string) {
  if (detailLevel === "brief") {
    return {
      title: "The Evolution and Future of AI",
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
      ]
    };
  } else {
    return {
      title: "The Evolution and Future Trajectory of Artificial Intelligence",
      summary: "This video provides a comprehensive overview of artificial intelligence's rapid evolution and its projected future. It highlights how recent advancements in large language models have fundamentally transformed human-technology interaction, enabling capabilities like text generation, language translation, and question answering. The discussion acknowledges significant ethical challenges surrounding AI, particularly regarding bias and misinformation. Looking forward, the video anticipates increasingly capable AI systems becoming more deeply integrated into daily life, with researchers developing models with enhanced reasoning, planning, and problem-solving abilities. However, the presentation emphasizes that these technological advancements bring substantial risks that require careful consideration and mitigation strategies.",
      keyTakeaways: [
        "AI has undergone rapid and transformative evolution in recent years",
        "Large language models have fundamentally changed human-technology interaction",
        "Current AI systems can generate text, translate languages, and answer questions",
        "Ethical considerations include significant concerns about bias and misinformation",
        "Future AI is expected to be more capable and more integrated into daily life",
        "Advanced models are being developed with improved reasoning and problem-solving abilities",
        "These technological advancements come with substantial risks requiring mitigation"
      ],
      topics: [
        {
          title: "Recent AI Evolution",
          description: "Overview of how artificial intelligence has rapidly developed in recent years",
          timestamps: "0:00 - 0:05",
          coverage: 15
        },
        {
          title: "Language Model Capabilities",
          description: "Explanation of how large language models have transformed technology interaction",
          timestamps: "0:05 - 0:15",
          coverage: 25
        },
        {
          title: "Ethical Concerns",
          description: "Discussion of ethical issues including bias and misinformation",
          timestamps: "0:15 - 0:25",
          coverage: 25
        },
        {
          title: "Future AI Development",
          description: "Predictions about the future direction of AI research and integration",
          timestamps: "0:25 - 0:35",
          coverage: 35
        }
      ],
      keyPoints: [
        {
          content: "AI has been rapidly evolving in recent years",
          timestamp: "0:05",
          confidence: 95
        },
        {
          content: "Large language models have transformed human-technology interaction",
          timestamp: "0:10",
          confidence: 90
        },
        {
          content: "Models like GPT can generate text, translate languages, and answer questions",
          timestamp: "0:15",
          confidence: 85
        },
        {
          content: "AI raises important ethical questions about bias and misinformation",
          timestamp: "0:20",
          confidence: 90
        },
        {
          content: "Next-generation AI will be more integrated into daily life",
          timestamp: "0:25",
          confidence: 80
        },
        {
          content: "Researchers are developing AI that can reason, plan, and solve complex problems",
          timestamp: "0:30",
          confidence: 85
        },
        {
          content: "Advanced AI capabilities come with risks that need addressing",
          timestamp: "0:35",
          confidence: 80
        }
      ]
    };
  }
}

// Mock data for Ted Talk video
export function getTedTalkAnalysis(detailLevel: string) {
  if (detailLevel === "brief") {
    return {
      title: "The Importance of Human Connection",
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
      ]
    };
  } else {
    return {
      title: "The Power of Human Connection in a Digital Age",
      summary: "This compelling TED talk explores the critical importance of meaningful human connections in our increasingly digital society. The speaker presents research demonstrating that strong social relationships significantly improve health outcomes, with socially connected individuals living longer, healthier lives. Despite technology's pervasiveness, many people experience a 'connection deficit' that impacts wellbeing. The presentation examines how technology can either enhance or diminish social bonds depending on how it's used, and emphasizes that even brief interactions with strangers can foster a sense of belonging. The talk concludes with a practical challenge for listeners to disconnect from their devices temporarily and make an effort to connect with someone new, suggesting that these small actions can have profound effects on both individual and community wellbeing.",
      keyTakeaways: [
        "Face-to-face human connections remain essential despite increasing digitalization",
        "Research confirms that meaningful social ties directly improve health outcomes and longevity",
        "Many people experience a 'connection deficit' in the modern world",
        "Technology can either strengthen or weaken social bonds depending on usage patterns",
        "Even small daily interactions with strangers can significantly boost feelings of belonging",
        "Taking intentional breaks from digital devices to connect with others is beneficial"
      ],
      topics: [
        {
          title: "Introduction to Human Connection",
          description: "Setting up the importance of connection in the digital age",
          timestamps: "0:00 - 0:08",
          coverage: 15
        },
        {
          title: "Digital World Challenges",
          description: "Discussion of how digital technology affects face-to-face interaction",
          timestamps: "0:08 - 0:16",
          coverage: 15
        },
        {
          title: "Health Benefits of Connection",
          description: "Presentation of research on social connection and health outcomes",
          timestamps: "0:16 - 0:32",
          coverage: 25
        },
        {
          title: "Technology's Dual Role",
          description: "Analysis of how technology both helps and hinders human connection",
          timestamps: "0:32 - 0:48",
          coverage: 25
        },
        {
          title: "Practical Applications",
          description: "Suggestions for enhancing connection in daily life",
          timestamps: "0:48 - 0:56",
          coverage: 20
        }
      ],
      keyPoints: [
        {
          content: "Human connection remains vital in our increasingly digital world",
          timestamp: "0:00",
          confidence: 95
        },
        {
          content: "Digital technology often reduces face-to-face interaction opportunities",
          timestamp: "0:08",
          confidence: 90
        },
        {
          content: "Research shows meaningful social connections improve health outcomes",
          timestamp: "0:16",
          confidence: 95
        },
        {
          content: "People with strong social networks tend to live longer and healthier lives",
          timestamp: "0:24",
          confidence: 90
        },
        {
          content: "Many people experience a 'connection deficit' in modern society",
          timestamp: "0:32",
          confidence: 85
        },
        {
          content: "Technology can either enhance or diminish social connections",
          timestamp: "0:40",
          confidence: 80
        },
        {
          content: "Brief interactions with strangers can significantly boost belonging",
          timestamp: "0:48",
          confidence: 85
        },
        {
          content: "Taking breaks from digital devices to connect with others is beneficial",
          timestamp: "0:56",
          confidence: 90
        }
      ]
    };
  }
}

// Mock data for standard AI video
export function getStandardAIAnalysis(detailLevel: string) {
  if (detailLevel === "brief") {
    return {
      title: "Understanding AI and Machine Learning: Core Concepts",
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
      ]
    };
  } else {
    return {
      title: "Comprehensive Guide to AI and Machine Learning: From Fundamentals to Application",
      summary: "This video offers an in-depth exploration of artificial intelligence and machine learning technologies, explaining their fundamental concepts and practical applications. It begins with an overview of how AI systems operate, emphasizing the crucial role of extensive data sets in effective learning processes. The video thoroughly explains the architecture of neural networks, including input, hidden, and output layers, and how these structures enable complex pattern recognition. It highlights deep learning's exceptional ability to identify patterns in unstructured data, showcasing successful applications in computer vision and natural language processing. The presentation also covers reinforcement learning techniques and emphasizes the critical importance of ethical considerations in AI development, particularly focusing on how biases in training data can lead to problematic AI systems. Throughout, the video illustrates how these technologies are driving transformation across diverse industries globally.",
      keyTakeaways: [
        "AI and machine learning technologies require large volumes of data to learn effectively",
        "Neural networks are structured with input, hidden, and output layers that enable pattern recognition",
        "Deep learning excels specifically at identifying patterns within unstructured data sources",
        "Computer vision and natural language processing represent major successful applications of deep learning",
        "Reinforcement learning uses trial and error methods to train AI systems",
        "Ethical considerations are paramount when developing AI, especially regarding bias in training data",
        "AI and machine learning technologies are transforming numerous industries worldwide"
      ],
      topics: [
        {
          title: "Introduction to AI and Machine Learning",
          description: "Overview of core concepts and the scope of the technologies",
          timestamps: "0:00 - 0:10",
          coverage: 15
        },
        {
          title: "Data Requirements and Neural Networks",
          description: "Explanation of data needs and neural network structure",
          timestamps: "0:15 - 0:25",
          coverage: 20
        },
        {
          title: "Deep Learning Applications",
          description: "Discussion of deep learning and its practical uses",
          timestamps: "0:25 - 0:35",
          coverage: 20
        },
        {
          title: "Advanced AI Techniques",
          description: "Exploration of reinforcement learning and other advanced methods",
          timestamps: "0:35 - 0:45",
          coverage: 15
        },
        {
          title: "Ethical Considerations in AI",
          description: "Analysis of ethical issues, including bias in AI systems",
          timestamps: "0:45 - 0:55",
          coverage: 20
        },
        {
          title: "Industrial Transformation",
          description: "Overview of how AI is changing industries globally",
          timestamps: "0:55 - 1:00",
          coverage: 10
        }
      ],
      keyPoints: [
        {
          content: "AI and machine learning fundamentals are essential to understanding modern technology",
          timestamp: "0:00",
          confidence: 90
        },
        {
          content: "Effective AI systems require large datasets for training",
          timestamp: "0:15",
          confidence: 95
        },
        {
          content: "Neural networks consist of input, hidden, and output layers that enable pattern recognition",
          timestamp: "0:20",
          confidence: 90
        },
        {
          content: "Deep learning is particularly effective at recognizing patterns in unstructured data",
          timestamp: "0:25",
          confidence: 85
        },
        {
          content: "Computer vision represents one of deep learning's most successful applications",
          timestamp: "0:30",
          confidence: 90
        },
        {
          content: "Natural language processing enables computers to understand and generate human language",
          timestamp: "0:35",
          confidence: 85
        },
        {
          content: "Reinforcement learning teaches AI through systematic trial and error processes",
          timestamp: "0:40",
          confidence: 80
        },
        {
          content: "Ethical considerations must be integrated into AI development from the beginning",
          timestamp: "0:45",
          confidence: 95
        },
        {
          content: "Biases in training data directly lead to biased AI systems and outputs",
          timestamp: "0:50",
          confidence: 90
        },
        {
          content: "AI and machine learning are driving transformation across global industries",
          timestamp: "0:55",
          confidence: 85
        }
      ]
    };
  }
}

// Mock data for climate change video
export function getClimateChangeAnalysis(detailLevel: string) {
  if (detailLevel === "brief") {
    return {
      title: "Climate Change: Challenges and Solutions",
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
      ]
    };
  } else {
    return {
      title: "Climate Change: Global Challenges and Comprehensive Solutions",
      summary: "This informative video examines climate change as one of the most pressing challenges facing our planet, providing a thorough analysis of its causes, effects, and potential solutions. It explains how global temperatures have risen significantly over the past century primarily due to greenhouse gas emissions from human activities. The presentation details the wide-ranging consequences, including rising sea levels, increasingly frequent and severe extreme weather events, and accelerating biodiversity loss. The video emphasizes the overwhelming scientific consensus on the need for immediate action and explores solution pathways focusing on renewable energy sources as alternatives to fossil fuels. Additionally, it highlights how individual actions and consumption choices complement larger systemic changes, presenting climate action as a multi-level responsibility requiring both personal and collective commitment.",
      keyTakeaways: [
        "Climate change represents one of the most significant challenges facing our planet today",
        "Global temperatures have risen substantially over the past century due to human activities",
        "Greenhouse gas emissions from human activities are the primary driver of climate change",
        "Major effects include rising sea levels, extreme weather events, and biodiversity loss",
        "Scientific consensus strongly supports the need for immediate action",
        "Renewable energy sources are essential for reducing carbon emissions",
        "Individual actions and consumption choices complement larger systemic changes"
      ],
      topics: [
        {
          title: "Introduction to Climate Change",
          description: "Overview of climate change as a global challenge",
          timestamps: "0:00 - 0:08",
          coverage: 15
        },
        {
          title: "Rising Global Temperatures",
          description: "Evidence and data regarding temperature increases",
          timestamps: "0:08 - 0:22",
          coverage: 20
        },
        {
          title: "Causes of Climate Change",
          description: "Analysis of greenhouse gas emissions and human activities",
          timestamps: "0:22 - 0:30",
          coverage: 15
        },
        {
          title: "Climate Change Effects",
          description: "Detailed explanation of major impacts and consequences",
          timestamps: "0:30 - 0:38",
          coverage: 15
        },
        {
          title: "Scientific Consensus",
          description: "Discussion of scientific agreement on climate change",
          timestamps: "0:38 - 0:45",
          coverage: 15
        },
        {
          title: "Solutions and Actions",
          description: "Exploration of renewable energy and individual contributions",
          timestamps: "0:45 - 0:52",
          coverage: 20
        }
      ],
      keyPoints: [
        {
          content: "Climate change is one of the most significant challenges our planet faces",
          timestamp: "0:08",
          confidence: 95
        },
        {
          content: "Global temperatures have risen significantly over the past century",
          timestamp: "0:15",
          confidence: 90
        },
        {
          content: "Greenhouse gas emissions from human activities are the primary cause",
          timestamp: "0:22",
          confidence: 95
        },
        {
          content: "Climate change effects include rising sea levels and extreme weather",
          timestamp: "0:30",
          confidence: 85
        },
        {
          content: "Biodiversity loss is a major consequence of climate change",
          timestamp: "0:35",
          confidence: 80
        },
        {
          content: "There is strong scientific consensus on the need for immediate action",
          timestamp: "0:38",
          confidence: 90
        },
        {
          content: "Renewable energy sources are crucial for reducing carbon emissions",
          timestamp: "0:45",
          confidence: 85
        },
        {
          content: "Individual actions and reduced consumption can make a difference",
          timestamp: "0:52",
          confidence: 80
        }
      ]
    };
  }
}

// Mock data for Spanish AI video
export function getSpanishAIAnalysis(detailLevel: string) {
  if (detailLevel === "brief") {
    return {
      title: "Inteligencia Artificial: Conceptos Básicos y Aplicaciones",
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
      ]
    };
  } else {
    return {
      title: "Inteligencia Artificial: Transformación Tecnológica y Desafíos Éticos",
      summary: "Este completo video examina el impacto transformador de la inteligencia artificial en la sociedad moderna, destacando sus aplicaciones prácticas desde asistentes virtuales hasta vehículos autónomos. La presentación explica cómo el aprendizaje automático constituye el fundamento tecnológico de la IA moderna, permitiendo que los sistemas aprendan de los datos y mejoren con el tiempo. Se analiza en detalle cómo las redes neuronales artificiales imitan la estructura del cerebro humano para procesar información de manera más eficiente. El video también aborda el procesamiento del lenguaje natural como tecnología clave que permite a las máquinas comprender y generar lenguaje humano. La parte final enfatiza la importancia crítica de las consideraciones éticas en el desarrollo de la IA, sugiriendo que la responsabilidad ética debe ser una prioridad para garantizar que estas poderosas tecnologías beneficien a la humanidad sin causar daños no intencionados.",
      keyTakeaways: [
        "La inteligencia artificial está transformando radicalmente numerosos aspectos de nuestra vida cotidiana",
        "Las aplicaciones de IA abarcan desde asistentes virtuales hasta sistemas de transporte autónomos",
        "El aprendizaje automático es la tecnología fundamental que impulsa los avances en IA",
        "Las redes neuronales artificiales se inspiran en la estructura biológica del cerebro humano",
        "El procesamiento del lenguaje natural permite la comunicación efectiva entre humanos y máquinas",
        "Las consideraciones éticas son cruciales para el desarrollo responsable de tecnologías de IA",
        "El diseño de sistemas de IA debe priorizar la equidad, transparencia y beneficio social"
      ],
      topics: [
        {
          title: "Impacto de la IA en la Sociedad",
          description: "Análisis de cómo la IA está cambiando nuestras vidas",
          timestamps: "0:00 - 0:15",
          coverage: 25
        },
        {
          title: "Aplicaciones Prácticas",
          description: "Ejemplos concretos de implementación de la IA",
          timestamps: "0:15 - 0:22",
          coverage: 15
        },
        {
          title: "Fundamentos del Aprendizaje Automático",
          description: "Explicación de los principios básicos del machine learning",
          timestamps: "0:22 - 0:30",
          coverage: 20
        },
        {
          title: "Redes Neuronales",
          description: "Funcionamiento de las redes neuronales artificiales",
          timestamps: "0:30 - 0:38",
          coverage: 20
        },
        {
          title: "Procesamiento del Lenguaje Natural",
          description: "Cómo las máquinas entienden y generan lenguaje humano",
          timestamps: "0:38 - 0:45",
          coverage: 10
        },
        {
          title: "Ética en la IA",
          description: "Consideraciones éticas en el desarrollo de sistemas de IA",
          timestamps: "0:45 - 0:50",
          coverage: 10
        }
      ],
      keyPoints: [
        {
          content: "La inteligencia artificial está transformando numerosos aspectos de nuestra vida diaria",
          timestamp: "0:07",
          confidence: 95
        },
        {
          content: "Los asistentes virtuales y vehículos autónomos son ejemplos destacados de aplicaciones de IA",
          timestamp: "0:15",
          confidence: 90
        },
        {
          content: "El aprendizaje automático es el componente fundamental de la inteligencia artificial moderna",
          timestamp: "0:22",
          confidence: 85
        },
        {
          content: "Las redes neuronales artificiales se inspiran en la estructura biológica del cerebro",
          timestamp: "0:30",
          confidence: 90
        },
        {
          content: "El procesamiento del lenguaje natural facilita la comunicación entre humanos y máquinas",
          timestamp: "0:38",
          confidence: 85
        },
        {
          content: "Las consideraciones éticas son esenciales para un desarrollo responsable de la IA",
          timestamp: "0:45",
          confidence: 95
        }
      ]
    };
  }
}
