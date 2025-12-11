import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Vytvořte Supabase admin client přímo
function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function POST(request: NextRequest) {
  console.log('🔐 LOGIN API: Starting login process...');
     
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('📧 LOGIN API: Attempting login for email:', email);

    if (!email || !password) {
      console.log('❌ LOGIN API: Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      console.log('❌ LOGIN API: Supabase client not available');
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    // Step 1: Authenticate with Supabase Auth
    console.log('🔍 LOGIN API: Authenticating with Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.log('❌ LOGIN API: Authentication failed:', authError?.message);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ LOGIN API: Supabase Auth successful, user ID:', authData.user.id);

    // Step 2: Fetch additional user data from users table
    console.log('🔍 LOGIN API: Fetching user data from users table...');
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.log('⚠️ LOGIN API: User not found in users table:', userError.message);
             
      // Create user record if it doesn't exist (for existing Supabase Auth users)
      console.log('🔧 LOGIN API: Creating missing user record...');
      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: authData.user.user_metadata?.full_name || email.split('@')[0],
          role: 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.log('❌ LOGIN API: Failed to create user record:', insertError.message);
        return NextResponse.json(
          { error: 'Failed to initialize user profile' },
          { status: 500 }
        );
      }

      console.log('✅ LOGIN API: User record created successfully');
      userData = newUserData;
    }

    console.log('✅ LOGIN API: User data fetched:', {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      full_name: userData.full_name
    });

    // Step 3: Create session data
    const sessionData = {
      user: {
        id: authData.user.id,
        email: userData.email,
        name: userData.full_name || userData.name,
        role: userData.role,
        isAdmin: userData.role === 'admin',
        avatar_url: userData.avatar_url,
        subscription_status: userData.subscription_status,
        is_seller: userData.is_seller
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at
      }
    };

    console.log('📝 LOGIN API: Session data prepared:', {
      userId: sessionData.user.id,
      role: sessionData.user.role,
      isAdmin: sessionData.user.isAdmin
    });

    // Step 4: Set HTTP-only cookies for session
    const response = NextResponse.json({
      success: true,
      user: sessionData.user,
      message: 'Login successful'
    });

    // Set secure cookies
    response.cookies.set('diginest-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    response.cookies.set('diginest-user', JSON.stringify(sessionData.user), {
      httpOnly: false, // Accessible to client-side
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    console.log('✅ LOGIN API: Login completed successfully');
    return response;

  } catch (error) {
    console.error('❌ LOGIN API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
