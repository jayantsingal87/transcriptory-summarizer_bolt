
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, RotateCcw, History, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { TranscriptResult } from "@/types/transcript";
import { useToast } from "@/components/ui/use-toast";

interface Version {
  id: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  changes: {
    type: 'added' | 'modified' | 'removed';
    section: string;
    detail: string;
  }[];
  isCurrent: boolean;
}

interface VersionHistoryProps {
  videoId: string;
  result: TranscriptResult;
}

export function VersionHistory({ videoId, result }: VersionHistoryProps) {
  const { toast } = useToast();
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  useEffect(() => {
    // This would fetch from API in a real app
    const mockVersions: Version[] = [
      {
        id: "v3",
        timestamp: new Date(),
        user: {
          id: "user1",
          name: "Current User",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Current"
        },
        changes: [
          { type: 'modified', section: 'Summary', detail: 'Updated the introduction paragraph' },
          { type: 'added', section: 'Key Points', detail: 'Added point about quantum computing applications' }
        ],
        isCurrent: true
      },
      {
        id: "v2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        user: {
          id: "user2",
          name: "Alex Wong",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
        },
        changes: [
          { type: 'modified', section: 'Topics', detail: 'Reorganized topic sections' },
          { type: 'removed', section: 'Transcript', detail: 'Removed duplicate paragraphs' }
        ],
        isCurrent: false
      },
      {
        id: "v1",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        user: {
          id: "user3",
          name: "Maria Garcia",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
        },
        changes: [
          { type: 'added', section: 'Initial Analysis', detail: 'Created the initial analysis from transcript' }
        ],
        isCurrent: false
      }
    ];
    
    setVersions(mockVersions);
  }, [videoId]);

  const handleRestoreVersion = () => {
    if (!selectedVersion) return;
    
    setIsRestoring(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Version restored",
        description: `Restored to version from ${format(selectedVersion.timestamp, 'MMM d, yyyy h:mm a')}`,
      });
      
      // In a real app, this would update the current analysis data
      
      setIsRestoring(false);
      setSelectedVersion(null);
    }, 1000);
  };

  const getChangeIcon = (type: 'added' | 'modified' | 'removed') => {
    switch (type) {
      case 'added':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Added</Badge>;
      case 'modified':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Modified</Badge>;
      case 'removed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Removed</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy h:mm a');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span>Version History</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            View and restore previous versions of this analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <div className="md:col-span-1 border rounded-md">
            <div className="p-3 border-b font-medium text-sm">Versions</div>
            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-2">
                {versions.map((version) => (
                  <button
                    key={version.id}
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      selectedVersion?.id === version.id 
                        ? 'bg-brand-50 border-brand-200 border' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedVersion(version)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 items-center">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={version.user.avatar} />
                          <AvatarFallback>{version.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{version.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatDate(version.timestamp)}
                          </p>
                        </div>
                      </div>
                      {version.isCurrent && (
                        <Badge variant="outline" className="text-xs">Current</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="md:col-span-2 border rounded-md">
            <div className="p-3 border-b font-medium text-sm">Version Details</div>
            <div className="p-4">
              {selectedVersion ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">
                      {selectedVersion.isCurrent ? 'Current Version' : 'Previous Version'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Last updated {formatDate(selectedVersion.timestamp)} by {selectedVersion.user.name}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Changes</h4>
                    <div className="space-y-2">
                      {selectedVersion.changes.map((change, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          {getChangeIcon(change.type)}
                          <div className="text-sm">
                            <p className="font-medium">{change.section}</p>
                            <p className="text-muted-foreground">{change.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {!selectedVersion.isCurrent && (
                    <div className="pt-4">
                      <Button
                        variant="default"
                        onClick={handleRestoreVersion}
                        disabled={isRestoring}
                        className="w-full"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {isRestoring ? "Restoring..." : "Restore This Version"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Restoring will create a new version with this content
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Select a version to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
