import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/database';
import { constructEvent } from '@/lib/stripe-server';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Construct and verify the webhook event
    const event = constructEvent(body, signature);
    
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('Database connection failed');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    console.log('Stripe webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        
        // Update purchase status to completed
        const { data: purchase, error: updateError } = await supabase
          .from('purchases')
          .update({ 
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating purchase:', updateError);
          return NextResponse.json(
            { error: 'Failed to update purchase' },
            { status: 500 }
          );
        }

        if (!purchase) {
          console.error('Purchase not found for session:', session.id);
          return NextResponse.json(
            { error: 'Purchase not found' },
            { status: 404 }
          );
        }

        // Create download links for each purchased product
        const cartItems = purchase.cart_items || [];
        const downloads = [];

        for (const item of cartItems) {
          const downloadToken = randomBytes(32).toString('hex');
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30); // 30 days expiry

          const { data: download, error: downloadError } = await supabase
            .from('downloads')
            .insert({
              purchase_id: purchase.id,
              product_id: item.id,
              user_id: purchase.user_id,
              download_token: downloadToken,
              max_downloads: 5,
              download_count: 0,
              expires_at: expiryDate.toISOString(),
            })
            .select()
            .single();

          if (downloadError) {
            console.error('Error creating download:', downloadError);
            continue;
          }

          downloads.push({
            product_name: item.name,
            download_url: `/api/downloads/${download.id}?token=${downloadToken}`,
          });
        }

        // TODO: Send confirmation email with download links
        console.log('Purchase completed:', {
          purchaseId: purchase.id,
          customerEmail: purchase.customer_email,
          downloads: downloads,
        });

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as any;
        
        // Update purchase status to failed
        const { error: updateError } = await supabase
          .from('purchases')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id);

        if (updateError) {
          console.error('Error updating expired purchase:', updateError);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        
        // Update purchase status to failed
        const { error: updateError } = await supabase
          .from('purchases')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (updateError) {
          console.error('Error updating failed purchase:', updateError);
        }

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