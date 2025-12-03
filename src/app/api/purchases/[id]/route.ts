import { createClient } from '@/lib/database'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const purchaseId = params.id

    if (!purchaseId) {
      return Response.json({ error: 'Purchase ID required' }, { status: 400 })
    }
    
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select(`
        *,
        products(
          id,
          name,
          description,
          price,
          thumbnail_url,
          file_url,
          slug,
          category_id
        ),
        downloads(
          id,
          downloaded_at,
          ip_address
        )
      `)
      .eq('id', purchaseId)
      .single()
    
    if (purchaseError || !purchase) {
      return Response.json({ error: 'Purchase not found' }, { status: 404 })
    }

    // Přidej počet downloadů
    const downloadCount = purchase.downloads?.length || 0
    
    return Response.json({ 
      purchase: {
        ...purchase,
        download_count: downloadCount
      }
    })
  } catch (error) {
    console.error('Purchase detail error:', error)
    return Response.json({ error: 'Failed to load purchase' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const purchaseId = params.id
    const { status, payment_intent_id } = await request.json()

    const { data: purchase, error } = await supabase
      .from('purchases')
      .update({
        status,
        payment_intent_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', purchaseId)
      .select()
      .single()

    if (error || !purchase) {
      return Response.json({ error: 'Failed to update purchase' }, { status: 500 })
    }

    return Response.json({ purchase })
  } catch (error) {
    console.error('Purchase update error:', error)
    return Response.json({ error: 'Failed to update purchase' }, { status: 500 })
  }
}