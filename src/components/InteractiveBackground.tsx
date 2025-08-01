"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface InteractiveBackgroundProps {
  intensity?: "low" | "medium" | "high";
}

export function InteractiveBackground({
  intensity = "medium",
}: InteractiveBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide on mobile for better performance
    if (typeof navigator !== "undefined") {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      setIsVisible(!isMobile);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  if (!isVisible) return null;

  const shapeCount = intensity === "low" ? 6 : intensity === "medium" ? 10 : 15;
  const particleCount =
    intensity === "low" ? 20 : intensity === "medium" ? 35 : 50;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 35%, rgba(6, 182, 212, 0.05) 70%, transparent 100%)`,
        }}
      />

      {/* Floating Geometric Shapes */}
      {[...Array(shapeCount)].map((_, i) => {
        const delay = i * 0.5;
        const size = 20 + Math.random() * 40;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 8 + Math.random() * 12;
        const uniqueId = `shape-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;

        return (
          <motion.div
            key={uniqueId}
            className="absolute rounded-lg opacity-20"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: [
                "linear-gradient(45deg, #3b82f6, #06b6d4)",
                "linear-gradient(45deg, #8b5cf6, #ec4899)",
                "linear-gradient(45deg, #10b981, #f59e0b)",
                "linear-gradient(45deg, #ef4444, #f97316)",
              ][i % 4],
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              x: [0, (mousePosition.x - 50) * 0.5, 0],
              y: [0, (mousePosition.y - 50) * 0.3, 0],
            }}
            transition={{
              rotate: {
                duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              scale: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              x: { duration: 2, ease: "easeOut" },
              y: { duration: 2, ease: "easeOut" },
            }}
          />
        );
      })}

      {/* Floating Particles */}
      {[...Array(particleCount)].map((_, i) => {
        const delay = i * 0.1;
        const size = 2 + Math.random() * 4;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const uniqueId = `particle-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;

        return (
          <motion.div
            key={uniqueId}
            className="absolute rounded-full bg-white opacity-40"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
              x: [0, (mousePosition.x - 50) * 0.1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Mouse Trail Effect */}
      <motion.div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)",
          filter: "blur(20px)",
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Corner Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/5 via-transparent to-pink-400/5 rounded-full blur-3xl" />

      {/* Pulse Rings */}
      {[...Array(3)].map((_, i) => {
        const uniqueId = `ring-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
        return (
          <motion.div
            key={uniqueId}
            className="absolute border border-white/10 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              width: 100 + i * 100,
              height: 100 + i * 100,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Interactive Hover Zones */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => {
          const uniqueId = `zone-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
          return (
            <motion.div
              key={uniqueId}
              className="absolute w-24 h-24 rounded-full opacity-0"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              }}
              whileHover={{
                opacity: 1,
                scale: 1.5,
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default InteractiveBackground;
