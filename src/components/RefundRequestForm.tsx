"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  DollarSign,
  FileText,
  Send
} from "lucide-react";
import { REFUND_POLICY } from "@/lib/refundPolicy";

interface RefundRequestFormProps {
  orderId?: string;
  productId?: string;
  productName?: string;
  purchaseAmount?: number;
  customerEmail?: string;
  onSuccess?: (refundId: string) => void;
  onError?: (error: string) => void;
}

interface RefundEligibility {
  eligible: boolean;
  reason: string;
  timeRemaining?: number;
}

export default function RefundRequestForm({
  orderId = "order_demo_123",
  productId = "prod_demo_456",
  productName = "Sample Digital Product",
  purchaseAmount = 29.99,
  customerEmail = "",
  onSuccess,
  onError
}: RefundRequestFormProps) {
  const [eligibility, setEligibility] = useState<RefundEligibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    customReason: "",
    email: customerEmail
  });

  // Check refund eligibility on component mount
  useEffect(() => {
    checkRefundEligibility();
  }, [orderId, productId]);

  const checkRefundEligibility = async () => {
    try {
      setLoading(true);

      // In a real implementation, this would call the actual API
      const response = await fetch(`/api/refunds?orderId=${orderId}&productId=${productId}`);

      if (response.ok) {
        const data = await response.json();
        setEligibility(data.eligibility);
      } else {
        // Mock response for demo
        setEligibility({
          eligible: true,
          reason: "Product is eligible for refund as it has not been accessed.",
          timeRemaining: 22.5
        });
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      // Mock eligibility for demo
      setEligibility({
        eligible: true,
        reason: "Product is eligible for refund as it has not been accessed.",
        timeRemaining: 22.5
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eligibility?.eligible) {
      onError?.("This order is not eligible for a refund.");
      return;
    }

    if (!formData.reason) {
      onError?.("Please select a reason for the refund.");
      return;
    }

    if (!formData.email) {
      onError?.("Please provide your email address.");
      return;
    }

    setSubmitting(true);

    try {
      const refundReason = formData.reason === "Other" ? formData.customReason : formData.reason;

      const response = await fetch('/api/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          productId,
          customerEmail: formData.email,
          reason: refundReason,
          amount: purchaseAmount
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        onSuccess?.(data.refundRequest.id);
      } else {
        onError?.(data.error || 'Failed to submit refund request');
      }
    } catch (error) {
      console.error('Error submitting refund:', error);
      onError?.('Failed to submit refund request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-gray-600">Checking refund eligibility...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-6 w-6" />
            Refund Request Submitted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <p className="text-green-800 mb-2">
              Your refund request has been successfully submitted and is being reviewed.
            </p>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Product:</strong> {productName}</p>
              <p><strong>Amount:</strong> ${purchaseAmount.toFixed(2)}</p>
              <p><strong>Expected Processing:</strong> 3-5 business days</p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              You will receive email updates about the status of your refund request.
              Approved refunds will be processed to your original payment method.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!eligibility?.eligible) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <XCircle className="h-6 w-6" />
            Refund Not Available
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <p className="text-red-800 mb-2 font-medium">
              This order is not eligible for a refund.
            </p>
            <p className="text-sm text-red-700">
              {eligibility.reason}
            </p>
          </div>

          <div className="text-sm text-red-700 space-y-1">
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Product:</strong> {productName}</p>
            <p><strong>Amount:</strong> ${purchaseAmount.toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">
              If you believe this is an error or have special circumstances,
              please contact our support team with your order details.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-blue-600" />
          Request Refund
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Eligible for Refund
          </Badge>
          {eligibility.timeRemaining && (
            <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-300">
              <Clock className="h-3 w-3 mr-1" />
              {eligibility.timeRemaining.toFixed(1)}h remaining
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Product:</strong> {productName}</p>
            <p><strong>Amount:</strong> ${purchaseAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> Not accessed (eligible for refund)</p>
          </div>
        </div>

        {/* Refund Policy Reminder */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Refund Policy Reminder</p>
              <p>{REFUND_POLICY.SUMMARY}</p>
            </div>
          </div>
        </div>

        {/* Refund Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason for Refund *</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REFUND_POLICY.REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.reason === "Other" && (
            <div>
              <Label htmlFor="customReason">Please specify *</Label>
              <Textarea
                id="customReason"
                value={formData.customReason}
                onChange={(e) => setFormData(prev => ({ ...prev, customReason: e.target.value }))}
                placeholder="Please describe your reason for requesting a refund"
                rows={3}
                required
              />
            </div>
          )}

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Once you submit this refund request, you will not be able to download or access this product while the request is being processed.
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitting || !formData.reason || !formData.email}
            className="w-full"
            size="lg"
          >
            {submitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Submitting Refund Request...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Refund Request
              </>
            )}
          </Button>
        </form>

        <div className="text-xs text-gray-600 space-y-1">
          <p>• Refund requests are typically processed within 3-5 business days</p>
          <p>• You will receive email updates about your refund status</p>
          <p>• Approved refunds will be returned to your original payment method</p>
        </div>
      </CardContent>
    </Card>
  );
}
