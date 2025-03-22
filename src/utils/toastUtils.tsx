
import React from 'react';
import { toast } from '@/components/ui/use-toast';

export function showShortcutsToast() {
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
