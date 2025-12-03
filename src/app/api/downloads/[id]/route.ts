import { createClient } from '@/lib/database'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const purchaseId = params.id
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0] || realIP || 'unknown'

    if (!purchaseId) {
      return Response.json({ error: 'Purchase ID required' }, { status: 400 })
    }
    
    // Ověř purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select(`
        *,
        products(
          id,
          name,
          file_url,
          download_limit
        )
      `)
      .eq('id', purchaseId)
      .eq('status', 'completed')
      .single()
    
    if (purchaseError || !purchase) {
      return Response.json({ error: 'Invalid or incomplete purchase' }, { status: 403 })
    }

    // Zkontroluj download limit
    const { count: downloadCount } = await supabase
      .from('downloads')
      .select('*', { count: 'exact' })
      .eq('purchase_id', purchaseId)

    if (purchase.products.download_limit && downloadCount >= purchase.products.download_limit) {
      return Response.json({ error: 'Download limit exceeded' }, { status: 403 })
    }
    
    // Vytvoř download record
    const { error: downloadError } = await supabase
      .from('downloads')
      .insert({
        purchase_id: purchase.id,
        product_id: purchase.product_id,
        user_id: purchase.user_id,
        downloaded_at: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })

    if (downloadError) {
      console.error('Failed to create download record:', downloadError)
      // Pokračuj i když se nepodaří vytvořit download record
    }
    
    // Redirect na file nebo vrať download URL
    if (purchase.products.file_url) {
      return redirect(purchase.products.file_url)
    } else {
      return Response.json({ error: 'File not available' }, { status: 404 })
    }
  } catch (error) {
    console.error('Download error:', error)
    return Response.json({ error: 'Download failed' }, { status: 500 })
  }
}

// Pro získání download historie
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const purchaseId = params.id
    
    const { data: downloads, error } = await supabase
      .from('downloads')
      .select('*')
      .eq('purchase_id', purchaseId)
      .order('downloaded_at', { ascending: false })

    if (error) {
      return Response.json({ error: 'Failed to load downloads' }, { status: 500 })
    }

    return Response.json({ downloads })
  } catch (error) {
    console.error('Download history error:', error)
    return Response.json({ error: 'Failed to load download history' }, { status: 500 })
  }
}