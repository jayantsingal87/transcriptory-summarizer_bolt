
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getSinglePreference } from '@/services/preferences/userPreferences';

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

  useEffect(() => {
    const shortcutsEnabled = getSinglePreference('keyboardShortcuts');
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
      window.addEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

export function showShortcutsToast() {
  const { toast } = useToast();
  
  toast({
    title: "Keyboard Shortcuts",
    description: (
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="text-sm">
          <strong>s</strong>: Start new analysis
        </div>
        <div className="text-sm">
          <strong>e</strong>: Export results
        </div>
        <div className="text-sm">
          <strong>c</strong>: Copy summary
        </div>
        <div className="text-sm">
          <strong>h</strong>: Toggle highlight mode
        </div>
        <div className="text-sm">
          <strong>?</strong>: Show all shortcuts
        </div>
        <div className="text-sm">
          <strong>1-5</strong>: Switch tabs
        </div>
      </div>
    ),
  });
}
