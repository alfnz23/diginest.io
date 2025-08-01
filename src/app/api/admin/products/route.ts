import { type NextRequest, NextResponse } from "next/server";
import { getAllProductsForAdmin, createProduct } from "@/lib/database";

// Verify admin authentication
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const adminKey = process.env.ADMIN_SECRET_KEY;

  if (!authHeader || !adminKey) {
    return false;
  }

  return authHeader === `Bearer ${adminKey}`;
}

// GET /api/admin/products - Get all products (admin view)
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getAllProductsForAdmin();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      category,
      features,
      requirements,
      image_url,
      download_url,
      meta_data,
    } = body;

    // Validate required fields
    if (!name || !description || !price || !category || !image_url) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, description, price, category, image_url",
        },
        { status: 400 },
      );
    }

    const productData = {
      name,
      description,
      price: Number.parseFloat(price),
      image_url,
      category,
      rating: 0,
      reviews_count: 0,
      features: features || [],
      requirements: requirements || [],
      download_url: download_url || null,
      is_active: true,
      meta_data: meta_data || {},
    };

    const newProduct = await createProduct(productData);

    if (!newProduct) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 },
      );
    }

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
