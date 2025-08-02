"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  ExternalLink
} from "lucide-react";
import RefundPolicyNotice from "./RefundPolicyNotice";

interface ProductAccessTrackerProps {
  orderId: string;
  productId: string;
  productName: string;
  downloadUrl: string;
  previewUrl?: string;
  customerEmail: string;
  refundEligible: boolean;
  timeRemainingForRefund?: number;
  onAccess?: (accessType: 'download' | 'access' | 'preview') => void;
}

export default function ProductAccessTracker({
  orderId,
  productId,
  productName,
  downloadUrl,
  previewUrl,
  customerEmail,
  refundEligible,
  timeRemainingForRefund,
  onAccess
}: ProductAccessTrackerProps) {
  const [showRefundWarning, setShowRefundWarning] = useState(false);
  const [pendingAccessType, setPendingAccessType] = useState<'download' | 'access' | null>(null);
  const [accessed, setAccessed] = useState(false);
  const [accessedAt, setAccessedAt] = useState<Date | null>(null);

  const trackAccess = async (accessType: 'download' | 'access' | 'preview') => {
    try {
      // Track the access in the database
      const response = await fetch('/api/product-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          productId,
          customerEmail,
          accessType,
          userAgent: navigator.userAgent
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Access tracked:', data);

        if (accessType !== 'preview') {
          setAccessed(true);
          setAccessedAt(new Date());
        }

        onAccess?.(accessType);
      } else {
        console.error('Failed to track access:', data.error);
      }
    } catch (error) {
      console.error('Error tracking access:', error);
    }
  };

  const handleDownload = () => {
    if (refundEligible && !accessed) {
      setShowRefundWarning(true);
      setPendingAccessType('download');
    } else {
      proceedWithDownload();
    }
  };

  const handleAccess = () => {
    if (refundEligible && !accessed) {
      setShowRefundWarning(true);
      setPendingAccessType('access');
    } else {
      proceedWithAccess();
    }
  };

  const handlePreview = () => {
    trackAccess('preview');
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const proceedWithDownload = () => {
    trackAccess('download');

    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = productName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowRefundWarning(false);
    setPendingAccessType(null);
  };

  const proceedWithAccess = () => {
    trackAccess('access');

    // Open in new tab
    window.open(downloadUrl, '_blank');

    setShowRefundWarning(false);
    setPendingAccessType(null);
  };

  const cancelAccess = () => {
    setShowRefundWarning(false);
    setPendingAccessType(null);
  };

  if (showRefundWarning) {
    return (
      <div className="space-y-4">
        <RefundPolicyNotice
          variant="product-access"
          productName={productName}
          refundEligible={refundEligible}
          timeRemaining={timeRemainingForRefund}
        />

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={cancelAccess}
                className="border-gray-300"
              >
                Cancel - Keep Refund Eligibility
              </Button>
              <Button
                onClick={pendingAccessType === 'download' ? proceedWithDownload : proceedWithAccess}
                className="bg-red-600 hover:bg-red-700"
              >
                Proceed - I Understand No Refunds
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Access Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Product Access
          </CardTitle>
          <div className="flex items-center gap-2">
            {accessed ? (
              <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Accessed - No Refunds
              </Badge>
            ) : refundEligible ? (
              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Refund Eligible
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-300">
                <Shield className="h-3 w-3 mr-1" />
                No Refunds
              </Badge>
            )}

            {refundEligible && timeRemainingForRefund && (
              <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-300">
                <Clock className="h-3 w-3 mr-1" />
                {timeRemainingForRefund.toFixed(1)}h remaining
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Product Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{productName}</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Product ID:</strong> {productId}</p>
              {accessedAt && (
                <p><strong>Accessed:</strong> {accessedAt.toLocaleString()}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Preview Button (if available) */}
            {previewUrl && (
              <Button
                variant="outline"
                onClick={handlePreview}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            )}

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              disabled={accessed}
              className={accessed ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
            >
              <Download className="h-4 w-4 mr-2" />
              {accessed ? "Already Downloaded" : "Download"}
            </Button>

            {/* Access Online Button */}
            <Button
              variant="outline"
              onClick={handleAccess}
              disabled={accessed}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {accessed ? "Already Accessed" : "Access Online"}
            </Button>
          </div>

          {/* Refund Policy Notice */}
          {!accessed && refundEligible && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Refund Policy Notice</p>
                  <p>
                    This product is currently eligible for a refund. Once you download or access it,
                    refunds will no longer be possible. You have {timeRemainingForRefund?.toFixed(1)} hours
                    remaining to request a refund if needed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Access Confirmation */}
          {accessed && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Product Accessed</p>
                  <p>
                    You have successfully accessed this digital product. As per our refund policy,
                    this product is no longer eligible for refunds. Thank you for your purchase!
                  </p>
                  {accessedAt && (
                    <p className="text-xs text-gray-600 mt-2">
                      Accessed on: {accessedAt.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>• Downloads and access are tracked automatically</p>
        <p>• Preview access does not affect refund eligibility</p>
        <p>• Contact support if you experience technical issues</p>
      </div>
    </div>
  );
}
