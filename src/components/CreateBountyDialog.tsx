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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Plus, ExternalLink, Github } from "lucide-react";

interface CreateBountyDialogProps {
  onSuccess?: () => void;
}

export const CreateBountyDialog = ({ onSuccess }: CreateBountyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [bountyType, setBountyType] = useState<"new" | "existing">("new");
  const [repository, setRepository] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bountyAmount, setBountyAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!repository || !bountyAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (bountyType === "new" && (!title || !description)) {
      toast({
        title: "Missing information",
        description: "Title and description are required for new issues",
        variant: "destructive",
      });
      return;
    }

    if (bountyType === "existing" && !issueNumber) {
      toast({
        title: "Missing information",
        description: "Issue number is required for existing issues",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(bountyAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bounty amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Mock API call - in real app, this would:
    // 1. Create GitHub issue if bountyType === "new"
    // 2. Link to existing issue if bountyType === "existing"
    // 3. Create bounty in the system
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const action = bountyType === "new" ? "created" : "linked";
    toast({
      title: "Bounty created successfully!",
      description: `$${numAmount.toLocaleString()} bounty ${action} for ${repository}${issueNumber ? `#${issueNumber}` : ""}`,
    });

    // Reset form
    setBountyType("new");
    setRepository("");
    setIssueNumber("");
    setTitle("");
    setDescription("");
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
      setBountyType("existing");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Bounty
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Bounty</DialogTitle>
            <DialogDescription>
              Create a new bounty by either creating a new GitHub issue or linking to an existing one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Bounty Type</Label>
              <RadioGroup
                value={bountyType}
                onValueChange={(value) => setBountyType(value as "new" | "existing")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new" className="cursor-pointer font-normal">
                    Create New Issue
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing" className="cursor-pointer font-normal">
                    Link Existing Issue
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Issue URL (Optional - Auto-fills fields)</Label>
              <Input
                id="github-url"
                type="url"
                placeholder="https://github.com/owner/repo/issues/123"
                onChange={(e) => parseGitHubUrl(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Paste a GitHub issue URL to auto-fill repository and issue number
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

              {bountyType === "existing" && (
                <div className="space-y-2">
                  <Label htmlFor="issue-number">Issue Number *</Label>
                  <Input
                    id="issue-number"
                    type="number"
                    placeholder="123"
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(e.target.value)}
                    disabled={isLoading}
                    required={bountyType === "existing"}
                  />
                </div>
              )}
            </div>

            {bountyType === "new" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Add dark mode support"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                    required={bountyType === "new"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Issue Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what needs to be done..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    rows={4}
                    required={bountyType === "new"}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used as the GitHub issue description
                  </p>
                </div>
              </>
            )}

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
              <p className="text-xs text-muted-foreground">
                Minimum amount: $1.00
              </p>
            </div>

            {repository && (bountyType === "existing" ? issueNumber : title) && (
              <div className="rounded-lg border p-4 bg-muted/50 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Github className="h-4 w-4" />
                  Preview
                </div>
                {bountyType === "existing" && issueNumber && (
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
                )}
                {bountyType === "new" && (
                  <div className="text-sm text-muted-foreground">
                    A new issue will be created in {repository} with the title: "{title}"
                  </div>
                )}
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
              {isLoading ? "Creating..." : bountyType === "new" ? "Create Issue & Bounty" : "Create Bounty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

