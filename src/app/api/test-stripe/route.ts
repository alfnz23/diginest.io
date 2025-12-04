import Stripe from 'stripe'

export async function GET() {
  try {
    // Verify Stripe secret key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: 'Stripe secret key not configured' },
        { status: 500 }
      )
    }

    // Initialize Stripe with secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })

    // Test Stripe connection by listing payment methods (limit 1 for quick test)
    const paymentMethods = await stripe.paymentMethods.list({
      type: 'card',
      limit: 1,
    })

    return Response.json({ 
      message: "Stripe test successful",
      connected: true,
      apiVersion: stripe.getApiField('version'),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Stripe test error:', error)
    return Response.json(
      { 
        error: 'Stripe connection failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}