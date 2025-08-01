"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModernGeometricBackgroundProps {
  variant?: 'minimal' | 'elegant' | 'dynamic';
}

export function ModernGeometricBackground({ variant = 'elegant' }: ModernGeometricBackgroundProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide on mobile for better performance
    if (typeof navigator !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsVisible(!isMobile);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

      {variant === 'minimal' && <MinimalPattern />}
      {variant === 'elegant' && <ElegantPattern />}
      {variant === 'dynamic' && <DynamicPattern />}
    </div>
  );
}

function MinimalPattern() {
  return (
    <>
      {/* Simple geometric lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgb(148 163 184)" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating circles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`circle-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`}
          className="absolute rounded-full border border-slate-200/40"
          style={{
            width: 200 + i * 100,
            height: 200 + i * 100,
            left: `${20 + i * 25}%`,
            top: `${30 + i * 15}%`,
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 30 + i * 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
        />
      ))}
    </>
  );
}

function ElegantPattern() {
  return (
    <>
      {/* Dot pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="rgb(148 163 184)" opacity="0.3"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)"/>
      </svg>

      {/* Large geometric shapes */}
      <motion.div
        className="absolute top-20 right-20 w-80 h-80 rounded-full border border-blue-100/50"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      <motion.div
        className="absolute bottom-20 left-20 w-60 h-60 rounded-lg border border-purple-100/50 rotate-45"
        animate={{ rotate: [45, 135, 45] }}
        transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.03), transparent)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Floating triangles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`triangle-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`}
          className="absolute"
          style={{
            left: `${15 + i * 20}%`,
            top: `${20 + (i % 2) * 50}%`,
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '25px solid rgb(148 163 184)',
            opacity: 0.1,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}

      {/* Gradient orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-xl" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-green-400/5 to-emerald-400/5 rounded-full blur-xl" />
    </>
  );
}

function DynamicPattern() {
  return (
    <>
      {/* Hexagonal pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" x="0" y="0" width="100" height="86.6" patternUnits="userSpaceOnUse">
            <polygon
              points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
              fill="none"
              stroke="rgb(148 163 184)"
              strokeWidth="0.5"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>

      {/* Animated geometric elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-40 bg-gradient-to-b from-blue-300/20 to-transparent"
        animate={{
          scaleY: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/3 w-40 h-2 bg-gradient-to-r from-purple-300/20 to-transparent"
        animate={{
          scaleX: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Pulsating circles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`pulse-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`}
          className="absolute rounded-full border border-slate-300/30"
          style={{
            width: 30 + i * 20,
            height: 30 + i * 20,
            left: `${70 - i * 8}%`,
            top: `${60 + i * 5}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Floating rectangles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`rect-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`}
          className="absolute bg-gradient-to-br from-indigo-200/10 to-blue-200/10 rounded-lg"
          style={{
            width: 60 + i * 20,
            height: 40 + i * 10,
            left: `${10 + i * 15}%`,
            top: `${70 - i * 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </>
  );
}

export default ModernGeometricBackground;
