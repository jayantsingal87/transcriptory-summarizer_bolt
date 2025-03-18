
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Copy, Download, FileText, Mail, Share2, List, ListChecks, 
  BarChart3, Clock, ArrowDown, Book 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { TranscriptResult } from "@/types/transcript";

interface ResultsDisplayProps {
  result: TranscriptResult | null;
  videoId: string;
}

export function ResultsDisplay({ result, videoId }: ResultsDisplayProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");

  if (!result) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `Export as ${format}`,
      description: `Your content would be exported as ${format}`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link generated",
      description: "A shareable link has been copied to your clipboard",
    });
  };

  const handleEmail = () => {
    toast({
      title: "Email option",
      description: "You would be able to email these results",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg border animate-fade-in">
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">{result.title}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Detail Level: {result.detailLevel}</span>
              <span>•</span>
              <span>{result.duration}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}>
              <FileText className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("Markdown")}>
              <Download className="h-4 w-4 mr-1" /> Markdown
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleEmail}>
              <Mail className="h-4 w-4 mr-1" /> Email
            </Button>
          </div>
        </div>

        {videoId && (
          <div className="mb-6">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}`} 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        )}

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="summary">
              <Book className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="topics">
              <List className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Topics
            </TabsTrigger>
            <TabsTrigger value="key-points">
              <ListChecks className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Key Points
            </TabsTrigger>
            <TabsTrigger value="transcript">
              <Clock className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Transcript
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Summary</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(result.summary)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{result.summary}</p>
                
                <Separator className="my-6" />
                
                <div>
                  <h4 className="font-semibold mb-3">Key Takeaways</h4>
                  <ul className="space-y-2">
                    {result.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex gap-2">
                        <ArrowDown className="h-5 w-5 text-brand-500 shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="topics" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Topics</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(result.topics.map(t => `${t.title}\n${t.description}`).join('\n\n'))}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.topics.map((topic, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="text-lg font-semibold text-brand-600">{topic.title}</h4>
                      <p>{topic.description}</p>
                      <div className="text-sm text-muted-foreground">
                        {topic.timestamps && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {topic.timestamps}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h4 className="font-semibold mb-3">Topic Distribution</h4>
                  {result.topics.map((topic, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{topic.title}</span>
                        <span>{topic.coverage}%</span>
                      </div>
                      <Progress value={topic.coverage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="key-points" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Key Points</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(result.keyPoints.map(p => p.content).join('\n\n'))}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.keyPoints.map((point, index) => (
                    <div key={index} className="pb-4 border-b last:border-b-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="mb-1">{point.content}</p>
                          {point.timestamp && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{point.timestamp}</span>
                            </div>
                          )}
                        </div>
                        {point.confidence && (
                          <div className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {point.confidence}% confidence
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transcript" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Transcript</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(result.transcript.map(t => `[${t.timestamp}] ${t.text}`).join('\n'))}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {result.transcript.map((segment, index) => (
                    <div key={index} className="flex">
                      <div className="text-sm font-medium text-muted-foreground w-16 shrink-0">
                        {segment.timestamp}
                      </div>
                      <div>{segment.text}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
