import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth Callback Route Handler
 * Zpracovává callback z email confirmation linku
 * Výměna authorization code za session a redirect
 */
export async function GET(request: NextRequest) {
  console.log('🔐 Auth callback handler started');
  
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';
    const error = searchParams.get('error');
    
    console.log('📝 Callback params:', { code: code?.slice(0, 10) + '...', next, error });

    // Pokud je error parametr, přesměruj na auth stránku s chybou
    if (error) {
      console.error('❌ Auth callback error:', error);
      return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent(error)}`, origin)
      );
    }

    // Pokud není code, nejde o confirmation callback
    if (!code) {
      console.warn('⚠️ No authorization code provided');
      return NextResponse.redirect(
        new URL('/auth?error=missing_code', origin)
      );
    }

    // Vytvoření Supabase klienta pro Route Handler
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });

    // Výměna code za session
    console.log('🔄 Exchanging code for session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sessionError) {
      console.error('❌ Session exchange error:', sessionError);
      return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent(sessionError.message)}`, origin)
      );
    }

    const { session, user } = sessionData;
    
    if (!session || !user) {
      console.error('❌ No session or user after exchange');
      return NextResponse.redirect(
        new URL('/auth?error=session_failed', origin)
      );
    }

    console.log('✅ Session created for user:', user.email);

    // Získání user profilu z databáze pro dodatečné info
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows
      console.warn('⚠️ Could not fetch user profile:', profileError);
    }

    // Vytvoření user objektu kompatibilního s AuthContext
    const userData = {
      id: user.id,
      email: user.email || '',
      name: userProfile?.full_name || userProfile?.name || user.user_metadata?.full_name || '',
      avatar: user.user_metadata?.avatar_url || userProfile?.avatar_url,
      isAdmin: userProfile?.role === 'admin',
      role: userProfile?.role || 'user',
      subscription_status: userProfile?.subscription_status || 'free',
      is_seller: userProfile?.is_seller || false,
      joinedAt: user.created_at
    };

    // Nastavení cookie pro kompatibilitu s existujícím AuthContext
    const response = NextResponse.redirect(new URL('/', origin));
    
    // Uložení user dat do cookie (kompatibilní s AuthContext)
    response.cookies.set('diginest-user', JSON.stringify(userData), {
      httpOnly: false, // Potřeba pro čtení na client side
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dní
      path: '/'
    });

    console.log('✅ Auth callback completed, redirecting to:', next);
    
    // Přesměrování na požadovanou stránku nebo dashboard
    const redirectUrl = next.startsWith('/') ? next : '/';
    return NextResponse.redirect(new URL(redirectUrl, origin));

  } catch (error) {
    console.error('💥 Auth callback unexpected error:', error);
    
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent('Authentication failed')}`, request.url)
    );
  }
}