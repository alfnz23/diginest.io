"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import EnhancedSearch from "@/components/EnhancedSearch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Star,
  Tag,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/contexts/I18nContext";

export interface SearchFilters {
  query: string;
  category: string;
  priceRange: string;
  rating: number;
  sortBy: string;
  tags: string[];
  dateRange: string;
  featured: boolean;
}

interface SearchAndFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  resultsCount?: number;
}

export function SearchAndFilter({
  filters,
  onFiltersChange,
  resultsCount,
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { t } = useI18n();

  const updateFilter = (key: keyof SearchFilters, value: string | number) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: "",
      category: "",
      priceRange: "",
      rating: 0,
      sortBy: "newest",
      tags: [],
      dateRange: "",
      featured: false,
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.priceRange ||
    filters.rating > 0 ||
    filters.tags.length > 0 ||
    filters.dateRange ||
    filters.featured;

  return (
    <div className="space-y-4">
      {/* Enhanced Search Bar */}
      <div className="relative">
        <EnhancedSearch
          placeholder={t("products.search")}
          onSearch={(query) => updateFilter("query", query)}
          onProductSelect={(product) => {
            // You can implement product selection logic here
            console.log("Selected product:", product);
          }}
          showTrending={true}
          showHistory={true}
          showSuggestions={true}
          className="w-full"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("products.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("products.allCategories")}</SelectItem>
              <SelectItem value="ebooks">{t("category.ebooks")}</SelectItem>
              <SelectItem value="planners">{t("category.planners")}</SelectItem>
              <SelectItem value="templates">
                {t("category.templates")}
              </SelectItem>
              <SelectItem value="tools">{t("category.tools")}</SelectItem>
              <SelectItem value="health">{t("category.health")}</SelectItem>
              <SelectItem value="fitness">{t("category.fitness")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Filter Products</DialogTitle>
                <DialogDescription>
                  Refine your search with advanced filters
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Price Range
                  </Label>
                  <div className="space-y-2">
                    {[
                      { value: "", label: "Any Price" },
                      { value: "0-20", label: "Under $20" },
                      { value: "20-50", label: "$20 - $50" },
                      { value: "50-100", label: "$50 - $100" },
                      { value: "100+", label: "Over $100" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`price-${option.value}`}
                          checked={filters.priceRange === option.value}
                          onCheckedChange={() =>
                            updateFilter("priceRange", option.value)
                          }
                        />
                        <Label
                          htmlFor={`price-${option.value}`}
                          className="text-sm"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Minimum Rating
                  </Label>
                  <div className="space-y-2">
                    {[
                      { value: 0, label: "Any Rating" },
                      { value: 4, label: "4+ Stars" },
                      { value: 4.5, label: "4.5+ Stars" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`rating-${option.value}`}
                          checked={filters.rating === option.value}
                          onCheckedChange={() =>
                            updateFilter("rating", option.value)
                          }
                        />
                        <Label
                          htmlFor={`rating-${option.value}`}
                          className="text-sm"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                  disabled={!hasActiveFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Clear Active Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Label className="text-sm text-neutral-600">Sort by:</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      {resultsCount !== undefined && (
        <div className="text-sm text-neutral-600">
          {resultsCount} {resultsCount === 1 ? "product" : "products"} found
          {filters.query && ` for "${filters.query}"`}
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.category || filters.priceRange || filters.rating > 0) && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <div className="flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs">
              <span>Category: {filters.category}</span>
              <button
                onClick={() => updateFilter("category", "")}
                className="hover:text-neutral-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.priceRange && (
            <div className="flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs">
              <span>
                Price:{" "}
                {filters.priceRange === "100+"
                  ? "Over $100"
                  : `$${filters.priceRange}`}
              </span>
              <button
                onClick={() => updateFilter("priceRange", "")}
                className="hover:text-neutral-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filters.rating > 0 && (
            <div className="flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs">
              <span>{filters.rating}+ Stars</span>
              <button
                onClick={() => updateFilter("rating", 0)}
                className="hover:text-neutral-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
