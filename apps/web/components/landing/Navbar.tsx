"use client";

import { Workflow } from "lucide-react";
import { Button } from "../ui/button";
import { useUserInfoStore } from "@/store/userInfoStore";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";

export const Navbar = () => {
  const router = useRouter();
  const { id, setUserInfo } = useUserInfoStore();
  const { mutate: logoutUser, isPending: isLoggingOut } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setUserInfo({ id: undefined, email: undefined, fullname: undefined });
    },
  });
  const handleDashboard = () => router.push("/");
  const handleLogin = () => router.push("/signin");
  const handleGetStarted = () => router.push("/signup");
  const handleLogout = () => logoutUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Workflow size={20} />
          </div>
          Vibe Check
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#templates"
            className="hover:text-foreground transition-colors"
          >
            Public Polls
          </a>
          <a
            href="#pricing"
            className="hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-4">
          {id ? (
            <>
              <Button onClick={handleDashboard}>Dashboard</Button>
              <Button 
                variant="ghost" 
                className="hidden sm:inline-flex"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="hidden sm:inline-flex"
                onClick={handleLogin}
              >
                Log in
              </Button>
              <Button onClick={handleGetStarted}>Get Started</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};