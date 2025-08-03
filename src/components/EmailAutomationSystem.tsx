"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Send,
  Clock,
  Users,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Target,
  Zap,
  Settings,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Mock data for email campaigns
const mockCampaigns = [
  {
    id: "camp_001",
    name: "Welcome Series",
    type: "automated",
    status: "active",
    trigger: "user_signup",
    emails: 3,
    subscribers: 1247,
    sent: 3621,
    opens: 1894,
    clicks: 287,
    conversions: 45,
    revenue: 1350.75,
    createdAt: "2024-01-15"
  },
  {
    id: "camp_002",
    name: "Abandoned Cart Recovery",
    type: "automated",
    status: "active",
    trigger: "cart_abandoned",
    emails: 2,
    subscribers: 892,
    sent: 1784,
    opens: 1068,
    clicks: 231,
    conversions: 67,
    revenue: 2010.50,
    createdAt: "2024-01-10"
  },
  {
    id: "camp_003",
    name: "Post-Purchase Follow-up",
    type: "automated",
    status: "active",
    trigger: "purchase_complete",
    emails: 4,
    subscribers: 567,
    sent: 2268,
    opens: 1588,
    clicks: 445,
    conversions: 89,
    revenue: 2670.25,
    createdAt: "2024-01-05"
  },
  {
    id: "camp_004",
    name: "Monthly Newsletter",
    type: "broadcast",
    status: "draft",
    trigger: "manual",
    emails: 1,
    subscribers: 2156,
    sent: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    createdAt: "2024-01-20"
  }
];

const emailTemplates = [
  {
    id: "tpl_welcome",
    name: "Welcome Email",
    type: "welcome",
    subject: "Welcome to DigiNest.io! 🎉",
    preview: "Thanks for joining our community of digital creators..."
  },
  {
    id: "tpl_cart",
    name: "Abandoned Cart",
    type: "cart_recovery",
    subject: "Don't forget your digital products 🛒",
    preview: "You left some amazing products in your cart..."
  },
  {
    id: "tpl_purchase",
    name: "Purchase Confirmation",
    type: "transaction",
    subject: "Your order is ready for download! ⬇️",
    preview: "Thank you for your purchase. Your digital products are ready..."
  },
  {
    id: "tpl_refund",
    name: "Refund Notification",
    type: "refund",
    subject: "Refund processed for your order",
    preview: "Your refund request has been processed..."
  }
];

const audienceSegments = [
  { id: "all", name: "All Subscribers", count: 2156, description: "All email subscribers" },
  { id: "customers", name: "Customers", count: 892, description: "Users who made a purchase" },
  { id: "prospects", name: "Prospects", count: 1264, description: "Subscribers who haven't purchased" },
  { id: "vip", name: "VIP Customers", count: 145, description: "High-value customers (3+ purchases)" },
  { id: "recent", name: "Recent Signups", count: 234, description: "Signed up in last 30 days" }
];

interface EmailAutomationSystemProps {
  onCampaignCreate?: (campaign: any) => void;
  onCampaignUpdate?: (id: string, updates: any) => void;
}

export default function EmailAutomationSystem({
  onCampaignCreate,
  onCampaignUpdate
}: EmailAutomationSystemProps) {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatPercentage = (value: number, total: number) =>
    total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'automated': return <Zap className="h-4 w-4" />;
      case 'broadcast': return <Mail className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const calculateOverallStats = () => {
    const totals = campaigns.reduce((acc, campaign) => ({
      sent: acc.sent + campaign.sent,
      opens: acc.opens + campaign.opens,
      clicks: acc.clicks + campaign.clicks,
      conversions: acc.conversions + campaign.conversions,
      revenue: acc.revenue + campaign.revenue
    }), { sent: 0, opens: 0, clicks: 0, conversions: 0, revenue: 0 });

    return {
      ...totals,
      openRate: formatPercentage(totals.opens, totals.sent),
      clickRate: formatPercentage(totals.clicks, totals.sent),
      conversionRate: formatPercentage(totals.conversions, totals.sent)
    };
  };

  const overallStats = calculateOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Automation</h1>
          <p className="text-gray-600">Manage automated campaigns and email marketing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Email Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new automated email campaign or broadcast
                </DialogDescription>
              </DialogHeader>
              <CreateCampaignForm onClose={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.sent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.openRate}</div>
            <p className="text-xs text-muted-foreground">{overallStats.opens.toLocaleString()} opens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.clickRate}</div>
            <p className="text-xs text-muted-foreground">{overallStats.clicks.toLocaleString()} clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.conversionRate}</div>
            <p className="text-xs text-muted-foreground">{overallStats.conversions} conversions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overallStats.revenue)}</div>
            <p className="text-xs text-muted-foreground">From email campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(campaign.type)}
                        <div>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <p className="text-sm text-gray-500">
                            {campaign.type} • {campaign.emails} email{campaign.emails !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Subscribers</p>
                      <p className="font-semibold">{campaign.subscribers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sent</p>
                      <p className="font-semibold">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Open Rate</p>
                      <p className="font-semibold">{formatPercentage(campaign.opens, campaign.sent)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Click Rate</p>
                      <p className="font-semibold">{formatPercentage(campaign.clicks, campaign.sent)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversions</p>
                      <p className="font-semibold">{campaign.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="font-semibold">{formatCurrency(campaign.revenue)}</p>
                    </div>
                  </div>

                  {campaign.type === 'automated' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <Zap className="h-4 w-4 inline mr-1" />
                        Automated trigger: {campaign.trigger.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Email Templates</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">{template.subject}</p>
                    <p className="text-sm text-gray-500">{template.preview}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Audience Segments</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Segment
            </Button>
          </div>

          <div className="grid gap-4">
            {audienceSegments.map((segment) => (
              <Card key={segment.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{segment.name}</h3>
                      <p className="text-sm text-gray-500">{segment.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{segment.count.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">subscribers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Service Configuration</CardTitle>
              <CardDescription>Configure your email service provider settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email Service Provider</Label>
                  <Select defaultValue="sendgrid">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="smtp">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>From Email</Label>
                  <Input placeholder="noreply@diginest.io" />
                </div>
                <div>
                  <Label>From Name</Label>
                  <Input placeholder="DigiNest.io" />
                </div>
                <div>
                  <Label>Reply-To Email</Label>
                  <Input placeholder="support@diginest.io" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Automation Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Welcome email delay</span>
                    <Select defaultValue="immediate">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="1hour">1 hour</SelectItem>
                        <SelectItem value="1day">1 day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Abandoned cart delay</span>
                    <Select defaultValue="1hour">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="1hour">1 hour</SelectItem>
                        <SelectItem value="6hours">6 hours</SelectItem>
                        <SelectItem value="1day">1 day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateCampaignForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'automated',
    trigger: '',
    audience: 'all',
    subject: '',
    content: ''
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Campaign Name</Label>
          <Input
            placeholder="Enter campaign name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <Label>Campaign Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automated">Automated</SelectItem>
              <SelectItem value="broadcast">Broadcast</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.type === 'automated' && (
        <div>
          <Label>Trigger Event</Label>
          <Select value={formData.trigger} onValueChange={(value) => setFormData(prev => ({ ...prev, trigger: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select trigger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user_signup">User Signup</SelectItem>
              <SelectItem value="cart_abandoned">Cart Abandoned</SelectItem>
              <SelectItem value="purchase_complete">Purchase Complete</SelectItem>
              <SelectItem value="refund_processed">Refund Processed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Target Audience</Label>
        <Select value={formData.audience} onValueChange={(value) => setFormData(prev => ({ ...prev, audience: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subscribers</SelectItem>
            <SelectItem value="customers">Customers</SelectItem>
            <SelectItem value="prospects">Prospects</SelectItem>
            <SelectItem value="vip">VIP Customers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Email Subject</Label>
        <Input
          placeholder="Enter email subject"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
        />
      </div>

      <div>
        <Label>Email Content</Label>
        <Textarea
          placeholder="Enter email content..."
          rows={6}
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button>Create Campaign</Button>
      </div>
    </div>
  );
}
