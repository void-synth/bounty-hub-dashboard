import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { mockIssues, mockPullRequests, mockContributor } from "@/lib/mockData";
import { GitPullRequest, Award, ExternalLink } from "lucide-react";

const Contributions = () => {
  const myIssues = mockIssues.filter(issue => issue.assignedTo === mockContributor.username);
  const myPRs = mockPullRequests.filter(pr => pr.author === mockContributor.username);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Contributions</h1>
          <p className="text-muted-foreground mt-2">
            Track your active and completed work
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockContributor.totalContributions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                ${mockContributor.totalEarned}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myIssues.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Active Issues
            </CardTitle>
            <CardDescription>
              Issues you're currently working on
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {myIssues.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No active issues. Browse bounties to get started!
              </p>
            ) : (
              myIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={issue.status} type="issue" />
                      <span className="text-sm text-muted-foreground">
                        #{issue.number}
                      </span>
                    </div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {issue.repository}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-success mb-2">
                      ${issue.bountyAmount}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a
                        href={`https://github.com/${issue.repository}/issues/${issue.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5" />
              Pull Requests
            </CardTitle>
            <CardDescription>
              Your submitted pull requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {myPRs.map((pr) => {
              const issue = mockIssues.find(i => i.id === pr.issueId);
              return (
                <div
                  key={pr.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={pr.status} type="pr" />
                      <span className="text-sm text-muted-foreground">
                        PR #{pr.number}
                      </span>
                    </div>
                    <p className="font-medium">{pr.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {pr.repository} • Linked to issue #{issue?.number}
                    </p>
                  </div>
                  <div className="text-right ml-4 space-y-2">
                    {pr.status === "merged" && issue && (
                      <div className="text-lg font-bold text-success">
                        ${issue.bountyAmount}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {pr.mergedAt
                        ? `Merged ${new Date(pr.mergedAt).toLocaleDateString()}`
                        : `Created ${new Date(pr.createdAt).toLocaleDateString()}`}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      asChild
                    >
                      <a
                        href={`https://github.com/${pr.repository}/pull/${pr.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View PR
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Contributions;
