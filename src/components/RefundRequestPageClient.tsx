"use client";

import RefundRequestForm from "@/components/RefundRequestForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundRequestPageClient() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-neutral-900">
                DigiNest.io
              </Link>
              <Link
                href="/account"
                className="flex items-center text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">
            Request Refund
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Request a refund for your digital product purchase. Please note that refunds are only available
            for products that have not been downloaded or accessed.
          </p>
        </div>

        {/* Refund Request Form */}
        <RefundRequestForm
          orderId="order_demo_123"
          productId="prod_demo_456"
          productName="Digital Marketing Toolkit"
          purchaseAmount={29.99}
          customerEmail="customer@example.com"
          onSuccess={(refundId) => {
            alert(`Refund request submitted successfully! Reference: ${refundId}`);
          }}
          onError={(error) => {
            alert(`Error submitting refund request: ${error}`);
          }}
        />

        {/* Help Section */}
        <div className="mt-12 text-center">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you're experiencing technical issues or have questions about our refund policy,
              our support team is here to help.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/terms"
                className="text-blue-600 hover:underline text-sm"
              >
                View Refund Policy
              </Link>
              <span className="text-gray-400">•</span>
              <a
                href="mailto:support@diginest.io"
                className="text-blue-600 hover:underline text-sm"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
