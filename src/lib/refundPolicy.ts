// Refund Policy Management System

export interface ProductAccess {
  id: string;
  orderId: string;
  productId: string;
  customerId: string;
  customerEmail: string;
  accessedAt: Date | null;
  downloadedAt: Date | null;
  refundEligible: boolean;
  refundRequestedAt: Date | null;
  refundStatus: 'none' | 'requested' | 'approved' | 'denied' | 'processed';
  refundReason?: string;
  createdAt: Date;
}

export interface RefundRequest {
  id: string;
  orderId: string;
  productId: string;
  customerId: string;
  customerEmail: string;
  reason: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'denied' | 'processed';
  denialReason?: string;
  processedAt?: Date;
  refundAmount: number;
}

// Refund Policy Constants
export const REFUND_POLICY = {
  TITLE: "Digital Product Refund Policy",
  SUMMARY: "Refunds can only be requested before downloading or accessing the digital product. After the product has been downloaded or accessed, refunds are no longer available.",
  FULL_TEXT: `
**Digital Product Refund Policy**

1. **Refund Eligibility**: Refunds are only available for digital products that have NOT been downloaded or accessed by the customer.

2. **No Refunds After Access**: Once you have downloaded, accessed, or used any digital product, refunds are no longer possible due to the nature of digital goods.

3. **Refund Window**: You may request a refund within 24 hours of purchase, provided the product has not been accessed.

4. **Automatic Tracking**: Our system automatically tracks when products are downloaded or accessed to ensure fair application of this policy.

5. **Processing Time**: Approved refunds will be processed within 3-5 business days to your original payment method.

6. **Previews Available**: We encourage you to review product descriptions, previews, and sample content before purchasing to ensure the product meets your needs.

For questions about refunds, contact our support team.
  `.trim(),
  MAX_REFUND_HOURS: 24,
  REASONS: [
    "Product does not match description",
    "Technical issues with download",
    "Purchased by mistake",
    "Changed my mind",
    "Found a better alternative",
    "Other"
  ]
};

// Database Schema SQL
export const REFUND_SCHEMA_SQL = `
-- Product Access Tracking Table
CREATE TABLE IF NOT EXISTS product_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  customer_id TEXT,
  customer_email TEXT NOT NULL,
  accessed_at TIMESTAMP,
  downloaded_at TIMESTAMP,
  refund_eligible BOOLEAN DEFAULT true,
  refund_requested_at TIMESTAMP,
  refund_status TEXT DEFAULT 'none' CHECK (refund_status IN ('none', 'requested', 'approved', 'denied', 'processed')),
  refund_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Refund Requests Table
CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  customer_id TEXT,
  customer_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  requested_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'processed')),
  denial_reason TEXT,
  processed_at TIMESTAMP,
  refund_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_access_order_id ON product_access(order_id);
CREATE INDEX IF NOT EXISTS idx_product_access_customer_email ON product_access(customer_email);
CREATE INDEX IF NOT EXISTS idx_product_access_product_id ON product_access(product_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_order_id ON refund_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_customer_email ON refund_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_access_updated_at BEFORE UPDATE ON product_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_refund_requests_updated_at BEFORE UPDATE ON refund_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

// Utility Functions
export class RefundPolicyManager {
  // Check if a product access is eligible for refund
  static isRefundEligible(access: ProductAccess): boolean {
    // Not eligible if already accessed or downloaded
    if (access.accessedAt || access.downloadedAt) {
      return false;
    }

    // Not eligible if refund already requested/processed
    if (access.refundStatus !== 'none') {
      return false;
    }

    // Check if within time window (24 hours)
    const hoursSincePurchase = (Date.now() - access.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSincePurchase > REFUND_POLICY.MAX_REFUND_HOURS) {
      return false;
    }

    return true;
  }

  // Mark product as accessed (tracks download/access)
  static async markProductAccessed(orderId: string, productId: string, accessType: 'download' | 'access'): Promise<boolean> {
    try {
      // In a real implementation, this would update the database
      console.log(`Marking product ${productId} in order ${orderId} as ${accessType}ed`);

      // Update product_access table
      const updateField = accessType === 'download' ? 'downloaded_at' : 'accessed_at';

      // This would be a database update:
      // UPDATE product_access
      // SET ${updateField} = NOW(), refund_eligible = false
      // WHERE order_id = $1 AND product_id = $2

      return true;
    } catch (error) {
      console.error('Error marking product as accessed:', error);
      return false;
    }
  }

  // Create refund request
  static async createRefundRequest(orderId: string, productId: string, customerEmail: string, reason: string, amount: number): Promise<RefundRequest | null> {
    try {
      const refundRequest: RefundRequest = {
        id: crypto.randomUUID(),
        orderId,
        productId,
        customerId: '', // Would be set from session
        customerEmail,
        reason,
        requestedAt: new Date(),
        status: 'pending',
        refundAmount: amount
      };

      // In a real implementation, this would insert into database
      console.log('Creating refund request:', refundRequest);

      return refundRequest;
    } catch (error) {
      console.error('Error creating refund request:', error);
      return null;
    }
  }

  // Get refund eligibility status
  static async getRefundEligibility(orderId: string, productId: string): Promise<{
    eligible: boolean;
    reason: string;
    timeRemaining?: number;
  }> {
    try {
      // This would query the database for product access
      // For now, simulating the response
      const mockAccess: ProductAccess = {
        id: '1',
        orderId,
        productId,
        customerId: '',
        customerEmail: '',
        accessedAt: null,
        downloadedAt: null,
        refundEligible: true,
        refundRequestedAt: null,
        refundStatus: 'none',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      };

      if (mockAccess.accessedAt || mockAccess.downloadedAt) {
        return {
          eligible: false,
          reason: "Product has already been downloaded or accessed. Refunds are not available for used digital products."
        };
      }

      if (mockAccess.refundStatus !== 'none') {
        return {
          eligible: false,
          reason: `Refund has already been ${mockAccess.refundStatus}. No additional refunds are possible.`
        };
      }

      const hoursSincePurchase = (Date.now() - mockAccess.createdAt.getTime()) / (1000 * 60 * 60);
      const hoursRemaining = REFUND_POLICY.MAX_REFUND_HOURS - hoursSincePurchase;

      if (hoursRemaining <= 0) {
        return {
          eligible: false,
          reason: `Refund window has expired. Refunds must be requested within ${REFUND_POLICY.MAX_REFUND_HOURS} hours of purchase.`
        };
      }

      return {
        eligible: true,
        reason: "Product is eligible for refund as it has not been accessed.",
        timeRemaining: Math.round(hoursRemaining * 100) / 100
      };

    } catch (error) {
      console.error('Error checking refund eligibility:', error);
      return {
        eligible: false,
        reason: "Unable to check refund eligibility. Please contact support."
      };
    }
  }

  // Generate refund policy notice for checkout
  static getCheckoutNotice(): string {
    return `
🔒 **IMPORTANT REFUND POLICY**

${REFUND_POLICY.SUMMARY}

By completing this purchase, you acknowledge that:
• Refunds are only available BEFORE downloading or accessing the product
• Once downloaded/accessed, the sale is final
• You have ${REFUND_POLICY.MAX_REFUND_HOURS} hours from purchase to request a refund (if not accessed)
• Product previews and descriptions should be reviewed before purchasing
    `.trim();
  }

  // Generate order confirmation notice
  static getOrderConfirmationNotice(): string {
    return `
📋 **Refund Policy Reminder**

Your digital products are now available for download. Please note:

⚠️ **BEFORE YOU DOWNLOAD**: Refunds are only available BEFORE accessing or downloading your products.

✅ **Still eligible**: You can request a refund within ${REFUND_POLICY.MAX_REFUND_HOURS} hours if you haven't downloaded anything yet.

❌ **After download**: Once you download or access any product, refunds are no longer possible.

Need a refund? Request it now before downloading: [Request Refund]
    `.trim();
  }
}

// Mock data for development
export const mockProductAccess: ProductAccess[] = [
  {
    id: '1',
    orderId: 'order_123',
    productId: 'prod_456',
    customerId: 'cust_789',
    customerEmail: 'customer@example.com',
    accessedAt: null,
    downloadedAt: null,
    refundEligible: true,
    refundRequestedAt: null,
    refundStatus: 'none',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
  },
  {
    id: '2',
    orderId: 'order_124',
    productId: 'prod_457',
    customerId: 'cust_789',
    customerEmail: 'customer@example.com',
    accessedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    downloadedAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
    refundEligible: false,
    refundRequestedAt: null,
    refundStatus: 'none',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  }
];
