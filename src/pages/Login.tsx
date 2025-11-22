import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Github, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleGitHubAuth = async () => {
    setIsLoading(true);
    try {
      // Mock GitHub OAuth - in real app, this would redirect to GitHub OAuth
      // For signup: if user doesn't exist, create account
      // For login: if user exists, authenticate
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In real app, this would be handled by the OAuth callback
      // Here we simulate both signup and login with GitHub
      await login("mock_github_token");
      
      toast({
        title: "Successfully authenticated!",
        description: "Welcome to BountyHub",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again or contact support if the issue persists",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
              <Award className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">Welcome to BountyHub</CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in or sign up with your GitHub account to get started
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGitHubAuth}
            disabled={isLoading}
            className="w-full gap-2"
            size="lg"
          >
            <Github className="h-5 w-5" />
            {isLoading ? "Connecting to GitHub..." : "Continue with GitHub"}
          </Button>

          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">GitHub authentication required</strong>
              <br />
              You'll be redirected to GitHub to authorize BountyHub. 
              New users will automatically create an account.
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

