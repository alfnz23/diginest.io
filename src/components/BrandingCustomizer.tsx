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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Package,
  Type,
  Target,
  Download,
  Trash2,
  Plus,
  Save,
  RefreshCw,
  Eye
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface BrandTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface BusinessProfile {
  name: string;
  tagline: string;
  description: string;
  focus: string;
  target: string;
}

import {
  businessTemplates,
  type BrandConfig,
  generateCSSVariables,
  generateCategoryConfig,
  applyBrandingConfig
} from "@/lib/brandingConfig";

// Convert the business templates to the format expected by the component
const templateOptions = [
  ...Object.entries(businessTemplates).map(([id, config]) => ({
    id,
    name: config.business.name.replace(/\s+(Studio|Academy|Hub|Vault|Digital)$/, '').trim(),
    focus: config.business.focus,
    categories: config.categories,
    theme: config.theme,
    business: config.business
  })),
  {
    id: "custom",
    name: "Custom Setup",
    focus: "Create your own unique business profile",
    categories: [],
    theme: { primary: "#6366f1", secondary: "#4f46e5", accent: "#818cf8", background: "#f1f5f9" },
    business: {
      name: "Your Business",
      tagline: "Your Custom Tagline",
      description: "Your business description",
      focus: "custom",
      target: "customers"
    }
  }
];

export default function BrandingCustomizer() {
  const [selectedTemplate, setSelectedTemplate] = useState(templateOptions[0]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    name: "DigiNest.io",
    tagline: "Premium Digital Products for Modern Productivity",
    description: "Discover beautifully crafted digital products designed to elevate your workflow",
    focus: "productivity",
    target: "professionals"
  });
  const [categories, setCategories] = useState<Category[]>(selectedTemplate.categories);
  const [theme, setTheme] = useState<BrandTheme>(selectedTemplate.theme);
  const [customCategory, setCustomCategory] = useState({ name: "", description: "", icon: "" });
  const [isApplying, setIsApplying] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    const template = templateOptions.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCategories([...template.categories]);
      setTheme({ ...template.theme });
      if (template.business) {
        setBusinessProfile({...template.business});
      }
    }
  };

  const handleApplyChanges = async () => {
    setIsApplying(true);
    try {
      const config: BrandConfig = {
        business: businessProfile,
        categories,
        theme
      };

      const success = await applyBrandingConfig(config);
      if (success) {
        alert('Branding configuration applied successfully! Please restart your development server to see changes.');
      } else {
        alert('Failed to apply branding configuration. Please try again.');
      }
    } catch (error) {
      console.error('Error applying branding:', error);
      alert('An error occurred while applying the configuration.');
    } finally {
      setIsApplying(false);
    }
  };

  const addCustomCategory = () => {
    if (customCategory.name && customCategory.description) {
      const newCategory: Category = {
        id: customCategory.name.toLowerCase().replace(/\s+/g, '-'),
        name: customCategory.name,
        description: customCategory.description,
        icon: customCategory.icon || "📦"
      };
      setCategories([...categories, newCategory]);
      setCustomCategory({ name: "", description: "", icon: "" });
    }
  };

  const removeCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const generateConfigCode = () => {
    return `// Branding Configuration
export const brandConfig = {
  business: {
    name: "${businessProfile.name}",
    tagline: "${businessProfile.tagline}",
    description: "${businessProfile.description}",
    focus: "${businessProfile.focus}"
  },
  categories: [
${categories.map(cat => `    {
      id: "${cat.id}",
      name: "${cat.name}",
      description: "${cat.description}",
      icon: "${cat.icon}"
    }`).join(',\n')}
  ],
  theme: {
    primary: "${theme.primary}",
    secondary: "${theme.secondary}",
    accent: "${theme.accent}",
    background: "${theme.background}"
  }
};`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
              <Palette className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Brand Customization Studio
              </h1>
              <p className="text-gray-600 mt-2">Customize your DigiNest.io platform for your business</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Business Type
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Business Templates */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Business Type</CardTitle>
                <CardDescription>
                  Select a template that matches your business focus. This will set up appropriate categories and branding.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templateOptions.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedTemplate.id === template.id
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleTemplateChange(template.id)}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">{template.name}</h3>
                            {selectedTemplate.id === template.id && (
                              <Badge className="bg-blue-500">Selected</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{template.focus}</p>
                          <div className="flex flex-wrap gap-1">
                            {template.categories.slice(0, 4).map((cat) => (
                              <Badge key={cat.id} variant="outline" className="text-xs">
                                {cat.icon} {cat.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding */}
          <TabsContent value="branding" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Business Identity */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Identity</CardTitle>
                  <CardDescription>Define your brand name and messaging</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessProfile.name}
                      onChange={(e) => setBusinessProfile(prev => ({...prev, name: e.target.value}))}
                      placeholder="Your Business Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={businessProfile.tagline}
                      onChange={(e) => setBusinessProfile(prev => ({...prev, tagline: e.target.value}))}
                      placeholder="Your brand tagline"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={businessProfile.description}
                      onChange={(e) => setBusinessProfile(prev => ({...prev, description: e.target.value}))}
                      placeholder="Describe your business..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Color Theme */}
              <Card>
                <CardHeader>
                  <CardTitle>Color Theme</CardTitle>
                  <CardDescription>Customize your brand colors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary"
                          type="color"
                          value={theme.primary}
                          onChange={(e) => setTheme(prev => ({...prev, primary: e.target.value}))}
                          className="w-12 h-10 p-1 rounded"
                        />
                        <Input
                          value={theme.primary}
                          onChange={(e) => setTheme(prev => ({...prev, primary: e.target.value}))}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary"
                          type="color"
                          value={theme.secondary}
                          onChange={(e) => setTheme(prev => ({...prev, secondary: e.target.value}))}
                          className="w-12 h-10 p-1 rounded"
                        />
                        <Input
                          value={theme.secondary}
                          onChange={(e) => setTheme(prev => ({...prev, secondary: e.target.value}))}
                          placeholder="#1e40af"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accent">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent"
                          type="color"
                          value={theme.accent}
                          onChange={(e) => setTheme(prev => ({...prev, accent: e.target.value}))}
                          className="w-12 h-10 p-1 rounded"
                        />
                        <Input
                          value={theme.accent}
                          onChange={(e) => setTheme(prev => ({...prev, accent: e.target.value}))}
                          placeholder="#60a5fa"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="background">Background</Label>
                      <div className="flex gap-2">
                        <Input
                          id="background"
                          type="color"
                          value={theme.background}
                          onChange={(e) => setTheme(prev => ({...prev, background: e.target.value}))}
                          className="w-12 h-10 p-1 rounded"
                        />
                        <Input
                          value={theme.background}
                          onChange={(e) => setTheme(prev => ({...prev, background: e.target.value}))}
                          placeholder="#f8fafc"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.background }}>
                    <div className="space-y-2">
                      <div
                        className="px-4 py-2 rounded text-white font-medium"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Primary Button
                      </div>
                      <div
                        className="px-4 py-2 rounded text-white"
                        style={{ backgroundColor: theme.secondary }}
                      >
                        Secondary Element
                      </div>
                      <div
                        className="px-4 py-2 rounded text-white"
                        style={{ backgroundColor: theme.accent }}
                      >
                        Accent Highlight
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Current Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Manage your product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCategory(category.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Category</CardTitle>
                  <CardDescription>Create custom product categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={customCategory.name}
                      onChange={(e) => setCustomCategory(prev => ({...prev, name: e.target.value}))}
                      placeholder="e.g., Photography"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryDesc">Description</Label>
                    <Input
                      id="categoryDesc"
                      value={customCategory.description}
                      onChange={(e) => setCustomCategory(prev => ({...prev, description: e.target.value}))}
                      placeholder="e.g., Photo editing tools"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryIcon">Icon (Emoji)</Label>
                    <Input
                      id="categoryIcon"
                      value={customCategory.icon}
                      onChange={(e) => setCustomCategory(prev => ({...prev, icon: e.target.value}))}
                      placeholder="📷"
                    />
                  </div>

                  <Button onClick={addCustomCategory} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview & Code */}
          <TabsContent value="preview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Brand Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Brand Preview</CardTitle>
                  <CardDescription>See how your brand will look</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="p-6 rounded-lg border-2"
                    style={{ backgroundColor: theme.background, borderColor: theme.accent }}
                  >
                    <div className="space-y-4">
                      <div className="text-center space-y-2">
                        <h1
                          className="text-3xl font-bold"
                          style={{ color: theme.primary }}
                        >
                          {businessProfile.name}
                        </h1>
                        <p
                          className="text-lg"
                          style={{ color: theme.secondary }}
                        >
                          {businessProfile.tagline}
                        </p>
                        <p className="text-gray-600">{businessProfile.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {categories.slice(0, 4).map((cat) => (
                          <div
                            key={cat.id}
                            className="p-3 rounded text-center text-white text-sm"
                            style={{ backgroundColor: theme.accent }}
                          >
                            <div>{cat.icon}</div>
                            <div className="font-medium">{cat.name}</div>
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full text-white"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Code</CardTitle>
                  <CardDescription>Copy this code to apply your changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-96">
                      {generateConfigCode()}
                    </pre>

                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={handleApplyChanges}
                        disabled={isApplying}
                      >
                        {isApplying ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Applying Changes...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Apply These Changes
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const config = { business: businessProfile, categories, theme };
                          const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'brand-config.json';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Download Configuration
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
