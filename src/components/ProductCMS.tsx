"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Upload,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Package,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { productManager, type ProductFormData, type ProductFile } from "@/lib/productManager";
import type { Product } from "@/contexts/CartContext";

interface CMSProduct extends Product {
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export function ProductCMS() {
  const [products, setProducts] = useState<CMSProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CMSProduct | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Create Product Form
  const CreateProductForm = () => {
    const [formData, setFormData] = useState<ProductFormData>({
      name: '',
      description: '',
      price: 0,
      category: '',
      images: [],
      features: [],
      requirements: [],
      tags: []
    });
    const [productFiles, setProductFiles] = useState<ProductFile[]>([]);
    const [currentFeature, setCurrentFeature] = useState('');
    const [currentRequirement, setCurrentRequirement] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const productFileRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newProductFiles = files.map(file => ({
        name: file.name,
        file,
        type: 'main' as const
      }));
      setProductFiles(prev => [...prev, ...newProductFiles]);
    };

    const addFeature = () => {
      if (currentFeature.trim()) {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, currentFeature.trim()]
        }));
        setCurrentFeature('');
      }
    };

    const addRequirement = () => {
      if (currentRequirement.trim()) {
        setFormData(prev => ({
          ...prev,
          requirements: [...prev.requirements, currentRequirement.trim()]
        }));
        setCurrentRequirement('');
      }
    };

    const removeFeature = (featureToRemove: string) => {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter(feature => feature !== featureToRemove)
      }));
    };

    const removeRequirement = (requirementToRemove: string) => {
      setFormData(prev => ({
        ...prev,
        requirements: prev.requirements.filter(requirement => requirement !== requirementToRemove)
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const newProduct = await productManager.createProduct(formData, productFiles);

        const cmsProduct: CMSProduct = {
          ...newProduct,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setProducts(prev => [...prev, cmsProduct]);
        setShowCreateDialog(false);

        // Reset form
        setFormData({
          name: '',
          description: '',
          price: 0,
          category: '',
          images: [],
          features: [],
          requirements: [],
          tags: []
        });
        setProductFiles([]);
      } catch (error) {
        console.error('Error creating product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ebooks">eBooks</SelectItem>
              <SelectItem value="planners">Planners</SelectItem>
              <SelectItem value="templates">Templates</SelectItem>
              <SelectItem value="tools">Design Tools</SelectItem>
              <SelectItem value="health">Health & Nutrition</SelectItem>
              <SelectItem value="fitness">Fitness & Training</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter product description"
            rows={4}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label>Product Images</Label>
          <div className="mt-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-dashed"
            >
              <div className="text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
                <span>Click to upload images</span>
                <p className="text-sm text-neutral-500 mt-1">PNG, JPG up to 10MB each</p>
              </div>
            </Button>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {formData.images.map((file, index) => (
                  <div key={`image-${file.name}-${index}-${file.size}`} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Files */}
        <div>
          <Label>Product Files</Label>
          <div className="mt-2">
            <input
              ref={productFileRef}
              type="file"
              multiple
              onChange={handleProductFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => productFileRef.current?.click()}
              className="w-full h-24 border-dashed"
            >
              <div className="text-center">
                <Package className="h-6 w-6 mx-auto mb-2 text-neutral-400" />
                <span>Upload downloadable files</span>
                <p className="text-sm text-neutral-500 mt-1">PDF, ZIP, etc.</p>
              </div>
            </Button>
            {productFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {productFiles.map((file, index) => (
                  <div key={`file-${file.name}-${index}`} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setProductFiles(prev => prev.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div>
          <Label>Features</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              placeholder="Add a feature"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button type="button" onClick={addFeature}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.features.map((feature) => (
              <Badge key={`feature-${feature}-${Date.now()}-${Math.random()}`} variant="secondary" className="flex items-center gap-1">
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <Label>Requirements</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={currentRequirement}
              onChange={(e) => setCurrentRequirement(e.target.value)}
              placeholder="Add a requirement"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRequirement();
                }
              }}
            />
            <Button type="button" onClick={addRequirement}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.requirements.map((requirement) => (
              <Badge key={`requirement-${requirement}-${Date.now()}-${Math.random()}`} variant="outline" className="flex items-center gap-1">
                {requirement}
                <button
                  type="button"
                  onClick={() => removeRequirement(requirement)}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Product
              </>
            )}
          </Button>
        </div>
      </form>
    );
  };

  // Product List Component
  const ProductList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredProducts = products.filter(product => {
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (categoryFilter === '' || product.category === categoryFilter) &&
        (statusFilter === '' || product.status === statusFilter)
      );
    });

    return (
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="ebooks">eBooks</SelectItem>
              <SelectItem value="planners">Planners</SelectItem>
              <SelectItem value="templates">Templates</SelectItem>
              <SelectItem value="tools">Design Tools</SelectItem>
              <SelectItem value="health">Health & Nutrition</SelectItem>
              <SelectItem value="fitness">Fitness & Training</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={
                      product.status === 'published' ? 'default' :
                      product.status === 'draft' ? 'secondary' : 'outline'
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                <div className="flex justify-between items-center text-sm text-neutral-600">
                  <span>${product.price.toFixed(2)}</span>
                  <span>{product.category}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-neutral-600">Manage your digital product catalog</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>
                Add a new digital product to your catalog
              </DialogDescription>
            </DialogHeader>
            <CreateProductForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductList />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
              <CardDescription>Track your product performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold">{products.length}</div>
                  <div className="text-sm text-neutral-600">Total Products</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold">
                    {products.filter(p => p.status === 'published').length}
                  </div>
                  <div className="text-sm text-neutral-600">Published</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold">
                    ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-neutral-600">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import</CardTitle>
              <CardDescription>Import multiple products from CSV</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                <p className="text-neutral-600 mb-4">
                  Import products in bulk using a CSV file with columns: name, description, price, category, image, downloadUrl
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose CSV File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
