"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmailNewsletter, FooterNewsletter } from "@/components/EmailNewsletter";
import { useCart, type Product } from "@/contexts/CartContext";
import { useI18n, useCurrency } from "@/contexts/I18nContext";
import { ChevronRight, Star, Download, Users, Clock, TrendingUp, BookOpen, Calendar, FileText, Palette, Heart, Dumbbell } from "lucide-react";
import Link from "next/link";
import { SimpleRobot } from "@/components/SimpleRobot";
import { CurrencyDisplay } from "@/components/LanguageSwitcher";

interface HomePageClientProps {
  featuredProducts: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    reviews: number;
  }>;
}

export default function HomePageClient({ featuredProducts }: HomePageClientProps) {
  const { addToCart } = useCart();
  const { t } = useI18n();
  const { convertPrice } = useCurrency();
  const [robotEmotion, setRobotEmotion] = useState<'happy' | 'excited' | 'curious' | 'thinking' | 'celebrating'>('happy');

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setRobotEmotion('celebrating');
    setTimeout(() => setRobotEmotion('happy'), 3000);
  };

  const handleCategoryClick = () => {
    setRobotEmotion('curious');
    setTimeout(() => setRobotEmotion('happy'), 2000);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-light text-neutral-900 mb-6">
              {t('home.hero.title')}
              <span className="block text-neutral-700 font-normal">{t('home.hero.subtitle')}</span>
            </h2>
            <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
              {t('home.hero.description')}
            </p>

            {/* Version 40 Indicator */}
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Version 40 - All Production Issues Fixed
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white px-8">
                  {t('home.hero.exploreBtn')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-neutral-300 text-neutral-700">
                {t('home.hero.featuredBtn')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Download className="h-8 w-8 text-neutral-600" />
              </div>
              <div className="text-3xl font-light text-neutral-900 mb-2">10K+</div>
              <div className="text-neutral-600">{t('home.stats.downloads')}</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-neutral-600" />
              </div>
              <div className="text-3xl font-light text-neutral-900 mb-2">5K+</div>
              <div className="text-neutral-600">{t('home.stats.customers')}</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Star className="h-8 w-8 text-neutral-600" />
              </div>
              <div className="text-3xl font-light text-neutral-900 mb-2">4.9</div>
              <div className="text-neutral-600">{t('home.stats.rating')}</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-neutral-600" />
              </div>
              <div className="text-3xl font-light text-neutral-900 mb-2">100+</div>
              <div className="text-neutral-600">{t('home.stats.newProducts')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-neutral-900 mb-4">
              {t('home.categories.title')}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('home.categories.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Link href="/products?category=ebooks" onClick={handleCategoryClick} className="block">
              <Card className="group hover:shadow-lg transition-all duration-300 border-neutral-200 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">{t('category.ebooks')}</CardTitle>
                  <CardDescription className="text-sm">{t('category.ebooks.desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    {t('home.categories.browse')}
                    <ChevronRight className="ml-2 h-3 w-3 inline" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/products?category=planners" onClick={handleCategoryClick} className="block">
              <Card className="group hover:shadow-lg transition-all duration-300 border-neutral-200 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">{t('category.planners')}</CardTitle>
                  <CardDescription className="text-sm">{t('category.planners.desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    Browse
                    <ChevronRight className="ml-2 h-3 w-3 inline" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="group hover:shadow-lg transition-all duration-300 border-neutral-200 cursor-pointer">
              <Link href="/products?category=templates" onClick={handleCategoryClick} className="block">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">{t('category.templates')}</CardTitle>
                  <CardDescription className="text-sm">{t('category.templates.desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    Browse
                    <ChevronRight className="ml-2 h-3 w-3 inline" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-neutral-200 cursor-pointer">
              <Link href="/products?category=tools" onClick={handleCategoryClick} className="block">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
                    <Palette className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">Design Tools</CardTitle>
                  <CardDescription className="text-sm">Creative resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    Browse
                    <ChevronRight className="ml-2 h-3 w-3 inline" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-neutral-200 cursor-pointer">
              <Link href="/products?category=health" onClick={handleCategoryClick} className="block">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-colors">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">Health</CardTitle>
                  <CardDescription className="text-sm">Nutrition tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    Browse
                    <ChevronRight className="ml-2 h-3 w-3 inline" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-neutral-200 cursor-pointer">
              <Link href="/products?category=fitness" onClick={handleCategoryClick} className="block">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-indigo-300 transition-colors">
                    <Dumbbell className="h-8 w-8 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">Fitness</CardTitle>
                  <CardDescription className="text-sm">Training programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    Browse
                    <ChevronRight className="ml-2 h-3 w-3 inline" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-neutral-900 mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('home.featured.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-neutral-200">
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-neutral-900 text-white">
                      {product.rating >= 4.8 ? 'Bestseller' : 'Popular'}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`star-${product.id}-${i}`}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-600">({product.reviews} reviews)</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <CurrencyDisplay amount={convertPrice(product.price)} />
                    <Button
                      size="sm"
                      className="bg-neutral-900 hover:bg-neutral-800"
                      onClick={() => handleAddToCart(product as Product)}
                    >
                      {t('products.addToCart')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg" className="border-neutral-300 text-neutral-700 px-8">
                {t('home.featured.viewAll')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailNewsletter />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-neutral-200/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">DigiNest.io</h3>
              <p className="text-neutral-600 mb-4">
                Premium digital products for modern productivity and creativity.
              </p>
              <div className="flex space-x-4">
                <Clock className="h-5 w-5 text-neutral-400" />
                <span className="text-sm text-neutral-600">24/7 Support</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="#" className="hover:text-neutral-900">eBooks</Link></li>
                <li><Link href="#" className="hover:text-neutral-900">Planners</Link></li>
                <li><Link href="#" className="hover:text-neutral-900">Templates</Link></li>
                <li><Link href="#" className="hover:text-neutral-900">Design Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="#" className="hover:text-neutral-900">Help Center</Link></li>
                <li><Link href="#" className="hover:text-neutral-900">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-neutral-900">Downloads</Link></li>
                <li><Link href="#" className="hover:text-neutral-900">Refunds</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="#" className="hover:text-neutral-900">About</Link></li>
                <li><Link href="#" className="hover:text-neutral-900">Blog</Link></li>
                <li><Link href="#" className="hover:text-neutral-900">Careers</Link></li>
                <li><Link href="#" className="hover:text-neutral-900">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <FooterNewsletter />
            </div>
          </div>
          <div className="border-t border-neutral-200 mt-12 pt-8 text-center text-sm text-neutral-600">
            <p>&copy; 2025 DigiNest.io. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Interactive Robot Companion */}
      <SimpleRobot emotion={robotEmotion} />
    </>
  );
}
