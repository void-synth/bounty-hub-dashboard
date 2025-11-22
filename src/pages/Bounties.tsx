import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { mockIssues } from "@/lib/mockData";
import { Search, ExternalLink } from "lucide-react";
import { useState } from "react";

const Bounties = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIssues = mockIssues.filter(issue =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.repository.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Bounties</h1>
          <p className="text-muted-foreground mt-2">
            Browse and claim available bounties
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bounties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={issue.status} type="issue" />
                      <span className="text-sm text-muted-foreground">
                        #{issue.number}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {issue.repository}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{issue.title}</CardTitle>
                    <CardDescription className="text-base">
                      {issue.description}
                    </CardDescription>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-3xl font-bold text-success mb-2">
                      ${issue.bountyAmount}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        className="gap-2"
                        disabled={issue.status !== "open"}
                        asChild
                      >
                        <a
                          href={`https://github.com/${issue.repository}/issues/${issue.number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {issue.status === "open" ? (
                            <>
                              View Issue
                              <ExternalLink className="h-4 w-4" />
                            </>
                          ) : (
                            "Assigned"
                          )}
                        </a>
                      </Button>
                      {issue.status === "open" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          asChild
                        >
                          <a
                            href={`https://github.com/${issue.repository}/issues/${issue.number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Submit PR
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Created {new Date(issue.createdAt).toLocaleDateString()}</span>
                  {issue.assignedTo && (
                    <span>Assigned to @{issue.assignedTo}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Bounties;
