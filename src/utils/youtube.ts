
// Extract YouTube video ID from various URL formats
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  
  // Handle youtu.be format
  if (url.includes('youtu.be')) {
    const match = url.match(/youtu\.be\/([^?&#]+)/);
    return match ? match[1] : null;
  }
  
  // Handle youtube.com/watch?v= format
  const match = url.match(/[?&]v=([^?&#]+)/);
  if (match) {
    return match[1];
  }
  
  // Handle youtube.com/embed/ format
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (embedMatch) {
    return embedMatch[1];
  }
  
  return null;
}

// Format seconds to MM:SS format
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
