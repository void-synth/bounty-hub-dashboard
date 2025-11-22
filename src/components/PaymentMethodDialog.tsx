import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethod } from "@/types";
import { CreditCard, Building2, Wallet, Coins } from "lucide-react";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  rewardId: string;
  onSuccess?: () => void;
}

const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard; description: string }[] = [
  { value: "stripe", label: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, Amex" },
  { value: "bank", label: "Bank Transfer", icon: Building2, description: "Direct bank transfer" },
  { value: "paypal", label: "PayPal", icon: Wallet, description: "PayPal account" },
  { value: "crypto", label: "Cryptocurrency", icon: Coins, description: "USDC, USDT, ETH" },
];

export const PaymentMethodDialog = ({
  open,
  onOpenChange,
  amount,
  rewardId,
  onSuccess,
}: PaymentMethodDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("stripe");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    // Mock payment initiation - in real app, this would call backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Payment initiated!",
      description: `$${amount.toLocaleString()} payment via ${paymentMethods.find(m => m.value === selectedMethod)?.label} is being processed`,
    });

    setIsLoading(false);
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
          <DialogDescription>
            Choose how you'd like to receive your reward of ${amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.value} className="flex items-start space-x-3 space-y-0 rounded-md border p-4 mb-2 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={method.value} id={method.value} className="mt-1" />
                  <Label
                    htmlFor={method.value}
                    className="flex-1 cursor-pointer space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{method.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Processing..." : "Initiate Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

