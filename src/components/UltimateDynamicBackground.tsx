"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

interface UltimateDynamicBackgroundProps {
  theme?: "light" | "dark" | "gradient" | "cosmic" | "ocean" | "sunset";
  intensity?: "minimal" | "moderate" | "intense" | "maximum";
  interactive?: boolean;
  animationSpeed?: "slow" | "normal" | "fast";
}

export function UltimateDynamicBackground({
  theme = "gradient",
  intensity = "moderate",
  interactive = true,
  animationSpeed = "normal",
}: UltimateDynamicBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  // Performance optimization - detect device capabilities
  useEffect(() => {
    const checkPerformance = () => {
      if (typeof navigator !== "undefined") {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          );
        const isLowEnd =
          navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        setIsVisible(!isMobile && !isLowEnd);
      }
    };

    checkPerformance();
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    if (!interactive || typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  // Time-based animations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev + 1) % 3600); // Reset every hour
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Theme configurations
  const themeConfig = useMemo(() => {
    const themes = {
      light: {
        primary: "rgba(59, 130, 246, 0.15)",
        secondary: "rgba(139, 92, 246, 0.12)",
        accent: "rgba(6, 182, 212, 0.1)",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        particles: "rgba(100, 116, 139, 0.4)",
        overlay: "rgba(255, 255, 255, 0.1)",
      },
      dark: {
        primary: "rgba(0, 0, 0, 0.6)",
        secondary: "rgba(45, 45, 45, 0.4)",
        accent: "rgba(100, 100, 100, 0.3)",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        particles: "rgba(148, 163, 184, 0.5)",
        overlay: "rgba(0, 0, 0, 0.2)",
      },
      gradient: {
        primary: "rgba(236, 72, 153, 0.15)",
        secondary: "rgba(79, 70, 229, 0.12)",
        accent: "rgba(16, 185, 129, 0.1)",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
        particles: "rgba(255, 255, 255, 0.6)",
        overlay: "rgba(255, 255, 255, 0.15)",
      },
      cosmic: {
        primary: "rgba(139, 69, 19, 0.2)",
        secondary: "rgba(75, 0, 130, 0.15)",
        accent: "rgba(255, 20, 147, 0.1)",
        background:
          "linear-gradient(135deg, #0c0c0c 0%, #2d1b69 50%, #11092d 100%)",
        particles: "rgba(255, 255, 255, 0.8)",
        overlay: "rgba(138, 43, 226, 0.1)",
      },
      ocean: {
        primary: "rgba(0, 191, 255, 0.2)",
        secondary: "rgba(30, 144, 255, 0.15)",
        accent: "rgba(0, 206, 209, 0.1)",
        background:
          "linear-gradient(135deg, #006994 0%, #0077be 50%, #87ceeb 100%)",
        particles: "rgba(255, 255, 255, 0.7)",
        overlay: "rgba(0, 191, 255, 0.1)",
      },
      sunset: {
        primary: "rgba(255, 94, 77, 0.2)",
        secondary: "rgba(255, 154, 0, 0.15)",
        accent: "rgba(255, 206, 84, 0.1)",
        background:
          "linear-gradient(135deg, #ff6b6b 0%, #ffa726 50%, #ffcc02 100%)",
        particles: "rgba(255, 255, 255, 0.6)",
        overlay: "rgba(255, 87, 34, 0.1)",
      },
    };
    return themes[theme];
  }, [theme]);

  // Animation speed configurations
  const speedConfig = useMemo(() => {
    const speeds = {
      slow: { multiplier: 0.5, duration: 40 },
      normal: { multiplier: 1, duration: 25 },
      fast: { multiplier: 1.5, duration: 15 },
    };
    return speeds[animationSpeed];
  }, [animationSpeed]);

  // Intensity-based element counts
  const elementCounts = useMemo(() => {
    const counts = {
      minimal: { orbs: 3, waves: 2, particles: 15, geometrics: 4 },
      moderate: { orbs: 6, waves: 4, particles: 30, geometrics: 8 },
      intense: { orbs: 10, waves: 6, particles: 50, geometrics: 12 },
      maximum: { orbs: 15, waves: 8, particles: 80, geometrics: 16 },
    };
    return counts[intensity];
  }, [intensity]);

  if (!isVisible) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-[-1]"
        style={{ background: themeConfig.background }}
      />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Base animated gradient */}
      <motion.div
        className="absolute inset-0"
        style={{ background: themeConfig.background }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: speedConfig.duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Dynamic floating orbs */}
      {[...Array(elementCounts.orbs)].map((_, i) => {
        const size = 80 + i * 40;
        const delay = i * (speedConfig.duration / elementCounts.orbs);
        const duration = speedConfig.duration + i * 5;
        const uniqueKey = `orb-${theme}-${i}-${Date.now()}`;

        return (
          <motion.div
            key={uniqueKey}
            className="absolute rounded-full opacity-60"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, ${themeConfig.primary}, transparent 70%)`,
              filter: "blur(25px)",
            }}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              y: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              scale: [1, 1.5, 0.8, 1.2, 1],
              opacity: [0.3, 0.8, 0.4, 0.9, 0.3],
            }}
            transition={{
              duration: duration * speedConfig.multiplier,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Flowing waves */}
      {[...Array(elementCounts.waves)].map((_, i) => {
        const height = 150 + i * 50;
        const delay = i * 4;
        const uniqueKey = `wave-${theme}-${i}-${Date.now()}`;

        return (
          <motion.div
            key={uniqueKey}
            className="absolute w-full opacity-40"
            style={{
              height: height,
              top: `${15 + i * 20}%`,
              background: `linear-gradient(90deg,
                transparent 0%,
                ${themeConfig.secondary} 25%,
                ${themeConfig.primary} 50%,
                ${themeConfig.accent} 75%,
                transparent 100%)`,
              borderRadius: "50%",
              filter: "blur(30px)",
            }}
            animate={{
              x: ["-120%", "120%"],
              scaleY: [1, 1.8, 1.2, 1],
              opacity: [0, 0.6, 0.8, 0],
            }}
            transition={{
              duration: (speedConfig.duration + i * 8) * speedConfig.multiplier,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Enhanced geometric patterns */}
      {[...Array(elementCounts.geometrics)].map((_, i) => {
        const size = 25 + (i % 4) * 25;
        const x = 8 + ((i * 11) % 84);
        const y = 12 + ((i * 13) % 76);
        const rotation = i * 30;
        const uniqueKey = `geo-${theme}-${i}-${Date.now()}`;

        return (
          <motion.div
            key={uniqueKey}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
            }}
            animate={{
              rotate: [rotation, rotation + 360],
              scale: [1, 1.4, 0.8, 1.2, 1],
              opacity: [0.1, 0.5, 0.3, 0.7, 0.1],
            }}
            transition={{
              duration: (35 + i * 3) * speedConfig.multiplier,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {i % 5 === 0 && (
              <div
                className="w-full h-full border-2 rounded-full"
                style={{
                  borderColor: themeConfig.accent,
                  boxShadow: `0 0 20px ${themeConfig.accent}`,
                }}
              />
            )}
            {i % 5 === 1 && (
              <div
                className="w-full h-full border-2 rotate-45"
                style={{
                  borderColor: themeConfig.secondary,
                  background: `linear-gradient(45deg, ${themeConfig.secondary}, transparent)`,
                  boxShadow: `0 0 15px ${themeConfig.secondary}`,
                }}
              />
            )}
            {i % 5 === 2 && (
              <div
                className="w-full h-full"
                style={{
                  background: `conic-gradient(from 0deg, ${themeConfig.primary}, transparent, ${themeConfig.accent})`,
                  borderRadius: "30%",
                  filter: "blur(8px)",
                }}
              />
            )}
            {i % 5 === 3 && (
              <div
                className="w-full h-full"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  background: themeConfig.primary,
                  filter: `drop-shadow(0 0 10px ${themeConfig.primary})`,
                }}
              />
            )}
            {i % 5 === 4 && (
              <div
                className="w-full h-full rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${themeConfig.accent}, ${themeConfig.secondary})`,
                  opacity: 0.6,
                }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Interactive mouse following effect */}
      {interactive && (
        <motion.div
          className="absolute w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${themeConfig.primary} 0%, ${themeConfig.secondary} 40%, transparent 70%)`,
            filter: "blur(50px)",
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.3, 1.1, 1],
            opacity: [0.3, 0.7, 0.5, 0.3],
          }}
          transition={{
            duration: 3 * speedConfig.multiplier,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Floating particles system */}
      {[...Array(elementCounts.particles)].map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = 1 + Math.random() * 4;
        const duration = 12 + Math.random() * 15;
        const delay = Math.random() * 8;
        const uniqueKey = `particle-${theme}-${i}-${Date.now()}`;

        return (
          <motion.div
            key={uniqueKey}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: `radial-gradient(circle, ${themeConfig.particles}, transparent)`,
              boxShadow: `0 0 ${size * 3}px ${themeConfig.particles}`,
            }}
            animate={{
              y: [0, -200, -400, -200, 0],
              x: [0, 30, -20, 10, 0],
              opacity: [0, 0.8, 1, 0.6, 0],
              scale: [0.5, 1.2, 1.8, 1, 0.5],
            }}
            transition={{
              duration: duration * speedConfig.multiplier,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Corner accent effects */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96"
        style={{
          background: `radial-gradient(circle, ${themeConfig.primary} 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.5, 1.2, 1],
          opacity: [0.2, 0.6, 0.4, 0.2],
        }}
        transition={{
          duration: 18 * speedConfig.multiplier,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96"
        style={{
          background: `radial-gradient(circle, ${themeConfig.accent} 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1.5, 1, 1.3, 1.5],
          opacity: [0.6, 0.2, 0.5, 0.6],
        }}
        transition={{
          duration: 15 * speedConfig.multiplier,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 7,
        }}
      />

      {/* Central flowing element */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${themeConfig.secondary}, ${themeConfig.accent}, transparent)`,
          filter: "blur(100px)",
          borderRadius: "50%",
        }}
        animate={{
          rotate: [0, 360],
          scaleX: [1, 1.6, 0.8, 1],
          scaleY: [1, 0.6, 1.4, 1],
        }}
        transition={{
          duration: 60 * speedConfig.multiplier,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Dynamic overlay for depth */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: themeConfig.overlay,
          mixBlendMode: "overlay",
        }}
        animate={{
          opacity: [0.1, 0.3, 0.2, 0.1],
        }}
        transition={{
          duration: 20 * speedConfig.multiplier,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Subtle animated grid for texture */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${themeConfig.particles} 1px, transparent 1px),
            linear-gradient(90deg, ${themeConfig.particles} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px", "0px 0px"],
        }}
        transition={{
          duration: 30 * speedConfig.multiplier,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default UltimateDynamicBackground;
