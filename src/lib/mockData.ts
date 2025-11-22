import { Issue, PullRequest, Reward, Contributor, FundingPool } from "@/types";

export const mockContributor: Contributor = {
  id: "1",
  username: "devuser",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=devuser",
  totalEarned: 2500,
  totalContributions: 15,
  joinedAt: "2024-01-15",
};

export const mockIssues: Issue[] = [
  {
    id: "1",
    number: 123,
    title: "Add dark mode support to dashboard",
    description: "Implement theme toggle and dark mode styles across all components",
    bountyAmount: 500,
    status: "open",
    repository: "acme/dashboard",
    createdAt: "2024-03-01",
  },
  {
    id: "2",
    number: 456,
    title: "Fix authentication bug in login flow",
    description: "Users unable to login with GitHub OAuth on Safari browser",
    bountyAmount: 300,
    status: "in_review",
    repository: "acme/auth-service",
    createdAt: "2024-02-28",
    assignedTo: "devuser",
    prLinked: "789",
  },
  {
    id: "3",
    number: 789,
    title: "Optimize database queries for reports",
    description: "Improve performance of analytics queries by implementing proper indexing",
    bountyAmount: 800,
    status: "merged",
    repository: "acme/backend",
    createdAt: "2024-02-15",
    assignedTo: "devuser",
    prLinked: "790",
  },
  {
    id: "4",
    number: 234,
    title: "Add export functionality to CSV",
    description: "Users need ability to export data tables to CSV format",
    bountyAmount: 400,
    status: "open",
    repository: "acme/dashboard",
    createdAt: "2024-03-05",
  },
  {
    id: "5",
    number: 567,
    title: "Implement rate limiting for API endpoints",
    description: "Add rate limiting middleware to prevent API abuse",
    bountyAmount: 600,
    status: "open",
    repository: "acme/api",
    createdAt: "2024-03-03",
  },
];

export const mockPullRequests: PullRequest[] = [
  {
    id: "1",
    number: 789,
    title: "Fix: Safari OAuth login issue",
    issueId: "2",
    status: "open",
    author: "devuser",
    repository: "acme/auth-service",
    createdAt: "2024-03-10",
  },
  {
    id: "2",
    number: 790,
    title: "Optimize: Add indexes to analytics queries",
    issueId: "3",
    status: "merged",
    author: "devuser",
    repository: "acme/backend",
    createdAt: "2024-02-20",
    mergedAt: "2024-02-25",
  },
];

export const mockRewards: Reward[] = [
  {
    id: "1",
    issueId: "3",
    contributorId: "1",
    amount: 800,
    status: "eligible",
  },
  {
    id: "2",
    issueId: "2",
    contributorId: "1",
    amount: 300,
    status: "pending",
  },
];

export const mockFundingPool: FundingPool = {
  totalFunding: 25000,
  activeBounties: 12,
  totalAssigned: 8500,
  totalPaid: 5200,
};
