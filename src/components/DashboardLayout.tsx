import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, LayoutDashboard, FileCode, Award, Wallet, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockContributor } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/bounties", label: "Bounties", icon: FileCode },
  { path: "/contributions", label: "My Contributions", icon: Award },
  { path: "/rewards", label: "Rewards", icon: Wallet },
  { path: "/funding", label: "Funding Pool", icon: Wallet },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Award className="h-5 w-5 text-primary-foreground" />
              </div>
              BountyHub
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-2",
                        isActive && "bg-muted text-foreground font-medium"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Connect GitHub</span>
            </Button>
            <Link to="/profile">
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 ring-primary transition-all">
                <AvatarImage src={mockContributor.avatarUrl} />
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>
      <main className="container px-4 py-8">
        {children}
      </main>
    </div>
  );
};
