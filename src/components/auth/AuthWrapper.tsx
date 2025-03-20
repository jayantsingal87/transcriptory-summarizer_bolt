
import { ReactNode } from "react";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LogIn, BarChart, FileText, Star, User } from "lucide-react";
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
    <>
      <SignedIn>
        <UserProfile />
      </SignedIn>
      <SignedOut>
        <SignInControls />
      </SignedOut>
    </>
  );
}

function SignInControls() {
  return (
    <div className="flex gap-3">
      <SignInButton mode="modal">
        <Button variant="outline" className="flex items-center gap-2 border-brand-200 hover:bg-brand-50">
          <LogIn className="h-4 w-4 text-brand-600" />
          <span>Log In</span>
        </Button>
      </SignInButton>
      
      <SignInButton mode="modal">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="default" className="flex items-center gap-2 btn-gradient">
            <User className="h-4 w-4" />
            <span>Sign Up Free</span>
          </Button>
        </motion.div>
      </SignInButton>
    </div>
  );
}

function UserProfile() {
  const { userId } = useAuth();
  
  return (
    <motion.div 
      className="flex items-center gap-4 bg-white/50 dark:bg-gray-900/50 rounded-lg p-2 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col text-sm">
        <span className="text-muted-foreground">Welcome back!</span>
        <div className="flex gap-2 mt-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-brand-50 hover:text-brand-700">
            <FileText className="h-3 w-3 mr-1" />
            My Summaries
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-brand-50 hover:text-brand-700">
            <Star className="h-3 w-3 mr-1" />
            Favorites
          </Button>
        </div>
      </div>
      <UserButton 
        appearance={{
          elements: {
            userButtonAvatarBox: "w-8 h-8 border-2 border-brand-100",
            userButtonPopoverCard: "rounded-lg shadow-lg border border-gray-100"
          }
        }}
        afterSignOutUrl="/"
      />
    </motion.div>
  );
}
