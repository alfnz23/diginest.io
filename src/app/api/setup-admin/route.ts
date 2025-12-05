import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if admin user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('role', 'admin')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing admin:', checkError);
      return NextResponse.json(
        { error: 'Failed to check admin status', details: checkError.message },
        { status: 500 }
      );
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        adminExists: true,
        existingAdmin: {
          id: existingUsers[0].id,
          email: existingUsers[0].email
        }
      });
    }

    // Create default admin user
    const adminData = {
      email: 'admin@diginest.io',
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Default: password
      full_name: 'System Administrator',
      role: 'admin',
      is_active: true,
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newAdmin, error: createError } = await supabase
      .from('users')
      .insert([adminData])
      .select()
      .single();

    if (createError) {
      console.error('Error creating admin user:', createError);
      return NextResponse.json(
        { error: 'Failed to create admin user', details: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role,
        created_at: newAdmin.created_at
      },
      credentials: {
        email: 'admin@diginest.io',
        password: 'password'
      },
      note: 'Please change the default password after first login'
    });

  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check admin status
    const { data: adminUsers, error } = await supabase
      .from('users')
      .select('id, email, role, created_at, is_active')
      .eq('role', 'admin');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to check admin status', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      adminExists: adminUsers && adminUsers.length > 0,
      adminCount: adminUsers?.length || 0,
      admins: adminUsers?.map(admin => ({
        id: admin.id,
        email: admin.email,
        role: admin.role,
        created_at: admin.created_at,
        is_active: admin.is_active
      })) || []
    });

  } catch (error) {
    console.error('Get admin status error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}