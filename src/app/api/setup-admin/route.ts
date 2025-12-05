import { getSupabaseAdminClient } from '@/lib/database';
import { NextResponse } from 'next/server';

// One-time setup endpoint to create the admin user
export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Check if admin already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('email', 'redlinebadpacks@gmail.com')
      .single();

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        user: existingUser
      });
    }

    // Create admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'redlinebadpacks@gmail.com',
      password: 'heslo123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
        role: 'admin'
      }
    });

    if (authError) {
      return NextResponse.json(
        { error: `Auth creation failed: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'No user data returned' },
        { status: 500 }
      );
    }

    // Insert into users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'redlinebadpacks@gmail.com',
        full_name: 'Admin User',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      // Cleanup auth user if users table insert failed
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: `User table insert failed: ${userError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        created_at: userData.created_at
      },
      credentials: {
        email: 'redlinebadpacks@gmail.com',
        password: 'heslo123'
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}