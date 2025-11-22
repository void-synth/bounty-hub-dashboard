import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Award, DollarSign, User, CheckCircle2 } from "lucide-react";
import { mockContributor } from "@/lib/mockData";

const Profile = () => {
  const { user } = useAuth();
  const displayUser = user || {
    username: mockContributor.username,
    email: `${mockContributor.username}@example.com`,
    avatarUrl: mockContributor.avatarUrl,
    githubConnected: false,
    joinedAt: mockContributor.joinedAt,
    role: "contributor" as const,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your contributor profile
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={displayUser.avatarUrl} />
                <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">@{displayUser.username}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mt-2">
                  {displayUser.role}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(displayUser.joinedAt).toLocaleDateString()}</span>
              </div>
              <Button className="w-full gap-2" variant="outline" disabled>
                <CheckCircle2 className="h-4 w-4 text-success" />
                GitHub Connected
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                GitHub authentication is required for BountyHub
              </p>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">
                    ${mockContributor.totalEarned.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lifetime earnings
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Total Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {mockContributor.totalContributions}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Completed bounties
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your profile and contribution details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">Username</span>
                    <span className="text-sm text-muted-foreground">@{mockContributor.username}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">Member Since</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(mockContributor.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">GitHub Status</span>
                    {displayUser.githubConnected ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Connected
                      </Badge>
                    ) : (
                      <span className="text-sm text-warning">Not Connected</span>
                    )}
                  </div>
                  {displayUser.githubUsername && (
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="text-sm font-medium">GitHub Username</span>
                      <a
                        href={`https://github.com/${displayUser.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        @{displayUser.githubUsername}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
