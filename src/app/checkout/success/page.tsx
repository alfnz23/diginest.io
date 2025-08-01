"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Download, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  name: string;
  price: number;
  downloadUrl: string;
}

interface OrderDetails {
  orderId: string;
  total: number;
  items: OrderItem[];
  customerEmail: string;
}

export default function CheckoutSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate order processing
    const processOrder = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock order details
      setOrderDetails({
        orderId: `ORDER-${Date.now()}`,
        total: 74.99,
        items: [
          {
            name: "Minimalist Digital Planner",
            price: 29.99,
            downloadUrl: "/downloads/planner.zip",
          },
          {
            name: "Productivity Handbook",
            price: 19.99,
            downloadUrl: "/downloads/handbook.pdf",
          },
          {
            name: "Self-Care Planner",
            price: 24.99,
            downloadUrl: "/downloads/selfcare.zip",
          },
        ],
        customerEmail: "customer@example.com",
      });

      setIsLoading(false);
    };

    processOrder();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4" />
          <p className="text-neutral-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-neutral-900">
              DigiNest.io
            </Link>
            <Link
              href="/"
              className="flex items-center text-neutral-600 hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Store
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-light text-neutral-900 mb-4">
            Order Complete!
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Thank you for your purchase. Your digital products are ready for
            download.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Order #{orderDetails?.orderId}
            </CardTitle>
            <CardDescription>
              Confirmation email sent to {orderDetails?.customerEmail}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails?.items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-neutral-900">{item.name}</h3>
                  <p className="text-sm text-neutral-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-neutral-900 hover:bg-neutral-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-bold">
                  ${orderDetails?.total.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/account">
            <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800">
              View My Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
