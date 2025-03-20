
import { BookOpen, Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthStatus } from "@/components/auth/AuthWrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-brand-500 to-accent1-500 rounded-lg p-1.5 text-white"
          >
            <BookOpen className="h-5 w-5" />
          </motion.div>
          
          <motion.span 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent1-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            TranscriptLens
          </motion.span>
        </motion.div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <nav className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Link to="#features">
                <Button variant="ghost" className="animated-underline font-medium">Features</Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Link to="#pricing">
                <Button variant="ghost" className="animated-underline font-medium">Pricing</Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Link to="#examples">
                <Button variant="ghost" className="animated-underline font-medium">Examples</Button>
              </Link>
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
                <Link to="#features" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="justify-start w-full">Features</Button>
                </Link>
                <Link to="#pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="justify-start w-full">Pricing</Button>
                </Link>
                <Link to="#examples" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="justify-start w-full">Examples</Button>
                </Link>
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
