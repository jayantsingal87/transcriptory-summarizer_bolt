
// User preference management service
import { PreferenceKey, UserPreferences } from '@/hooks/useUserPreferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  detailLevel: 'standard',
  language: 'en',
  showRawTranscript: false,
  generateWordCloud: true,
  colorTheme: 'system',
  keyboardShortcuts: true,
  dismissedTours: [],
};

export function getUserPreferences(): UserPreferences {
  try {
    const savedPrefs = localStorage.getItem('user_preferences');
    if (savedPrefs) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(savedPrefs) };
    }
  } catch (error) {
    console.error('Error loading user preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

export function saveUserPreferences(preferences: Partial<UserPreferences>): UserPreferences {
  try {
    const currentPrefs = getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    localStorage.setItem('user_preferences', JSON.stringify(updatedPrefs));
    return updatedPrefs;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return getUserPreferences();
  }
}

export function getSinglePreference<K extends PreferenceKey>(key: K): UserPreferences[K] {
  return getUserPreferences()[key];
}

export function setSinglePreference<K extends PreferenceKey>(key: K, value: UserPreferences[K]): void {
  const update = { [key]: value } as Partial<UserPreferences>;
  saveUserPreferences(update);
}
