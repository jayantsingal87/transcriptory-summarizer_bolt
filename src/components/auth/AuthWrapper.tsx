
import { ReactNode } from "react";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const CLERK_PUBLISHABLE_KEY = "pk_test_ZnVuZGFtZW50YWwtc2NvcnBpb24tNjkuY2xlcmsuYWNjb3VudHMuZGV2JA";

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    </ClerkProvider>
  );
}

export function AuthStatus() {
  return (
    <div className="flex justify-end mb-4">
      <SignedIn>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Welcome back!</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
