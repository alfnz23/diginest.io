import { type NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/database";

// Verify admin authentication
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const adminKey = process.env.ADMIN_SECRET_KEY;

  if (!authHeader || !adminKey) {
    return false;
  }

  return authHeader === `Bearer ${adminKey}`;
}

// GET /api/admin/products/[id] - Get specific product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const product = await ProductService.getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    const { created_at, updated_at, ...updateData } = body;

    // Convert price to number if provided
    if (updateData.price) {
      updateData.price = Number.parseFloat(updateData.price);
    }

    const updatedProduct = await ProductService.updateProduct(id, updateData);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await ProductService.deleteProduct(id);

    if (!success) {
      return NextResponse.json(
        { error: "Product not found or delete failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
