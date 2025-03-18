
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Copy, Download, FileText, Mail, Share2, List, ListChecks, 
  BarChart3, Clock, ArrowDown, Book, FileCode, FileSpreadsheet, 
  FileText as FileTextIcon, CheckSquare, Globe, FileTerminal
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ExportOptions, TranscriptResult } from "@/types/transcript";
import { WordCloud } from "./WordCloud";

interface ResultsDisplayProps {
  result: TranscriptResult | null;
  videoId: string;
  onExport: (options: ExportOptions) => void;
  isCostEstimate?: boolean;
}

export function ResultsDisplay({ result, videoId, onExport, isCostEstimate = false }: ResultsDisplayProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'markdown' | 'word' | 'text'>('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeOriginalTranscript: true,
    includeTopics: true,
    includeKeyPoints: true,
    includeSummary: true
  });

  if (!result) return null;

  // Determine if we should show the raw transcript tab
  const showRawTranscriptTab = result.rawTranscript && result.rawTranscript.length > 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard",
    });
  };

  const handleExport = () => {
    const options: ExportOptions = {
      format: exportFormat,
      ...exportOptions
    };
    
    onExport(options);
    setExportDialogOpen(false);
  };

  const handleShare = () => {
    // In a real app, this would generate a shareable link
    const shareableLink = `https://transcriptlens.com/share/${videoId}?tab=${activeTab}`;
    navigator.clipboard.writeText(shareableLink);
    
    toast({
      title: "Share link generated",
      description: "A shareable link has been copied to your clipboard",
    });
  };

  const handleEmail = () => {
    // In a real app, this would open an email dialog or form
    const subject = encodeURIComponent(`TranscriptLens: ${result.title}`);
    const body = encodeURIComponent(`Check out this transcript: ${result.title}\n\nSummary: ${result.summary}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: "Email option",
      description: "Your default email client has been opened",
    });
  };

  // Render cost estimate if that's what we have
  if (isCostEstimate && result.processingCost) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Processing Cost Estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Detail Level:</span>
                <span className="font-medium">{result.detailLevel}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tokens:</span>
                <span className="font-medium">{result.processingCost.tokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Cost:</span>
                <span className="font-medium">{result.processingCost.estimatedCost}</span>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm">This is an estimate only. Actual processing costs may vary based on the length and complexity of the video content.</p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={() => window.location.reload()} className="btn-gradient">
                Process Another Video
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {result.translatedFrom && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Translated from {result.translatedFrom}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Options</DialogTitle>
                  <DialogDescription>
                    Choose your export format and content options.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={exportFormat === "pdf" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportFormat("pdf")}
                        className="flex gap-1"
                      >
                        <FileText className="h-4 w-4" /> PDF
                      </Button>
                      <Button
                        type="button"
                        variant={exportFormat === "markdown" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportFormat("markdown")}
                        className="flex gap-1"
                      >
                        <FileCode className="h-4 w-4" /> Markdown
                      </Button>
                      <Button
                        type="button"
                        variant={exportFormat === "word" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportFormat("word")}
                        className="flex gap-1"
                      >
                        <FileTextIcon className="h-4 w-4" /> Word
                      </Button>
                      <Button
                        type="button"
                        variant={exportFormat === "text" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportFormat("text")}
                        className="flex gap-1"
                      >
                        <FileSpreadsheet className="h-4 w-4" /> Text
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Content to Include</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeSummary" 
                          checked={exportOptions.includeSummary}
                          onCheckedChange={(checked) => 
                            setExportOptions({...exportOptions, includeSummary: !!checked})
                          }
                        />
                        <Label htmlFor="includeSummary">Summary & Key Takeaways</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeTopics" 
                          checked={exportOptions.includeTopics}
                          onCheckedChange={(checked) => 
                            setExportOptions({...exportOptions, includeTopics: !!checked})
                          }
                        />
                        <Label htmlFor="includeTopics">Topics</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeKeyPoints" 
                          checked={exportOptions.includeKeyPoints}
                          onCheckedChange={(checked) => 
                            setExportOptions({...exportOptions, includeKeyPoints: !!checked})
                          }
                        />
                        <Label htmlFor="includeKeyPoints">Key Points</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeTranscript" 
                          checked={exportOptions.includeOriginalTranscript}
                          onCheckedChange={(checked) => 
                            setExportOptions({...exportOptions, includeOriginalTranscript: !!checked})
                          }
                        />
                        <Label htmlFor="includeTranscript">Full Transcript</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleExport}>
                    Export Now
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
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

        {result.processingCost && (
          <div className="mb-4 p-3 border rounded-md bg-muted/40">
            <div className="flex items-center justify-between">
              <span className="text-sm">Processing Cost: {result.processingCost.estimatedCost}</span>
              <span className="text-xs text-muted-foreground">{result.processingCost.tokens.toLocaleString()} tokens</span>
            </div>
            {result.confidenceScore && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm">Confidence Score:</span>
                <Progress value={result.confidenceScore} className="h-2 flex-1" />
                <span className="text-xs">{result.confidenceScore}%</span>
              </div>
            )}
          </div>
        )}

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid ${showRawTranscriptTab ? 'grid-cols-6' : 'grid-cols-5'} mb-6`}>
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
            <TabsTrigger value="visualizations">
              <BarChart3 className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Visuals
            </TabsTrigger>
            <TabsTrigger value="transcript">
              <Clock className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Transcript
            </TabsTrigger>
            {showRawTranscriptTab && (
              <TabsTrigger value="raw-transcript">
                <FileTerminal className="h-4 w-4 mr-2 hidden sm:inline-block" />
                Raw
              </TabsTrigger>
            )}
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
                        <div className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-brand-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="mb-1">{point.content}</p>
                            {point.timestamp && (
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{point.timestamp}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {point.confidence && (
                          <div className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
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
          
          <TabsContent value="visualizations" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle>Visualizations</CardTitle>
              </CardHeader>
              <CardContent>
                {result.wordCloudData ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Word Cloud</h4>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <WordCloud data={result.wordCloudData} />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Topic Distribution</h4>
                      <div className="space-y-3">
                        {result.topics.map((topic, index) => (
                          <div key={index} className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{topic.title}</span>
                              <span>{topic.coverage}%</span>
                            </div>
                            <Progress value={topic.coverage} className="h-3" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <p>Word cloud visualization was not generated for this analysis.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enable the "Generate Word Cloud" option when processing to see visualizations.
                    </p>
                  </div>
                )}
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
          
          {showRawTranscriptTab && (
            <TabsContent value="raw-transcript" className="animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>Raw Transcript</span>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(result.rawTranscript?.map(t => `[${t.timestamp}] ${t.text}`).join('\n') || '')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.rawTranscript && result.rawTranscript.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {result.rawTranscript.map((segment, index) => (
                        <div key={index} className="flex">
                          <div className="text-sm font-medium text-muted-foreground w-16 shrink-0">
                            {segment.timestamp}
                          </div>
                          <div>{segment.text}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p>Raw transcript data is not available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
