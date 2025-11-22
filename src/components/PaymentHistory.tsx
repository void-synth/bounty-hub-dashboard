import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Payment, PaymentMethod } from "@/types";
import { CreditCard, Building2, Wallet, Coins, CheckCircle2, Clock, XCircle } from "lucide-react";

// Mock payment data - in real app, this would come from API
const mockPayments: Payment[] = [
  {
    id: "1",
    rewardId: "1",
    amount: 800,
    method: "stripe",
    status: "completed",
    initiatedAt: "2024-02-25T10:30:00Z",
    completedAt: "2024-02-25T10:35:00Z",
    transactionId: "txn_abc123",
  },
  {
    id: "2",
    rewardId: "2",
    amount: 300,
    method: "paypal",
    status: "processing",
    initiatedAt: "2024-03-10T14:20:00Z",
  },
];

const getPaymentMethodIcon = (method: PaymentMethod) => {
  switch (method) {
    case "stripe":
      return CreditCard;
    case "bank":
      return Building2;
    case "paypal":
      return Wallet;
    case "crypto":
      return Coins;
  }
};

const getPaymentStatusBadge = (status: Payment["status"]) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="h-3 w-3" />
          Processing
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="info" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
  }
};

export const PaymentHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>
          Track all your payment transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mockPayments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No payment history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockPayments.map((payment) => {
              const Icon = getPaymentMethodIcon(payment.method);
              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          ${payment.amount.toLocaleString()}
                        </p>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="capitalize">{payment.method}</span>
                        {payment.transactionId && (
                          <span>Transaction: {payment.transactionId}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Initiated: {new Date(payment.initiatedAt).toLocaleString()}
                        {payment.completedAt && (
                          <> • Completed: {new Date(payment.completedAt).toLocaleString()}</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

