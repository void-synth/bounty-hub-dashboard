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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Github, RefreshCw, Plus, X } from "lucide-react";
import { Repository } from "@/types";

// Mock repositories - in real app, this would come from API
const mockRepositories: Repository[] = [
  {
    id: "1",
    name: "dashboard",
    fullName: "acme/dashboard",
    owner: "acme",
    url: "https://github.com/acme/dashboard",
    isActive: true,
    lastSyncedAt: "2024-03-10T10:30:00Z",
  },
  {
    id: "2",
    name: "auth-service",
    fullName: "acme/auth-service",
    owner: "acme",
    url: "https://github.com/acme/auth-service",
    isActive: true,
    lastSyncedAt: "2024-03-10T09:15:00Z",
  },
];

export const GitHubSyncDialog = () => {
  const [open, setOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>(mockRepositories);
  const [newRepo, setNewRepo] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleAddRepository = () => {
    if (!newRepo.trim()) return;

    const repoMatch = newRepo.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!repoMatch) {
      toast({
        title: "Invalid repository URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    const newRepository: Repository = {
      id: Date.now().toString(),
      name: repoMatch[2],
      fullName: `${repoMatch[1]}/${repoMatch[2]}`,
      owner: repoMatch[1],
      url: newRepo,
      isActive: true,
    };

    setRepositories([...repositories, newRepository]);
    setNewRepo("");
    toast({
      title: "Repository added",
      description: `${newRepository.fullName} has been added`,
    });
  };

  const handleRemoveRepository = (id: string) => {
    setRepositories(repositories.filter((r) => r.id !== id));
    toast({
      title: "Repository removed",
      description: "Repository has been removed from sync list",
    });
  };

  const handleSync = async (repoId?: string) => {
    setIsSyncing(true);
    // Mock sync - in real app, this would call backend
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (repoId) {
      setRepositories(
        repositories.map((r) =>
          r.id === repoId
            ? { ...r, lastSyncedAt: new Date().toISOString() }
            : r
        )
      );
      toast({
        title: "Sync completed",
        description: "Issues and PRs have been updated",
      });
    } else {
      setRepositories(
        repositories.map((r) => ({
          ...r,
          lastSyncedAt: new Date().toISOString(),
        }))
      );
      toast({
        title: "All repositories synced",
        description: "All issues and PRs have been updated",
      });
    }

    setIsSyncing(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Github className="h-4 w-4" />
          Manage GitHub Sync
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>GitHub Repository Sync</DialogTitle>
          <DialogDescription>
            Manage repositories and sync issues/PRs from GitHub
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Add Repository</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://github.com/owner/repo"
                value={newRepo}
                onChange={(e) => setNewRepo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddRepository()}
              />
              <Button onClick={handleAddRepository} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Active Repositories</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSync()}
                disabled={isSyncing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                Sync All
              </Button>
            </div>
            <div className="space-y-2">
              {repositories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No repositories added. Add one above to get started.
                </p>
              ) : (
                repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline"
                        >
                          {repo.fullName}
                        </a>
                        {repo.isActive && (
                          <Badge variant="success" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      {repo.lastSyncedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last synced: {new Date(repo.lastSyncedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSync(repo.id)}
                        disabled={isSyncing}
                      >
                        <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRepository(repo.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

