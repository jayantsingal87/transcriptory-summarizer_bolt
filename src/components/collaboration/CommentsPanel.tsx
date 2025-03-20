
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MessageSquarePlus, CornerUpLeft, Trash2, Edit2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImageUrl?: string;
  content: string;
  timestamp: Date;
  replyTo?: string;
  highlightId?: string;
  edited?: boolean;
}

interface CommentsPanelProps {
  videoId: string;
  sectionId?: string;
  className?: string;
}

export function CommentsPanel({ videoId, sectionId, className = "" }: CommentsPanelProps) {
  const { userId, isSignedIn } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading comments
  useEffect(() => {
    // In a real app, this would fetch from API
    const mockComments: Comment[] = [
      {
        id: "comment1",
        userId: "user1",
        userName: "Sarah Johnson",
        userImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        content: "This section about quantum computing was incredibly insightful. I've been studying this subject for years and the analysis here is spot on.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        highlightId: "highlight1"
      },
      {
        id: "comment2",
        userId: "user2",
        userName: "David Chen",
        userImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        content: "I'd also add that the implications for cryptography here are significant. The speaker mentioned it briefly but didn't go into detail.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        replyTo: "comment1"
      }
    ];
    
    setComments(mockComments);
  }, [videoId, sectionId]);

  const handleAddComment = () => {
    if (!isSignedIn || !userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to leave comments",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    
    // Create a new comment
    const comment: Comment = {
      id: `comment${Date.now()}`,
      userId: userId,
      userName: "You", // In a real app, get from user profile
      content: newComment,
      timestamp: new Date(),
      replyTo: replyTo?.id,
      highlightId: sectionId
    };
    
    // Simulate API delay
    setTimeout(() => {
      // Add comment to list
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      setReplyTo(null);
      setIsLoading(false);
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    }, 500);
  };

  const handleEditComment = (commentId: string) => {
    if (!isSignedIn || !userId) return;
    
    const comment = comments.find(c => c.id === commentId);
    if (!comment || comment.userId !== userId) return;
    
    setEditingComment(comment);
    setNewComment(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editingComment || !newComment.trim()) return;
    
    setIsLoading(true);
    
    // Update the comment
    setTimeout(() => {
      setComments(prev => 
        prev.map(c => 
          c.id === editingComment.id 
            ? { ...c, content: newComment, edited: true } 
            : c
        )
      );
      
      setNewComment("");
      setEditingComment(null);
      setIsLoading(false);
      
      toast({
        title: "Comment updated",
        description: "Your edit has been saved successfully",
      });
    }, 500);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!isSignedIn || !userId) return;
    
    const comment = comments.find(c => c.id === commentId);
    if (!comment || comment.userId !== userId) return;
    
    setIsLoading(true);
    
    // Delete the comment
    setTimeout(() => {
      setComments(prev => prev.filter(c => c.id !== commentId));
      setIsLoading(false);
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    }, 500);
  };

  const getCommentTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={`border rounded-md flex flex-col h-full ${className}`}>
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-medium">Comments ({comments.length})</h3>
        <Badge variant="outline" className="text-xs">
          {sectionId ? "Section Comments" : "All Comments"}
        </Badge>
      </div>

      <ScrollArea className="flex-1 p-3">
        <AnimatePresence>
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No comments yet</p>
              <p className="text-sm">Be the first to add a comment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded-lg ${
                    comment.replyTo ? "ml-6 border-l-2 pl-4" : "bg-muted/30"
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.userImageUrl} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-sm">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {getCommentTime(comment.timestamp)}
                          </span>
                          {comment.edited && (
                            <span className="text-xs text-muted-foreground ml-1">(edited)</span>
                          )}
                        </div>
                        
                        {comment.userId === userId && (
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => handleEditComment(comment.id)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive" 
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm">{comment.content}</p>
                      
                      {isSignedIn && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => setReplyTo(comment)}
                        >
                          <CornerUpLeft className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
      
      <div className="p-3 border-t">
        {replyTo && (
          <div className="mb-2 text-xs bg-muted/30 p-2 rounded-md flex justify-between">
            <div>
              <span className="text-muted-foreground">Replying to </span>
              <span className="font-medium">{replyTo.userName}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 px-1" 
              onClick={() => setReplyTo(null)}
            >
              Cancel
            </Button>
          </div>
        )}
        
        {editingComment && (
          <div className="mb-2 text-xs bg-muted/30 p-2 rounded-md flex justify-between">
            <div>
              <span className="text-muted-foreground">Editing comment</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 px-1" 
              onClick={() => {
                setEditingComment(null);
                setNewComment("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
        
        <div className="flex gap-2">
          <Input 
            placeholder={
              editingComment 
                ? "Edit your comment..." 
                : replyTo 
                ? `Reply to ${replyTo.userName}...` 
                : "Add a comment..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isSignedIn || isLoading}
            className="flex-1"
          />
          
          <Button 
            size="sm" 
            disabled={!newComment.trim() || isLoading || !isSignedIn}
            onClick={editingComment ? handleSaveEdit : handleAddComment}
          >
            {isLoading ? (
              "..."
            ) : editingComment ? (
              "Save"
            ) : (
              <>
                <MessageSquarePlus className="h-4 w-4 mr-1" />
                {replyTo ? "Reply" : "Comment"}
              </>
            )}
          </Button>
        </div>
        
        {!isSignedIn && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Please sign in to leave comments
          </p>
        )}
      </div>
    </div>
  );
}
