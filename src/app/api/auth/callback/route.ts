import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  
  if (!code) {
    console.error('OAuth callback: Missing authorization code')
    return NextResponse.redirect(`${url.origin}/auth`)
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('OAuth callback error:', error.message)
      return NextResponse.redirect(`${url.origin}/auth?error=oauth_error`)
    }

    // Successful authentication - redirect to dashboard
    return NextResponse.redirect(`${url.origin}/dashboard`)
    
  } catch (error) {
    console.error('Unexpected OAuth callback error:', error)
    return NextResponse.redirect(`${url.origin}/auth?error=server_error`)
  }
}