"use client";

import { StripeCheckout } from "@/components/StripeCheckout";
import { ShoppingCartTrigger } from "@/components/ShoppingCart";
import { UserMenu } from "@/components/AuthDialog";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
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
                href="/products"
                className="flex items-center text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Continue Shopping
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingCartTrigger />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">
            Secure Checkout
          </h1>
          <p className="text-neutral-600">
            Complete your purchase with confidence
          </p>
        </div>

        {/* Checkout Component */}
        <StripeCheckout />

        {/* Security Features */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">🔒</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">
                SSL Encrypted
              </h3>
              <p className="text-sm text-neutral-600">
                Your data is protected with 256-bit encryption
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">⚡</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">
                Instant Delivery
              </h3>
              <p className="text-sm text-neutral-600">
                Download links available immediately
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">💯</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">
                Money Back Guarantee
              </h3>
              <p className="text-sm text-neutral-600">
                30-day refund policy on all products
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
