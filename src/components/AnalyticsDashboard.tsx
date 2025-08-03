"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Calendar,
  Target,
  Award,
  Activity,
  Eye,
  MousePointer,
  CreditCard,
  Package,
  Globe,
  Smartphone,
  Monitor,
  AlertCircle
} from "lucide-react";

// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalRevenue: 45832.50,
    totalOrders: 1247,
    totalCustomers: 892,
    conversionRate: 3.4,
    averageOrderValue: 36.75,
    refundRate: 2.1,
    revenueGrowth: 15.3,
    orderGrowth: 12.8,
    customerGrowth: 18.9,
    conversionGrowth: -0.3
  },
  revenueData: [
    { date: '2024-01-01', revenue: 2400, orders: 65, customers: 45 },
    { date: '2024-01-02', revenue: 1398, orders: 42, customers: 35 },
    { date: '2024-01-03', revenue: 9800, orders: 128, customers: 89 },
    { date: '2024-01-04', revenue: 3908, orders: 89, customers: 67 },
    { date: '2024-01-05', revenue: 4800, orders: 95, customers: 72 },
    { date: '2024-01-06', revenue: 3800, orders: 78, customers: 58 },
    { date: '2024-01-07', revenue: 4300, orders: 86, customers: 64 }
  ],
  topProducts: [
    { name: 'Digital Marketing Toolkit', sales: 156, revenue: 4680, category: 'templates' },
    { name: 'Minimalist Digital Planner', sales: 134, revenue: 4019, category: 'planners' },
    { name: 'Logo Design Kit', sales: 98, revenue: 4508, category: 'tools' },
    { name: 'Yoga Flow Sequences', sales: 87, revenue: 2348, category: 'fitness' },
    { name: 'Business Plan Template', sales: 76, revenue: 1520, category: 'templates' }
  ],
  categoryData: [
    { name: 'Templates', value: 35, revenue: 12450 },
    { name: 'Planners', value: 28, revenue: 9830 },
    { name: 'eBooks', value: 20, revenue: 7200 },
    { name: 'Tools', value: 12, revenue: 5890 },
    { name: 'Fitness', value: 5, revenue: 2340 }
  ],
  trafficSources: [
    { source: 'Organic Search', sessions: 3421, conversion: 4.2, revenue: 15680 },
    { source: 'Direct', sessions: 2156, conversion: 5.8, revenue: 12450 },
    { source: 'Social Media', sessions: 1845, conversion: 2.1, revenue: 3890 },
    { source: 'Email', sessions: 987, conversion: 8.9, revenue: 8760 },
    { source: 'Paid Ads', sessions: 756, conversion: 6.3, revenue: 4750 }
  ],
  deviceData: [
    { device: 'Desktop', sessions: 4523, conversion: 4.8, revenue: 18920 },
    { device: 'Mobile', sessions: 3892, conversion: 3.1, revenue: 12090 },
    { device: 'Tablet', sessions: 750, conversion: 2.9, revenue: 2180 }
  ],
  customerBehavior: {
    bounceRate: 45.2,
    avgSessionDuration: '3:24',
    pagesPerSession: 4.2,
    newVsReturning: { new: 68, returning: 32 },
    topPages: [
      { page: '/products', views: 8924, bounceRate: 42.1 },
      { page: '/', views: 6721, bounceRate: 38.5 },
      { page: '/checkout', views: 2341, bounceRate: 15.2 },
      { page: '/products/templates', views: 1876, bounceRate: 51.3 }
    ]
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface AnalyticsDashboardProps {
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export default function AnalyticsDashboard({
  timeRange = "7d",
  onTimeRangeChange
}: AnalyticsDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(mockAnalyticsData);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(mockAnalyticsData);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat('en-US').format(num);

  const formatPercentage = (num: number) =>
    `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;

  const getGrowthIcon = (growth: number) =>
    growth >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;

  const getGrowthColor = (growth: number) =>
    growth >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive business intelligence and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</div>
                <div className="flex items-center text-xs">
                  {getGrowthIcon(data.overview.revenueGrowth)}
                  <span className={`ml-1 ${getGrowthColor(data.overview.revenueGrowth)}`}>
                    {formatPercentage(data.overview.revenueGrowth)} from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overview.totalOrders)}</div>
                <div className="flex items-center text-xs">
                  {getGrowthIcon(data.overview.orderGrowth)}
                  <span className={`ml-1 ${getGrowthColor(data.overview.orderGrowth)}`}>
                    {formatPercentage(data.overview.orderGrowth)} from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overview.totalCustomers)}</div>
                <div className="flex items-center text-xs">
                  {getGrowthIcon(data.overview.customerGrowth)}
                  <span className={`ml-1 ${getGrowthColor(data.overview.customerGrowth)}`}>
                    {formatPercentage(data.overview.customerGrowth)} from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.conversionRate}%</div>
                <div className="flex items-center text-xs">
                  {getGrowthIcon(data.overview.conversionGrowth)}
                  <span className={`ml-1 ${getGrowthColor(data.overview.conversionGrowth)}`}>
                    {formatPercentage(data.overview.conversionGrowth)} from last period
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value as number) : value,
                      name
                    ]}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(product.revenue)}</p>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.overview.averageOrderValue)}</div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.refundRate}%</div>
                <p className="text-xs text-muted-foreground">Of total orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Revenue per Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.overview.totalRevenue / data.overview.totalCustomers)}
                </div>
                <p className="text-xs text-muted-foreground">Lifetime value</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value as number) : value,
                      name
                    ]}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topProducts.map((product, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{product.name}</h4>
                        <Badge>{product.category}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Sales</p>
                          <p className="font-medium">{product.sales} units</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Revenue</p>
                          <p className="font-medium">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customerBehavior.bounceRate}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customerBehavior.avgSessionDuration}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Pages/Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customerBehavior.pagesPerSession}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">New vs Returning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>New: {data.customerBehavior.newVsReturning.new}%</p>
                  <p>Returning: {data.customerBehavior.newVsReturning.returning}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.deviceData.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {device.device === 'Desktop' && <Monitor className="h-5 w-5" />}
                      {device.device === 'Mobile' && <Smartphone className="h-5 w-5" />}
                      {device.device === 'Tablet' && <Smartphone className="h-5 w-5" />}
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatNumber(device.sessions)} sessions</p>
                      <p className="text-sm text-gray-500">{device.conversion}% conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{source.source}</h4>
                      <p className="text-sm text-gray-500">{formatNumber(source.sessions)} sessions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(source.revenue)}</p>
                      <p className="text-sm text-gray-500">{source.conversion}% conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Landing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.customerBehavior.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{page.page}</h4>
                      <p className="text-sm text-gray-500">{formatNumber(page.views)} views</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{page.bounceRate}%</p>
                      <p className="text-sm text-gray-500">bounce rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
