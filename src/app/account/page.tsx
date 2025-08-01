"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCartTrigger } from "@/components/ShoppingCart";
import { UserMenu } from "@/components/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  Download,
  ArrowLeft,
  Edit,
  Calendar,
  CreditCard,
  User,
  Package,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Mock purchase data
const mockPurchases = [
  {
    id: "order-001",
    date: "2024-01-20",
    total: 74.97,
    status: "completed",
    items: [
      {
        id: "product-1",
        name: "Minimalist Digital Planner",
        price: 29.99,
        image:
          "https://ugc.same-assets.com/6jd4GpTcWCFWWhsxvoEQ6FImxgcD9bcY.jpeg",
        downloadUrl: "/downloads/planner.zip",
        downloaded: true,
      },
      {
        id: "product-10",
        name: "12-Week Strength Training Program",
        price: 34.99,
        image: "https://ugc.same-assets.com/strength-training.jpeg",
        downloadUrl: "/downloads/strength-program.pdf",
        downloaded: false,
      },
      {
        id: "product-9",
        name: "Ultimate Calorie Tracking Spreadsheet",
        price: 22.99,
        image: "https://ugc.same-assets.com/nutrition-tracker.jpeg",
        downloadUrl: "/downloads/calorie-tracker.xlsx",
        downloaded: true,
      },
    ],
  },
  {
    id: "order-002",
    date: "2024-01-15",
    total: 45.98,
    status: "completed",
    items: [
      {
        id: "product-2",
        name: "The Productivity Handbook",
        price: 19.99,
        image:
          "https://ugc.same-assets.com/80xGSN9gA5ZZ-dQBQi4Iy2W53I-QTr6V.jpeg",
        downloadUrl: "/downloads/productivity-handbook.pdf",
        downloaded: true,
      },
      {
        id: "product-3",
        name: "Self-Care Planner",
        price: 24.99,
        image:
          "https://ugc.same-assets.com/POO9DdqexdiqS1yMBbpcyyty8PFkD3rG.jpeg",
        downloadUrl: "/downloads/self-care-planner.zip",
        downloaded: true,
      },
    ],
  },
];

export default function AccountPage() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Please Sign In
          </h1>
          <p className="text-neutral-600 mb-6">
            You need to be logged in to access your account.
          </p>
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = () => {
    updateUser(profileData);
    setIsEditing(false);
  };

  const totalSpent = mockPurchases.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = mockPurchases.reduce(
    (sum, order) => sum + order.items.length,
    0,
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-neutral-900">
                DigiNest.io
              </Link>
              <Link
                href="/"
                className="flex items-center text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Store
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingCartTrigger />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">
            My Account
          </h1>
          <p className="text-neutral-600">
            Manage your profile, downloads, and purchase history
          </p>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-neutral-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-neutral-600">
                Across {mockPurchases.length} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Products Owned
              </CardTitle>
              <Package className="h-4 w-4 text-neutral-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-neutral-600">Digital products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Member Since
              </CardTitle>
              <Calendar className="h-4 w-4 text-neutral-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Jan 2024</div>
              <p className="text-xs text-neutral-600">Premium customer</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="purchases" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="purchases">Purchase History</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="mt-8">
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-neutral-900">
                Purchase History
              </h2>

              {mockPurchases.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id}
                        </CardTitle>
                        <CardDescription>
                          Purchased on{" "}
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium">
                          ${order.total.toFixed(2)}
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
                        >
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-neutral-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.downloaded && (
                              <Badge
                                variant="secondary"
                                className="text-green-600"
                              >
                                Downloaded
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              className="bg-neutral-900 hover:bg-neutral-800"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="mt-8">
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-neutral-900">
                My Downloads
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPurchases
                  .flatMap((order) => order.items)
                  .map((item) => (
                    <Card
                      key={item.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.downloaded && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Downloaded
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium line-clamp-1">
                          {item.name}
                        </CardTitle>
                        <CardDescription>
                          ${item.price.toFixed(2)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-neutral-900 hover:bg-neutral-800">
                          <Download className="h-4 w-4 mr-2" />
                          Download Again
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-8">
            <div className="max-w-2xl">
              <h2 className="text-xl font-medium text-neutral-900 mb-6">
                Profile Settings
              </h2>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-neutral-600">{user.email}</p>
                      {user.isAdmin && <Badge className="mt-1">Admin</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleProfileUpdate}
                          className="bg-neutral-900 hover:bg-neutral-800"
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-neutral-600">
                          Update your personal information and preferences
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  )}

                  <div className="pt-6 border-t">
                    <h4 className="font-medium text-neutral-900 mb-4">
                      Account Actions
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All Purchases
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
