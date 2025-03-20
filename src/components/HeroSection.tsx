
import { ArrowRight, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <div className="py-16 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-6"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-2">
              <Youtube className="h-4 w-4 mr-2" />
              <span>AI-Powered Analysis</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block hero-text-gradient">Transform Videos</span>
              <span className="block">into Structured Knowledge</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              Extract meaningful insights, topics, and summaries from any YouTube video with our advanced AI-powered transcript analyzer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="btn-gradient text-base">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button size="lg" variant="outline" className="text-base">
                See Examples
              </Button>
            </div>
            
            <div className="pt-6 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center md:items-start">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">100%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-accent1-500">12+</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent1-500 to-accent1-400">Fast</div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-brand-500/10 to-accent1-500/10 backdrop-blur-sm border border-white/10">
              <div className="aspect-video w-full bg-gradient-to-br from-brand-500/5 to-accent1-500/5 p-5">
                <div className="bg-black/80 rounded-lg h-full w-full overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-accent1-600/20 opacity-30"></div>
                  <div className="text-center p-6 z-10">
                    <div className="inline-flex mb-4 rounded-full bg-white/10 p-6">
                      <Youtube className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Video Transcript Analysis</h3>
                    <p className="text-white/80 text-sm">AI-powered insights from any YouTube video</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-24"></div>
            </div>
            
            {/* Floating badges */}
            <motion.div 
              className="absolute -top-5 -right-5 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Multi-language Support</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-5 -left-5 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium">AI-Powered Insights</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
