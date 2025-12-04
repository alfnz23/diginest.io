'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getStripe } from '@/lib/stripe-client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface CheckoutButtonProps {
  productId: string;
  price: number;
  title: string;
  disabled?: boolean;
  className?: string;
}

export default function CheckoutButton({
  productId,
  price,
  title,
  disabled,
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase this product.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userId: user.id,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else if (sessionId) {
        // Use Stripe.js to redirect to checkout
        const stripe = await getStripe();
        if (!stripe) {
          throw new Error('Failed to load Stripe');
        }

        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error('Invalid response from checkout API');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className={className}
      size="lg"
    >
      {loading ? 'Processing...' : `Buy Now - $${price}`}
    </Button>
  );
}