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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Database,
  Image as ImageIcon,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Palette,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  rating: number;
  reviews_count: number;
  features: string[];
  requirements: string[];
  download_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  features: string;
  requirements: string;
  image_url: string;
  download_url: string;
}

const categories = [
  { value: "ebooks", label: "eBooks" },
  { value: "planners", label: "Planners" },
  { value: "templates", label: "Templates" },
  { value: "tools", label: "Design Tools" },
  { value: "health", label: "Health & Nutrition" },
  { value: "fitness", label: "Fitness & Training" },
];

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    features: "",
    requirements: "",
    image_url: "",
    download_url: "",
  });

  // Admin authentication check
  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/");
      return;
    }
    fetchProducts();
  }, [user, router]);

  // Get admin auth token
  const getAuthToken = () => {
    // In a real app, this would be stored securely
    return (
      process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY ||
      "your_super_secret_admin_key_here"
    );
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "diginest-products");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image_url: data.url }));
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Submit product form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        features: formData.features.split("\n").filter((f) => f.trim()),
        requirements: formData.requirements.split("\n").filter((r) => r.trim()),
      };

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      // Refresh products list
      await fetchProducts();

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        features: "",
        requirements: "",
        image_url: "",
        download_url: "",
      });
      setEditingProduct(null);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      await fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete product");
    }
  };

  // Edit product
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      features: product.features.join("\n"),
      requirements: product.requirements.join("\n"),
      image_url: product.image_url,
      download_url: product.download_url || "",
    });
    setIsDialogOpen(true);
  };

  // Stats calculation
  const stats = {
    totalProducts: products.length,
    totalRevenue: products.reduce(
      (sum, p) => sum + p.price * p.reviews_count,
      0,
    ),
    averageRating:
      products.length > 0
        ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
        : 0,
    totalReviews: products.reduce((sum, p) => sum + p.reviews_count, 0),
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-neutral-900">
                DigiNest.io
              </Link>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Admin Panel
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">
                Welcome, {user?.name}
              </span>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="database">Database Setup</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalProducts}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Est. Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats.totalRevenue.toFixed(0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Rating
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageRating.toFixed(1)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Reviews
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalReviews}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Button variant="outline" onClick={fetchProducts}>
                  <Database className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
                <Link href="/products" target="_blank">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Store
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Product Management</h2>
                <p className="text-neutral-600">
                  Manage your digital product catalog
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4" />
                  <p className="text-neutral-600">Loading products...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="group hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-neutral-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(product)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-1">
                          {product.name}
                        </CardTitle>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">
                          ${product.price}
                        </span>
                        <div className="text-sm text-neutral-600">
                          ⭐ {product.rating} ({product.reviews_count})
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Database Setup Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Setup Instructions</CardTitle>
                <CardDescription>
                  Follow these steps to set up your Supabase database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    1. Create Supabase Project
                  </h4>
                  <p className="text-sm text-neutral-600 mb-2">
                    Go to{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                      rel="noreferrer"
                    >
                      supabase.com
                    </a>{" "}
                    and create a new project.
                  </p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">2. Run Database Schema</h4>
                  <p className="text-sm text-neutral-600 mb-2">
                    Copy the SQL below and run it in your Supabase SQL editor:
                  </p>
                  <div className="bg-neutral-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
                    <pre>{`-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  download_url TEXT,
  is_active BOOLEAN DEFAULT true,
  meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);`}</pre>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    3. Update Environment Variables
                  </h4>
                  <p className="text-sm text-neutral-600">
                    Add your Supabase credentials to your environment variables:
                  </p>
                  <div className="bg-neutral-900 text-green-400 p-4 rounded text-xs mt-2">
                    <pre>{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret`}</pre>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Ready to Go!
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Once configured, this admin panel will be fully functional
                    with database storage and cloud image uploads.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Customization</CardTitle>
                <CardDescription>
                  Customize your store's branding, categories, and business identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Quick Templates */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Business Templates</h4>
                    <div className="space-y-3">
                      {[
                        { name: "Creative & Design", desc: "Graphics, fonts, design tools", color: "bg-purple-100 text-purple-800" },
                        { name: "Education & Learning", desc: "Courses, ebooks, guides", color: "bg-green-100 text-green-800" },
                        { name: "Business & Professional", desc: "Templates, contracts, tools", color: "bg-red-100 text-red-800" },
                        { name: "Lifestyle & Wellness", desc: "Fitness, nutrition, wellness", color: "bg-orange-100 text-orange-800" }
                      ].map((template, i) => (
                        <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-600">{template.desc}</div>
                            </div>
                            <Badge className={template.color}>Apply</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Settings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Current Settings</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="font-medium text-blue-900">DigiNest.io</div>
                        <div className="text-sm text-blue-700">Premium Digital Products for Modern Productivity</div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Product Categories:</div>
                        <div className="flex flex-wrap gap-2">
                          {["eBooks", "Planners", "Templates", "Design Tools", "Health", "Fitness"].map((cat) => (
                            <Badge key={cat} variant="outline">{cat}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4">
                  <Link href="/admin/branding" target="_blank" className="flex-1">
                    <Button className="w-full" size="lg">
                      <Palette className="h-4 w-4 mr-2" />
                      Open Brand Studio
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg text-white">
                      <Palette className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Brand Customization Studio</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Use our comprehensive branding studio to customize your store's identity,
                        product categories, color scheme, and business messaging. Perfect for
                        tailoring your platform to any industry or niche.
                      </p>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• Choose from business templates (Creative, Education, Business, Wellness)</li>
                        <li>• Customize brand name, tagline, and descriptions</li>
                        <li>• Create custom product categories with icons</li>
                        <li>• Design your color theme and visual identity</li>
                        <li>• Preview changes before applying</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update the product information below."
                  : "Fill in the product details below. All fields marked with * are required."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="29.99"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Detailed product description..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Product Image *</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-900" />
                      Uploading image...
                    </div>
                  )}
                  {formData.image_url && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      features: e.target.value,
                    }))
                  }
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="requirements">
                  Requirements (one per line)
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requirements: e.target.value,
                    }))
                  }
                  placeholder="Requirement 1&#10;Requirement 2&#10;Requirement 3"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="download_url">Download URL (optional)</Label>
                <Input
                  id="download_url"
                  value={formData.download_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      download_url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/download/product.zip"
                />
              </div>

              <Separator />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || uploading || !formData.image_url}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingProduct ? "Update Product" : "Create Product"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
