
import { Heart, Github, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-10 md:py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-brand-500 to-accent1-500 rounded-lg p-1.5 text-white">
                <Heart className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent1-600">
                TranscriptLens
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transform YouTube videos into structured knowledge with AI-powered transcript analysis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Examples</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} TranscriptLens. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by Lovable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
