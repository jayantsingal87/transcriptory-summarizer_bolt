
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Book, Code, Users, Terminal } from "lucide-react";

export function AppReadme() {
  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl">TranscriptLens</CardTitle>
              <CardDescription className="text-lg">
                AI-powered YouTube transcript analysis and summarization tool
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">React</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">TypeScript</Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">TailwindCSS</Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">OpenAI</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Book className="h-5 w-5 text-brand-600" />
              Overview
            </h2>
            <p>
              TranscriptLens is a web application that uses AI to analyze and summarize YouTube video transcripts.
              It extracts key insights, topics, and important points from videos, saving users time and enabling
              more efficient content consumption.
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Code className="h-5 w-5 text-brand-600" />
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 p-4 rounded-md">
                <h3 className="font-medium mb-2">Transcript Analysis</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Extract and process YouTube video transcripts</li>
                  <li>Generate concise summaries of video content</li>
                  <li>Identify key topics and their timestamps</li>
                  <li>Extract actionable takeaways and insights</li>
                </ul>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md">
                <h3 className="font-medium mb-2">Collaboration Features</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Share analysis results with other users</li>
                  <li>Comment on specific parts of the analysis</li>
                  <li>Highlight important sections with color coding</li>
                  <li>Track changes with version history</li>
                </ul>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md">
                <h3 className="font-medium mb-2">Export & Integration</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Export results in multiple formats (PDF, Markdown, etc.)</li>
                  <li>Embed analysis results in other websites</li>
                  <li>API access for programmatic integration</li>
                  <li>Batch processing for playlists</li>
                </ul>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md">
                <h3 className="font-medium mb-2">Advanced Options</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Adjustable detail levels for analysis</li>
                  <li>Translate transcript and analysis to other languages</li>
                  <li>Generate word clouds and visualizations</li>
                  <li>Customizable processing options</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Terminal className="h-5 w-5 text-brand-600" />
              Technical Stack
            </h2>
            <div className="space-y-2">
              <h3 className="font-medium">Frontend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge className="justify-start">React</Badge>
                <Badge className="justify-start">TypeScript</Badge>
                <Badge className="justify-start">TailwindCSS</Badge>
                <Badge className="justify-start">Shadcn UI</Badge>
                <Badge className="justify-start">React Router</Badge>
                <Badge className="justify-start">TanStack Query</Badge>
                <Badge className="justify-start">Framer Motion</Badge>
                <Badge className="justify-start">Recharts</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Backend & APIs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge className="justify-start">YouTube Data API</Badge>
                <Badge className="justify-start">OpenAI API</Badge>
                <Badge className="justify-start">Clerk Authentication</Badge>
                <Badge className="justify-start">D3.js (Visualizations)</Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-600" />
              Getting Started
            </h2>
            <div className="bg-muted p-4 rounded-md font-mono text-sm">
              <pre>{`# Clone the repository
git clone https://github.com/yourusername/transcriptlens.git

# Navigate to project directory
cd transcriptlens

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev`}</pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Note: You'll need to obtain API keys for OpenAI and YouTube Data API to use all features.
            </p>
          </div>
          
          <Separator />
          
          <div className="flex flex-wrap gap-3">
            <Button className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              View on GitHub
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
