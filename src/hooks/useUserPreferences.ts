
import { useState, useEffect } from 'react';
import { 
  getUserPreferences, 
  saveUserPreferences, 
  getSinglePreference, 
  setSinglePreference 
} from '@/services/preferences/userPreferences';

export type PreferenceKey = 'detailLevel' | 'language' | 'showRawTranscript' | 'generateWordCloud' | 'colorTheme' | 'keyboardShortcuts' | 'dismissedTours';

export type UserPreferences = {
  detailLevel: 'brief' | 'standard' | 'detailed';
  language: string;
  showRawTranscript: boolean;
  generateWordCloud: boolean;
  colorTheme: 'light' | 'dark' | 'system';
  keyboardShortcuts: boolean;
  dismissedTours: string[];
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(getUserPreferences());

  useEffect(() => {
    // Load preferences from localStorage
    setPreferences(getUserPreferences());
  }, []);

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = saveUserPreferences(newPrefs);
    setPreferences(updated);
    return updated;
  };

  const getPreference = <K extends PreferenceKey>(key: K): UserPreferences[K] => {
    return preferences[key];
  };

  const setPreference = <K extends PreferenceKey>(key: K, value: UserPreferences[K]) => {
    setSinglePreference(key, value);
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return {
    preferences,
    updatePreferences,
    getPreference,
    setPreference
  };
}
