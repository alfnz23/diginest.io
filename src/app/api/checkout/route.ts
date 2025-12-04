import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { productId, priceId, userId, successUrl, cancelUrl } = await request.json();

    // Validate required fields
    if (!productId || !priceId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, priceId, or userId' },
        { status: 400 }
      );
    }

    // Fetch product details from Supabase
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already owns this product
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .single();

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You already own this product' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.short_description || product.description,
              images: product.preview_image ? [product.preview_image] : [],
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/products/${productId}`,
      metadata: {
        productId,
        userId,
        sellerId: product.seller_id || product.created_by,
      },
      customer_email: undefined, // Let customer enter email
      payment_intent_data: {
        metadata: {
          productId,
          userId,
          sellerId: product.seller_id || product.created_by,
        },
      },
    });

    // Store pending purchase in database
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        product_id: productId,
        stripe_session_id: session.id,
        status: 'pending',
        amount: product.price,
        currency: 'usd',
        created_at: new Date().toISOString(),
      });

    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError);
      // Continue anyway - webhook will handle it
    }

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}