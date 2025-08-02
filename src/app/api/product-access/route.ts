import { type NextRequest, NextResponse } from "next/server";
import { RefundPolicyManager } from "@/lib/refundPolicy";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// POST - Track product access/download
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, customerEmail, accessType, userAgent } = body;

    // Validate required fields
    if (!orderId || !productId || !accessType) {
      return NextResponse.json(
        { error: 'Order ID, Product ID, and Access Type are required' },
        { status: 400 }
      );
    }

    // Validate access type
    if (!['download', 'access', 'preview'].includes(accessType)) {
      return NextResponse.json(
        { error: 'Invalid access type. Must be: download, access, or preview' },
        { status: 400 }
      );
    }

    // Only track download/access, not previews (previews don't affect refund eligibility)
    if (accessType === 'preview') {
      return NextResponse.json({
        success: true,
        message: 'Preview access logged (does not affect refund eligibility)',
        accessType: 'preview',
        refundEligible: true
      });
    }

    // Mark product as accessed (this makes it ineligible for refunds)
    const success = await RefundPolicyManager.markProductAccessed(
      orderId,
      productId,
      accessType as 'download' | 'access'
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to track product access' },
        { status: 500 }
      );
    }

    // Log the access for audit purposes
    console.log(`Product access tracked:`, {
      orderId,
      productId,
      customerEmail,
      accessType,
      timestamp: new Date().toISOString(),
      userAgent: userAgent || 'unknown'
    });

    // Check current refund eligibility after access
    const eligibility = await RefundPolicyManager.getRefundEligibility(orderId, productId);

    return NextResponse.json({
      success: true,
      message: `Product ${accessType} tracked successfully`,
      accessType,
      accessedAt: new Date().toISOString(),
      refundEligible: eligibility.eligible,
      refundMessage: eligibility.eligible
        ? 'Product can still be refunded if requested within the time window'
        : eligibility.reason
    });

  } catch (error) {
    console.error('Error tracking product access:', error);
    return NextResponse.json(
      { error: 'Failed to track product access' },
      { status: 500 }
    );
  }
}

// GET - Get access history for an order/product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const productId = searchParams.get('productId');
    const customerEmail = searchParams.get('customerEmail');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would query the database
    // For now, return mock data
    const mockAccessHistory = {
      orderId,
      productId: productId || 'all',
      customerEmail: customerEmail || 'unknown',
      accessHistory: [
        {
          productId: productId || 'prod_123',
          productName: 'Sample Digital Product',
          purchasedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          accessedAt: null,
          downloadedAt: null,
          refundEligible: true,
          refundStatus: 'none',
          timeRemainingForRefund: '22.5 hours'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockAccessHistory
    });

  } catch (error) {
    console.error('Error getting access history:', error);
    return NextResponse.json(
      { error: 'Failed to get access history' },
      { status: 500 }
    );
  }
}

// DELETE - Remove access tracking (admin only, for testing)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const productId = searchParams.get('productId');
    const adminSecret = searchParams.get('adminSecret');

    // Simple admin authentication
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!orderId || !productId) {
      return NextResponse.json(
        { error: 'Order ID and Product ID are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would reset the access tracking in the database
    console.log(`Resetting access tracking for order ${orderId}, product ${productId}`);

    return NextResponse.json({
      success: true,
      message: 'Access tracking reset successfully (for testing purposes)',
      orderId,
      productId
    });

  } catch (error) {
    console.error('Error resetting access tracking:', error);
    return NextResponse.json(
      { error: 'Failed to reset access tracking' },
      { status: 500 }
    );
  }
}
