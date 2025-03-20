
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, ChevronDown, FileCode, Info, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ApiDocs() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedExample, setExpandedExample] = useState<string | null>(null);
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard",
    });
  };
  
  const toggleExample = (id: string) => {
    if (expandedExample === id) {
      setExpandedExample(null);
    } else {
      setExpandedExample(id);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border-none shadow-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl">TranscriptLens API Documentation</CardTitle>
          <CardDescription className="text-lg">
            Integrate TranscriptLens analysis functionality into your own applications
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Learn how to integrate TranscriptLens analysis into your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Introduction</h3>
                  <p>
                    The TranscriptLens API allows you to programmatically analyze YouTube video transcripts.
                    Use our API to extract summaries, key points, topics, and more from any YouTube video.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Extract and analyze transcripts from YouTube videos</li>
                    <li>Generate summaries, topics, and key points</li>
                    <li>Translate transcripts into different languages</li>
                    <li>Create word clouds and visualizations</li>
                    <li>Collaborate on and share analyses</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Rate Limits</h3>
                  <div className="bg-muted/40 p-4 rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2">Plan</th>
                          <th className="text-left pb-2">Requests Per Day</th>
                          <th className="text-left pb-2">Requests Per Minute</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-1">Free</td>
                          <td>100</td>
                          <td>10</td>
                        </tr>
                        <tr>
                          <td className="py-1">Pro</td>
                          <td>1,000</td>
                          <td>60</td>
                        </tr>
                        <tr>
                          <td className="py-1">Enterprise</td>
                          <td>10,000+</td>
                          <td>300</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="mr-4">Sign Up for API Key</Button>
                  <Button variant="outline">
                    View on GitHub
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="authentication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Authentication</CardTitle>
                <CardDescription>
                  Learn how to authenticate your API requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">API Keys</h3>
                  <p>
                    All requests to the TranscriptLens API require an API key. You can get your API key by signing up
                    for a TranscriptLens account. Your API key should be kept secret and not exposed in client-side code.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Authentication Methods</h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="header">
                      <AccordionTrigger>Authentication via Header (Recommended)</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p>Pass your API key in the <code>X-API-Key</code> header:</p>
                          <div className="bg-muted p-3 rounded-md font-mono text-sm relative">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => handleCopy('X-API-Key: your_api_key_here')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <pre>X-API-Key: your_api_key_here</pre>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            This is the recommended way to authenticate your API requests.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="query">
                      <AccordionTrigger>Authentication via Query Parameter</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p>Pass your API key as a query parameter:</p>
                          <div className="bg-muted p-3 rounded-md font-mono text-sm relative">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => handleCopy('https://api.transcriptlens.com/v1/analyze?api_key=your_api_key_here')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <pre>https://api.transcriptlens.com/v1/analyze?api_key=your_api_key_here</pre>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            This method is less secure as API keys in URLs might be logged. Use only for testing.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <div className="space-y-3 pt-2">
                  <h3 className="text-lg font-medium">Securing Your API Key</h3>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-amber-500 shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800">Security Best Practices</p>
                        <ul className="list-disc list-inside space-y-1 mt-2 text-amber-700">
                          <li>Never expose your API key in client-side code</li>
                          <li>Use environment variables to store your API key</li>
                          <li>Create a server-side proxy to make API requests</li>
                          <li>Implement request signing for enhanced security</li>
                          <li>Rotate your API keys periodically</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Explore available endpoints and their parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="analyze">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Badge className="mr-2">POST</Badge>
                        <span>/v1/analyze</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>Analyze a YouTube video transcript.</p>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Request Parameters</h4>
                          <div className="bg-muted/40 p-3 rounded-md">
                            <div className="space-y-2">
                              <div>
                                <code className="text-sm font-semibold">videoId</code>
                                <span className="text-sm ml-2">string <span className="text-red-500">required</span></span>
                                <p className="text-sm text-muted-foreground">YouTube video ID</p>
                              </div>
                              <Separator />
                              <div>
                                <code className="text-sm font-semibold">detailLevel</code>
                                <span className="text-sm ml-2">string <span className="text-gray-500">optional</span></span>
                                <p className="text-sm text-muted-foreground">Level of detail for analysis: "brief", "standard", or "detailed". Defaults to "standard".</p>
                              </div>
                              <Separator />
                              <div>
                                <code className="text-sm font-semibold">translateTo</code>
                                <span className="text-sm ml-2">string <span className="text-gray-500">optional</span></span>
                                <p className="text-sm text-muted-foreground">Language code to translate results to (e.g., "es", "fr")</p>
                              </div>
                              <Separator />
                              <div>
                                <code className="text-sm font-semibold">generateWordCloud</code>
                                <span className="text-sm ml-2">boolean <span className="text-gray-500">optional</span></span>
                                <p className="text-sm text-muted-foreground">Whether to generate word cloud data. Defaults to false.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Example Request</h4>
                          <div className="bg-muted p-3 rounded-md font-mono text-sm relative">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => handleCopy('curl -X POST https://api.transcriptlens.com/v1/analyze \\\n-H "X-API-Key: your_api_key_here" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "videoId": "dQw4w9WgXcQ",\n  "detailLevel": "detailed",\n  "generateWordCloud": true\n}\'')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <pre>{`curl -X POST https://api.transcriptlens.com/v1/analyze \\
-H "X-API-Key: your_api_key_here" \\
-H "Content-Type: application/json" \\
-d '{
  "videoId": "dQw4w9WgXcQ",
  "detailLevel": "detailed",
  "generateWordCloud": true
}'`}</pre>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Response</h4>
                          <div className="bg-muted p-3 rounded-md font-mono text-sm h-64 overflow-y-auto">
                            <pre>{`{
  "videoId": "dQw4w9WgXcQ",
  "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
  "detailLevel": "detailed",
  "duration": "3:32",
  "summary": "This video is the official music video for Rick Astley's 1987 hit song...",
  "keyTakeaways": [
    "Released in 1987 as Astley's debut single",
    "Became a worldwide number-one hit",
    "Later became an internet meme known as 'Rickrolling'"
  ],
  "topics": [
    {
      "title": "Song Introduction",
      "description": "Introduces the main themes of the song about commitment and devotion",
      "timestamps": "0:00 - 0:45",
      "coverage": 25
    },
    // Additional topics...
  ],
  "keyPoints": [
    {
      "content": "The song expresses a commitment to a relationship",
      "timestamp": "0:15",
      "confidence": 95
    },
    // Additional key points...
  ],
  "transcript": [
    {
      "timestamp": "0:00",
      "text": "We're no strangers to love"
    },
    // Full transcript...
  ]
}`}</pre>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="extract">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Badge className="mr-2">GET</Badge>
                        <span>/v1/transcript/{'{videoId}'}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>Extract the raw transcript from a YouTube video without analysis.</p>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Path Parameters</h4>
                          <div className="bg-muted/40 p-3 rounded-md">
                            <div>
                              <code className="text-sm font-semibold">videoId</code>
                              <span className="text-sm ml-2">string <span className="text-red-500">required</span></span>
                              <p className="text-sm text-muted-foreground">YouTube video ID</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Example Request</h4>
                          <div className="bg-muted p-3 rounded-md font-mono text-sm relative">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => handleCopy('curl -X GET https://api.transcriptlens.com/v1/transcript/dQw4w9WgXcQ \\\n-H "X-API-Key: your_api_key_here"')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <pre>{`curl -X GET https://api.transcriptlens.com/v1/transcript/dQw4w9WgXcQ \\
-H "X-API-Key: your_api_key_here"`}</pre>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="share">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Badge className="mr-2">POST</Badge>
                        <span>/v1/share</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>Share an analysis with other users.</p>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Example Request</h4>
                          <div className="bg-muted p-3 rounded-md font-mono text-sm relative">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => handleCopy('curl -X POST https://api.transcriptlens.com/v1/share \\\n-H "X-API-Key: your_api_key_here" \\\n-H "Content-Type: application/json" \\\n-d \'{\n  "analysisId": "analysis_12345",\n  "recipients": ["user@example.com"],\n  "expiresIn": 7,\n  "allowComments": true\n}\'')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <pre>{`curl -X POST https://api.transcriptlens.com/v1/share \\
-H "X-API-Key: your_api_key_here" \\
-H "Content-Type: application/json" \\
-d '{
  "analysisId": "analysis_12345",
  "recipients": ["user@example.com"],
  "expiresIn": 7,
  "allowComments": true
}'`}</pre>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>
                  Integration examples in different programming languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { id: "js", name: "JavaScript", icon: "js-icon" },
                    { id: "python", name: "Python", icon: "python-icon" },
                    { id: "node", name: "Node.js", icon: "node-icon" },
                    { id: "react", name: "React", icon: "react-icon" }
                  ].map((lang) => (
                    <Button
                      key={lang.id}
                      variant="outline"
                      className={`h-auto py-3 justify-start ${expandedExample === lang.id ? 'border-brand-400 bg-brand-50' : ''}`}
                      onClick={() => toggleExample(lang.id)}
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex justify-between w-full">
                          <span className="font-medium">{lang.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedExample === lang.id ? 'rotate-180' : ''}`} />
                        </div>
                        <span className="text-xs text-muted-foreground">Integration Example</span>
                      </div>
                    </Button>
                  ))}
                </div>
                
                {expandedExample === "js" && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">JavaScript (Browser)</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleCopy(`// JavaScript Example - Using Fetch API
async function analyzeVideo(videoId) {
  const apiKey = 'your_api_key_here';
  const url = 'https://api.transcriptlens.com/v1/analyze';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        videoId: videoId,
        detailLevel: 'standard',
        generateWordCloud: true
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to analyze video');
    }
    
    return data;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
}

// Usage
analyzeVideo('dQw4w9WgXcQ')
  .then(result => {
    console.log('Analysis result:', result);
    // Process the result...
  })
  .catch(error => {
    console.error('Analysis failed:', error);
  });`)}
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </Button>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md font-mono text-sm">
                      <pre className="whitespace-pre-wrap">{`// JavaScript Example - Using Fetch API
async function analyzeVideo(videoId) {
  const apiKey = 'your_api_key_here';
  const url = 'https://api.transcriptlens.com/v1/analyze';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        videoId: videoId,
        detailLevel: 'standard',
        generateWordCloud: true
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to analyze video');
    }
    
    return data;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
}

// Usage
analyzeVideo('dQw4w9WgXcQ')
  .then(result => {
    console.log('Analysis result:', result);
    // Process the result...
  })
  .catch(error => {
    console.error('Analysis failed:', error);
  });`}</pre>
                    </div>
                  </div>
                )}
                
                {expandedExample === "python" && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Python</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleCopy(`# Python Example - Using requests
import requests
import json

def analyze_video(video_id, api_key):
    url = 'https://api.transcriptlens.com/v1/analyze'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': api_key
    }
    payload = {
        'videoId': video_id,
        'detailLevel': 'standard',
        'generateWordCloud': True
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error analyzing video: {e}")
        return None

# Usage
api_key = 'your_api_key_here'
result = analyze_video('dQw4w9WgXcQ', api_key)

if result:
    print("Analysis completed successfully!")
    print(f"Title: {result.get('title')}")
    print(f"Summary: {result.get('summary')}")
    
    # Process key takeaways
    print("\nKey Takeaways:")
    for takeaway in result.get('keyTakeaways', []):
        print(f"- {takeaway}")
        
    # Process topics
    print("\nTopics:")
    for topic in result.get('topics', []):
        print(f"- {topic.get('title')}: {topic.get('description')}")`)}
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </Button>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md font-mono text-sm">
                      <pre className="whitespace-pre-wrap">{`# Python Example - Using requests
import requests
import json

def analyze_video(video_id, api_key):
    url = 'https://api.transcriptlens.com/v1/analyze'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': api_key
    }
    payload = {
        'videoId': video_id,
        'detailLevel': 'standard',
        'generateWordCloud': True
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error analyzing video: {e}")
        return None

# Usage
api_key = 'your_api_key_here'
result = analyze_video('dQw4w9WgXcQ', api_key)

if result:
    print("Analysis completed successfully!")
    print(f"Title: {result.get('title')}")
    print(f"Summary: {result.get('summary')}")
    
    # Process key takeaways
    print("\nKey Takeaways:")
    for takeaway in result.get('keyTakeaways', []):
        print(f"- {takeaway}")
        
    # Process topics
    print("\nTopics:")
    for topic in result.get('topics', []):
        print(f"- {topic.get('title')}: {topic.get('description')}")`}</pre>
                    </div>
                  </div>
                )}
                
                {!expandedExample && (
                  <div className="text-center py-8">
                    <FileCode className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p>Select a language to view integration examples</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
