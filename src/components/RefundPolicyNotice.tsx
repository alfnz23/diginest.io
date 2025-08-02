"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  Clock,
  Download,
  Shield,
  Info,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";
import { REFUND_POLICY } from "@/lib/refundPolicy";

interface RefundPolicyNoticeProps {
  variant?: 'checkout' | 'order-confirmation' | 'product-access' | 'full-policy';
  orderId?: string;
  productId?: string;
  productName?: string;
  timeRemaining?: number;
  refundEligible?: boolean;
  refundReason?: string;
  onAcknowledge?: (acknowledged: boolean) => void;
  className?: string;
}

export default function RefundPolicyNotice({
  variant = 'checkout',
  orderId,
  productId,
  productName,
  timeRemaining,
  refundEligible = true,
  refundReason,
  onAcknowledge,
  className = ""
}: RefundPolicyNoticeProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleAcknowledge = (checked: boolean) => {
    setAcknowledged(checked);
    onAcknowledge?.(checked);
  };

  // Checkout Notice
  if (variant === 'checkout') {
    return (
      <Card className={`border-orange-200 bg-orange-50 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            Important Refund Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <p className="text-sm font-medium text-orange-900 mb-2">
              {REFUND_POLICY.SUMMARY}
            </p>
            <div className="space-y-2 text-xs text-orange-800">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Refund window: {REFUND_POLICY.MAX_REFUND_HOURS} hours from purchase</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                <span>Refunds impossible after download or access</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                <span>Automatic tracking ensures fair policy application</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-orange-100 rounded-lg">
            <Checkbox
              id="refund-policy-acknowledgment"
              checked={acknowledged}
              onCheckedChange={handleAcknowledge}
              className="mt-1"
            />
            <label
              htmlFor="refund-policy-acknowledgment"
              className="text-sm text-orange-900 cursor-pointer leading-relaxed"
            >
              I understand and acknowledge the refund policy. I am aware that refunds are only available before downloading or accessing digital products.
            </label>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-orange-700 border-orange-300 hover:bg-orange-100"
          >
            <FileText className="h-4 w-4 mr-2" />
            {expanded ? 'Hide' : 'Read'} Full Policy
          </Button>

          {expanded && (
            <div className="bg-white p-4 rounded-lg border border-orange-200 text-sm text-gray-700">
              <pre className="whitespace-pre-wrap font-sans">{REFUND_POLICY.FULL_TEXT}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Order Confirmation Notice
  if (variant === 'order-confirmation') {
    return (
      <Card className={`border-blue-200 bg-blue-50 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            Your Order is Ready - Refund Policy Reminder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 mb-1">
                  Before You Download - Refund Policy
                </p>
                <p className="text-sm text-blue-800">
                  {REFUND_POLICY.SUMMARY}
                </p>
              </div>
            </div>

            {refundEligible && timeRemaining && (
              <div className="flex items-center gap-2 p-2 bg-green-100 rounded text-green-800 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>
                  Still eligible for refund • Time remaining: {timeRemaining.toFixed(1)} hours
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                <CheckCircle className="h-4 w-4" />
                Still Eligible
              </div>
              <p className="text-green-700">
                You can request a refund within {REFUND_POLICY.MAX_REFUND_HOURS} hours if you haven't downloaded anything yet.
              </p>
            </div>

            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-1">
                <XCircle className="h-4 w-4" />
                After Download
              </div>
              <p className="text-red-700">
                Once you download or access any product, refunds are no longer possible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Product Access Warning
  if (variant === 'product-access') {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Final Refund Warning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <p className="font-medium text-red-900 mb-2">
              You are about to access: {productName || 'this digital product'}
            </p>
            <p className="text-sm text-red-800 mb-3">
              ⚠️ <strong>Important:</strong> Once you download or access this product, you will no longer be eligible for a refund.
            </p>
            <div className="text-xs text-red-700 space-y-1">
              <p>• This action is irreversible</p>
              <p>• The download will be tracked automatically</p>
              <p>• Refund eligibility will be permanently removed</p>
            </div>
          </div>

          {refundEligible && timeRemaining && (
            <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
              <p className="text-sm text-yellow-800">
                <Clock className="h-4 w-4 inline mr-1" />
                You still have {timeRemaining.toFixed(1)} hours to request a refund if you change your mind.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full Policy Display
  if (variant === 'full-policy') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {REFUND_POLICY.TITLE}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
            Effective for All Digital Products
          </Badge>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-medium text-blue-900 mb-2">Policy Summary</p>
            <p className="text-sm text-blue-800">{REFUND_POLICY.SUMMARY}</p>
          </div>

          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg">
              {REFUND_POLICY.FULL_TEXT}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-900 mb-2">Common Refund Reasons</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              {REFUND_POLICY.REASONS.map((reason, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
