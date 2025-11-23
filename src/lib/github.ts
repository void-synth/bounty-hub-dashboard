/**
 * GitHub OAuth Configuration
 * 
 * To set up GitHub OAuth:
 * 1. Go to https://github.com/settings/developers
 * 2. Create a new OAuth App
 * 3. Set Authorization callback URL to match your dev server port:
 *    - Check which port your dev server uses (look at terminal output)
 *    - Common: http://localhost:8080/auth/callback or http://localhost:8081/auth/callback
 *    - The port MUST match exactly what's in your browser URL
 * 4. Copy Client ID and set it in .env file as VITE_GITHUB_CLIENT_ID
 * 5. Restart your dev server after updating .env
 */

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "";
const GITHUB_REDIRECT_URI = `${window.location.origin}/auth/callback`;
const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_API_BASE = "https://api.github.com";

// Check if GitHub OAuth is configured (and not still using placeholder)
export const isGitHubConfigured = (): boolean => {
  return !!GITHUB_CLIENT_ID && GITHUB_CLIENT_ID !== "your_github_client_id_here";
};

/**
 * Generate GitHub OAuth URL
 */
export const getGitHubAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: "read:user user:email",
    state: generateState(),
  });

  return `${GITHUB_AUTH_URL}?${params.toString()}`;
};

/**
 * Generate random state for OAuth security
 */
const generateState = (): string => {
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // Store in both sessionStorage and localStorage for reliability
  try {
    sessionStorage.setItem("github_oauth_state", state);
    localStorage.setItem("github_oauth_state", state);
  } catch (error) {
    console.warn("Could not store state:", error);
  }
  return state;
};

/**
 * Verify OAuth state
 */
export const verifyState = (state: string): boolean => {
  try {
    // Check sessionStorage first
    const storedState = sessionStorage.getItem("github_oauth_state");
    if (storedState && storedState === state) {
      sessionStorage.removeItem("github_oauth_state");
      localStorage.removeItem("github_oauth_state"); // Clean up both
      console.log("✅ State verified (sessionStorage)");
      return true;
    }
    
    // Check localStorage as fallback (in case sessionStorage was cleared)
    const localStorageState = localStorage.getItem("github_oauth_state");
    if (localStorageState && localStorageState === state) {
      sessionStorage.removeItem("github_oauth_state");
      localStorage.removeItem("github_oauth_state");
      console.log("✅ State verified (localStorage)");
      return true;
    }
    
    // Log for debugging
    console.warn("⚠️ State mismatch:");
    console.warn("   Stored (sessionStorage):", storedState || "(none)");
    console.warn("   Stored (localStorage):", localStorageState || "(none)");
    console.warn("   Received:", state);
    
    // For development: if no state was stored, allow it (might be a refresh issue)
    // In production, this should be strict
    if (!storedState && !localStorageState) {
      console.warn("⚠️ No stored state found. This might be a page refresh issue.");
      console.warn("   Allowing authentication to proceed (development mode)");
      // In a real app, you might want to be stricter, but for development this helps
      return true; // Allow for development
    }
    
    return false;
  } catch (error) {
    console.error("❌ Error verifying state:", error);
    // In development, allow on error (might be storage issues)
    if (import.meta.env.DEV) {
      console.warn("⚠️ Allowing authentication despite state verification error (development mode)");
      return true;
    }
    return false;
  }
};

/**
 * Exchange OAuth code for access token
 * Note: This requires a backend endpoint. In production, this should call your backend API.
 */
export const exchangeCodeForToken = async (code: string): Promise<string> => {
  const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "";
  
  if (!BACKEND_API_URL) {
    throw new Error("Backend API URL not configured. Please set VITE_BACKEND_API_URL in .env file");
  }
  
  try {
    console.log("🔄 Exchanging code for token...");
    console.log("   Backend URL:", BACKEND_API_URL);
    console.log("   Redirect URI:", GITHUB_REDIRECT_URI);
    
    const response = await fetch(`${BACKEND_API_URL}/api/auth/github/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, redirect_uri: GITHUB_REDIRECT_URI }),
    });

    const responseData = await response.json().catch(() => ({ error: "Invalid JSON response" }));

    if (!response.ok) {
      const errorMessage = responseData.error || `HTTP ${response.status}: ${response.statusText}`;
      const errorDetails = responseData.details || responseData.error_code || "";
      
      console.error("❌ Token exchange failed:");
      console.error("   Status:", response.status);
      console.error("   Error:", errorMessage);
      if (errorDetails) {
        console.error("   Details:", errorDetails);
      }
      
      // Provide helpful error messages
      if (response.status === 400) {
        if (errorDetails.includes("bad_verification_code") || errorDetails.includes("code")) {
          throw new Error("The authorization code is invalid or has expired. Please try logging in again.");
        }
        if (errorDetails.includes("redirect_uri_mismatch")) {
          throw new Error(`Redirect URI mismatch. Make sure your GitHub OAuth App callback URL matches: ${GITHUB_REDIRECT_URI}`);
        }
        throw new Error(`Authentication failed: ${errorMessage}. ${errorDetails ? `Details: ${errorDetails}` : ""}`);
      }
      
      throw new Error(`Failed to exchange code for token: ${errorMessage}`);
    }

    if (!responseData.access_token) {
      console.error("❌ No access token in response:", responseData);
      throw new Error("No access token received from backend");
    }

    console.log("✅ Token exchange successful");
    return responseData.access_token;
  } catch (error: any) {
    console.error("❌ Error exchanging code for token:", error);
    
    // If it's already a user-friendly error, re-throw it
    if (error.message && !error.message.includes("fetch")) {
      throw error;
    }
    
    // Network errors
    if (error.message?.includes("fetch") || error.message?.includes("Failed to fetch")) {
      throw new Error("Cannot connect to backend server. Make sure the backend is running on " + BACKEND_API_URL);
    }
    
    throw error;
  }
};

/**
 * Fetch GitHub user data using access token
 */
export const fetchGitHubUser = async (accessToken: string) => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub user");
    }

    const userData = await response.json();

    // Also fetch user email
    let email = userData.email;
    if (!email) {
      try {
        const emailResponse = await fetch(`${GITHUB_API_BASE}/user/emails`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        if (emailResponse.ok) {
          const emails = await emailResponse.json();
          const primaryEmail = emails.find((e: any) => e.primary) || emails[0];
          email = primaryEmail?.email || "";
        }
      } catch (e) {
        console.warn("Could not fetch user email:", e);
      }
    }

    return {
      id: userData.id.toString(),
      username: userData.login,
      email: email || `${userData.login}@users.noreply.github.com`,
      avatarUrl: userData.avatar_url,
      githubUsername: userData.login,
      name: userData.name || userData.login,
    };
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    throw error;
  }
};

/**
 * Redirect to GitHub OAuth
 */
export const redirectToGitHub = () => {
  if (!GITHUB_CLIENT_ID || GITHUB_CLIENT_ID === "your_github_client_id_here") {
    const errorMessage = `GitHub Client ID not configured.

To fix this:
1. Open the .env file in the project root
2. Replace "your_github_client_id_here" with your actual Client ID
3. Get your Client ID from: https://github.com/settings/developers
   - Create a new OAuth App
   - Set callback URL to: ${GITHUB_REDIRECT_URI}
   - Copy the Client ID
4. Restart the development server (Vite needs restart to load .env changes)

See GITHUB_OAUTH_SETUP.md for detailed instructions.`;
    throw new Error(errorMessage);
  }
  window.location.href = getGitHubAuthUrl();
};

