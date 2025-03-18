
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-brand-600" />
          <span className="text-xl font-bold">TranscriptLens</span>
        </div>
        <nav className="flex gap-4">
          <Button variant="ghost">How It Works</Button>
          <Button variant="ghost">Pricing</Button>
          <Button variant="ghost">Examples</Button>
          <Button className="btn-gradient">Sign In</Button>
        </nav>
      </div>
    </header>
  );
}
