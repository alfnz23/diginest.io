import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function GET(request: NextRequest) {
  try {
    // Test Stripe connection
    const account = await stripe.accounts.retrieve();
    
    return NextResponse.json({
      success: true,
      message: 'Stripe connection successful',
      account: {
        id: account.id,
        country: account.country,
        default_currency: account.default_currency,
        email: account.email,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      },
    });

  } catch (error: any) {
    console.error('Stripe test error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to connect to Stripe',
        type: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount = 1000, currency = 'usd' } = await request.json();

    // Create a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        test: 'true',
      },
    });

    return NextResponse.json({
      success: true,
      payment_intent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      },
    });

  } catch (error: any) {
    console.error('Test payment intent error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create test payment intent',
        type: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}