import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusRefreshButton } from "@/components/StatusRefreshButton";
import { mockIssues, mockRewards, mockFundingPool } from "@/lib/mockData";
import { Wallet, TrendingUp, Award, FileCode, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const activeIssues = mockIssues.filter(i => i.status === "open").length;
  const pendingReviews = mockIssues.filter(i => i.status === "in_review").length;
  const eligibleRewards = mockRewards.filter(r => r.status === "eligible");
  const totalEligible = eligibleRewards.reduce((sum, r) => sum + r.amount, 0);

  const recentIssues = mockIssues.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track bounties, contributions, and rewards in one place
            </p>
          </div>
          <StatusRefreshButton />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Available Bounties"
            value={activeIssues}
            icon={FileCode}
            description="Open issues with rewards"
          />
          <StatCard
            title="In Review"
            value={pendingReviews}
            icon={TrendingUp}
            description="PRs under review"
          />
          <StatCard
            title="Eligible Rewards"
            value={`$${totalEligible}`}
            icon={Award}
            description="Ready to claim"
          />
          <StatCard
            title="Funding Pool"
            value={`$${mockFundingPool.totalFunding.toLocaleString()}`}
            icon={Wallet}
            description="Total available funding"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Bounties</CardTitle>
                  <CardDescription>Latest issues with rewards attached</CardDescription>
                </div>
                <Link to="/bounties">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={issue.status} type="issue" />
                      <span className="text-sm font-medium">
                        #{issue.number}
                      </span>
                    </div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {issue.repository}
                    </p>
                    <a
                      href={`https://github.com/${issue.repository}/issues/${issue.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      View on GitHub
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-success">
                      ${issue.bountyAmount}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Rewards</CardTitle>
                  <CardDescription>Track your earned rewards</CardDescription>
                </div>
                <Link to="/rewards">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRewards.map((reward) => {
                const issue = mockIssues.find(i => i.id === reward.issueId);
                if (!issue) return null;
                return (
                  <div
                    key={reward.id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={reward.status} type="reward" />
                      </div>
                      <p className="font-medium">{issue.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {issue.repository}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-success">
                        ${reward.amount}
                      </div>
                      {reward.status === "eligible" && (
                        <Link to="/rewards">
                          <Button size="sm" className="mt-2">
                            Claim
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
