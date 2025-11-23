import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically handles the OAuth callback
        // We just need to exchange the code for a session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setStatus("error");
          setErrorMessage(error.message || "Failed to complete authentication. Please try again.");
          return;
        }

        if (data.session) {
          setStatus("success");
          // Redirect after a short delay
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1500);
        } else {
          // Check for error in URL params
          const errorParam = searchParams.get("error");
          const errorDescription = searchParams.get("error_description");
          
          if (errorParam) {
            setStatus("error");
            setErrorMessage(
              errorParam === "access_denied"
                ? "GitHub authorization was denied. Please try again."
                : errorDescription || `Authentication error: ${errorParam}`
            );
          } else {
            setStatus("error");
            setErrorMessage("No session found. Please try logging in again.");
          }
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to complete authentication. Please try again.");
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Completing Authentication</CardTitle>
          <CardDescription>
            Please wait while we verify your GitHub account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Connecting to GitHub...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <p className="text-sm font-medium">Authentication successful!</p>
              <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
