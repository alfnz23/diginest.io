import { type NextRequest, NextResponse } from "next/server";
import { RefundPolicyManager, REFUND_POLICY } from "@/lib/refundPolicy";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// GET - Check refund eligibility
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const productId = searchParams.get('productId');

    if (!orderId || !productId) {
      return NextResponse.json(
        { error: 'Order ID and Product ID are required' },
        { status: 400 }
      );
    }

    const eligibility = await RefundPolicyManager.getRefundEligibility(orderId, productId);

    return NextResponse.json({
      success: true,
      eligibility,
      policy: {
        summary: REFUND_POLICY.SUMMARY,
        maxHours: REFUND_POLICY.MAX_REFUND_HOURS,
        reasons: REFUND_POLICY.REASONS
      }
    });

  } catch (error) {
    console.error('Error checking refund eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check refund eligibility' },
      { status: 500 }
    );
  }
}

// POST - Create refund request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, customerEmail, reason, amount } = body;

    // Validate required fields
    if (!orderId || !productId || !customerEmail || !reason || !amount) {
      return NextResponse.json(
        { error: 'All fields are required: orderId, productId, customerEmail, reason, amount' },
        { status: 400 }
      );
    }

    // Validate reason
    if (!REFUND_POLICY.REASONS.includes(reason) && reason !== 'Other') {
      return NextResponse.json(
        { error: 'Invalid refund reason' },
        { status: 400 }
      );
    }

    // Check eligibility first
    const eligibility = await RefundPolicyManager.getRefundEligibility(orderId, productId);

    if (!eligibility.eligible) {
      return NextResponse.json(
        {
          success: false,
          error: 'Refund not eligible',
          reason: eligibility.reason
        },
        { status: 400 }
      );
    }

    // Create refund request
    const refundRequest = await RefundPolicyManager.createRefundRequest(
      orderId,
      productId,
      customerEmail,
      reason,
      amount
    );

    if (!refundRequest) {
      return NextResponse.json(
        { error: 'Failed to create refund request' },
        { status: 500 }
      );
    }

    // In a real implementation, you would:
    // 1. Send email notification to customer
    // 2. Send notification to admin
    // 3. Update order status
    // 4. Potentially integrate with payment processor

    return NextResponse.json({
      success: true,
      message: 'Refund request submitted successfully',
      refundRequest: {
        id: refundRequest.id,
        status: refundRequest.status,
        requestedAt: refundRequest.requestedAt,
        expectedProcessingTime: '3-5 business days'
      }
    });

  } catch (error) {
    console.error('Error creating refund request:', error);
    return NextResponse.json(
      { error: 'Failed to create refund request' },
      { status: 500 }
    );
  }
}

// PUT - Update refund status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { refundId, status, denialReason, adminSecret } = body;

    // Simple admin authentication (in production, use proper auth)
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!refundId || !status) {
      return NextResponse.json(
        { error: 'Refund ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'denied', 'processed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: approved, denied, or processed' },
        { status: 400 }
      );
    }

    if (status === 'denied' && !denialReason) {
      return NextResponse.json(
        { error: 'Denial reason is required when denying refund' },
        { status: 400 }
      );
    }

    // In a real implementation, update the database
    console.log(`Updating refund ${refundId} to status: ${status}`);

    return NextResponse.json({
      success: true,
      message: `Refund ${status} successfully`,
      refundId,
      status,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating refund status:', error);
    return NextResponse.json(
      { error: 'Failed to update refund status' },
      { status: 500 }
    );
  }
}
