
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Mail, Link, Share2, Check, AlertCircle, Code } from "lucide-react";
import { TranscriptResult } from "@/types/transcript";
import { useToast } from "@/components/ui/use-toast";
import { shareAnalysis, generateEmbedCode, SharingMethod } from "@/services/collaboration/sharingService";

interface SharingDialogProps {
  result: TranscriptResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShareResult {
  success: boolean;
  shareId?: string;
  shareUrl?: string;
  error?: string;
}

export function SharingDialog({ result, open, onOpenChange }: SharingDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SharingMethod>("email");
  const [recipientEmails, setRecipientEmails] = useState("");
  const [message, setMessage] = useState("");
  const [expireHours, setExpireHours] = useState(24);
  const [allowComments, setAllowComments] = useState(true);
  const [allowEdits, setAllowEdits] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const options = {
        recipientEmails: activeTab === "email" ? recipientEmails.split(',').map(email => email.trim()) : undefined,
        message: message,
        expiresIn: expireHours,
        allowComments: allowComments,
        allowEditing: allowEdits
      };
      
      const shareResult: ShareResult = await shareAnalysis(result, activeTab, options);
      
      if (shareResult.success && shareResult.shareUrl) {
        setShareUrl(shareResult.shareUrl);
        setEmbedCode(generateEmbedCode(shareResult.shareId!));
        
        if (activeTab === "email") {
          toast({
            title: "Shared successfully",
            description: `Analysis has been shared with ${recipientEmails.split(',').length} recipient(s)`,
          });
          
          // Close dialog after email sharing
          setTimeout(() => onOpenChange(false), 1500);
        }
      } else {
        setError(shareResult.error || "Failed to share analysis");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "You can now paste this anywhere",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Analysis</DialogTitle>
          <DialogDescription>
            Share your analysis with others through email, link, or embed code.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SharingMethod)} className="w-full mt-4">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span>Link</span>
            </TabsTrigger>
            <TabsTrigger value="embed" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Embed</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Recipient Emails</Label>
              <Input 
                id="emails" 
                placeholder="email@example.com, another@example.com" 
                value={recipientEmails}
                onChange={(e) => setRecipientEmails(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate multiple emails with commas</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea 
                id="message" 
                placeholder="Add a personal message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4">
            {shareUrl ? (
              <div className="space-y-2">
                <Label htmlFor="shareLink">Shareable Link</Label>
                <div className="flex gap-2">
                  <Input 
                    id="shareLink" 
                    value={shareUrl} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleCopy(shareUrl)}
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground">Generate a link to share this analysis</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="embed" className="space-y-4">
            {embedCode ? (
              <div className="space-y-2">
                <Label htmlFor="embedCode">Embed Code</Label>
                <div className="flex gap-2">
                  <Textarea 
                    id="embedCode" 
                    value={embedCode} 
                    readOnly 
                    className="flex-1 font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleCopy(embedCode)}
                    className="self-start"
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Paste this code into your website to embed the analysis</p>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground">Generate code to embed this analysis</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4 py-4 border-t">
          <div className="space-y-2">
            <Label>Sharing Options</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="comments-toggle" className="text-sm">Allow Comments</Label>
                <p className="text-xs text-muted-foreground">Let viewers add comments to this analysis</p>
              </div>
              <Switch 
                id="comments-toggle" 
                checked={allowComments}
                onCheckedChange={setAllowComments}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="edits-toggle" className="text-sm">Allow Editing</Label>
                <p className="text-xs text-muted-foreground">Let viewers make edits to this analysis</p>
              </div>
              <Switch 
                id="edits-toggle" 
                checked={allowEdits}
                onCheckedChange={setAllowEdits}
              />
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <Label htmlFor="expire-slider" className="text-sm">Expires After</Label>
                <span className="text-sm font-medium">
                  {expireHours === 0 ? "Never" : expireHours === 1 ? "1 hour" : `${expireHours} hours`}
                </span>
              </div>
              <Slider 
                id="expire-slider"
                min={0}
                max={72}
                step={1}
                value={[expireHours]}
                onValueChange={(values) => setExpireHours(values[0])}
              />
              <p className="text-xs text-muted-foreground">Set to 0 for no expiration</p>
            </div>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={isLoading || (activeTab === "email" && !recipientEmails.trim())}
            className={activeTab !== "email" && shareUrl ? "hidden" : ""}
          >
            {isLoading ? "Sharing..." : activeTab === "email" ? "Send" : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
