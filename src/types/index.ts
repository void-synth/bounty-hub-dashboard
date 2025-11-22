export type IssueStatus = "open" | "in_review" | "merged" | "closed";
export type RewardStatus = "pending" | "eligible" | "paid";
export type PRStatus = "open" | "merged" | "closed";

export interface Issue {
  id: string;
  number: number;
  title: string;
  description: string;
  bountyAmount: number;
  status: IssueStatus;
  repository: string;
  createdAt: string;
  assignedTo?: string;
  prLinked?: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  issueId: string;
  status: PRStatus;
  author: string;
  repository: string;
  createdAt: string;
  mergedAt?: string;
}

export interface Reward {
  id: string;
  issueId: string;
  contributorId: string;
  amount: number;
  status: RewardStatus;
  claimedAt?: string;
  paidAt?: string;
}

export interface Contributor {
  id: string;
  username: string;
  avatarUrl: string;
  totalEarned: number;
  totalContributions: number;
  joinedAt: string;
}

export interface FundingPool {
  totalFunding: number;
  activeBounties: number;
  totalAssigned: number;
  totalPaid: number;
}
