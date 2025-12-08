import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabaseAdminClient } from '@/lib/database';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword, action } = await request.json();

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    if (action === 'request') {
      // Request password reset
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }

      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('email', email.toLowerCase())
        .single();

      if (userError || !user) {
        // Don't reveal if user exists or not for security
        return NextResponse.json({
          success: true,
          message: 'If an account with this email exists, you will receive a password reset link'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Store reset token (you might want a separate table for this)
      await supabase
        .from('users')
        .update({
          reset_token: resetToken,
          reset_token_expiry: resetTokenExpiry.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      // TODO: Send email with reset link
      // In production, integrate with email service like SendGrid, Resend, etc.
      console.log(`Reset token for ${email}: ${resetToken}`);

      return NextResponse.json({
        success: true,
        message: 'Password reset link sent to your email',
        // For demo purposes - remove in production
        resetToken: resetToken
      });

    } else if (action === 'reset') {
      // Reset password with token
      if (!token || !newPassword) {
        return NextResponse.json(
          { error: 'Reset token and new password are required' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      // Find user with valid reset token
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('reset_token', token)
        .gt('reset_token_expiry', new Date().toISOString())
        .single();

      if (userError || !user) {
        return NextResponse.json(
          { error: 'Invalid or expired reset token' },
          { status: 400 }
        );
      }

      // Hash new password with bcryptjs
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: hashedPassword,
          reset_token: null,
          reset_token_expiry: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error resetting password:', updateError);
        return NextResponse.json(
          { error: 'Failed to reset password' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully'
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}