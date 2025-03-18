
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 text-center md:text-left">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            © 2023 TranscriptLens. All rights reserved.
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <a href="#" className="text-sm hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="text-sm hover:underline">
            Terms of Service
          </a>
          <a href="#" className="text-sm hover:underline">
            Contact Us
          </a>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500" />
          <span>by Lovable</span>
        </div>
      </div>
    </footer>
  );
}
