import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ShoppingCartTrigger } from "@/components/ShoppingCart";
import { UserMenu } from "@/components/AuthDialog";
import ProductsPageClient from "@/components/ProductsPageClient";
import { BlueprintBackground } from "@/components/BlueprintBackground";

// Force dynamic rendering - disable all static generation
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Blueprint Background Component */}
      <BlueprintBackground />

      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-neutral-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-neutral-900">
                DigiNest.io
              </Link>
              <Link
                href="/"
                className="flex items-center text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
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
        <div className="mb-8">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">
            All Products
          </h1>
          <p className="text-neutral-600">
            Discover our complete collection of premium digital products
          </p>
        </div>

        {/* Products Client Component */}
        <ProductsPageClient />
      </div>
    </div>
  );
}
