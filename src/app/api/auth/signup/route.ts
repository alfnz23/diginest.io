import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/database';

export async function POST(request: NextRequest) {
  console.log('📝 SIGNUP API: Starting signup process...');
  
  try {
    const body = await request.json();
    const { email, password, name } = body;

    console.log('📧 SIGNUP API: Attempting signup for email:', email, 'name:', name);

    if (!email || !password || !name) {
      console.log('❌ SIGNUP API: Missing required fields');
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      console.log('❌ SIGNUP API: Supabase client not available');
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    // Step 1: Create user in Supabase Auth
    console.log('🔍 SIGNUP API: Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (authError) {
      console.log('❌ SIGNUP API: Supabase Auth signup failed:', authError.message);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      console.log('❌ SIGNUP API: No user data returned from Supabase Auth');
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    console.log('✅ SIGNUP API: Supabase Auth user created:', authData.user.id);

    // Step 2: IMMEDIATELY create record in users table
    console.log('🔧 SIGNUP API: Creating user record in users table...');
    const userData = {
      id: authData.user.id,
      email: authData.user.email!,
      full_name: name,
      role: 'customer',
      is_seller: false,
      subscription_status: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('📝 SIGNUP API: Inserting user data:', userData);

    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (insertError) {
      console.log('❌ SIGNUP API: Failed to create user record:', insertError.message);
      
      // Cleanup: Delete the auth user if we can't create the profile
      console.log('🧹 SIGNUP API: Cleaning up auth user...');
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    console.log('✅ SIGNUP API: User record created successfully:', {
      id: insertedUser.id,
      email: insertedUser.email,
      full_name: insertedUser.full_name,
      role: insertedUser.role
    });

    // Step 3: Prepare response
    const userResponse = {
      id: insertedUser.id,
      email: insertedUser.email,
      name: insertedUser.full_name,
      role: insertedUser.role,
      isAdmin: insertedUser.role === 'admin',
      avatar_url: insertedUser.avatar_url,
      subscription_status: insertedUser.subscription_status,
      is_seller: insertedUser.is_seller
    };

    console.log('✅ SIGNUP API: Signup completed successfully');
    
    return NextResponse.json({
      success: true,
      user: userResponse,
      message: authData.user.email_confirmed_at 
        ? 'Account created successfully' 
        : 'Account created. Please check your email to confirm your account.',
      requiresEmailConfirmation: !authData.user.email_confirmed_at
    });

  } catch (error) {
    console.error('❌ SIGNUP API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}