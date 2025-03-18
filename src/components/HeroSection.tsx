
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="py-12 md:py-24 text-center">
      <div className="container px-4 md:px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 hero-text-gradient">
          Transform YouTube Videos into Structured Knowledge
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Extract meaningful insights, topics, and summaries from any YouTube video with our AI-powered transcript analyzer.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Fast Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Multi-language Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span>AI-Powered Insights</span>
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 justify-center">
              <span>Input URL</span>
              <ArrowRight className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span>AI Processing</span>
              <ArrowRight className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span>Structured Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
