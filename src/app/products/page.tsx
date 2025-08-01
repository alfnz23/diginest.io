import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ShoppingCartTrigger } from "@/components/ShoppingCart";
import { UserMenu } from "@/components/AuthDialog";
import ProductsPageClient from "@/components/ProductsPageClient";
import { BlueprintBackground } from "@/components/BlueprintBackground";
import { Suspense } from "react";

// Force dynamic rendering - disable all static generation
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  // Safely extract category from search params
  const category = typeof searchParams?.category === 'string' ? searchParams.category : '';

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
            {category ? `${getCategoryDisplayName(category)} Products` : 'All Products'}
          </h1>
          <p className="text-neutral-600">
            {category
              ? `Browse our collection of ${getCategoryDisplayName(category).toLowerCase()}`
              : 'Discover our complete collection of premium digital products'
            }
          </p>
        </div>

        {/* Products Client Component with Suspense */}
        <Suspense fallback={<ProductsLoadingFallback />}>
          <ProductsPageClient initialCategory={category} />
        </Suspense>
      </div>
    </div>
  );
}

// Helper function to get display names for categories
function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    'ebooks': 'eBook',
    'planners': 'Planner',
    'templates': 'Template',
    'tools': 'Design Tool',
    'health': 'Health & Nutrition',
    'fitness': 'Fitness & Training',
  };
  return categoryNames[category] || 'Digital Product';
}

// Loading fallback component
function ProductsLoadingFallback() {
  return (
    <div className="space-y-8">
      {/* Search/Filter skeleton */}
      <div className="h-12 bg-neutral-200 rounded-lg animate-pulse"></div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-neutral-200 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-3 bg-neutral-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
