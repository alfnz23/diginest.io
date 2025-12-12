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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCartTrigger } from "@/components/ShoppingCart";
import { UserMenu } from "@/components/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { getDatabase } from "@/lib/database"; // ✅ Používáme existující database.ts
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
  Loader2,
} from "lucide-react";
import Link from "next/link";

// ✅ Typy pro reálná data
interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: {
    id: string;
    name: string;
    image_url: string;
    download_url?: string;
  };
}

interface UserOrder {
  id: string;
  created_at: string;
  total: number;
  status: string;
  order_items: OrderItem[];
}

export default function AccountPage() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userPurchases, setUserPurchases] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // ✅ Načítání reálných dat z Supabase
  useEffect(() => {
    async function fetchUserPurchases() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const supabase = getDatabase();
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            total,
            status,
            order_items (
              id,
              product_id,
              quantity,
              price,
              products (
                id,
                name,
                image_url,
                download_url
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        setUserPurchases(data || []);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        setError('Failed to load your purchases. Please try again.');
        setUserPurchases([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPurchases();
  }, [user?.id]);

  // ✅ Pokud není přihlášený
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

  // ✅ Loading stav
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-2xl font-bold text-neutral-900">
                  DigiNest.io
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <ShoppingCartTrigger />
                <UserMenu />
              </div>
            </div>
          </div>
        </nav>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Loading your account...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = () => {
    updateUser(profileData);
    setIsEditing(false);
  };

  // ✅ Reálné statistiky
  const totalSpent = userPurchases.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalProducts = userPurchases.reduce(
    (sum, order) => sum + (order.order_items?.length || 0),
    0
  );

  // ✅ Všechny produkty pro Downloads tab
  const allPurchasedProducts = userPurchases.flatMap(order => 
    order.order_items?.map(item => ({
      ...item,
      orderDate: order.created_at,
      orderId: order.id
    })) || []
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

        {/* ✅ Error stav */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

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
                Across {userPurchases.length} orders
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
              <div className="text-2xl font-bold">
                {userPurchases.length > 0 
                  ? new Date(userPurchases[userPurchases.length - 1].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'New Member'
                }
              </div>
              <p className="text-xs text-neutral-600">Premium customer</p>
            </CardContent>
          </Card>
        </div>

        {/* ✅ Prázdný stav pro nové uživatele */}
        {userPurchases.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No purchases yet
              </h3>
              <p className="text-neutral-600 mb-6">
                Start exploring our digital products to see your purchases here.
              </p>
              <Link href="/">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* ✅ Tabs s reálnými daty */}
        {userPurchases.length > 0 && (
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

                {userPurchases.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order.id.slice(-8)}
                          </CardTitle>
                          <CardDescription>
                            Purchased on{" "}
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium">
                            ${(order.total || 0).toFixed(2)}
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {order.status || 'completed'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
                          >
                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                              {item.products?.image_url ? (
                                <img
                                  src={item.products.image_url}
                                  alt={item.products.name || 'Product'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-neutral-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-neutral-900">
                                {item.products?.name || 'Product'}
                              </h3>
                              <p className="text-sm text-neutral-600">
                                ${(item.price || 0).toFixed(2)}
                                {item.quantity > 1 && ` × ${item.quantity}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-green-600">
                                Available
                              </Badge>
                              <Button
                                size="sm"
                                className="bg-neutral-900 hover:bg-neutral-800"
                                disabled={!item.products?.download_url}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        )) || (
                          <p className="text-neutral-600">No items in this order.</p>
                        )}
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
                  {allPurchasedProducts.length > 0 ? (
                    allPurchasedProducts.map((item) => (
                      <Card
                        key={`${item.id}-${item.orderId}`}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                          {item.products?.image_url ? (
                            <img
                              src={item.products.image_url}
                              alt={item.products.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-12 w-12 text-neutral-400" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg font-medium line-clamp-1">
                            {item.products?.name || 'Product'}
                          </CardTitle>
                          <CardDescription>
                            ${(item.price || 0).toFixed(2)} • 
                            Purchased {new Date(item.orderDate).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            className="w-full bg-neutral-900 hover:bg-neutral-800"
                            disabled={!item.products?.download_url}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Again
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                      <p className="text-neutral-600">No downloads available</p>
                    </div>
                  )}
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
        )}
      </div>
    </div>
  );
}
