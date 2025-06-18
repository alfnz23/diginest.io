"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModernMovingBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  theme?: 'light' | 'dark' | 'colorful';
}

export function ModernMovingBackground({ intensity = 'medium', theme = 'light' }: ModernMovingBackgroundProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Always show for testing - remove mobile detection temporarily
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          primary: 'rgba(59, 130, 246, 0.03)',
          secondary: 'rgba(139, 92, 246, 0.02)',
          accent: 'rgba(6, 182, 212, 0.02)',
          background: 'rgba(15, 23, 42, 0.02)'
        };
      case 'colorful':
        return {
          primary: 'rgba(59, 130, 246, 0.15)',
          secondary: 'rgba(139, 92, 246, 0.12)',
          accent: 'rgba(236, 72, 153, 0.1)',
          background: 'rgba(16, 185, 129, 0.08)'
        };
      default:
        return {
          primary: 'rgba(59, 130, 246, 0.12)',
          secondary: 'rgba(139, 92, 246, 0.1)',
          accent: 'rgba(6, 182, 212, 0.1)',
          background: 'rgba(248, 250, 252, 0.4)'
        };
    }
  };

  const colors = getThemeColors();
  const particleCount = intensity === 'low' ? 15 : intensity === 'medium' ? 25 : 40;
  const waveCount = intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Base gradient that moves very subtly */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, ${colors.background}, transparent, ${colors.primary})`,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Floating waves that move across the screen */}
      {[...Array(waveCount)].map((_, i) => {
        const delay = i * 2;
        const duration = 15 + i * 5;
        const startX = -20 - (i * 10);
        const endX = 120 + (i * 10);
        const yPosition = 10 + (i * 15);
        const size = 200 + (i * 100);

        return (
          <motion.div
            key={`wave-${i}-${Date.now()}`}
            className="absolute rounded-full opacity-80"
            style={{
              width: size,
              height: size / 2,
              background: `radial-gradient(ellipse, ${colors.primary}, transparent 70%)`,
              filter: 'blur(40px)',
              top: `${yPosition}%`,
            }}
            animate={{
              x: [`${startX}%`, `${endX}%`],
              y: [0, -20, 20, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0, 0.3, 0.3, 0],
            }}
            transition={{
              duration,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Subtle floating particles */}
      {[...Array(particleCount)].map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = 2 + Math.random() * 4;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 10;

        return (
          <motion.div
            key={`particle-${i}-${Date.now()}`}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: `radial-gradient(circle, ${colors.accent}, transparent)`,
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -30, -60, -30, 0],
              x: [0, 10, -10, 5, 0],
              opacity: [0, 0.8, 1, 0.6, 0],
              scale: [0.5, 1, 1.2, 0.8, 0.5],
            }}
            transition={{
              duration,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Geometric shapes that rotate and move */}
      {[...Array(6)].map((_, i) => {
        const x = 10 + (i * 15);
        const y = 20 + ((i % 2) * 40);
        const size = 40 + (i * 20);
        const rotationDuration = 20 + (i * 10);
        const moveDuration = 12 + (i * 3);

        return (
          <motion.div
            key={`shape-${i}-${Date.now()}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
            }}
            animate={{
              rotate: 360,
              x: [0, 50, -30, 20, 0],
              y: [0, -20, 30, -10, 0],
            }}
            transition={{
              rotate: { duration: rotationDuration, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              x: { duration: moveDuration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              y: { duration: moveDuration + 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          >
            {/* Different geometric shapes */}
            {i % 3 === 0 && (
              <div
                className="w-full h-full border opacity-20 rounded-full"
                style={{
                  borderColor: colors.secondary,
                  borderWidth: '1px',
                }}
              />
            )}
            {i % 3 === 1 && (
              <div
                className="w-full h-full opacity-10 rotate-45"
                style={{
                  background: `linear-gradient(45deg, ${colors.primary}, transparent)`,
                  borderRadius: '20%',
                }}
              />
            )}
            {i % 3 === 2 && (
              <div
                className="w-full h-full opacity-15"
                style={{
                  background: `conic-gradient(from 0deg, ${colors.accent}, transparent, ${colors.secondary})`,
                  borderRadius: '30%',
                  filter: 'blur(20px)',
                }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Subtle grid pattern that moves */}
      <motion.div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px', '0px 0px'],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Corner accent gradients */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Center flowing gradient */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
          filter: 'blur(80px)',
        }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export default ModernMovingBackground;
