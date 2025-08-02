"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  UserX,
  ArrowLeft,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

interface AdminProtectionProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  showUnauthorized?: boolean;
}

export function AdminProtection({
  children,
  requireAuth = true,
  redirectTo = "/",
  showUnauthorized = true
}: AdminProtectionProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect non-authenticated users
  useEffect(() => {
    if (mounted && !isLoading && requireAuth) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (!user?.isAdmin) {
        // For non-admin users, show unauthorized instead of redirecting
        // This prevents accidental exposure of admin URLs
        if (!showUnauthorized) {
          router.push(redirectTo);
        }
      }
    }
  }, [mounted, isLoading, isAuthenticated, user, requireAuth, redirectTo, showUnauthorized, router]);

  // Show loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-gray-600">Verifying authentication...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Lock className="h-6 w-6" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <p className="text-red-800 mb-2">
                You must be logged in to access this page.
              </p>
              <p className="text-sm text-red-700">
                Please sign in with your account to continue.
              </p>
            </div>

            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show unauthorized message for non-admin users
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <UserX className="h-6 w-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <p className="text-orange-800 mb-2 font-medium">
                Administrator access required
              </p>
              <p className="text-sm text-orange-700 mb-3">
                You don't have permission to access this area. This section is restricted to administrators only.
              </p>
              <div className="text-xs text-orange-600 space-y-1">
                <p><strong>Current user:</strong> {user?.name} ({user?.email})</p>
                <p><strong>Role:</strong> Customer</p>
              </div>
            </div>

            <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Need admin access?</p>
                  <p>Contact your system administrator to request admin privileges.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Store
                </Button>
              </Link>
              <Link href="/account" className="flex-1">
                <Button className="w-full">
                  My Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and is admin - render children
  return <>{children}</>;
}

// Hook to check if current user is admin
export function useIsAdmin(): boolean {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.isAdmin === true;
}

// Component to conditionally render admin-only content
export function AdminOnly({
  children,
  fallback = null
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isAdmin = useIsAdmin();
  return isAdmin ? <>{children}</> : <>{fallback}</>;
}

// Admin status badge component
export function AdminStatusBadge() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
        <UserX className="h-3 w-3 mr-1" />
        Not Logged In
      </Badge>
    );
  }

  if (user?.isAdmin) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
        <Shield className="h-3 w-3 mr-1" />
        Administrator
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
      <UserX className="h-3 w-3 mr-1" />
      Customer
    </Badge>
  );
}
