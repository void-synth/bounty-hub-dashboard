import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/types";
import { mockContributor } from "@/lib/mockData";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (githubToken: string) => Promise<void>;
  logout: () => void;
  connectGitHub: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in real app, this would come from API
const mockUser: User = {
  id: mockContributor.id,
  username: mockContributor.username,
  email: `${mockContributor.username}@example.com`,
  avatarUrl: mockContributor.avatarUrl,
  role: "contributor",
  githubConnected: false,
  joinedAt: mockContributor.joinedAt,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (mock - check localStorage)
    const storedUser = localStorage.getItem("bountyhub_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (githubToken: string) => {
    setIsLoading(true);
    // Mock login/signup - in real app, this would call API
    // If user exists: authenticate, if not: create account
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // GitHub authentication is required - always set as connected
    const userToStore = { 
      ...mockUser, 
      githubConnected: true, 
      githubUsername: mockUser.username 
    };
    
    setUser(userToStore);
    localStorage.setItem("bountyhub_user", JSON.stringify(userToStore));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bountyhub_user");
  };

  const connectGitHub = async () => {
    // Mock GitHub OAuth flow
    // In real app, this would redirect to GitHub OAuth
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = { ...user, githubConnected: true, githubUsername: user.username };
      setUser(updatedUser);
      localStorage.setItem("bountyhub_user", JSON.stringify(updatedUser));
    }
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

