/**
 * Debug utility to check GitHub OAuth configuration
 * Run this in browser console: checkGitHubConfig()
 */

export const checkGitHubConfig = () => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/callback`;
  
  console.log("=== GitHub OAuth Configuration Check ===");
  console.log("Client ID:", clientId || "❌ NOT SET (still has placeholder)");
  console.log("Redirect URI:", redirectUri);
  console.log("Current Origin:", window.location.origin);
  console.log("Is Configured:", !!clientId && clientId !== "your_github_client_id_here");
  
  if (!clientId || clientId === "your_github_client_id_here") {
    console.error("❌ Client ID is not configured!");
    console.log("Fix: Update .env file with your actual GitHub Client ID");
    console.log("Then restart the dev server");
  } else {
    console.log("✅ Client ID is configured");
  }
  
  return {
    clientId,
    redirectUri,
    isConfigured: !!clientId && clientId !== "your_github_client_id_here",
  };
};

// Make it available globally for debugging
if (typeof window !== "undefined") {
  (window as any).checkGitHubConfig = checkGitHubConfig;
}

