import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return Response.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return Response.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the webhook event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Payment succeeded:', session.id)
        
        // TODO: Update purchase status in database
        // TODO: Send confirmation email
        // TODO: Grant product access
        
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment intent succeeded:', paymentIntent.id)
        break

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice
        console.log('Invoice payment failed:', invoice.id)
        break

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription cancelled:', subscription.id)
        
        // TODO: Revoke access to subscription-based products
        
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return Response.json({ 
      success: true,
      received: true,
      event_type: event.type 
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Only allow POST requests
export async function GET() {
  return Response.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}