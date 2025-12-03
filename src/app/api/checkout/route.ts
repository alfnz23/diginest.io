import { createClient } from '@/lib/database'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { productId, userId } = await request.json()
    
    if (!productId || !userId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()
    
    // Načti product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()
    
    if (productError || !product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    // Zkontroluj, zda produkt není již zakoupen
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .single()

    if (existingPurchase) {
      return Response.json({ error: 'Product already purchased' }, { status: 400 })
    }
    
    // Vytvoř purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        product_id: productId,
        amount: product.price,
        status: 'pending',
        purchased_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (purchaseError || !purchase) {
      return Response.json({ error: 'Failed to create purchase' }, { status: 500 })
    }
    
    // Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: product.name,
            description: product.description || undefined
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?purchase_id=${purchase.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/products/${product.slug}`,
      metadata: { 
        purchaseId: purchase.id,
        productId: productId,
        userId: userId
      }
    })

    return Response.json({ 
      sessionId: session.id,
      checkoutUrl: session.url,
      purchaseId: purchase.id 
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return Response.json({ error: 'Checkout failed' }, { status: 500 })
  }
}