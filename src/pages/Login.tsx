import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Github, Award, AlertCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return !!url && !!key && url !== 'your_supabase_url_here' && key !== 'your_supabase_anon_key_here';
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isConfigured, setIsConfigured] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);
    
    if (!configured) {
      console.warn("⚠️ Supabase not configured. Check .env file and restart dev server.");
    }
  }, []);

  const handleGitHubAuth = async () => {
    if (!isConfigured) {
      setError("Supabase is not configured. Please set up your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // This will redirect to GitHub OAuth via Supabase
      await login();
      // Note: We won't reach here because redirect happens
      // The callback will handle the rest
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || "Failed to initiate GitHub authentication. Please check your configuration.");
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
          {!isConfigured && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <p className="font-medium">Supabase not configured</p>
                <p className="text-sm">
                  Create a <code className="px-1 py-0.5 bg-destructive/20 rounded">.env</code> file in the project root with:
                </p>
                <pre className="text-xs p-2 bg-muted rounded overflow-x-auto">
                  VITE_SUPABASE_URL=your_supabase_url_here{'\n'}VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
                </pre>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Get credentials from Supabase
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-xs mt-2">
                  See <code className="px-1 py-0.5 bg-destructive/20 rounded">SUPABASE_SETUP.md</code> for detailed instructions.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {error && isConfigured && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGitHubAuth}
            disabled={isLoading || !isConfigured}
            className="w-full gap-2"
            size="lg"
          >
            <Github className="h-5 w-5" />
            {isLoading ? "Redirecting to GitHub..." : "Continue with GitHub"}
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
