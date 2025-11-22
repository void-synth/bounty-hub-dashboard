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
import { Wallet } from "lucide-react";

interface AddFundsDialogProps {
  onSuccess?: () => void;
}

export const AddFundsDialog = ({ onSuccess }: AddFundsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Mock API call - in real app, this would call backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Funds added successfully!",
      description: `$${numAmount.toLocaleString()} has been added to the funding pool`,
    });

    setAmount("");
    setOpen(false);
    onSuccess?.();
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          Add Funds
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Funds to Pool</DialogTitle>
            <DialogDescription>
              Contribute to the funding pool to support open source bounties
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum amount: $1.00
              </p>
            </div>
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing fee:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-sm mt-2 font-medium">
                <span>Total:</span>
                <span>${amount ? parseFloat(amount).toLocaleString() : "0.00"}</span>
              </div>
            </div>
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
              {isLoading ? "Processing..." : "Add Funds"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

