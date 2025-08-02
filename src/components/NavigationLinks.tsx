"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ShoppingCartTrigger } from "@/components/ShoppingCart";
import { UserMenu } from "@/components/AuthDialog";
import { AdminOnly } from "@/components/AdminProtection";

export function NavigationLinks() {
  return (
    <>
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

      {/* Admin link - only visible to admin users */}
      <AdminOnly>
        <Link
          href="/admin"
          className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
        >
          Admin
        </Link>
      </AdminOnly>

      <LanguageSwitcher variant="compact" />
      <ShoppingCartTrigger />
      <UserMenu />
    </>
  );
}
