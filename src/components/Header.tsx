
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthStatus } from "@/components/auth/AuthWrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="h-6 w-6 text-brand-600" />
          </motion.div>
          <motion.span 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent1-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            TranscriptLens
          </motion.span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <nav className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button variant="ghost" className="animated-underline">How It Works</Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Button variant="ghost" className="animated-underline">Pricing</Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button variant="ghost" className="animated-underline">Examples</Button>
            </motion.div>
          </nav>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <AuthStatus />
          </motion.div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t"
          >
            <div className="container py-4 space-y-4">
              <nav className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start">How It Works</Button>
                <Button variant="ghost" className="justify-start">Pricing</Button>
                <Button variant="ghost" className="justify-start">Examples</Button>
              </nav>
              
              <div className="pt-2 border-t">
                <AuthStatus />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
