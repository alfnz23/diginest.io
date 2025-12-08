import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/database';

// Helper function to verify admin role
async function verifyAdminRole(request: NextRequest) {
  console.log('🔐 ADMIN USERS API: Verifying admin role...');
  
  const sessionCookie = request.cookies.get('diginest-session');
  if (!sessionCookie) {
    console.log('❌ ADMIN USERS API: No session cookie found');
    return null;
  }

  let sessionData;
  try {
    sessionData = JSON.parse(sessionCookie.value);
  } catch (error) {
    console.log('❌ ADMIN USERS API: Invalid session cookie');
    return null;
  }

  const userId = sessionData.user?.id;
  if (!userId) {
    console.log('❌ ADMIN USERS API: No user ID in session');
    return null;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.log('❌ ADMIN USERS API: Supabase client not available');
    return null;
  }

  // Verify admin role from users table
  const { data: userData, error } = await supabase
    .from('users')
    .select('id, role, email')
    .eq('id', userId)
    .single();

  if (error || !userData) {
    console.log('❌ ADMIN USERS API: User not found:', error?.message);
    return null;
  }

  if (userData.role !== 'admin') {
    console.log('❌ ADMIN USERS API: User is not admin:', userData.role);
    return null;
  }

  console.log('✅ ADMIN USERS API: Admin role verified for:', userData.email);
  return userData;
}

export async function GET(request: NextRequest) {
  console.log('👥 ADMIN USERS API: Getting all users...');
  
  try {
    // Verify admin role
    const adminUser = await verifyAdminRole(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    console.log('🔍 ADMIN USERS API: Fetching all users from database...');
    
    // Get all users from users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        name,
        role,
        is_seller,
        subscription_status,
        avatar_url,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (usersError) {
      console.log('❌ ADMIN USERS API: Failed to fetch users:', usersError.message);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    console.log('✅ ADMIN USERS API: Fetched', users?.length || 0, 'users');

    // Format users for response
    const formattedUsers = users?.map(user => ({
      id: user.id,
      email: user.email,
      name: user.full_name || user.name,
      full_name: user.full_name,
      role: user.role,
      isAdmin: user.role === 'admin',
      is_seller: user.is_seller,
      subscription_status: user.subscription_status,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at
    })) || [];

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      total: formattedUsers.length
    });

  } catch (error) {
    console.error('❌ ADMIN USERS API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  console.log('📝 ADMIN USERS API: Updating user...');
  
  try {
    // Verify admin role
    const adminUser = await verifyAdminRole(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { userId, role, is_seller, subscription_status } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 ADMIN USERS API: Updating user:', userId, 'with data:', {
      role, is_seller, subscription_status
    });

    // Update user in users table
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (role !== undefined) updateData.role = role;
    if (is_seller !== undefined) updateData.is_seller = is_seller;
    if (subscription_status !== undefined) updateData.subscription_status = subscription_status;

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError || !updatedUser) {
      console.log('❌ ADMIN USERS API: Failed to update user:', updateError?.message);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    console.log('✅ ADMIN USERS API: User updated successfully');

    const formattedUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.full_name || updatedUser.name,
      role: updatedUser.role,
      isAdmin: updatedUser.role === 'admin',
      is_seller: updatedUser.is_seller,
      subscription_status: updatedUser.subscription_status,
      updated_at: updatedUser.updated_at
    };

    return NextResponse.json({
      success: true,
      user: formattedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('❌ ADMIN USERS API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}