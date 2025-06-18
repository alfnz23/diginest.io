"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCMS } from "@/components/ProductCMS";
import { PaymentCashout } from "@/components/PaymentCashout";
import {
  Upload,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Settings,
  CreditCard,
  BarChart3,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 18,
    totalRevenue: 45680.50,
    totalOrders: 342,
    totalCustomers: 156,
    monthlyGrowth: 12.5,
    recentOrders: [
      { id: 'order-001', customer: 'Sarah Chen', total: 74.99, status: 'completed', date: '2024-01-25' },
      { id: 'order-002', customer: 'Mike Rodriguez', total: 29.99, status: 'completed', date: '2024-01-25' },
      { id: 'order-003', customer: 'Emma Thompson', total: 45.98, status: 'processing', date: '2024-01-24' },
      { id: 'order-004', customer: 'David Kim', total: 22.99, status: 'completed', date: '2024-01-24' },
      { id: 'order-005', customer: 'Maria Santos', total: 34.99, status: 'completed', date: '2024-01-23' }
    ],
    topProducts: [
      { name: 'Minimalist Digital Planner', sales: 89, revenue: 2667.11 },
      { name: '12-Week Strength Training Program', sales: 76, revenue: 2659.24 },
      { name: 'Ultimate Calorie Tracking Spreadsheet', sales: 65, revenue: 1493.35 },
      { name: 'Self-Care Planner', sales: 54, revenue: 1349.46 }
    ]
  });

  const [stripeStats, setStripeStats] = useState({
    todayRevenue: 1234.56,
    weeklyRevenue: 8976.23,
    monthlyRevenue: 45680.50,
    successfulPayments: 98.5,
    failedPayments: 1.5,
    averageOrderValue: 33.45
  });

  // Payment Analytics Component
  const PaymentAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-neutral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stripeStats.todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-neutral-600">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-neutral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stripeStats.weeklyRevenue.toFixed(2)}</div>
            <p className="text-xs text-neutral-600">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-neutral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stripeStats.monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-neutral-600">+{dashboardStats.monthlyGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stripeStats.successfulPayments}%</div>
            <p className="text-xs text-neutral-600">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <CreditCard className="h-4 w-4 text-neutral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stripeStats.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-neutral-600">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stripeStats.failedPayments}%</div>
            <p className="text-xs text-neutral-600">-2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Integration Status</CardTitle>
          <CardDescription>Your payment processing setup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium">Stripe Account Connected</h3>
                <p className="text-sm text-neutral-600">Test mode active</p>
              </div>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium">Webhook Endpoints</h3>
                <p className="text-sm text-neutral-600">Payment events configured</p>
              </div>
            </div>
            <Badge variant="secondary">Configured</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="font-medium">Live Mode</h3>
                <p className="text-sm text-neutral-600">Switch to production when ready</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-neutral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
            <p className="text-xs text-neutral-600">+2 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-neutral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-neutral-600">+{dashboardStats.monthlyGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-neutral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-neutral-600">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-neutral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCustomers}</div>
            <p className="text-xs text-neutral-600">+23 this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-neutral-600">{order.id} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <Badge
                      variant={order.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing digital products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-sm text-neutral-600">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-neutral-900">
                DigiNest.io
              </Link>
              <Badge className="ml-3 bg-neutral-100 text-neutral-700">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Link href="/">Back to Store</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">Manage your digital products, payments, and monitor store performance</p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Product CMS</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductCMS />
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <PaymentCashout />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Configure your store preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Store Name</label>
                      <input
                        type="text"
                        defaultValue="DigiNest.io"
                        className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Currency</label>
                      <select className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md">
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>
                  </div>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
