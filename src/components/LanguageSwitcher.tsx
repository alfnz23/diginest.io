"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useI18n, supportedLanguages, type Language } from "@/contexts/I18nContext";
import { Globe, Check } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "mobile";
  showLabel?: boolean;
}

export function LanguageSwitcher({ variant = "default", showLabel = false }: LanguageSwitcherProps) {
  const { language, setLanguage, getCurrentLanguage, t } = useI18n();
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);

    // Optional: Track language changes for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_change', {
        event_category: 'engagement',
        event_label: newLanguage,
        value: 1
      });
    }
  };

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="text-sm">{currentLang.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {supportedLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{lang.flag}</span>
                <span className="text-sm">{lang.nativeName}</span>
              </div>
              {language === lang.code && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">{t('common.language')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {supportedLanguages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "outline"}
              size="sm"
              onClick={() => handleLanguageChange(lang.code)}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-xs">{lang.code.toUpperCase()}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLang.flag}</span>
          {showLabel && (
            <span className="hidden sm:inline text-sm">{currentLang.nativeName}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2 border-b border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-700">Choose Language</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {supportedLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between cursor-pointer p-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <div className="text-sm font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-neutral-500">{lang.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {lang.currencySymbol}
                </Badge>
                {language === lang.code && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="p-2 border-t border-neutral-200 text-xs text-neutral-500">
          Prices will be displayed in local currency
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Currency display component
export function CurrencyDisplay({ amount, showCode = false }: { amount: number; showCode?: boolean }) {
  const { formatPrice, getCurrentLanguage } = useI18n();
  const currentLang = getCurrentLanguage();

  return (
    <span className="font-medium">
      {formatPrice(amount)}
      {showCode && (
        <span className="text-xs text-neutral-500 ml-1">
          {currentLang.currency}
        </span>
      )}
    </span>
  );
}

// Regional preferences indicator
export function RegionalIndicator() {
  const { getCurrentLanguage } = useI18n();
  const currentLang = getCurrentLanguage();

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-500">
      <span>{currentLang.flag}</span>
      <span>{currentLang.name}</span>
      <span>•</span>
      <span>{currentLang.currency}</span>
    </div>
  );
}
