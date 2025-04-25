
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App.tsx'
import './index.css'

// This is a public key and can safely be in the codebase
const CLERK_PUBLISHABLE_KEY = "pk_test_ZnVuZGFtZW50YWwtc2NvcnBpb24tNjkuY2xlcmsuYWNjb3VudHMuZGV2JA";

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={CLERK_PUBLISHABLE_KEY}
    signInFallbackRedirectUrl="/"
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
  >
    <App />
  </ClerkProvider>
);
