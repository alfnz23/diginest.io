"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  Image as ImageIcon,
  Database,
  Globe,
  Monitor,
  Smartphone,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  BarChart3,
  Gauge
} from "lucide-react";

// Performance metrics interface
interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  pageSize: number;
  imageOptimization: number;
  cacheHitRate: number;
  cdnHitRate: number;
  mobileScore: number;
  desktopScore: number;
}

// Mock performance data
const mockPerformanceData: PerformanceMetrics = {
  loadTime: 1.2,
  firstContentfulPaint: 0.8,
  largestContentfulPaint: 1.5,
  cumulativeLayoutShift: 0.05,
  timeToInteractive: 2.1,
  totalBlockingTime: 45,
  pageSize: 1.8,
  imageOptimization: 92,
  cacheHitRate: 87,
  cdnHitRate: 94,
  mobileScore: 89,
  desktopScore: 95
};

const optimizationFeatures = [
  {
    id: "images",
    name: "Image Optimization",
    description: "WebP format, lazy loading, responsive images",
    status: "active",
    improvement: "40% faster loading",
    icon: ImageIcon
  },
  {
    id: "caching",
    name: "Intelligent Caching",
    description: "Browser caching, CDN caching, service worker",
    status: "active",
    improvement: "60% cache hit rate",
    icon: Database
  },
  {
    id: "cdn",
    name: "Global CDN",
    description: "Worldwide content delivery network",
    status: "active",
    improvement: "50% faster global access",
    icon: Globe
  },
  {
    id: "bundling",
    name: "Code Splitting",
    description: "Dynamic imports, tree shaking, bundle optimization",
    status: "active",
    improvement: "30% smaller bundles",
    icon: Zap
  },
  {
    id: "preload",
    name: "Resource Preloading",
    description: "Critical resource preloading, DNS prefetch",
    status: "active",
    improvement: "25% faster first paint",
    icon: TrendingUp
  }
];

const coreWebVitalsThresholds = {
  lcp: { good: 2.5, poor: 4.0 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1.8, poor: 3.0 },
  tti: { good: 3.8, poor: 7.3 }
};

interface PerformanceOptimizationProps {
  onOptimize?: (feature: string) => void;
  onAnalyze?: () => void;
}

export default function PerformanceOptimization({
  onOptimize,
  onAnalyze
}: PerformanceOptimizationProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(mockPerformanceData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>({});

  // Simulate real-time performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        setRealTimeMetrics({
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const analyzePerformance = async () => {
    setIsAnalyzing(true);

    // Simulate performance analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update metrics with slight variations
    setMetrics(prev => ({
      ...prev,
      loadTime: prev.loadTime + (Math.random() - 0.5) * 0.2,
      firstContentfulPaint: prev.firstContentfulPaint + (Math.random() - 0.5) * 0.1,
      largestContentfulPaint: prev.largestContentfulPaint + (Math.random() - 0.5) * 0.3,
      imageOptimization: Math.min(100, prev.imageOptimization + Math.random() * 5),
      cacheHitRate: Math.min(100, prev.cacheHitRate + Math.random() * 10)
    }));

    setIsAnalyzing(false);
    onAnalyze?.();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getCoreWebVitalStatus = (value: number, metric: keyof typeof coreWebVitalsThresholds) => {
    const thresholds = coreWebVitalsThresholds[metric];
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.poor) return "needs-improvement";
    return "poor";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "needs-improvement": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "poor": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Optimization</h1>
          <p className="text-gray-600">Monitor and optimize website performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={analyzePerformance} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? "Analyzing..." : "Analyze Performance"}
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Performance Scores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <Progress value={92} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Excellent performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Score</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.mobileScore)}`}>
              {metrics.mobileScore}
            </div>
            <Progress value={metrics.mobileScore} className="mt-2" />
            <Badge className={getScoreBadge(metrics.mobileScore)}>
              {metrics.mobileScore >= 90 ? "Good" : metrics.mobileScore >= 70 ? "Fair" : "Poor"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop Score</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.desktopScore)}`}>
              {metrics.desktopScore}
            </div>
            <Progress value={metrics.desktopScore} className="mt-2" />
            <Badge className={getScoreBadge(metrics.desktopScore)}>
              {metrics.desktopScore >= 90 ? "Good" : metrics.desktopScore >= 70 ? "Fair" : "Poor"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Load Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.loadTime.toFixed(1)}s</div>
            <Progress value={Math.max(0, 100 - (metrics.loadTime * 20))} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.loadTime <= 2 ? "Fast" : metrics.loadTime <= 4 ? "Average" : "Slow"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="core-vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Page Load Time</span>
                    <span className="font-medium">{metrics.loadTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">First Contentful Paint</span>
                    <span className="font-medium">{metrics.firstContentfulPaint.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time to Interactive</span>
                    <span className="font-medium">{metrics.timeToInteractive.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Page Size</span>
                    <span className="font-medium">{metrics.pageSize.toFixed(1)}MB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Image Optimization</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metrics.imageOptimization}%</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cache Hit Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metrics.cacheHitRate}%</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CDN Hit Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metrics.cdnHitRate}%</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Blocking Time</span>
                    <span className="font-medium">{metrics.totalBlockingTime}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Core Web Vitals Tab */}
        <TabsContent value="core-vitals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Largest Contentful Paint</CardTitle>
                <CardDescription>Measures loading performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold">{metrics.largestContentfulPaint.toFixed(1)}s</span>
                  {getStatusIcon(getCoreWebVitalStatus(metrics.largestContentfulPaint, 'lcp'))}
                </div>
                <Progress
                  value={Math.max(0, 100 - (metrics.largestContentfulPaint / 4 * 100))}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  Good: ≤2.5s | Poor: >4.0s
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">First Contentful Paint</CardTitle>
                <CardDescription>Time until first content appears</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold">{metrics.firstContentfulPaint.toFixed(1)}s</span>
                  {getStatusIcon(getCoreWebVitalStatus(metrics.firstContentfulPaint, 'fcp'))}
                </div>
                <Progress
                  value={Math.max(0, 100 - (metrics.firstContentfulPaint / 3 * 100))}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  Good: ≤1.8s | Poor: >3.0s
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cumulative Layout Shift</CardTitle>
                <CardDescription>Measures visual stability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold">{metrics.cumulativeLayoutShift.toFixed(2)}</span>
                  {getStatusIcon(getCoreWebVitalStatus(metrics.cumulativeLayoutShift, 'cls'))}
                </div>
                <Progress
                  value={Math.max(0, 100 - (metrics.cumulativeLayoutShift / 0.25 * 100))}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  Good: ≤0.1 | Poor: >0.25
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimizations Tab */}
        <TabsContent value="optimizations" className="space-y-6">
          <div className="grid gap-4">
            {optimizationFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{feature.name}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                          <Badge className="bg-green-100 text-green-800 mt-1">
                            {feature.improvement}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={feature.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {feature.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOptimize?.(feature.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Real-time Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Performance Monitoring</CardTitle>
              <CardDescription>Live performance metrics and system status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">DOM Loaded</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {realTimeMetrics.domContentLoaded ? `${realTimeMetrics.domContentLoaded.toFixed(0)}ms` : '-'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Load Complete</p>
                  <p className="text-2xl font-bold text-green-900">
                    {realTimeMetrics.loadComplete ? `${realTimeMetrics.loadComplete.toFixed(0)}ms` : '-'}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">First Paint</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {realTimeMetrics.firstPaint ? `${realTimeMetrics.firstPaint.toFixed(0)}ms` : '-'}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Memory Usage</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {realTimeMetrics.memoryUsage ? `${(realTimeMetrics.memoryUsage / 1024 / 1024).toFixed(1)}MB` : '-'}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Performance Recommendations</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Enable gzip compression for text resources</li>
                  <li>• Implement service worker for offline caching</li>
                  <li>• Use WebP format for images where supported</li>
                  <li>• Minimize JavaScript bundle size with code splitting</li>
                  <li>• Optimize font loading with font-display: swap</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
