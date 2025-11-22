import { Badge } from "@/components/ui/badge";
import { IssueStatus, RewardStatus, PRStatus } from "@/types";
import { GitMerge, GitPullRequest, Clock, CheckCircle2, XCircle, DollarSign } from "lucide-react";

interface StatusBadgeProps {
  status: IssueStatus | RewardStatus | PRStatus;
  type: "issue" | "reward" | "pr";
}

export const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    if (type === "issue") {
      switch (status as IssueStatus) {
        case "open":
          return { label: "Open", icon: GitPullRequest, variant: "info" as const };
        case "in_review":
          return { label: "In Review", icon: Clock, variant: "warning" as const };
        case "merged":
          return { label: "Merged", icon: GitMerge, variant: "success" as const };
        case "closed":
          return { label: "Closed", icon: XCircle, variant: "secondary" as const };
      }
    } else if (type === "reward") {
      switch (status as RewardStatus) {
        case "pending":
          return { label: "Pending", icon: Clock, variant: "warning" as const };
        case "eligible":
          return { label: "Eligible", icon: CheckCircle2, variant: "success" as const };
        case "paid":
          return { label: "Paid", icon: DollarSign, variant: "default" as const };
      }
    } else {
      switch (status as PRStatus) {
        case "open":
          return { label: "Open", icon: GitPullRequest, variant: "info" as const };
        case "merged":
          return { label: "Merged", icon: GitMerge, variant: "success" as const };
        case "closed":
          return { label: "Closed", icon: XCircle, variant: "secondary" as const };
      }
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
