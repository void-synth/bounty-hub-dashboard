import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StatusRefreshButtonProps {
  onRefresh?: () => Promise<void>;
  label?: string;
}

export const StatusRefreshButton = ({ onRefresh, label = "Refresh Status" }: StatusRefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        // Mock refresh - in real app, this would call backend
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      toast({
        title: "Status updated",
        description: "Issues and PRs have been refreshed",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {label}
    </Button>
  );
};

