
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TourProvider } from "@/components/ui/guided-tour";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SharedAnalysis from "./pages/SharedAnalysis";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthWrapper>
        <TourProvider>
          <Toaster />
          <Sonner position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shared/:shareId" element={<SharedAnalysis />} />
              <Route path="/embed/:shareId" element={<SharedAnalysis embed />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TourProvider>
      </AuthWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
