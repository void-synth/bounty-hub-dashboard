import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { mockRewards, mockIssues } from "@/lib/mockData";
import { Award, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethodDialog } from "@/components/PaymentMethodDialog";
import { PaymentHistory } from "@/components/PaymentHistory";

const Rewards = () => {
  const { toast } = useToast();
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<{ id: string; amount: number } | null>(null);

  const eligibleRewards = mockRewards.filter(r => r.status === "eligible");
  const pendingRewards = mockRewards.filter(r => r.status === "pending");
  const paidRewards = mockRewards.filter(r => r.status === "paid");

  const totalEligible = eligibleRewards.reduce((sum, r) => sum + r.amount, 0);
  const totalPaid = paidRewards.reduce((sum, r) => sum + r.amount, 0);

  const handleClaim = (rewardId: string, amount: number) => {
    setSelectedReward({ id: rewardId, amount });
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedReward) {
      setClaimingId(selectedReward.id);
      setTimeout(() => {
        toast({
          title: "Payment initiated!",
          description: `Your reward of $${selectedReward.amount} is being processed.`,
        });
        setClaimingId(null);
        setSelectedReward(null);
      }, 500);
    }
  };

  const renderRewardCard = (reward: typeof mockRewards[0]) => {
    const issue = mockIssues.find(i => i.id === reward.issueId);
    if (!issue) return null;

    return (
      <div
        key={reward.id}
        className="flex items-start justify-between p-6 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <StatusBadge status={reward.status} type="reward" />
            <span className="text-sm text-muted-foreground">
              #{issue.number}
            </span>
          </div>
          <p className="font-medium text-lg">{issue.title}</p>
          <p className="text-sm text-muted-foreground">
            {issue.repository}
          </p>
          {reward.claimedAt && (
            <p className="text-sm text-muted-foreground">
              Claimed on {new Date(reward.claimedAt).toLocaleDateString()}
            </p>
          )}
          {reward.paidAt && (
            <p className="text-sm text-success">
              Paid on {new Date(reward.paidAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="text-right ml-6">
          <div className="text-2xl font-bold text-success mb-3">
            ${reward.amount}
          </div>
          {reward.status === "eligible" && (
            <Button
              onClick={() => handleClaim(reward.id, reward.amount)}
              disabled={claimingId === reward.id}
              className="gap-2"
            >
              {claimingId === reward.id ? "Processing..." : "Claim Reward"}
              <Award className="h-4 w-4" />
            </Button>
          )}
          {reward.status === "paid" && reward.paidAt && (
            <div className="text-xs text-muted-foreground mt-2">
              Payment completed
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Rewards</h1>
          <p className="text-muted-foreground mt-2">
            Claim your earned rewards and track payment status
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Eligible to Claim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                ${totalEligible}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {eligibleRewards.length} reward{eligibleRewards.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {pendingRewards.length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Awaiting PR merge
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${totalPaid}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {paidRewards.length} payment{paidRewards.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {eligibleRewards.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-success" />
                Eligible Rewards
              </CardTitle>
              <CardDescription>
                These rewards are ready to claim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eligibleRewards.map(renderRewardCard)}
            </CardContent>
          </Card>
        )}

        {pendingRewards.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-warning" />
                Pending Rewards
              </CardTitle>
              <CardDescription>
                Waiting for PR review and merge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRewards.map(renderRewardCard)}
            </CardContent>
          </Card>
        )}

        {eligibleRewards.length === 0 && pendingRewards.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <Award className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-lg font-medium">No rewards yet</p>
                <p className="text-muted-foreground">
                  Complete bounties to earn rewards
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <PaymentHistory />

        {selectedReward && (
          <PaymentMethodDialog
            open={paymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            amount={selectedReward.amount}
            rewardId={selectedReward.id}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Rewards;
