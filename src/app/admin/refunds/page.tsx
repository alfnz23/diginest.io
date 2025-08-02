"use client";

import { useState, useEffect } from "react";
import { AdminProtection } from "@/components/AdminProtection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Download,
  Database,
  TestTube,
  FileText
} from "lucide-react";
import RefundRequestForm from "@/components/RefundRequestForm";
import ProductAccessTracker from "@/components/ProductAccessTracker";
import RefundPolicyNotice from "@/components/RefundPolicyNotice";
import { AdminStatusBadge } from "@/components/AdminProtection";
import Link from "next/link";

interface MockRefundRequest {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  customerEmail: string;
  reason: string;
  amount: number;
  status: 'pending' | 'approved' | 'denied' | 'processed';
  requestedAt: Date;
  processedAt?: Date;
}

export default function RefundManagementPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mockRefunds, setMockRefunds] = useState<MockRefundRequest[]>([]);
  const [testOrderId, setTestOrderId] = useState("order_demo_123");
  const [testProductId, setTestProductId] = useState("prod_demo_456");

  useEffect(() => {
    // Load mock refund data
    setMockRefunds([
      {
        id: "ref_001",
        orderId: "order_demo_123",
        productId: "prod_demo_456",
        productName: "Digital Marketing Toolkit",
        customerEmail: "customer@example.com",
        reason: "Product does not match description",
        amount: 29.99,
        status: "pending",
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: "ref_002",
        orderId: "order_demo_124",
        productId: "prod_demo_457",
        productName: "Business Plan Template",
        customerEmail: "user@example.com",
        reason: "Changed my mind",
        amount: 19.99,
        status: "approved",
        requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        processedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]);
  }, []);

  const handleUpdateRefundStatus = async (refundId: string, newStatus: string) => {
    setMockRefunds(prev => prev.map(refund =>
      refund.id === refundId
        ? { ...refund, status: newStatus as any, processedAt: new Date() }
        : refund
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          Denied
        </Badge>;
      case 'processed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
          <DollarSign className="h-3 w-3 mr-1" />
          Processed
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AdminProtection>
      <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-2xl font-bold text-neutral-900">
                DigiNest.io Admin
              </Link>
              <AdminStatusBadge />
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Refund Management
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Back to Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Refund Policy Management
          </h1>
          <p className="text-neutral-600">
            Manage refund requests, test the refund system, and configure policy settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Refund Requests</TabsTrigger>
            <TabsTrigger value="testing">Testing Tools</TabsTrigger>
            <TabsTrigger value="policy">Policy Display</TabsTrigger>
            <TabsTrigger value="database">Database Setup</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockRefunds.length}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockRefunds.filter(r => r.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockRefunds.filter(r => r.status === 'approved').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Ready for processing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${mockRefunds.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Requested refunds</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Refund Policy Implementation Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">✅ Implemented Features</h4>
                    <ul className="text-sm space-y-1 text-green-700">
                      <li>• Access tracking API endpoints</li>
                      <li>• Refund request system</li>
                      <li>• Policy notices in checkout</li>
                      <li>• Updated Terms & Conditions</li>
                      <li>• Admin management interface</li>
                      <li>• Automatic eligibility checking</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">⚠️ Next Steps</h4>
                    <ul className="text-sm space-y-1 text-orange-700">
                      <li>• Configure database with provided schema</li>
                      <li>• Integrate with payment processor refunds</li>
                      <li>• Set up email notifications</li>
                      <li>• Add to product download pages</li>
                      <li>• Test with real orders</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Refund Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Refund Requests Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review and process customer refund requests
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRefunds.map((refund) => (
                    <div key={refund.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{refund.productName}</h4>
                          <p className="text-sm text-gray-600">
                            Order: {refund.orderId} • Customer: {refund.customerEmail}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(refund.status)}
                          <span className="text-lg font-bold">${refund.amount}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 mb-3">
                        <p><strong>Reason:</strong> {refund.reason}</p>
                        <p><strong>Requested:</strong> {refund.requestedAt.toLocaleString()}</p>
                        {refund.processedAt && (
                          <p><strong>Processed:</strong> {refund.processedAt.toLocaleString()}</p>
                        )}
                      </div>

                      {refund.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateRefundStatus(refund.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateRefundStatus(refund.id, 'denied')}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Deny
                          </Button>
                        </div>
                      )}

                      {refund.status === 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateRefundStatus(refund.id, 'processed')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Mark as Processed
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tools Tab */}
          <TabsContent value="testing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Test Refund Request
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Simulate a customer refund request
                  </p>
                </CardHeader>
                <CardContent>
                  <RefundRequestForm
                    orderId={testOrderId}
                    productId={testProductId}
                    productName="Test Digital Product"
                    purchaseAmount={29.99}
                    customerEmail="test@example.com"
                    onSuccess={(refundId) => alert(`Refund request created: ${refundId}`)}
                    onError={(error) => alert(`Error: ${error}`)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Test Product Access
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Simulate product download/access tracking
                  </p>
                </CardHeader>
                <CardContent>
                  <ProductAccessTracker
                    orderId={testOrderId}
                    productId={testProductId}
                    productName="Test Digital Product"
                    downloadUrl="https://example.com/download/test.zip"
                    previewUrl="https://example.com/preview/test"
                    customerEmail="test@example.com"
                    refundEligible={true}
                    timeRemainingForRefund={22.5}
                    onAccess={(type) => console.log(`Access tracked: ${type}`)}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Test Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testOrderId">Test Order ID</Label>
                    <Input
                      id="testOrderId"
                      value={testOrderId}
                      onChange={(e) => setTestOrderId(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="testProductId">Test Product ID</Label>
                    <Input
                      id="testProductId"
                      value={testProductId}
                      onChange={(e) => setTestProductId(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policy Display Tab */}
          <TabsContent value="policy" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Refund Policy Components</h3>

              <Card>
                <CardHeader>
                  <CardTitle>Checkout Notice</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    This appears during the checkout process
                  </p>
                </CardHeader>
                <CardContent>
                  <RefundPolicyNotice variant="checkout" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Confirmation Notice</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    This appears after successful purchase
                  </p>
                </CardHeader>
                <CardContent>
                  <RefundPolicyNotice
                    variant="order-confirmation"
                    refundEligible={true}
                    timeRemaining={23.5}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Full Policy Display</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Complete policy as shown in Terms & Conditions
                  </p>
                </CardHeader>
                <CardContent>
                  <RefundPolicyNotice variant="full-policy" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Database Setup Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Schema Setup
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  SQL schema for refund policy tracking
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                  <pre>{`-- Product Access Tracking Table
CREATE TABLE IF NOT EXISTS product_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  customer_id TEXT,
  customer_email TEXT NOT NULL,
  accessed_at TIMESTAMP,
  downloaded_at TIMESTAMP,
  refund_eligible BOOLEAN DEFAULT true,
  refund_requested_at TIMESTAMP,
  refund_status TEXT DEFAULT 'none',
  refund_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Refund Requests Table
CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  customer_id TEXT,
  customer_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  requested_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  denial_reason TEXT,
  processed_at TIMESTAMP,
  refund_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_access_order_id ON product_access(order_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_order_id ON refund_requests(order_id);`}</pre>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Copy the SQL schema above</li>
                    <li>2. Run it in your Supabase SQL editor</li>
                    <li>3. Update environment variables if needed</li>
                    <li>4. Test the API endpoints</li>
                    <li>5. Integrate with your payment processor</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AdminProtection>
  );
}
