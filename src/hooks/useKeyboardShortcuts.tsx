
import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUserPreferences } from './useUserPreferences';

type ShortcutAction = () => void;

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: ShortcutAction;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const { toast } = useToast();
  const { getPreference } = useUserPreferences();

  useEffect(() => {
    const shortcutsEnabled = getPreference('keyboardShortcuts');
    if (!shortcutsEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, getPreference]);
}
