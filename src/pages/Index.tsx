
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { AuthWrapper, AuthStatus } from "@/components/auth/AuthWrapper";
import { MainContent } from "@/components/content/MainContent";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <AuthWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col"
      >
        <Header />
        <main className="flex-1">
          <HeroSection />
          <MainContent />
        </main>
        <Footer />
      </motion.div>
    </AuthWrapper>
  );
};

export default Index;
