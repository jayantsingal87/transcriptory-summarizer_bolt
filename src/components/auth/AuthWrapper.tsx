
import { ReactNode } from "react";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LogIn, BarChart, FileText } from "lucide-react";
import { motion } from "framer-motion";

// This is a public key and can safely be in the codebase
const CLERK_PUBLISHABLE_KEY = "pk_test_ZnVuZGFtZW50YWwtc2NvcnBpb24tNjkuY2xlcmsuYWNjb3VudHMuZGV2JA";

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}

export function AuthStatus() {
  return (
    <div className="flex justify-end mb-6">
      <SignedIn>
        <UserProfile />
      </SignedIn>
      <SignedOut>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SignInButton mode="modal">
            <Button variant="outline" className="flex items-center gap-2 btn-gradient text-white">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </SignInButton>
        </motion.div>
      </SignedOut>
    </div>
  );
}

function UserProfile() {
  const { userId } = useAuth();
  
  return (
    <motion.div 
      className="flex items-center gap-4 bg-white/50 dark:bg-gray-900/50 rounded-lg p-2 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col text-sm">
        <span className="text-muted-foreground">Welcome back!</span>
        <div className="flex gap-2 mt-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <FileText className="h-3 w-3 mr-1" />
            My Summaries
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <BarChart className="h-3 w-3 mr-1" />
            Analytics
          </Button>
        </div>
      </div>
      <UserButton 
        appearance={{
          elements: {
            userButtonAvatarBox: "w-8 h-8"
          }
        }}
        afterSignOutUrl="/"
      />
    </motion.div>
  );
}
