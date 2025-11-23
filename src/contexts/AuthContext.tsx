import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/lib/supabase";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  connectGitHub: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Map Supabase user to our User type
const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser, metadata?: any): User => {
  const userMetadata = supabaseUser.user_metadata || {};
  const appMetadata = supabaseUser.app_metadata || {};
  
  return {
    id: supabaseUser.id,
    username: userMetadata.user_name || userMetadata.preferred_username || userMetadata.name || supabaseUser.email?.split('@')[0] || 'user',
    email: supabaseUser.email || '',
    avatarUrl: userMetadata.avatar_url || userMetadata.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email || 'user')}`,
    role: appMetadata.role || metadata?.role || "contributor",
    githubConnected: !!userMetadata.provider || supabaseUser.app_metadata?.provider === 'github',
    githubUsername: userMetadata.user_name || userMetadata.preferred_username || '',
    joinedAt: supabaseUser.created_at || new Date().toISOString(),
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUserToAppUser(session.user, session.user.user_metadata));
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUserToAppUser(session.user, session.user.user_metadata));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'read:user user:email',
        },
      });

      if (error) {
        console.error("GitHub OAuth error:", error);
        throw error;
      }

      // The redirect will happen automatically
      // No need to manually redirect
    } catch (error: any) {
      console.error("GitHub OAuth error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const connectGitHub = async () => {
    // Same as login for GitHub
    await login();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        connectGitHub,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
