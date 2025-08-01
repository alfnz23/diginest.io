"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SearchAndFilter,
  type SearchFilters,
} from "@/components/SearchAndFilter";
import { useCart, type Product } from "@/contexts/CartContext";
import { Star } from "lucide-react";
import Link from "next/link";
import { SimpleRobot } from "@/components/SimpleRobot";
import { ClientOnlyUrlParams } from "@/components/ClientOnlyUrlParams";

// Mock products data
const mockProducts: Product[] = [
  {
    id: "product-1",
    name: "Minimalist Digital Planner",
    description:
      "Complete planning system for iPad and tablets with monthly, weekly, and daily layouts",
    price: 29.99,
    image: "https://ugc.same-assets.com/bTHIWwJOBZ8ti0Zl7ZVoJy98XTtb4Xa5.jpeg",
    category: "planners",
    rating: 4.9,
    reviews: 247,
    downloadUrl: "/downloads/planner.zip",
  },
  {
    id: "product-2",
    name: "The Productivity Handbook",
    description:
      "Complete guide to maximizing your efficiency with proven strategies and techniques",
    price: 19.99,
    image: "https://ugc.same-assets.com/s5O7a8ldSmwD4vVf-5T89qmCmnnpQCO4.jpeg",
    category: "ebooks",
    rating: 4.7,
    reviews: 89,
    downloadUrl: "/downloads/productivity-handbook.pdf",
  },
  {
    id: "product-3",
    name: "Self-Care Planner",
    description:
      "Mindful planning for wellness and balance with habit trackers and reflection pages",
    price: 24.99,
    image: "https://ugc.same-assets.com/DJAgD61a-4T_nzFwTL1ekGXObpjr-hMN.jpeg",
    category: "planners",
    rating: 4.8,
    reviews: 156,
    downloadUrl: "/downloads/self-care-planner.zip",
  },
  {
    id: "product-4",
    name: "Task Management Templates",
    description:
      "Professional task management templates for teams and individuals",
    price: 14.99,
    image: "https://ugc.same-assets.com/nf9vBokQDSYdZTtPrSBVR2X8O_YrhOXq.jpeg",
    category: "templates",
    rating: 4.5,
    reviews: 73,
    downloadUrl: "/downloads/task-templates.zip",
  },
  {
    id: "product-5",
    name: "Creative Portfolio Template",
    description:
      "Showcase your creative work with this professional portfolio template",
    price: 39.99,
    image: "https://ugc.same-assets.com/AkLo0ZKe4I00cqqWt5-74qVVQT79X85U.jpeg",
    category: "templates",
    rating: 4.6,
    reviews: 92,
    downloadUrl: "/downloads/portfolio-template.zip",
  },
  {
    id: "product-6",
    name: "Financial Planning Workbook",
    description:
      "Comprehensive financial planning and budgeting workbook with calculators",
    price: 27.99,
    image: "https://ugc.same-assets.com/YVjJdQ_tVM0XLKYs5LNESgRD0MrO5XNj.jpeg",
    category: "ebooks",
    rating: 4.9,
    reviews: 134,
    downloadUrl: "/downloads/financial-workbook.pdf",
  },
  {
    id: "product-7",
    name: "Design System Kit",
    description:
      "Complete design system with components, colors, and typography guidelines",
    price: 49.99,
    image: "https://ugc.same-assets.com/GpSBGKJqlN6wvF17gXszBu6GNkKpHbCX.jpeg",
    category: "tools",
    rating: 4.8,
    reviews: 67,
    downloadUrl: "/downloads/design-kit.zip",
  },
  {
    id: "product-8",
    name: "Meal Planning Guide",
    description: "Healthy meal planning guide with recipes and shopping lists",
    price: 16.99,
    image: "https://ugc.same-assets.com/7R58kiOcIUY2HNp2gX5gk7H5LgoUDepD.jpeg",
    category: "ebooks",
    rating: 4.4,
    reviews: 201,
    downloadUrl: "/downloads/meal-planning.pdf",
  },
  // NEW HEALTH & FITNESS PRODUCTS
  {
    id: "product-9",
    name: "Ultimate Calorie Tracking Spreadsheet",
    description:
      "Advanced Excel/Google Sheets template for precise calorie and macro tracking with meal planning",
    price: 22.99,
    image: "https://ugc.same-assets.com/il21uiaNPQItlsYi3EMwn-IfAbiCorr2.jpeg",
    category: "health",
    rating: 4.7,
    reviews: 183,
    downloadUrl: "/downloads/calorie-tracker.xlsx",
  },
  {
    id: "product-10",
    name: "12-Week Strength Training Program",
    description:
      "Progressive strength training plan with exercise library and progress tracking",
    price: 34.99,
    image: "https://ugc.same-assets.com/8QM59VVMWstqjmqYUFFIGf07POvDew1_.png",
    category: "fitness",
    rating: 4.9,
    reviews: 298,
    downloadUrl: "/downloads/strength-program.pdf",
  },
  {
    id: "product-11",
    name: "Digital Workout Log & Progress Tracker",
    description:
      "Interactive workout journal for tracking sets, reps, weights, and personal records",
    price: 18.99,
    image: "https://ugc.same-assets.com/VmX0KDVr1dQUnozVrzXHLzZBY-IUgONy.jpeg",
    category: "fitness",
    rating: 4.6,
    reviews: 142,
    downloadUrl: "/downloads/workout-log.zip",
  },
  {
    id: "product-12",
    name: "Macro Calculator & Meal Planner",
    description:
      "Calculate your macros and plan balanced meals with automated shopping lists",
    price: 25.99,
    image: "https://ugc.same-assets.com/GgfoFD3lPd0Uy7kyEhDWkGZ_WxLcvPmi.png",
    category: "health",
    rating: 4.8,
    reviews: 217,
    downloadUrl: "/downloads/macro-calculator.xlsx",
  },
  {
    id: "product-13",
    name: "Home Workout Video Series",
    description:
      "30-day home workout program with video guides for all fitness levels",
    price: 45.99,
    image: "https://ugc.same-assets.com/JbTjUqJZkcuOh5_NP6mmzPLtWgJqYFM0.jpeg",
    category: "fitness",
    rating: 4.7,
    reviews: 356,
    downloadUrl: "/downloads/home-workout-series.zip",
  },
  {
    id: "product-14",
    name: "Intermittent Fasting Tracker",
    description:
      "Digital planner for tracking fasting windows, meals, and health metrics",
    price: 15.99,
    image: "https://ugc.same-assets.com/AE6FfXly13-4T7Wm1sL49LAIbq1PqVGp.jpeg",
    category: "health",
    rating: 4.5,
    reviews: 128,
    downloadUrl: "/downloads/fasting-tracker.pdf",
  },
  {
    id: "product-15",
    name: "Yoga Flow Sequence Guide",
    description:
      "Beautiful illustrated yoga sequences for morning, evening, and stress relief",
    price: 21.99,
    image: "https://ugc.same-assets.com/WLFhRPBmNAn6ezXWV3O0g5C1Z5KOitWO.jpeg",
    category: "fitness",
    rating: 4.8,
    reviews: 189,
    downloadUrl: "/downloads/yoga-sequences.pdf",
  },
  {
    id: "product-16",
    name: "Sleep & Recovery Optimization Guide",
    description:
      "Comprehensive guide to improving sleep quality and recovery with tracking templates",
    price: 19.99,
    image: "https://ugc.same-assets.com/ilbl4Aqz700C02JxjANhDD9E5LHMW4Cr.jpeg",
    category: "health",
    rating: 4.6,
    reviews: 94,
    downloadUrl: "/downloads/sleep-optimization.pdf",
  },
  {
    id: "product-17",
    name: "Bodyweight Training Blueprint",
    description:
      "Complete bodyweight exercise program with progression charts and form guides",
    price: 28.99,
    image: "https://ugc.same-assets.com/2H0CqkPAsVBawi7qVT4bTHAZ8Ij43CQI.jpeg",
    category: "fitness",
    rating: 4.7,
    reviews: 245,
    downloadUrl: "/downloads/bodyweight-blueprint.pdf",
  },
  {
    id: "product-18",
    name: "Hydration & Supplement Tracker",
    description:
      "Track daily water intake, supplements, and health metrics with reminder system",
    price: 12.99,
    image: "https://ugc.same-assets.com/5WS2eh07o84W9WABJ6AC7r36JC8BFZM_.jpeg",
    category: "health",
    rating: 4.4,
    reviews: 76,
    downloadUrl: "/downloads/hydration-tracker.xlsx",
  },

  // Additional eBooks
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
    downloadUrl: "/downloads/digital-marketing-mastery.pdf",
  },
  {
    id: "product-20",
    name: "Mindfulness & Meditation Guide",
    description:
      "Practical guide to mindfulness and meditation practices for stress reduction and mental clarity",
    price: 22.99,
    image: "https://ugc.same-assets.com/DJAgD61a-4T_nzFwTL1ekGXObpjr-hMN.jpeg",
    category: "ebooks",
    rating: 4.9,
    reviews: 185,
    downloadUrl: "/downloads/mindfulness-guide.pdf",
  },
  {
    id: "product-21",
    name: "Freelancer's Success Blueprint",
    description:
      "Everything you need to know to start and grow a successful freelancing business",
    price: 27.99,
    image: "https://ugc.same-assets.com/s5O7a8ldSmwD4vVf-5T89qmCmnnpQCO4.jpeg",
    category: "ebooks",
    rating: 4.6,
    reviews: 298,
    downloadUrl: "/downloads/freelancer-blueprint.pdf",
  },
  {
    id: "product-22",
    name: "Photography Fundamentals",
    description:
      "Master the basics of photography with this comprehensive beginner's guide",
    price: 24.99,
    image: "https://ugc.same-assets.com/AkLo0ZKe4I00cqqWt5-74qVVQT79X85U.jpeg",
    category: "ebooks",
    rating: 4.7,
    reviews: 156,
    downloadUrl: "/downloads/photography-fundamentals.pdf",
  },
  {
    id: "product-23",
    name: "Remote Work Success",
    description:
      "Essential strategies for productivity and success in remote work environments",
    price: 19.99,
    image: "https://ugc.same-assets.com/s5O7a8ldSmwD4vVf-5T89qmCmnnpQCO4.jpeg",
    category: "ebooks",
    rating: 4.5,
    reviews: 203,
    downloadUrl: "/downloads/remote-work-success.pdf",
  },

  // Additional Planners
  {
    id: "product-24",
    name: "Academic Success Planner",
    description:
      "Student planner with semester tracking, assignment management, and study schedules",
    price: 26.99,
    image: "https://ugc.same-assets.com/bTHIWwJOBZ8ti0Zl7ZVoJy98XTtb4Xa5.jpeg",
    category: "planners",
    rating: 4.8,
    reviews: 167,
    downloadUrl: "/downloads/academic-planner.zip",
  },
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
    downloadUrl: "/downloads/wedding-planner.zip",
  },
  {
    id: "product-26",
    name: "Content Creator Planner",
    description:
      "Social media content planning and scheduling system for creators and brands",
    price: 31.99,
    image: "https://ugc.same-assets.com/bTHIWwJOBZ8ti0Zl7ZVoJy98XTtb4Xa5.jpeg",
    category: "planners",
    rating: 4.7,
    reviews: 234,
    downloadUrl: "/downloads/content-creator-planner.zip",
  },
  {
    id: "product-27",
    name: "Travel Planning Journal",
    description:
      "Plan your perfect trip with itinerary templates, packing lists, and travel logs",
    price: 23.99,
    image: "https://ugc.same-assets.com/DJAgD61a-4T_nzFwTL1ekGXObpjr-hMN.jpeg",
    category: "planners",
    rating: 4.6,
    reviews: 145,
    downloadUrl: "/downloads/travel-planner.zip",
  },

  // Additional Templates
  {
    id: "product-28",
    name: "Invoice Template Collection",
    description:
      "Professional invoice templates for freelancers and small businesses",
    price: 16.99,
    image: "https://ugc.same-assets.com/nf9vBokQDSYdZTtPrSBVR2X8O_YrhOXq.jpeg",
    category: "templates",
    rating: 4.5,
    reviews: 189,
    downloadUrl: "/downloads/invoice-templates.zip",
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
    downloadUrl: "/downloads/social-media-templates.zip",
  },
  {
    id: "product-30",
    name: "Email Newsletter Templates",
    description:
      "Professional email newsletter templates for marketing campaigns",
    price: 24.99,
    image: "https://ugc.same-assets.com/nf9vBokQDSYdZTtPrSBVR2X8O_YrhOXq.jpeg",
    category: "templates",
    rating: 4.6,
    reviews: 156,
    downloadUrl: "/downloads/newsletter-templates.zip",
  },
  {
    id: "product-31",
    name: "Presentation Template Suite",
    description:
      "Modern PowerPoint and Keynote templates for business presentations",
    price: 32.99,
    image: "https://ugc.same-assets.com/AkLo0ZKe4I00cqqWt5-74qVVQT79X85U.jpeg",
    category: "templates",
    rating: 4.7,
    reviews: 298,
    downloadUrl: "/downloads/presentation-templates.zip",
  },

  // Additional Design Tools
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
    downloadUrl: "/downloads/logo-design-kit.zip",
  },
  {
    id: "product-33",
    name: "Color Palette Generator",
    description:
      "Professional color palettes and hex codes for web and print design",
    price: 18.99,
    image: "https://ugc.same-assets.com/nf9vBokQDSYdZTtPrSBVR2X8O_YrhOXq.jpeg",
    category: "tools",
    rating: 4.5,
    reviews: 123,
    downloadUrl: "/downloads/color-palettes.zip",
  },
  {
    id: "product-34",
    name: "Typography Collection",
    description:
      "Curated collection of professional fonts for branding and design projects",
    price: 38.99,
    image: "https://ugc.same-assets.com/AkLo0ZKe4I00cqqWt5-74qVVQT79X85U.jpeg",
    category: "tools",
    rating: 4.9,
    reviews: 189,
    downloadUrl: "/downloads/typography-collection.zip",
  },
  {
    id: "product-35",
    name: "Icon Library Bundle",
    description:
      "Thousands of professional icons in multiple formats for all your design needs",
    price: 42.99,
    image: "https://ugc.same-assets.com/nf9vBokQDSYdZTtPrSBVR2X8O_YrhOXq.jpeg",
    category: "tools",
    rating: 4.7,
    reviews: 345,
    downloadUrl: "/downloads/icon-library.zip",
  },

  // Additional Health Products
  {
    id: "product-36",
    name: "Mental Health Tracker",
    description: "Daily mood tracking and mental wellness monitoring system",
    price: 21.99,
    image: "https://ugc.same-assets.com/5WS2eh07o84W9WABJ6AC7r36JC8BFZM_.jpeg",
    category: "health",
    rating: 4.6,
    reviews: 198,
    downloadUrl: "/downloads/mental-health-tracker.xlsx",
  },
  {
    id: "product-37",
    name: "Sleep Optimization Guide",
    description:
      "Complete guide to improving sleep quality with tracking templates",
    price: 19.99,
    image: "https://ugc.same-assets.com/il21uiaNPQItlsYi3EMwn-IfAbiCorr2.jpeg",
    category: "health",
    rating: 4.8,
    reviews: 156,
    downloadUrl: "/downloads/sleep-optimization.pdf",
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
    downloadUrl: "/downloads/healthy-recipes.pdf",
  },

  // Additional Fitness Products
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
    downloadUrl: "/downloads/yoga-sequences.pdf",
  },
  {
    id: "product-40",
    name: "Marathon Training Plan",
    description:
      "16-week marathon training program with weekly schedules and nutrition plans",
    price: 29.99,
    image: "https://ugc.same-assets.com/8QM59VVMWstqjmqYUFFIGf07POvDew1_.png",
    category: "fitness",
    rating: 4.8,
    reviews: 189,
    downloadUrl: "/downloads/marathon-training.pdf",
  },
  {
    id: "product-41",
    name: "Home Gym Workout Guide",
    description: "Complete home workout routines requiring minimal equipment",
    price: 23.99,
    image: "https://ugc.same-assets.com/2H0CqkPAsVBawi7qVT4bTHAZ8Ij43CQI.jpeg",
    category: "fitness",
    rating: 4.6,
    reviews: 234,
    downloadUrl: "/downloads/home-gym-guide.pdf",
  },
  {
    id: "product-42",
    name: "Flexibility & Mobility Program",
    description:
      "Daily stretching and mobility routines for improved flexibility and injury prevention",
    price: 18.99,
    image: "https://ugc.same-assets.com/8QM59VVMWstqjmqYUFFIGf07POvDew1_.png",
    category: "fitness",
    rating: 4.7,
    reviews: 156,
    downloadUrl: "/downloads/flexibility-program.pdf",
  },
];

export default function ProductsPageClient() {
  const { addToCart } = useCart();
  const [robotEmotion, setRobotEmotion] = useState<
    "happy" | "excited" | "curious" | "thinking" | "celebrating"
  >("happy");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    priceRange: "",
    rating: 0,
    sortBy: "newest",
    tags: [],
    dateRange: "",
    featured: false,
  });

  const handleCategoryFromUrl = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    setRobotEmotion("curious");
    if (typeof window !== "undefined") {
      setTimeout(() => setRobotEmotion("happy"), 2000);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setRobotEmotion("celebrating");
    if (typeof window !== "undefined") {
      setTimeout(() => setRobotEmotion("happy"), 3000);
    }
  };

  const handleSearchChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (newFilters.query !== filters.query && newFilters.query.length > 0) {
      setRobotEmotion("thinking");
      if (typeof window !== "undefined") {
        setTimeout(() => setRobotEmotion("happy"), 2000);
      }
    } else if (
      newFilters.category !== filters.category &&
      newFilters.category
    ) {
      setRobotEmotion("curious");
      if (typeof window !== "undefined") {
        setTimeout(() => setRobotEmotion("happy"), 2000);
      }
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = mockProducts.filter((product) => {
      // Search query filter
      if (
        filters.query &&
        !product.name.toLowerCase().includes(filters.query.toLowerCase()) &&
        !product.description.toLowerCase().includes(filters.query.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const price = product.price;
        switch (filters.priceRange) {
          case "0-20":
            if (price > 20) return false;
            break;
          case "20-50":
            if (price < 20 || price > 50) return false;
            break;
          case "50-100":
            if (price < 50 || price > 100) return false;
            break;
          case "100+":
            if (price < 100) return false;
            break;
        }
      }

      // Rating filter
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (filters.sortBy) {
      case "popular":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep original order for newest
        break;
    }

    return filtered;
  }, [filters]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ebooks":
        return "📚";
      case "planners":
        return "📅";
      case "templates":
        return "✅";
      case "tools":
        return "🎨";
      case "health":
        return "🍎";
      case "fitness":
        return "💪";
      default:
        return "📦";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "ebooks":
        return "eBooks";
      case "planners":
        return "Planners";
      case "templates":
        return "Templates";
      case "tools":
        return "Design Tools";
      case "health":
        return "Health & Nutrition";
      case "fitness":
        return "Fitness & Training";
      default:
        return "Digital Products";
    }
  };

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-8">
        <SearchAndFilter
          filters={filters}
          onFiltersChange={handleSearchChange}
          resultsCount={filteredProducts.length}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-neutral-900 mb-2">
            No products found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                query: "",
                category: "",
                priceRange: "",
                rating: 0,
                sortBy: "newest",
                tags: [],
                dateRange: "",
                featured: false,
              })
            }
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-all duration-300 border-neutral-200"
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/80">
                      {getCategoryIcon(product.category)}{" "}
                      {getCategoryName(product.category)}
                    </Badge>
                  </div>
                  {product.rating >= 4.8 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-neutral-900 text-white">
                        Bestseller
                      </Badge>
                    </div>
                  )}
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="text-lg font-medium line-clamp-1">
                  {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`star-${product.id}-${i}`}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-light text-neutral-900">
                    ${product.price.toFixed(2)}
                  </div>
                  <Button
                    size="sm"
                    className="bg-neutral-900 hover:bg-neutral-800"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Interactive Robot Companion */}
      <SimpleRobot emotion={robotEmotion} />

      {/* Client-only URL parameter handler */}
      <ClientOnlyUrlParams onCategoryChange={handleCategoryFromUrl} />
    </>
  );
}
