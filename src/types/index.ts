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

export type UserRole = "contributor" | "funder" | "admin";
export type PaymentMethod = "bank" | "paypal" | "crypto" | "stripe";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed";

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  githubConnected: boolean;
  githubUsername?: string;
  joinedAt: string;
}

export interface FundingTransaction {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
  status: "completed" | "pending" | "failed";
}

export interface Payment {
  id: string;
  rewardId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  initiatedAt: string;
  completedAt?: string;
  transactionId?: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  isActive: boolean;
  lastSyncedAt?: string;
}