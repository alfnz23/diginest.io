import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Fetch featured products with all necessary data
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        category,
        rating,
        reviews_count,
        features,
        requirements,
        meta_data,
        created_at,
        categories (
          name,
          slug,
          icon
        )
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .order('reviews_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching featured products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch featured products' },
        { status: 500 }
      );
    }

    // Format the response data
    const formattedProducts = products?.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image_url,
      category: product.categories?.name || product.category,
      categorySlug: product.categories?.slug || '',
      categoryIcon: product.categories?.icon || '',
      rating: product.rating || 0,
      reviews: product.reviews_count || 0,
      features: product.features || [],
      requirements: product.requirements || [],
      metadata: product.meta_data || {},
      createdAt: product.created_at
    })) || [];

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      count: formattedProducts.length,
      message: 'Featured products retrieved successfully'
    });

  } catch (error) {
    console.error('Unexpected error in featured products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add POST method to toggle featured status (admin only)
export async function POST(request: NextRequest) {
  try {
    const { productId, featured } = await request.json();

    if (!productId || typeof featured !== 'boolean') {
      return NextResponse.json(
        { error: 'Product ID and featured status are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Update the featured status
    const { data, error } = await supabase
      .from('products')
      .update({ is_featured: featured })
      .eq('id', productId)
      .select('id, name, is_featured')
      .single();

    if (error) {
      console.error('Error updating featured status:', error);
      return NextResponse.json(
        { error: 'Failed to update featured status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: `Product ${featured ? 'added to' : 'removed from'} featured list`
    });

  } catch (error) {
    console.error('Unexpected error in featured products POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}