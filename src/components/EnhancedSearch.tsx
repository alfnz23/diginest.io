"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  TrendingUp,
  Clock,
  Star,
  Filter,
  X,
  Sparkles,
  Target,
  Zap,
  Eye,
  ShoppingCart
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

// Mock data for search functionality
const mockProducts = [
  { id: "1", name: "Digital Marketing Toolkit", category: "templates", price: 29.99, rating: 4.8, sales: 156 },
  { id: "2", name: "Minimalist Digital Planner", category: "planners", price: 29.99, rating: 4.9, sales: 247 },
  { id: "3", name: "Logo Design Kit", category: "tools", price: 45.99, rating: 4.8, sales: 234 },
  { id: "4", name: "Social Media Templates", category: "templates", price: 28.99, rating: 4.8, sales: 367 },
  { id: "5", name: "Business Plan Template", category: "templates", price: 19.99, rating: 4.6, sales: 189 },
  { id: "6", name: "Fitness Tracker Spreadsheet", category: "health", price: 22.99, rating: 4.7, sales: 183 },
  { id: "7", name: "Yoga Flow Sequences", category: "fitness", price: 26.99, rating: 4.9, sales: 345 },
  { id: "8", name: "Photography Lightroom Presets", category: "tools", price: 34.99, rating: 4.7, sales: 278 }
];

const trendingSearches = [
  "digital marketing",
  "business templates",
  "social media",
  "logo design",
  "fitness tracker",
  "productivity planner"
];

const searchHistory = [
  "marketing templates",
  "business plan",
  "social media kit",
  "logo maker"
];

const smartSuggestions = {
  "marketing": ["digital marketing", "marketing templates", "social media marketing", "email marketing"],
  "design": ["logo design", "graphic design", "web design", "design templates"],
  "business": ["business plan", "business templates", "business cards", "business strategy"],
  "fitness": ["fitness tracker", "workout planner", "yoga sequences", "nutrition guide"],
  "planner": ["digital planner", "productivity planner", "monthly planner", "goal planner"]
};

interface EnhancedSearchProps {
  onSearch?: (query: string, filters?: any) => void;
  onProductSelect?: (product: any) => void;
  placeholder?: string;
  showTrending?: boolean;
  showHistory?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

export default function EnhancedSearch({
  onSearch,
  onProductSelect,
  placeholder = "Search for digital products...",
  showTrending = true,
  showHistory = true,
  showSuggestions = true,
  className = ""
}: EnhancedSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(searchHistory);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLInputElement>(null);

  // Search function with AI-powered features
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Smart search with fuzzy matching and relevance scoring
    const searchResults = mockProducts
      .map(product => {
        const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatch = product.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Calculate relevance score
        let relevanceScore = 0;
        if (nameMatch) relevanceScore += 10;
        if (categoryMatch) relevanceScore += 5;
        if (product.rating >= 4.5) relevanceScore += 2;
        if (product.sales > 200) relevanceScore += 1;

        // Exact word matches get higher scores
        const queryWords = searchQuery.toLowerCase().split(' ');
        const nameWords = product.name.toLowerCase().split(' ');
        const exactMatches = queryWords.filter(word => nameWords.some(nameWord => nameWord.includes(word)));
        relevanceScore += exactMatches.length * 3;

        return nameMatch || categoryMatch ? { ...product, relevanceScore } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.relevanceScore || 0) - (a?.relevanceScore || 0))
      .slice(0, 6);

    // Generate smart suggestions based on query
    const querySuggestions = generateSmartSuggestions(searchQuery);

    setResults(searchResults);
    setSuggestions(querySuggestions);
    setLoading(false);
  }, []);

  // Generate smart suggestions based on partial query
  const generateSmartSuggestions = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    const allSuggestions: string[] = [];

    // Add suggestions from predefined categories
    Object.entries(smartSuggestions).forEach(([key, suggestions]) => {
      if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
        allSuggestions.push(...suggestions);
      }
    });

    // Add trending searches that match
    const matchingTrending = trendingSearches.filter(term =>
      term.toLowerCase().includes(lowerQuery) || lowerQuery.includes(term.toLowerCase())
    );
    allSuggestions.push(...matchingTrending);

    // Remove duplicates and return top 4
    return [...new Set(allSuggestions)].slice(0, 4);
  };

  // Effect for debounced search
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [debouncedQuery, performSearch]);

  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [searchQuery, ...prev.filter(item => item !== searchQuery)].slice(0, 5);
      return updated;
    });

    onSearch?.(searchQuery);
    setIsOpen(false);
    setQuery(searchQuery);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = results.length + suggestions.length + (showTrending ? trendingSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex === -1) {
          handleSearch();
        } else {
          // Handle selection based on active index
          if (activeIndex < results.length) {
            onProductSelect?.(results[activeIndex]);
          } else if (activeIndex < results.length + suggestions.length) {
            const suggestionIndex = activeIndex - results.length;
            handleSearch(suggestions[suggestionIndex]);
          } else {
            const trendingIndex = activeIndex - results.length - suggestions.length;
            handleSearch(trendingSearches[trendingIndex]);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSuggestions([]);
    setIsOpen(false);
    searchRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={searchRef}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              className="pl-10 pr-10"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandList className="max-h-96">
              {/* AI-Powered Suggestions */}
              {suggestions.length > 0 && (
                <>
                  <CommandGroup heading={
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span>Smart Suggestions</span>
                    </div>
                  }>
                    {suggestions.map((suggestion, index) => (
                      <CommandItem
                        key={suggestion}
                        value={suggestion}
                        onSelect={() => handleSearch(suggestion)}
                        className={`cursor-pointer ${activeIndex === results.length + index ? 'bg-gray-100' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span>{suggestion}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Search Results */}
              {results.length > 0 && (
                <>
                  <CommandGroup heading={
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <span>Products ({results.length})</span>
                    </div>
                  }>
                    {results.map((product, index) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        onSelect={() => onProductSelect?.(product)}
                        className={`cursor-pointer ${activeIndex === index ? 'bg-gray-100' : ''}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
                              <ShoppingCart className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Badge variant="outline" className="text-xs">{product.category}</Badge>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {product.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${product.price}</p>
                            <p className="text-xs text-gray-500">{product.sales} sales</p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Recent Searches */}
              {showHistory && recentSearches.length > 0 && !query && (
                <>
                  <CommandGroup heading={
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Recent Searches</span>
                    </div>
                  }>
                    {recentSearches.map((search, index) => (
                      <CommandItem
                        key={search}
                        value={search}
                        onSelect={() => handleSearch(search)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{search}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Trending Searches */}
              {showTrending && !query && (
                <CommandGroup heading={
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span>Trending</span>
                  </div>
                }>
                  {trendingSearches.map((trend, index) => (
                    <CommandItem
                      key={trend}
                      value={trend}
                      onSelect={() => handleSearch(trend)}
                      className={`cursor-pointer ${activeIndex === results.length + suggestions.length + index ? 'bg-gray-100' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-red-400" />
                        <span>{trend}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* No Results */}
              {query && results.length === 0 && suggestions.length === 0 && !loading && (
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-2 py-6">
                    <Search className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">No products found for "{query}"</p>
                    <p className="text-xs text-gray-400">Try different keywords or browse categories</p>
                  </div>
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Search Analytics */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 text-xs text-gray-500 flex justify-between items-center">
          <span>Search: "{query}"</span>
          {results.length > 0 && <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>}
        </div>
      )}
    </div>
  );
}

// Custom hook for debouncing
