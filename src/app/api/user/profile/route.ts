import { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/database';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  is_seller: boolean;
  seller_verified: boolean;
  total_purchases: number;
  total_sales?: number;
  account_status: 'active' | 'suspended' | 'pending';
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdminClient();
  
  if (!supabase) {
    return Response.json(
      { error: 'Database connection not available' },
      { status: 500 }
    );
  }

  try {
    // Get user ID from auth header or query params
    const authHeader = request.headers.get('authorization');
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!authHeader && !userId) {
      return Response.json(
        { error: 'Authorization header or userId parameter required' },
        { status: 401 }
      );
    }

    let targetUserId = userId;

    // If using auth header, extract user ID from JWT
    if (authHeader && !userId) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        return Response.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      
      targetUserId = user.id;
    }

    if (!targetUserId) {
      return Response.json(
        { error: 'User ID not found' },
        { status: 400 }
      );
    }

    // Fetch user profile with additional stats
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        username,
        avatar_url,
        bio,
        created_at,
        updated_at,
        is_seller,
        seller_verified,
        account_status
      `)
      .eq('id', targetUserId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      
      if (userError.code === 'PGRST116') {
        return Response.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return Response.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    // Get purchase statistics
    const { count: totalPurchases } = await supabase
      .from('purchases')
      .select('id', { count: 'exact' })
      .eq('user_id', targetUserId)
      .eq('status', 'completed');

    // Get sales statistics (if user is a seller)
    let totalSales = 0;
    if (user.is_seller) {
      const { count: salesCount } = await supabase
        .from('purchases')
        .select('id', { count: 'exact' })
        .in('product_id', 
          supabase
            .from('products')
            .select('id')
            .eq('seller_id', targetUserId)
        )
        .eq('status', 'completed');
      
      totalSales = salesCount || 0;
    }

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      username: user.username,
      avatar_url: user.avatar_url,
      bio: user.bio,
      created_at: user.created_at,
      updated_at: user.updated_at,
      is_seller: user.is_seller || false,
      seller_verified: user.seller_verified || false,
      total_purchases: totalPurchases || 0,
      total_sales: user.is_seller ? totalSales : undefined,
      account_status: user.account_status || 'active'
    };

    return Response.json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('Unexpected error in user profile endpoint:', error);
    
    return Response.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabaseAdminClient();
  
  if (!supabase) {
    return Response.json(
      { error: 'Database connection not available' },
      { status: 500 }
    );
  }

  try {
    // Get user ID from auth header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return Response.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return Response.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const allowedFields = [
      'full_name', 
      'username', 
      'bio', 
      'avatar_url'
    ];

    // Filter only allowed fields
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      
      // Handle unique constraint violations
      if (updateError.code === '23505') {
        return Response.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
      
      return Response.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        full_name: updatedUser.full_name,
        username: updatedUser.username,
        bio: updatedUser.bio,
        avatar_url: updatedUser.avatar_url,
        updated_at: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('Unexpected error updating user profile:', error);
    
    return Response.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabaseAdminClient();
  
  if (!supabase) {
    return Response.json(
      { error: 'Database connection not available' },
      { status: 500 }
    );
  }

  try {
    // Get user ID from auth header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return Response.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return Response.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Soft delete - mark account as suspended instead of hard delete
    // This preserves purchase history and referential integrity
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        account_status: 'suspended',
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error suspending user account:', updateError);
      return Response.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Account successfully deleted'
    });

  } catch (error) {
    console.error('Unexpected error deleting user account:', error);
    
    return Response.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}