import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockFundingPool, mockIssues } from "@/lib/mockData";
import { Wallet, TrendingUp, DollarSign, Award } from "lucide-react";
import { AddFundsDialog } from "@/components/AddFundsDialog";
import { AssignBountyDialog } from "@/components/AssignBountyDialog";
import { CreateBountyDialog } from "@/components/CreateBountyDialog";
import { GitHubSyncDialog } from "@/components/GitHubSyncDialog";
import { useState } from "react";

const Funding = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const assignedPercent = (mockFundingPool.totalAssigned / mockFundingPool.totalFunding) * 100;
  const paidPercent = (mockFundingPool.totalPaid / mockFundingPool.totalFunding) * 100;
  const availablePercent = 100 - assignedPercent;

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const bountiesByRepo = mockIssues.reduce((acc, issue) => {
    if (!acc[issue.repository]) {
      acc[issue.repository] = {
        count: 0,
        totalBounty: 0,
      };
    }
    acc[issue.repository].count++;
    acc[issue.repository].totalBounty += issue.bountyAmount;
    return acc;
  }, {} as Record<string, { count: number; totalBounty: number }>);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Funding Pool</h1>
            <p className="text-muted-foreground mt-2">
              Overview of bounty funding and distribution
            </p>
          </div>
          <div className="flex items-center gap-3">
            <GitHubSyncDialog />
            <CreateBountyDialog onSuccess={handleRefresh} />
            <AssignBountyDialog onSuccess={handleRefresh} />
            <AddFundsDialog onSuccess={handleRefresh} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Total Funding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${mockFundingPool.totalFunding.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Active Bounties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockFundingPool.activeBounties}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Assigned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                ${mockFundingPool.totalAssigned.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Paid Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                ${mockFundingPool.totalPaid.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Funding Distribution</CardTitle>
            <CardDescription>
              How funding is allocated across the pool
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Available</span>
                <span className="text-muted-foreground">
                  ${(mockFundingPool.totalFunding - mockFundingPool.totalAssigned).toLocaleString()} ({availablePercent.toFixed(1)}%)
                </span>
              </div>
              <Progress value={availablePercent} className="h-3" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Assigned to Bounties</span>
                <span className="text-muted-foreground">
                  ${mockFundingPool.totalAssigned.toLocaleString()} ({assignedPercent.toFixed(1)}%)
                </span>
              </div>
              <Progress value={assignedPercent} className="h-3 [&>div]:bg-warning" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Paid to Contributors</span>
                <span className="text-muted-foreground">
                  ${mockFundingPool.totalPaid.toLocaleString()} ({paidPercent.toFixed(1)}%)
                </span>
              </div>
              <Progress value={paidPercent} className="h-3 [&>div]:bg-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bounties by Repository</CardTitle>
            <CardDescription>
              Distribution of bounties across repositories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(bountiesByRepo).map(([repo, data]) => (
                <div key={repo} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">{repo}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.count} issue{data.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-success">
                      ${data.totalBounty.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Funding;
