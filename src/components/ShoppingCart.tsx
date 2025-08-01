"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { stripeService } from "@/lib/stripe-config";
import { paypalService } from "@/lib/paypal-config";
import { triggerAbandonedCart } from "@/lib/emailAutomation";
import { ShoppingBag, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { safeNavigate, safeLocalStorage } from "@/lib/browser-utils";

export function ShoppingCart() {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">(
    "stripe",
  );
  const [customerInfo, setCustomerInfo] = useState({
    email: user?.email || "",
    name: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // Calculate pricing
  const subtotal = total;
  const tax = subtotal * 0.08; // 8% tax
  const finalTotal = subtotal + tax;

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      if (typeof window === "undefined") return;

      const checkoutData = {
        cartItems: items,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        successUrl: `${safeNavigate.getOrigin()}/checkout/success`,
        cancelUrl: `${safeNavigate.getOrigin()}/checkout/cancel`,
      };

      if (paymentMethod === "stripe") {
        const session = await stripeService.createCheckoutSession(
          items,
          customerInfo,
        );
        safeNavigate.redirect(session.url);
      } else {
        const order = await paypalService.createOrder(items, customerInfo);
        // In a real implementation, you would redirect to PayPal approval URL
        console.log("PayPal order created:", order);
        alert("PayPal checkout would redirect here. Demo only.");
      }

      clearCart();
      setIsCheckingOut(false);
      setShowCheckout(false);
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsCheckingOut(false);
      alert("Checkout failed. Please try again.");
    }
  };

  // Trigger abandoned cart email when user closes cart with items
  const handleCartClose = () => {
    if (items.length > 0 && user && typeof window !== "undefined") {
      // Trigger abandoned cart email after 2 hours
      setTimeout(
        () => {
          triggerAbandonedCart(user.id, items, total);
        },
        2 * 60 * 60 * 1000,
      );
    }
  };

  // Enhanced abandoned cart tracking
  const handleCartActivity = () => {
    if (items.length > 0 && user && typeof window !== "undefined") {
      try {
        // Store cart session for analytics
        localStorage.setItem(
          "cart_session",
          JSON.stringify({
            userId: user.id,
            items: items,
            total: total,
            lastActivity: new Date().toISOString(),
          }),
        );
      } catch (error) {
        console.error("Failed to save cart session:", error);
      }
    }
  };

  if (showCheckout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCheckout(false)}
          >
            ← Back to Cart
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Checkout</h3>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">
              Payment Method
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === "stripe"
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === "paypal"
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <span className="text-blue-600 font-bold">PayPal</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={customerInfo.city}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  placeholder="New York"
                />
              </div>
              <div>
                <Label htmlFor="postal">Postal Code</Label>
                <Input
                  id="postal"
                  value={customerInfo.postalCode}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                  placeholder="10001"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={customerInfo.country}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  placeholder="USA"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full bg-neutral-900 hover:bg-neutral-800"
          disabled={isCheckingOut || !customerInfo.email || !customerInfo.name}
        >
          {isCheckingOut ? (
            "Processing..."
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Complete Purchase - ${finalTotal.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Shopping Cart</h3>
        <p className="text-sm text-neutral-600">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-xs text-neutral-600 mb-2">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm w-8 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="h-6 w-6 p-0 text-neutral-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button className="w-full bg-neutral-900 hover:bg-neutral-800">
              Proceed to Checkout
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

export function ShoppingCartTrigger() {
  const { itemCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingBag className="h-4 w-4" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-neutral-900 text-white text-xs rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <ShoppingCart />
        </div>
      </SheetContent>
    </Sheet>
  );
}
