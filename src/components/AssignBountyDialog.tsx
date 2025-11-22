import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Award, ExternalLink } from "lucide-react";

interface AssignBountyDialogProps {
  onSuccess?: () => void;
}

export const AssignBountyDialog = ({ onSuccess }: AssignBountyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [repository, setRepository] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [bountyAmount, setBountyAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!repository || !issueNumber || !bountyAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(bountyAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bounty amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Mock API call - in real app, this would call backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Bounty assigned successfully!",
      description: `$${numAmount.toLocaleString()} assigned to ${repository}#${issueNumber}`,
    });

    setRepository("");
    setIssueNumber("");
    setBountyAmount("");
    setOpen(false);
    onSuccess?.();
    setIsLoading(false);
  };

  const parseGitHubUrl = (url: string) => {
    // Try to parse GitHub URL format: https://github.com/owner/repo/issues/123
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
    if (match) {
      setRepository(`${match[1]}/${match[2]}`);
      setIssueNumber(match[3]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Award className="h-4 w-4" />
          Assign Bounty
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assign Bounty to GitHub Issue</DialogTitle>
            <DialogDescription>
              Link a bounty from the funding pool to a GitHub issue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Issue URL (Optional)</Label>
              <Input
                id="github-url"
                type="url"
                placeholder="https://github.com/owner/repo/issues/123"
                onChange={(e) => parseGitHubUrl(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Paste the GitHub issue URL to auto-fill repository and issue number
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="repository">Repository *</Label>
                <Input
                  id="repository"
                  placeholder="owner/repository"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Format: owner/repository
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue-number">Issue Number *</Label>
                <Input
                  id="issue-number"
                  type="number"
                  placeholder="123"
                  value={issueNumber}
                  onChange={(e) => setIssueNumber(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bounty-amount">Bounty Amount (USD) *</Label>
              <Input
                id="bounty-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={bountyAmount}
                onChange={(e) => setBountyAmount(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {repository && issueNumber && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://github.com/${repository}/issues/${issueNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Issue #{issueNumber} on GitHub
                  </a>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Assigning..." : "Assign Bounty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

