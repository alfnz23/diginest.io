import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const userId = url.searchParams.get('user_id');

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or user ID is required' },
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

    // Build query based on provided parameters
    let query = supabase
      .from('purchases')
      .select(`
        id,
        status,
        total_amount,
        customer_email,
        customer_name,
        cart_items,
        created_at,
        updated_at,
        downloads(
          id,
          download_token,
          download_count,
          max_downloads,
          expires_at,
          product_id,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (email) {
      query = query.eq('customer_email', email);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: purchases, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch purchases' },
        { status: 500 }
      );
    }

    // Sanitize and format purchases
    const formattedPurchases = purchases?.map((purchase: any) => ({
      id: purchase.id,
      status: purchase.status,
      total_amount: purchase.total_amount,
      customer_email: purchase.customer_email,
      customer_name: purchase.customer_name,
      items: purchase.cart_items || [],
      created_at: purchase.created_at,
      updated_at: purchase.updated_at,
      downloads: purchase.downloads?.map((download: any) => ({
        id: download.id,
        product_id: download.product_id,
        download_count: download.download_count,
        max_downloads: download.max_downloads,
        expires_at: download.expires_at,
        created_at: download.created_at,
        download_url: `/api/downloads/${download.id}?token=${download.download_token}`,
        is_expired: download.expires_at ? new Date(download.expires_at) < new Date() : false,
        downloads_remaining: Math.max(0, (download.max_downloads || 5) - download.download_count),
      })) || [],
    })) || [];

    return NextResponse.json({
      purchases: formattedPurchases,
      total: formattedPurchases.length,
    });

  } catch (error) {
    console.error('Get user purchases error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customer_email,
      customer_name,
      cart_items,
      total_amount,
      payment_method,
      stripe_session_id,
      user_id 
    } = body;

    if (!customer_email || !cart_items || !total_amount) {
      return NextResponse.json(
        { error: 'Required fields: customer_email, cart_items, total_amount' },
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

    // Create new purchase
    const { data: purchase, error } = await supabase
      .from('purchases')
      .insert({
        customer_email,
        customer_name,
        cart_items,
        total_amount,
        payment_method: payment_method || 'stripe',
        stripe_session_id,
        user_id,
        status: 'pending',
      })
      .select()
      .single();

    if (error || !purchase) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create purchase' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Purchase created successfully',
      purchase: {
        id: purchase.id,
        status: purchase.status,
        created_at: purchase.created_at,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}