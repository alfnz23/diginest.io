import { NextRequest, NextResponse } from 'next/server';
import { constructEvent, stripe } from '@/lib/stripe-server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Construct and verify webhook event
    const event = constructEvent(body, signature);

    console.log('Stripe webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  try {
    const { productId, userId, sellerId } = session.metadata;

    if (!productId || !userId) {
      console.error('Missing metadata in checkout session:', session.metadata);
      return;
    }

    // Update or create purchase record
    const { data: existingPurchase, error: fetchError } = await supabase
      .from('purchases')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching purchase:', fetchError);
      return;
    }

    const purchaseData = {
      user_id: userId,
      product_id: productId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent,
      status: 'completed',
      amount: session.amount_total / 100, // Convert from cents
      currency: session.currency,
      customer_email: session.customer_details?.email,
      completed_at: new Date().toISOString(),
    };

    if (existingPurchase) {
      // Update existing purchase
      const { error: updateError } = await supabase
        .from('purchases')
        .update(purchaseData)
        .eq('id', existingPurchase.id);

      if (updateError) {
        console.error('Error updating purchase:', updateError);
      }
    } else {
      // Create new purchase record
      const { error: insertError } = await supabase
        .from('purchases')
        .insert(purchaseData);

      if (insertError) {
        console.error('Error creating purchase:', insertError);
      }
    }

    // Update seller analytics
    if (sellerId) {
      await updateSellerAnalytics(sellerId, session.amount_total / 100);
    }

  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    const { productId, userId } = paymentIntent.metadata;

    if (!productId || !userId) {
      return;
    }

    // Update purchase status
    const { error } = await supabase
      .from('purchases')
      .update({
        status: 'completed',
        stripe_payment_intent_id: paymentIntent.id,
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error updating purchase on payment success:', error);
    }

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    const { productId, userId } = paymentIntent.metadata;

    if (!productId || !userId) {
      return;
    }

    // Update purchase status to failed
    const { error } = await supabase
      .from('purchases')
      .update({
        status: 'failed',
        stripe_payment_intent_id: paymentIntent.id,
      })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error updating purchase on payment failure:', error);
    }

  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  // Handle subscription payments if needed
  console.log('Invoice payment succeeded:', invoice.id);
}

async function updateSellerAnalytics(sellerId: string, amount: number) {
  try {
    // Get current analytics
    const { data: analytics } = await supabase
      .from('seller_analytics')
      .select('*')
      .eq('seller_id', sellerId)
      .single();

    if (analytics) {
      // Update existing analytics
      await supabase
        .from('seller_analytics')
        .update({
          total_revenue: (analytics.total_revenue || 0) + amount,
          total_sales: (analytics.total_sales || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('seller_id', sellerId);
    } else {
      // Create new analytics record
      await supabase
        .from('seller_analytics')
        .insert({
          seller_id: sellerId,
          total_revenue: amount,
          total_sales: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    }

  } catch (error) {
    console.error('Error updating seller analytics:', error);
  }
}