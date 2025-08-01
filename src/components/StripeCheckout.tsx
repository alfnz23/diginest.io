"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { stripeService, getStripe } from "@/lib/stripe-config";
import { paypalService } from "@/lib/paypal-config";
import {
  CreditCard,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Receipt,
} from "lucide-react";
import { PurchaseReceipt } from "./PurchaseReceipt";
import { safeNavigate } from "@/lib/browser-utils";

interface CheckoutFormData {
  email: string;
  name: string;
  acceptTerms: boolean;
  confirmPurchase: boolean;
  paymentMethod: "stripe" | "paypal";
}

interface DemoOrderDetails {
  orderId: string;
  orderDate: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: string;
  transactionId?: string;
  downloadUrls: Array<{
    productId: string;
    productName: string;
    downloadUrl: string;
  }>;
}

export function StripeCheckout() {
  const { items: cartItems, total: cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<DemoOrderDetails | null>(
    null,
  );
  const [showReceipt, setShowReceipt] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: user?.email || "",
    name: user?.name || "",
    acceptTerms: false,
    confirmPurchase: false,
    paymentMethod: "stripe",
  });

  const generateOrderDetails = (
    paymentMethod: string,
    transactionId?: string,
  ): DemoOrderDetails => {
    const orderId = `DN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    return {
      orderId,
      orderDate: new Date().toISOString(),
      customerEmail: formData.email,
      customerName: formData.name,
      paymentMethod: paymentMethod,
      transactionId,
      downloadUrls: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        downloadUrl: item.downloadUrl || `/downloads/${item.id}.zip`,
      })),
    };
  };

  const handleCheckout = async () => {
    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    if (!formData.confirmPurchase) {
      setError("Please confirm your purchase details");
      return;
    }

    if (!formData.email || !formData.name) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const customerInfo = {
        email: formData.email,
        name: formData.name,
        userId: user?.id,
      };

      if (formData.paymentMethod === "stripe") {
        // Create Stripe checkout session
        const session = await stripeService.createCheckoutSession(
          cartItems,
          customerInfo,
        );

        if (session.url && typeof window !== "undefined") {
          safeNavigate.redirect(session.url);
        } else {
          throw new Error("No checkout URL received");
        }
      } else {
        // Create PayPal order
        const order = await paypalService.createOrder(cartItems, customerInfo);
        console.log("PayPal order created:", order);

        // For demo purposes, show success message
        alert(
          `PayPal order created successfully! Order ID: ${order.id}\n\nIn production, you would be redirected to PayPal to complete payment.`,
        );

        // In a real implementation, redirect to PayPal approval URL:
        // window.location.href = order.approvalUrl;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create checkout session",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRealStripeCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      // Create real checkout session via your backend
      const session = await stripeService.createRealCheckoutSession(cartItems, {
        email: formData.email,
        name: formData.name,
        userId: user?.id,
      });

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error("Real Stripe checkout error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to redirect to checkout",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cartTotal;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  // Show receipt if purchase is complete
  if (showReceipt && orderDetails) {
    return (
      <PurchaseReceipt
        receiptData={{
          orderId: orderDetails.orderId,
          orderDate: orderDetails.orderDate,
          customerEmail: orderDetails.customerEmail,
          customerName: orderDetails.customerName,
          items: cartItems,
          subtotal: subtotal,
          tax: tax,
          total: total,
          paymentMethod: orderDetails.paymentMethod,
          transactionId: orderDetails.transactionId,
          downloadUrls: orderDetails.downloadUrls,
        }}
        onDownloadReceipt={() => {
          console.log("Download receipt requested");
        }}
      />
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Empty Cart
          </CardTitle>
          <CardDescription>
            Add some products to your cart before checkout
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Review your digital products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(cartItems || []).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-neutral-600">{item.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">Qty: {item.quantity}</Badge>
                  <span className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Instant Digital Delivery
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Download links will be available immediately after payment
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Secure Checkout
          </CardTitle>
          <CardDescription>
            Complete your purchase with Stripe's secure payment system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Payment Method</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, paymentMethod: "stripe" }))
                }
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  formData.paymentMethod === "stripe"
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, paymentMethod: "paypal" }))
                }
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  formData.paymentMethod === "paypal"
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                  P
                </div>
                <span className="font-medium text-blue-600">PayPal</span>
              </button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="your@email.com"
                required
                disabled={!!user}
              />
              {user && (
                <p className="text-xs text-neutral-500 mt-1">
                  Logged in as {user.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="John Doe"
                required
                disabled={!!user}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 p-4 border border-neutral-200 rounded-lg bg-neutral-50/50">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    acceptTerms: checked === true,
                  }))
                }
                className="mt-0.5"
              />
              <div className="space-y-2">
                <label
                  htmlFor="terms"
                  className="text-sm text-neutral-800 font-medium leading-relaxed cursor-pointer"
                >
                  I accept the{" "}
                  <a
                    href="/terms"
                    className="text-blue-600 underline hover:text-blue-800 transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-blue-600 underline hover:text-blue-800 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </label>
                <p className="text-xs text-neutral-500">
                  By checking this box, you confirm that you understand and
                  agree to our terms and privacy practices.
                </p>
              </div>
            </div>

            {/* Purchase Confirmation */}
            <div className="flex items-start gap-3 p-4 border border-neutral-200 rounded-lg bg-blue-50/50">
              <Checkbox
                id="confirm-purchase"
                checked={formData.confirmPurchase}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPurchase: checked === true,
                  }))
                }
                className="mt-0.5"
              />
              <div className="space-y-2">
                <label
                  htmlFor="confirm-purchase"
                  className="text-sm text-neutral-800 font-medium leading-relaxed cursor-pointer"
                >
                  I confirm my purchase details and authorize payment
                </label>
                <div className="text-xs text-neutral-600 space-y-1">
                  <p>
                    • Total:{" "}
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </p>
                  <p>
                    • Items:{" "}
                    <span className="font-medium">
                      {cartItems.length} digital product
                      {cartItems.length > 1 ? "s" : ""}
                    </span>
                  </p>
                  <p>• All sales are final for digital products</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {/* Main Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isLoading || !formData.acceptTerms}
                className={`w-full ${formData.paymentMethod === "paypal" ? "bg-blue-600 hover:bg-blue-700" : "bg-neutral-900 hover:bg-neutral-800"}`}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {formData.paymentMethod === "stripe" ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Pay ${total.toFixed(2)} with Stripe
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 bg-white rounded mr-2 flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">
                            P
                          </span>
                        </div>
                        Pay ${total.toFixed(2)} with PayPal
                      </>
                    )}
                  </>
                )}
              </Button>

              {/* Real Stripe Button (for development) */}
              {process.env.NODE_ENV === "development" &&
                formData.paymentMethod === "stripe" && (
                  <Button
                    onClick={handleRealStripeCheckout}
                    disabled={isLoading || !formData.acceptTerms}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay with Real Stripe (Dev)
                      </>
                    )}
                  </Button>
                )}

              {/* Demo Receipt Button (for testing) */}
              {process.env.NODE_ENV === "development" && (
                <Button
                  onClick={() => {
                    const mockOrderDetails = generateOrderDetails(
                      "Demo Payment",
                      `demo_${Date.now()}`,
                    );
                    setOrderDetails(mockOrderDetails);
                    setShowReceipt(true);
                  }}
                  disabled={
                    isLoading ||
                    !formData.acceptTerms ||
                    !formData.confirmPurchase
                  }
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Demo Receipt (Testing)
                </Button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
              <Lock className="h-3 w-3" />
              <span>
                {formData.paymentMethod === "stripe"
                  ? "Secured by Stripe | 256-bit SSL encryption"
                  : "Secured by PayPal | Industry-leading security"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DownloadUrl {
  productId: string;
  productName: string;
  downloadUrl: string;
}

interface OrderDetails {
  id: string;
  sessionId: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
  downloadUrls: DownloadUrl[];
}

export function PaymentSuccess({ sessionId }: { sessionId: string }) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    const processPayment = async () => {
      try {
        const order = await stripeService.handleSuccessfulPayment(sessionId);
        setOrderDetails(order);
      } catch (error) {
        console.error("Error processing payment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    processPayment();
  });

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p>Processing your payment...</p>
        </CardContent>
      </Card>
    );
  }

  if (!orderDetails) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p>Payment processing error. Please contact support.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle>Payment Successful!</CardTitle>
        <CardDescription>
          Your order has been processed and your downloads are ready
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-neutral-50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Order #{orderDetails.id}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{orderDetails.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{orderDetails.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium">
                ${orderDetails.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Your Downloads</h3>
          <div className="space-y-3">
            {orderDetails.downloadUrls.map((download: DownloadUrl) => (
              <div
                key={download.productId}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">{download.productName}</span>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-neutral-600">
          <p>
            A confirmation email has been sent to {orderDetails.customerEmail}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
