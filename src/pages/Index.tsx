
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { AuthWrapper, AuthStatus } from "@/components/auth/AuthWrapper";
import { MainContent } from "@/components/content/MainContent";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Show scroll button after scrolling past a certain point
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToContent = () => {
    const contentElement = document.getElementById("main-content");
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <AuthWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50"
      >
        <Header />
        <main className="flex-1">
          <HeroSection />
          
          {/* Scroll down button */}
          <motion.div 
            className="flex justify-center -mt-10 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 bg-white shadow-md border-brand-100 hover:bg-brand-50 transition-all"
              onClick={scrollToContent}
            >
              <ArrowDown className="h-5 w-5 text-brand-600" />
            </Button>
          </motion.div>
          
          {/* Features section */}
          <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="features">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  How It Works
                </motion.h2>
                <motion.p 
                  className="text-xl text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Transform any YouTube video into structured knowledge in three simple steps
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Enter URL",
                    description: "Paste any YouTube video or playlist URL to get started",
                    icon: "🔗",
                    delay: 0.2
                  },
                  {
                    title: "AI Processing",
                    description: "Our advanced AI analyzes the transcript and extracts key insights",
                    icon: "🧠",
                    delay: 0.3
                  },
                  {
                    title: "Get Results",
                    description: "Receive a structured summary with topics, insights, and key points",
                    icon: "✨",
                    delay: 0.4
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: feature.delay }}
                  >
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Main content with the URL input and processing */}
          <div id="main-content">
            <MainContent />
          </div>
          
          {/* Call to action */}
          <section className="py-16 bg-brand-600">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Ready to get started?
                </motion.h2>
                <motion.p 
                  className="text-xl text-white/80 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Sign up for free and start analyzing your first video today
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button size="lg" className="bg-white text-brand-600 hover:bg-white/90">
                    Get Started For Free
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        
        {/* Scroll to top button */}
        {showScrollButton && (
          <motion.div 
            className="fixed bottom-6 right-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="default"
              size="icon"
              className="rounded-full h-10 w-10 shadow-lg btn-gradient"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowDown className="h-5 w-5 text-white rotate-180" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AuthWrapper>
  );
};

export default Index;
