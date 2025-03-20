
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

// Extract playlist ID from URL
export function extractPlaylistId(url: string): string | null {
  const regex = /[&?]list=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Check if URL is for a playlist
export function isPlaylistUrl(url: string): boolean {
  return url.includes('list=') || url.includes('playlist?');
}

// Check if URL is for a playlists page (channel playlists tab)
export function isPlaylistsPageUrl(url: string): boolean {
  return url.includes('/playlists') || url.includes('tab=playlists');
}

// Check if it's a valid YouTube URL (video, playlist, or playlists page)
export function isValidYoutubeUrl(url: string): boolean {
  // Check if it's a video URL
  const isVideo = !!extractVideoId(url);
  
  // Check if it's a playlist URL
  const isPlaylist = isPlaylistUrl(url);
  
  // Check if it's a playlists page URL
  const isPlaylistsPage = isPlaylistsPageUrl(url);
  
  return isVideo || isPlaylist || isPlaylistsPage;
}

// Format time for display (converts seconds to MM:SS format)
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Generate a unique ID for each video to ensure different examples are used for testing
export function getUniqueIdForVideo(videoId: string): string {
  // Use last 3 characters of video ID to create a more unique example
  const uniqueChars = videoId.slice(-3);
  const charSum = uniqueChars.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (charSum % 4).toString(); // Return 0, 1, 2, or 3 to select different examples
}

// Get video details as fallback when API fails
export function getVideoTitleFallback(videoId: string): string {
  if (videoId === "dQw4w9WgXcQ") {
    return "Rick Astley - Never Gonna Give You Up";
  } else if (videoId === "hLS3-RiokIw") {
    return "AI Explained: Current Capabilities and Future Potential";
  } else if (videoId === "OJ8isyS9dGQ") {
    return "The Power of Human Connection | TED Talk";
  } else {
    return "Understanding AI and Machine Learning";
  }
}
