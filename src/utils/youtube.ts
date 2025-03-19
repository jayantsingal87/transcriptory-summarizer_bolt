
// Function to extract YouTube video ID from URL
export function extractVideoId(url: string): string | null {
  // Regular expression to match YouTube video URLs
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

// Check if URL is for a playlist
export function isPlaylistUrl(url: string): boolean {
  return url.includes('list=') || url.includes('playlist?');
}

// Check if it's a valid YouTube URL (video or playlist)
export function isValidYoutubeUrl(url: string): boolean {
  // Check if it's a video URL
  const isVideo = !!extractVideoId(url);
  
  // Check if it's a playlist URL
  const isPlaylist = isPlaylistUrl(url);
  
  return isVideo || isPlaylist;
}

// Format time for display (converts seconds to MM:SS format)
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
