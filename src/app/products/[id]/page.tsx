import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingCartTrigger } from "@/components/ShoppingCart";
import { UserMenu } from "@/components/AuthDialog";
import type { Product } from "@/contexts/CartContext";
import { Star, ArrowLeft, Download, Shield, Users, Clock } from "lucide-react";
import Link from "next/link";
import ProductDetailClient from "./ProductDetailClient";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

// Generate static params for all products
export async function generateStaticParams() {
  const productIds = [
    "product-1",
    "product-2",
    "product-3",
    "product-4",
    "product-5",
    "product-6",
    "product-7",
    "product-8",
    "product-9",
    "product-10",
    "product-11",
    "product-12",
    "product-13",
    "product-14",
    "product-15",
    "product-16",
    "product-17",
    "product-18",
  ];

  return productIds.map((id) => ({
    id: id,
  }));
}

// Mock product data
interface DetailedProduct extends Product {
  images: string[];
  features: string[];
  description: string;
  requirements: string[];
  reviewsData: Review[];
}

const mockProducts: Record<string, DetailedProduct> = {
  "product-1": {
    id: "product-1",
    name: "Minimalist Digital Planner",
    description:
      "Transform your productivity with our bestselling digital planner. Designed for iPad and tablet users who value clean, minimal aesthetics without compromising functionality.",
    price: 29.99,
    image: "https://ugc.same-assets.com/bTHIWwJOBZ8ti0Zl7ZVoJy98XTtb4Xa5.jpeg",
    images: [
      "https://ugc.same-assets.com/bTHIWwJOBZ8ti0Zl7ZVoJy98XTtb4Xa5.jpeg",
      "https://ugc.same-assets.com/DJAgD61a-4T_nzFwTL1ekGXObpjr-hMN.jpeg",
      "https://ugc.same-assets.com/uKeNqI3BUtEuxLBlJil5clZF6zGjAJqR.jpeg",
    ],
    category: "planners",
    rating: 4.9,
    reviews: 247,
    features: [
      "12 months of undated planning pages",
      "Weekly and daily layouts with time blocking",
      "Habit tracker and goal setting pages",
      "Note-taking sections with dot grid",
      "Hyperlinked navigation for easy access",
      "Compatible with GoodNotes, Notability, and more",
    ],
    requirements: [
      "iPad with Apple Pencil support",
      "GoodNotes 5, Notability, or similar app",
      "iOS 12.0 or later",
      "2GB free storage space",
    ],
    reviewsData: [
      {
        id: 1,
        name: "Sarah Chen",
        avatar: "SC",
        rating: 5,
        date: "2024-01-15",
        comment:
          "This planner completely transformed my productivity! The clean design helps me focus, and the hyperlinks make navigation seamless. Worth every penny!",
        verified: true,
      },
      {
        id: 2,
        name: "Mike Rodriguez",
        avatar: "MR",
        rating: 5,
        date: "2024-01-10",
        comment:
          "I've tried many digital planners, but this one stands out. The minimalist design is perfect for my workflow, and the quality is exceptional.",
        verified: true,
      },
      {
        id: 3,
        name: "Emma Thompson",
        avatar: "ET",
        rating: 4,
        date: "2024-01-08",
        comment:
          "Great planner with excellent layout. Only wish it had more color options, but the functionality is top-notch!",
        verified: false,
      },
    ],
  },
  "product-9": {
    id: "product-9",
    name: "Ultimate Calorie Tracking Spreadsheet",
    description:
      "Take control of your nutrition with our comprehensive calorie and macro tracking spreadsheet. Perfect for anyone serious about their health goals, weight management, or athletic performance.",
    price: 22.99,
    image: "https://ugc.same-assets.com/il21uiaNPQItlsYi3EMwn-IfAbiCorr2.jpeg",
    images: [
      "https://ugc.same-assets.com/il21uiaNPQItlsYi3EMwn-IfAbiCorr2.jpeg",
      "https://ugc.same-assets.com/GgfoFD3lPd0Uy7kyEhDWkGZ_WxLcvPmi.png",
      "https://ugc.same-assets.com/7R58kiOcIUY2HNp2gX5gk7H5LgoUDepD.jpeg",
    ],
    category: "health",
    rating: 4.7,
    reviews: 183,
    features: [
      "Advanced macro tracking with visual charts",
      "Database of 2000+ common foods with nutritional info",
      "Meal planning templates with automated calculations",
      "Progress tracking with weight and body composition",
      "Custom goal setting for cutting, bulking, or maintenance",
      "Compatible with Excel, Google Sheets, and Numbers",
    ],
    requirements: [
      "Microsoft Excel 2016 or later / Google Sheets",
      "Basic spreadsheet knowledge recommended",
      "Internet connection for cloud syncing (Google Sheets)",
      "50MB free storage space",
    ],
    reviewsData: [
      {
        id: 1,
        name: "Jessica Parks",
        avatar: "JP",
        rating: 5,
        date: "2024-01-20",
        comment:
          "This tracker helped me lose 15 pounds! The meal planning feature is a game-changer. So much better than expensive apps.",
        verified: true,
      },
      {
        id: 2,
        name: "David Kim",
        avatar: "DK",
        rating: 5,
        date: "2024-01-18",
        comment:
          "As a personal trainer, I recommend this to all my clients. The macro breakdown is incredibly detailed and accurate.",
        verified: true,
      },
      {
        id: 3,
        name: "Maria Santos",
        avatar: "MS",
        rating: 4,
        date: "2024-01-12",
        comment:
          "Great spreadsheet with tons of features. Took me a day to set up everything but now it's perfect for my needs.",
        verified: true,
      },
    ],
  },
  "product-10": {
    id: "product-10",
    name: "12-Week Strength Training Program",
    description:
      "Build serious strength with our scientifically-designed 12-week progressive training program. Suitable for intermediate to advanced lifters looking to break through plateaus.",
    price: 34.99,
    image: "https://ugc.same-assets.com/8QM59VVMWstqjmqYUFFIGf07POvDew1_.png",
    images: [
      "https://ugc.same-assets.com/8QM59VVMWstqjmqYUFFIGf07POvDew1_.png",
      "https://ugc.same-assets.com/VmX0KDVr1dQUnozVrzXHLzZBY-IUgONy.jpeg",
      "https://ugc.same-assets.com/2H0CqkPAsVBawi7qVT4bTHAZ8Ij43CQI.jpeg",
    ],
    category: "fitness",
    rating: 4.9,
    reviews: 298,
    features: [
      "12-week periodized strength program",
      "Detailed exercise library with form cues",
      "Progressive overload tracking system",
      "Warm-up and mobility routines included",
      "Nutrition guidelines for strength gains",
      "Bonus: Deload week protocols",
    ],
    requirements: [
      "Access to a gym with barbells and plates",
      "6+ months of lifting experience recommended",
      "Ability to perform basic compound movements",
      "PDF reader app on your device",
    ],
    reviewsData: [
      {
        id: 1,
        name: "Alex Johnson",
        avatar: "AJ",
        rating: 5,
        date: "2024-01-25",
        comment:
          "Increased my squat by 40lbs in 12 weeks! The progression is perfect and the exercise selection is spot on.",
        verified: true,
      },
      {
        id: 2,
        name: "Rachel Green",
        avatar: "RG",
        rating: 5,
        date: "2024-01-22",
        comment:
          "Finally broke through my bench press plateau. This program is challenging but very well structured.",
        verified: true,
      },
      {
        id: 3,
        name: "Tom Wilson",
        avatar: "TW",
        rating: 5,
        date: "2024-01-20",
        comment:
          "Best investment I made for my training. The program is intense but the results speak for themselves.",
        verified: true,
      },
    ],
  },
};

// Related products
const relatedProducts: Product[] = [
  {
    id: "product-2",
    name: "The Productivity Handbook",
    description: "Complete guide to maximizing your efficiency",
    price: 19.99,
    image: "https://ugc.same-assets.com/s5O7a8ldSmwD4vVf-5T89qmCmnnpQCO4.jpeg",
    category: "ebooks",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "product-3",
    name: "Self-Care Planner",
    description: "Mindful planning for wellness and balance",
    price: 24.99,
    image: "https://ugc.same-assets.com/DJAgD61a-4T_nzFwTL1ekGXObpjr-hMN.jpeg",
    category: "planners",
    rating: 4.8,
    reviews: 156,
  },
];

export default async function ProductDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = mockProducts[id];

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Product Not Found
          </h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
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
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-neutral-900">
                DigiNest.io
              </Link>
              <Link
                href="/products"
                className="flex items-center text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Products
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
        <ProductDetailClient product={product} />

        <div className="flex items-center gap-4 text-sm text-neutral-600 mt-6">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Instant download</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Secure payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>24/7 support</span>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviewsData.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li
                        key={`feature-${index}-${feature.slice(0, 10)}`}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-neutral-900 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>System Requirements</CardTitle>
                  <CardDescription>
                    Make sure your device meets these requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.requirements.map((requirement, index) => (
                      <li
                        key={`requirement-${index}-${requirement.slice(0, 10)}`}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-neutral-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                {product.reviewsData.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{review.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.name}</span>
                            {review.verified && (
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                              >
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={`review-star-${review.id}-${i}`}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-neutral-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-neutral-500">
                              {review.date}
                            </span>
                          </div>
                          <p className="text-neutral-700">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-light text-neutral-900 mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    {relatedProduct.name}
                  </CardTitle>
                  <CardDescription>
                    {relatedProduct.description}
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`related-star-${relatedProduct.id}-${i}`}
                          className={`h-4 w-4 ${
                            i < Math.floor(relatedProduct.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-600">
                      ({relatedProduct.reviews} reviews)
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-light text-neutral-900">
                      ${relatedProduct.price.toFixed(2)}
                    </div>
                    <Link href={`/products/${relatedProduct.id}`}>
                      <Button
                        size="sm"
                        className="bg-neutral-900 hover:bg-neutral-800"
                      >
                        View Product
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
