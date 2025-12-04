import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Download token is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Verify download token and get download record
    const { data: download, error: downloadError } = await supabase
      .from('downloads')
      .select(`
        *,
        product:products(name, download_url),
        purchase:purchases(customer_email, status)
      `)
      .eq('id', id)
      .eq('download_token', token)
      .single();

    if (downloadError || !download) {
      return NextResponse.json(
        { error: 'Invalid download link' },
        { status: 404 }
      );
    }

    // Check if purchase is completed
    if (download.purchase?.status !== 'completed') {
      return NextResponse.json(
        { error: 'Purchase not completed' },
        { status: 403 }
      );
    }

    // Check download limits
    if (download.download_count >= (download.max_downloads || 5)) {
      return NextResponse.json(
        { error: 'Download limit exceeded' },
        { status: 403 }
      );
    }

    // Check expiry
    if (download.expires_at && new Date(download.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      );
    }

    // Update download count and last downloaded
    const { error: updateError } = await supabase
      .from('downloads')
      .update({
        download_count: download.download_count + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating download count:', updateError);
      // Continue anyway
    }

    // Return download URL or redirect
    const downloadUrl = download.product?.download_url;
    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Product file not available' },
        { status: 404 }
      );
    }

    // Redirect to actual file or return signed URL
    return NextResponse.redirect(downloadUrl);

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}