import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 🔐 HARDCODED ADMIN CREDENTIALS
const HARDCODED_ADMIN = {
  email: "redlinebadpacks@gmail.com",
  password: "admin123",
  id: "admin-hardcoded-123",
  role: "admin"
};

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

    // 🎯 HARDCODED ADMIN CHECK - PRVNÍ PRIORITA
    if (email === HARDCODED_ADMIN.email && password === HARDCODED_ADMIN.password) {
      console.log('✅ LOGIN API: Hardcoded admin login successful!');
      
      const adminUser = {
        id: HARDCODED_ADMIN.id,
        email: HARDCODED_ADMIN.email,
        name: 'DigiNest Admin',
        role: HARDCODED_ADMIN.role,
        isAdmin: true,
        avatar_url: null,
        subscription_status: 'active',
        is_seller: true
      };
      
      const response = NextResponse.json({
        success: true,
        user: adminUser,
        message: 'Hardcoded admin login successful'
      });
      
      // Set cookies
      response.cookies.set('diginest-user', JSON.stringify(adminUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });

      response.cookies.set('diginest-session', JSON.stringify({
        user: adminUser,
        session: { access_token: 'hardcoded-admin-token' }
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      
      return response;
    }

    // Pokud není admin, pokračuj s Supabase
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      console.log('❌ LOGIN API: Supabase client not available');
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    // Zbytek Supabase logiky...
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

    // Continue with regular user flow...
    // (zbytek kódu zůstává stejný)

  } catch (error) {
    console.error('❌ LOGIN API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
