import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, role } = await request.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Create user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name,
        role: role || 'customer',
      },
      email_confirm: process.env.NODE_ENV === 'production', // Require email confirmation in production
    });

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name,
        role: role || 'customer',
      },
      message: process.env.NODE_ENV === 'production' 
        ? 'Please check your email to confirm your account'
        : 'Account created successfully'
    });

  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}