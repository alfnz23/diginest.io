import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCartTrigger } from "@/components/ShoppingCart";
import { UserMenu } from "@/components/AuthDialog";
import {
  EmailNewsletter,
  FooterNewsletter,
} from "@/components/EmailNewsletter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  ChevronRight,
  Star,
  Download,
  Users,
  Clock,
  TrendingUp,
  BookOpen,
  Calendar,
  FileText,
  Palette,
  Heart,
  Dumbbell,
} from "lucide-react";
import HomePageClient from "@/components/HomePageClient";
import { BlueprintBackground } from "@/components/BlueprintBackground";

// Force dynamic rendering - disable all static generation
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Featured products for the homepage (server-side data)
const featuredProducts = [
  {
    id: "product-25",
    name: "Wedding Planning Organizer",
    description:
      "Complete wedding planning system with checklists, budgets, and vendor management",
    price: 35.99,
    image: "https://ugc.same-assets.com/DJAgD61a-4T_nzFwTL1ekGXObpjr-hMN.jpeg",
    category: "planners",
    rating: 4.9,
    reviews: 423,
  },
  {
    id: "product-19",
    name: "Digital Marketing Mastery",
    description:
      "Complete guide to modern digital marketing strategies including SEO, social media, and PPC",
    price: 34.99,
    image: "https://ugc.same-assets.com/s5O7a8ldSmwD4vVf-5T89qmCmnnpQCO4.jpeg",
    category: "ebooks",
    rating: 4.8,
    reviews: 342,
  },
  {
    id: "product-32",
    name: "Logo Design Kit",
    description:
      "Complete logo design toolkit with icons, fonts, and brand guidelines",
    price: 45.99,
    image: "https://ugc.same-assets.com/AkLo0ZKe4I00cqqWt5-74qVVQT79X85U.jpeg",
    category: "tools",
    rating: 4.8,
    reviews: 234,
  },
  {
    id: "product-39",
    name: "Yoga Flow Sequences",
    description:
      "Detailed yoga sequences for all levels with pose illustrations and breathing guides",
    price: 26.99,
    image: "https://ugc.same-assets.com/2H0CqkPAsVBawi7qVT4bTHAZ8Ij43CQI.jpeg",
    category: "fitness",
    rating: 4.9,
    reviews: 345,
  },
  {
    id: "product-29",
    name: "Social Media Templates Pack",
    description:
      "Instagram, Facebook, and LinkedIn post templates for consistent branding",
    price: 28.99,
    image: "https://ugc.same-assets.com/AkLo0ZKe4I00cqqWt5-74qVVQT79X85U.jpeg",
    category: "templates",
    rating: 4.8,
    reviews: 367,
  },
  {
    id: "product-38",
    name: "Healthy Recipe Collection",
    description:
      "100+ healthy recipes with nutritional information and meal planning guides",
    price: 24.99,
    image: "https://ugc.same-assets.com/5WS2eh07o84W9WABJ6AC7r36JC8BFZM_.jpeg",
    category: "health",
    rating: 4.7,
    reviews: 267,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Blueprint Background Component */}
      <BlueprintBackground />

      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-neutral-900">
                DigiNest.io
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/products"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Products
              </Link>
              <Link
                href="#categories"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Categories
              </Link>
              <Link
                href="#about"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                About
              </Link>
              <Link
                href="/admin"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Admin
              </Link>
              <LanguageSwitcher variant="compact" />
              <ShoppingCartTrigger />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Pass data to client component */}
      <HomePageClient featuredProducts={featuredProducts} />
    </div>
  );
}
