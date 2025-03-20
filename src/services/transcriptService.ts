
// Central service file that re-exports functionality from other modules

// API-related exports
export {
  setOpenAIApiKey,
  getOpenAIApiKey,
} from './api/openai';

export {
  setYoutubeApiKey,
  getYoutubeApiKey,
  isPlaylist,
  isPlaylistsPage,
  extractChannelIdFromPlaylistsPage,
  extractPlaylistId,
  fetchChannelPlaylists,
  fetchPlaylistItems,
  fetchTranscript,
  getMockTranscriptForVideo,
} from './api/youtube';

// Transcript processing
export {
  processTranscript,
} from './processing/transcriptProcessor';

// Export functionality
export {
  exportResult,
  downloadExport,
} from './export/exportService';

// Re-export mock data generators for testing
export {
  getMockAnalyzedData,
} from './mockData/transcriptAnalysis';
