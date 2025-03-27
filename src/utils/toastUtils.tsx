
import React from "react";
import { toast } from "@/hooks/use-toast";
import { Keyboard } from "lucide-react";

export const showShortcutsToast = () => {
  toast({
    title: "Keyboard Shortcuts",
    description: (
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold">?</span>
          <span className="ml-2 text-gray-600">Show shortcuts</span>
        </div>
        <div>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold">H</span>
          <span className="ml-2 text-gray-600">Go to home</span>
        </div>
        <div>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold">S</span>
          <span className="ml-2 text-gray-600">Search</span>
        </div>
        <div>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold">Esc</span>
          <span className="ml-2 text-gray-600">Close dialogs</span>
        </div>
      </div>
    ),
    duration: 5000,
  });
};
