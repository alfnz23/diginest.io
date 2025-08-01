"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DollarSign,
  TrendingUp,
  Download,
  CreditCard,
  Building,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface PayoutAccount {
  id: string;
  type: "bank" | "paypal";
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
  lastUsed?: string;
}

interface Transaction {
  id: string;
  type: "payout" | "payment";
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
  method: string;
  description: string;
}

export function PaymentCashout() {
  const [balance, setBalance] = useState({
    available: 2840.5,
    pending: 456.75,
    total: 3297.25,
  });

  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([
    {
      id: "1",
      type: "bank",
      name: "Primary Bank Account",
      details: "****1234 - Chase Bank",
      isDefault: true,
      isVerified: true,
      lastUsed: "2024-01-15",
    },
    {
      id: "2",
      type: "paypal",
      name: "PayPal Account",
      details: "admin@diginest.io",
      isDefault: false,
      isVerified: true,
      lastUsed: "2024-01-10",
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TXN001",
      type: "payout",
      amount: 1200.0,
      status: "completed",
      date: "2024-01-15",
      method: "Bank Transfer",
      description: "Weekly payout",
    },
    {
      id: "TXN002",
      type: "payment",
      amount: 29.99,
      status: "completed",
      date: "2024-01-15",
      method: "Stripe",
      description: "Digital Planner - Customer #1234",
    },
    {
      id: "TXN003",
      type: "payout",
      amount: 800.0,
      status: "pending",
      date: "2024-01-14",
      method: "PayPal",
      description: "Manual payout request",
    },
  ]);

  const [payoutAmount, setPayoutAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(payoutAccounts[0].id);
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);

  const handlePayout = async () => {
    const amount = Number.parseFloat(payoutAmount);
    if (amount <= 0 || amount > balance.available) return;

    const selectedAccountData = payoutAccounts.find(
      (acc) => acc.id === selectedAccount,
    );
    if (!selectedAccountData) return;

    // Create new transaction
    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: "payout",
      amount: amount,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      method: selectedAccountData.type === "bank" ? "Bank Transfer" : "PayPal",
      description: "Manual payout request",
    };

    setTransactions([newTransaction, ...transactions]);
    setBalance((prev) => ({
      ...prev,
      available: prev.available - amount,
      pending: prev.pending + amount,
    }));

    setPayoutAmount("");
    setIsPayoutDialogOpen(false);

    // Simulate processing
    if (typeof window !== "undefined") {
      setTimeout(() => {
        setTransactions((prev) =>
          prev.map((txn) =>
            txn.id === newTransaction.id
              ? { ...txn, status: "completed" as const }
              : txn,
          ),
        );
        setBalance((prev) => ({
          ...prev,
          pending: prev.pending - amount,
        }));
      }, 3000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${balance.available.toFixed(2)}
            </div>
            <p className="text-xs text-neutral-600">Ready for payout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${balance.pending.toFixed(2)}
            </div>
            <p className="text-xs text-neutral-600">Processing payouts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${balance.total.toFixed(2)}
            </div>
            <p className="text-xs text-neutral-600">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Request Payout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Payout</DialogTitle>
              <DialogDescription>
                Transfer available funds to your chosen account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                  max={balance.available}
                />
                <p className="text-xs text-neutral-600 mt-1">
                  Available: ${balance.available.toFixed(2)}
                </p>
              </div>

              <div>
                <Label htmlFor="account">Payout Account</Label>
                <select
                  id="account"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md"
                >
                  {payoutAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} - {account.details}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handlePayout}
                disabled={
                  !payoutAmount ||
                  Number.parseFloat(payoutAmount) <= 0 ||
                  Number.parseFloat(payoutAmount) > balance.available
                }
                className="w-full"
              >
                Confirm Payout
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Payout Accounts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your latest payments and payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-neutral-600">
                          {transaction.id} • {transaction.method} •{" "}
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${transaction.type === "payout" ? "text-red-600" : "text-green-600"}`}
                      >
                        {transaction.type === "payout" ? "-" : "+"}$
                        {transaction.amount.toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Accounts</CardTitle>
              <CardDescription>
                Manage your bank accounts and PayPal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payoutAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {account.type === "bank" ? (
                        <Building className="h-5 w-5 text-blue-600" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      )}
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-sm text-neutral-600">
                          {account.details}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {account.isDefault && <Badge>Default</Badge>}
                      {account.isVerified && (
                        <Badge className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add New Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout Schedule</CardTitle>
                <CardDescription>Automatic payout settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto Payouts</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Frequency</span>
                  <span className="text-sm text-neutral-600">Weekly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Minimum Amount</span>
                  <span className="text-sm text-neutral-600">$100.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next Payout</span>
                  <span className="text-sm text-neutral-600">
                    Monday, Jan 22
                  </span>
                </div>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Modify Schedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
                <CardDescription>January 2024 performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Sales</span>
                  <span className="font-medium text-green-600">$4,250.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform Fees</span>
                  <span className="font-medium text-red-600">-$127.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Processing Fees</span>
                  <span className="font-medium text-red-600">-$85.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between font-medium">
                    <span>Net Earnings</span>
                    <span className="text-green-600">$4,037.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PaymentCashout;
