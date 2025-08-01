"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Check, Gift, Zap, TrendingUp } from "lucide-react";

export function EmailNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call to email service
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubscribed(true);
    setIsLoading(false);
    setEmail("");

    // In a real app, you'd integrate with services like:
    // - Mailchimp
    // - ConvertKit
    // - Klaviyo
    // - SendGrid
    console.log(`Subscribed email: ${email}`);
  };

  if (isSubscribed) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-900 mb-2">
              Welcome to DigiNest.io!
            </h3>
            <p className="text-green-700 text-sm">
              Thanks for subscribing! Check your email for a special welcome
              discount.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border-0">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl text-white">Stay Updated</CardTitle>
        <CardDescription className="text-neutral-300">
          Get the latest digital products, exclusive discounts, and productivity
          tips
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Gift className="h-5 w-5 text-neutral-300 mb-2" />
            <span className="text-xs text-neutral-400">
              Exclusive Discounts
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="h-5 w-5 text-neutral-300 mb-2" />
            <span className="text-xs text-neutral-400">Early Access</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="h-5 w-5 text-neutral-300 mb-2" />
            <span className="text-xs text-neutral-400">Productivity Tips</span>
          </div>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
            required
          />
          <Button
            type="submit"
            className="w-full bg-white text-neutral-900 hover:bg-neutral-100"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe Now"}
          </Button>
        </form>

        <p className="text-xs text-neutral-400 text-center">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </CardContent>
    </Card>
  );
}

// Compact version for footer
export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail("");
  };

  if (isSubscribed) {
    return (
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <Check className="h-5 w-5 text-green-600 mx-auto mb-2" />
        <p className="text-sm text-green-700">Thanks for subscribing!</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium text-neutral-900 mb-4">Stay Updated</h4>
      <p className="text-sm text-neutral-600 mb-4">
        Get notified about new products and exclusive offers
      </p>
      <form onSubmit={handleSubscribe} className="space-y-2">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-sm"
          required
        />
        <Button
          type="submit"
          size="sm"
          className="w-full bg-neutral-900 hover:bg-neutral-800"
          disabled={isLoading}
        >
          {isLoading ? "..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
