
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { MainContent } from "@/components/content/MainContent";

const Index = () => {
  return (
    <AuthWrapper>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <MainContent />
      </main>
      <Footer />
    </AuthWrapper>
  );
};

export default Index;
