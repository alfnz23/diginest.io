import { createClient } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Získání aktuálního uživatele z Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication failed' },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User not found' },
        { status: 401 }
      );
    }

    // Načtení profile dat z users tabulky
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Not found', message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Vrácení profile dat (bez citlivých informací)
    const {
      password_hash, // Odstraníme citlivé údaje
      ...safeProfile
    } = profile;

    return NextResponse.json({
      success: true,
      data: {
        user: safeProfile,
        auth: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          last_sign_in_at: user.last_sign_in_at,
        }
      }
    });

  } catch (error) {
    console.error('Unexpected error in /api/user/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Volitelně můžeme přidat PUT pro aktualizaci profilu
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();

    // Získání aktuálního uživatele
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Parsování request body
    const body = await request.json();
    
    // Povolená pole pro aktualizaci (bezpečnostní filtr)
    const allowedFields = [
      'full_name',
      'display_name', 
      'bio',
      'avatar_url',
      'website_url',
      'location',
      'phone'
    ];

    const updateData: Record<string, any> = {};
    
    // Filtrování pouze povolených polí
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Bad request', message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Přidání timestamp
    updateData.updated_at = new Date().toISOString();

    // Aktualizace profilu
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Vrácení aktualizovaného profilu (bez citlivých dat)
    const {
      password_hash,
      ...safeProfile
    } = updatedProfile;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: safeProfile
    });

  } catch (error) {
    console.error('Unexpected error in PUT /api/user/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}