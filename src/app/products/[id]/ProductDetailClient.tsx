"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart, type Product } from "@/contexts/CartContext";
import { Star, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ProductDetailClientProps {
  product: Product & {
    images: string[];
    features: string[];
    description: string;
    requirements: string[];
    reviewsData: Review[];
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-white rounded-lg overflow-hidden relative group">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Images */}
        {product.images.length > 1 && (
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <button
                key={`thumb-${image.slice(-10)}-${index}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  currentImageIndex === index ? 'border-neutral-900' : 'border-neutral-200'
                }`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.rating >= 4.8 && <Badge className="bg-neutral-900 text-white">Bestseller</Badge>}
          </div>
          <h1 className="text-3xl font-light text-neutral-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`rating-star-${product.id}-${i}`}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-neutral-600">{product.rating} ({product.reviewsData.length} reviews)</span>
          </div>

          <p className="text-neutral-600 leading-relaxed mb-6">{product.description}</p>

          <div className="text-3xl font-light text-neutral-900 mb-6">
            ${product.price.toFixed(2)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1 bg-neutral-900 hover:bg-neutral-800"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={isWishlisted ? 'border-red-300 text-red-600' : ''}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
