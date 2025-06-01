import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AuthError } from "@supabase/supabase-js";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "signin" | "signup";
  onToggleType: () => void;
}

const AuthModal: FC<AuthModalProps> = ({
  isOpen,
  onClose,
  type,
  onToggleType,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            "https://jkdovbbczvmgavtvklki.supabase.co/auth/v1/callback",
        },
      });

      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sign in with Google");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Check if email confirmation is required
          if (data.session) {
            // Direct session available - user can proceed directly
            toast.success("Account created successfully!");
            navigate("/onboarding");
            onClose();
          } else {
            // Email confirmation required
            setConfirmEmailSent(true);
            toast.success("Verification email sent. Please check your inbox.");
            // Don't close modal, show confirmation UI
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast.success("Welcome back!");
          navigate("/dashboard");
          onClose();
        }
      }
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setConfirmEmailSent(false);
    setEmail("");
    setPassword("");
    setName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseAndReset}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {confirmEmailSent
              ? "Verify your email"
              : type === "signin"
              ? "Welcome back"
              : "Create your account"}
          </DialogTitle>
        </DialogHeader>

        {confirmEmailSent ? (
          <div className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mb-4">
                <Check size={24} />
              </div>
              <h3 className="font-semibold text-lg">Check your inbox</h3>
              <p className="text-center text-gray-600 mt-2">
                We've sent a verification email to
                <br />
                <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Click the link in the email to verify your account and continue
                setting up your profile.
              </p>
            </div>
            <Button onClick={handleCloseAndReset} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              className="w-full mb-4"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {type === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : type === "signin"
                  ? "Sign In"
                  : "Sign Up"}
              </Button>

              <div className="text-center text-sm mt-6">
                {type === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setConfirmEmailSent(false);
                    onToggleType();
                  }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {type === "signin" ? "Sign up" : "Sign in"}
                </a>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
