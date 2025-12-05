import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if admin user already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('role', 'admin')
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing admin:', checkError);
      return NextResponse.json(
        { error: 'Database error while checking admin status' },
        { status: 500 }
      );
    }

    if (existingAdmin) {
      return NextResponse.json(
        { 
          error: 'Admin user already exists',
          existingAdmin: {
            email: existingAdmin.email,
            id: existingAdmin.id
          }
        },
        { status: 409 }
      );
    }

    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email verification for admin setup
      user_metadata: {
        name,
        role: 'admin',
        created_by: 'setup-admin-endpoint',
        created_at: new Date().toISOString()
      }
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      return NextResponse.json(
        { error: `Failed to create auth user: ${authError.message}` },
        { status: 500 }
      );
    }

    if (!authUser.user) {
      return NextResponse.json(
        { error: 'Failed to create auth user - no user returned' },
        { status: 500 }
      );
    }

    // Create user profile in users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email: email.toLowerCase(),
        name,
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: true,
        last_login: null,
        metadata: {
          created_by: 'setup-admin-endpoint',
          setup_completed: true,
          permissions: ['all']
        }
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      
      // Cleanup: Delete the auth user if profile creation failed
      try {
        await supabase.auth.admin.deleteUser(authUser.user.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }

      return NextResponse.json(
        { error: `Failed to create user profile: ${profileError.message}` },
        { status: 500 }
      );
    }

    // Generate session token for immediate login
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        created_at: userProfile.created_at
      },
      loginUrl: sessionData?.properties?.action_link || null
    }, { status: 201 });

  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method to check admin status
export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if any admin users exist
    const { data: adminUsers, error } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('role', 'admin')
      .eq('is_active', true);

    if (error) {
      console.error('Error checking admin users:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hasAdmin: adminUsers && adminUsers.length > 0,
      adminCount: adminUsers?.length || 0,
      admins: adminUsers || []
    });

  } catch (error) {
    console.error('Check admin status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}