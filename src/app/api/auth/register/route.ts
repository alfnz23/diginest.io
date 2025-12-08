import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    const supabase = createRouteHandlerClient({ cookies });

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name: name,
        },
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'An account with this email already exists.',
            message: 'Email already registered'
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    if (authData.user) {
      const user = {
        id: authData.user.id,
        email: authData.user.email!,
        name: name,
        joinedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: 'Account created successfully!',
        user: user,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}