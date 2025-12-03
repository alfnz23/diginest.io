import { createClient } from '@/lib/database'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const userId = request.nextUrl.searchParams.get('userId')
    const status = request.nextUrl.searchParams.get('status')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')
    
    if (!userId) {
      return Response.json({ error: 'User ID required' }, { status: 400 })
    }

    let query = supabase
      .from('purchases')
      .select(`
        *,
        products(
          id,
          name,
          thumbnail_url,
          slug,
          price,
          category_id,
          categories(name, slug)
        ),
        downloads(count)
      `)
      .eq('user_id', userId)

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status)
    }

    const { data: purchases, error: purchasesError } = await query
      .order('purchased_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (purchasesError) {
      return Response.json({ error: 'Failed to load purchases' }, { status: 500 })
    }

    // Získej celkový počet pro pagination
    const { count: totalCount, error: countError } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) {
      console.error('Count error:', countError)
    }

    // Transformuj data pro lepší použitelnost
    const transformedPurchases = purchases?.map(purchase => ({
      ...purchase,
      download_count: purchase.downloads?.[0]?.count || 0,
      product: purchase.products
    })) || []

    return Response.json({ 
      purchases: transformedPurchases,
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: (totalCount || 0) > offset + limit
      }
    })
  } catch (error) {
    console.error('User purchases error:', error)
    return Response.json({ error: 'Failed to load purchases' }, { status: 500 })
  }
}

// Pro vytvoření nového purchase (pokud potřebuješ mimo checkout)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { userId, productId, amount, paymentIntentId } = await request.json()
    
    if (!userId || !productId || !amount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: purchase, error } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        product_id: productId,
        amount,
        payment_intent_id: paymentIntentId,
        status: 'pending',
        purchased_at: new Date().toISOString()
      })
      .select(`
        *,
        products(
          id,
          name,
          thumbnail_url,
          slug,
          price
        )
      `)
      .single()

    if (error || !purchase) {
      return Response.json({ error: 'Failed to create purchase' }, { status: 500 })
    }

    return Response.json({ purchase })
  } catch (error) {
    console.error('Create purchase error:', error)
    return Response.json({ error: 'Failed to create purchase' }, { status: 500 })
  }
}