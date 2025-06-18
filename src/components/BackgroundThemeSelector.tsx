"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Palette, Check } from "lucide-react";

type BackgroundTheme = 'light' | 'dark' | 'gradient' | 'cosmic' | 'ocean' | 'sunset';
type BackgroundIntensity = 'minimal' | 'moderate' | 'intense' | 'maximum';
type AnimationSpeed = 'slow' | 'normal' | 'fast';

interface BackgroundThemeSelectorProps {
  currentTheme: BackgroundTheme;
  currentIntensity: BackgroundIntensity;
  currentSpeed: AnimationSpeed;
  onThemeChange: (theme: BackgroundTheme) => void;
  onIntensityChange: (intensity: BackgroundIntensity) => void;
  onSpeedChange: (speed: AnimationSpeed) => void;
}

const themeOptions = [
  { value: 'light' as const, label: 'Light & Clean', emoji: '☀️' },
  { value: 'dark' as const, label: 'Dark & Mysterious', emoji: '🌙' },
  { value: 'gradient' as const, label: 'Colorful Gradient', emoji: '🌈' },
  { value: 'cosmic' as const, label: 'Cosmic Space', emoji: '🌌' },
  { value: 'ocean' as const, label: 'Ocean Depths', emoji: '🌊' },
  { value: 'sunset' as const, label: 'Warm Sunset', emoji: '🌅' },
];

const intensityOptions = [
  { value: 'minimal' as const, label: 'Minimal', description: 'Subtle effects' },
  { value: 'moderate' as const, label: 'Moderate', description: 'Balanced visuals' },
  { value: 'intense' as const, label: 'Intense', description: 'Rich animations' },
  { value: 'maximum' as const, label: 'Maximum', description: 'Full experience' },
];

const speedOptions = [
  { value: 'slow' as const, label: 'Slow', description: 'Peaceful pace' },
  { value: 'normal' as const, label: 'Normal', description: 'Default speed' },
  { value: 'fast' as const, label: 'Fast', description: 'Energetic' },
];

export function BackgroundThemeSelector({
  currentTheme,
  currentIntensity,
  currentSpeed,
  onThemeChange,
  onIntensityChange,
  onSpeedChange,
}: BackgroundThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentThemeOption = themeOptions.find(option => option.value === currentTheme);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-neutral-300 hover:border-neutral-400 transition-colors"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">
            {currentThemeOption?.emoji} {currentThemeOption?.label}
          </span>
          <span className="sm:hidden text-sm">
            {currentThemeOption?.emoji}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2 border-b border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-700">Background Theme</h3>
        </div>

        {/* Theme Selection */}
        <div className="py-2">
          {themeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onThemeChange(option.value)}
              className="flex items-center justify-between cursor-pointer p-3 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{option.emoji}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
              {currentTheme === option.value && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* Intensity Selection */}
        <div className="py-2">
          <div className="px-3 py-2">
            <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Animation Intensity
            </h4>
          </div>
          {intensityOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onIntensityChange(option.value)}
              className="flex items-center justify-between cursor-pointer p-3 hover:bg-neutral-50"
            >
              <div>
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-neutral-500">{option.description}</div>
              </div>
              {currentIntensity === option.value && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* Speed Selection */}
        <div className="py-2">
          <div className="px-3 py-2">
            <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Animation Speed
            </h4>
          </div>
          {speedOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSpeedChange(option.value)}
              className="flex items-center justify-between cursor-pointer p-3 hover:bg-neutral-50"
            >
              <div>
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-neutral-500">{option.description}</div>
              </div>
              {currentSpeed === option.value && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        <div className="p-2 text-xs text-neutral-500">
          Background effects are optimized for desktop devices
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default BackgroundThemeSelector;
