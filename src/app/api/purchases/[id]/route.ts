import { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return Response.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const purchaseId = params.id;

    // Get purchase details with related data
    const { data: purchase, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products (
          id,
          name,
          description,
          price,
          image_url,
          category,
          seller:users!products_seller_id_fkey (
            id,
            email,
            full_name
          )
        ),
        users (
          id,
          email,
          full_name
        )
      `)
      .eq('id', purchaseId)
      .single();

    if (error) {
      console.error('Error fetching purchase:', error);
      return Response.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    if (!purchase) {
      return Response.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    return Response.json(purchase);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return Response.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const purchaseId = params.id;
    const body = await request.json();

    // Update purchase status or other allowed fields
    const { data: updatedPurchase, error } = await supabase
      .from('purchases')
      .update({
        status: body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', purchaseId)
      .select()
      .single();

    if (error) {
      console.error('Error updating purchase:', error);
      return Response.json(
        { error: 'Failed to update purchase' },
        { status: 400 }
      );
    }

    return Response.json(updatedPurchase);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}