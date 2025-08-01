import { createClient } from "@supabase/supabase-js";

// Database types
export interface Product {
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
  meta_data?: {
    file_size?: string;
    file_format?: string;
    compatibility?: string[];
  };
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
}

// Lazy initialization of Supabase clients to prevent build-time errors
let supabaseClient: any = null;
let supabaseAdminClient: any = null;

// Get public client (for client-side operations)
export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase environment variables not configured");
      return null;
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

// Get admin client (for server-side operations)
export function getSupabaseAdminClient() {
  if (!supabaseAdminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Supabase admin environment variables not configured");
      return null;
    }

    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseAdminClient;
}

// Legacy exports for backward compatibility
export const supabase = {
  get client() { return getSupabaseClient(); }
};
export const supabaseAdmin = {
  get client() { return getSupabaseAdminClient(); }
};

// Database operations - with proper error handling

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

// Admin functions using service role client

// Create new product (admin only)
export async function createProduct(productData: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product | null> {
  const client = getSupabaseAdminClient();
  if (!client) {
    throw new Error("Database not configured");
  }

  try {
    const { data, error } = await client
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Update product (admin only)
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  const client = getSupabaseAdminClient();
  if (!client) {
    throw new Error("Database not configured");
  }

  try {
    const { data, error } = await client
      .from("products")
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Delete product (admin only)
export async function deleteProduct(id: string): Promise<boolean> {
  const client = getSupabaseAdminClient();
  if (!client) {
    throw new Error("Database not configured");
  }

  try {
    const { error } = await client
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Get all products for admin (includes inactive)
export async function getAllProductsForAdmin(): Promise<Product[]> {
  const client = getSupabaseAdminClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

// Toggle product active status
export async function toggleProductStatus(id: string, isActive: boolean): Promise<Product | null> {
  const client = getSupabaseAdminClient();
  if (!client) {
    throw new Error("Database not configured");
  }

  try {
    const { data, error } = await client
      .from("products")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling product status:", error);
      throw new Error(`Failed to toggle product status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Get product statistics
export async function getProductStats(): Promise<{
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number;
  averageRating: number;
}> {
  const client = getSupabaseAdminClient();
  if (!client) {
    return { totalProducts: 0, activeProducts: 0, totalRevenue: 0, averageRating: 0 };
  }

  try {
    const { data: products, error } = await client
      .from("products")
      .select("price, rating, reviews_count, is_active");

    if (error) {
      console.error("Error fetching product stats:", error);
      return { totalProducts: 0, activeProducts: 0, totalRevenue: 0, averageRating: 0 };
    }

    const totalProducts = products?.length || 0;
    const activeProducts = products?.filter(p => p.is_active).length || 0;
    const totalRevenue = products?.reduce((sum, p) => sum + (p.price * p.reviews_count), 0) || 0;
    const averageRating = products?.length > 0
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
      : 0;

    return { totalProducts, activeProducts, totalRevenue, averageRating };
  } catch (error) {
    console.error("Database error:", error);
    return { totalProducts: 0, activeProducts: 0, totalRevenue: 0, averageRating: 0 };
  }
}

// Database setup SQL (run this in Supabase SQL editor)
export const DATABASE_SCHEMA = `
-- Enable UUID extension
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

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Create function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM product_reviews
      WHERE product_id = NEW.product_id
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM product_reviews
      WHERE product_id = NEW.product_id
    )
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update ratings
DROP TRIGGER IF EXISTS trigger_update_product_rating ON product_reviews;
CREATE TRIGGER trigger_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();
`;
