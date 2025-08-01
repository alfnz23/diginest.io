"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ElegantMovingBackgroundProps {
  intensity?: "low" | "medium" | "high";
}

export function ElegantMovingBackground({
  intensity = "medium",
}: ElegantMovingBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Always show - no mobile detection
    setIsVisible(true);
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

  const particleCount =
    intensity === "low" ? 30 : intensity === "medium" ? 50 : 80;
  const waveCount = intensity === "low" ? 4 : intensity === "medium" ? 6 : 10;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Primary animated gradient base */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Overlay for transparency */}
      <div className="absolute inset-0 bg-white/85" />

      {/* Floating orbs with different sizes and colors */}
      {[...Array(8)].map((_, i) => {
        const size = 100 + i * 50;
        const delay = i * 2;
        const duration = 20 + i * 5;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;

        const colors = [
          "rgba(102, 126, 234, 0.15)",
          "rgba(118, 75, 162, 0.15)",
          "rgba(240, 147, 251, 0.15)",
          "rgba(245, 87, 108, 0.15)",
          "rgba(79, 172, 254, 0.15)",
          "rgba(56, 239, 125, 0.15)",
          "rgba(255, 195, 113, 0.15)",
          "rgba(255, 107, 107, 0.15)",
        ];

        return (
          <motion.div
            key={`orb-${i}-${Date.now()}`}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, ${colors[i]}, transparent 70%)`,
              filter: "blur(20px)",
            }}
            initial={{
              x: `${startX}%`,
              y: `${startY}%`,
            }}
            animate={{
              x: [`${startX}%`, `${(startX + 50) % 100}%`, `${startX}%`],
              y: [`${startY}%`, `${(startY + 30) % 100}%`, `${startY}%`],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
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

      {/* Elegant flowing waves */}
      {[...Array(waveCount)].map((_, i) => {
        const delay = i * 3;
        const height = 200 + i * 50;
        const yPos = 10 + i * 15;

        return (
          <motion.div
            key={`wave-${i}-${Date.now()}`}
            className="absolute w-full opacity-20"
            style={{
              height: height,
              top: `${yPos}%`,
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(102, 126, 234, 0.3) 25%,
                rgba(118, 75, 162, 0.4) 50%,
                rgba(240, 147, 251, 0.3) 75%,
                transparent 100%)`,
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
            animate={{
              x: ["-100%", "100%"],
              scaleY: [1, 1.5, 1],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 25 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Sophisticated geometric patterns */}
      {[...Array(12)].map((_, i) => {
        const size = 30 + (i % 4) * 20;
        const x = 5 + ((i * 8) % 90);
        const y = 10 + ((i * 12) % 80);
        const rotation = i * 30;

        return (
          <motion.div
            key={`geo-${i}-${Date.now()}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
            }}
            animate={{
              rotate: [rotation, rotation + 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 30 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {/* Different geometric shapes */}
            {i % 4 === 0 && (
              <div className="w-full h-full border-2 border-purple-300/20 rounded-full" />
            )}
            {i % 4 === 1 && (
              <div className="w-full h-full border-2 border-blue-300/20 rotate-45" />
            )}
            {i % 4 === 2 && (
              <div
                className="w-full h-full border-2 border-pink-300/20"
                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
              />
            )}
            {i % 4 === 3 && (
              <div className="w-full h-full bg-gradient-to-r from-indigo-200/10 to-purple-200/10 rounded-lg" />
            )}
          </motion.div>
        );
      })}

      {/* Elegant particle system */}
      {[...Array(particleCount)].map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = 2 + Math.random() * 6;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 10;

        const colors = [
          "#667eea",
          "#764ba2",
          "#f093fb",
          "#f5576c",
          "#4facfe",
          "#38ef7d",
        ];

        return (
          <motion.div
            key={`particle-${i}-${Date.now()}`}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: `radial-gradient(circle, ${colors[i % colors.length]}40, transparent)`,
              boxShadow: `0 0 ${size * 2}px ${colors[i % colors.length]}20`,
            }}
            animate={{
              y: [0, -100, -200, -100, 0],
              x: [0, 20, -20, 10, 0],
              opacity: [0, 0.8, 1, 0.6, 0],
              scale: [0.5, 1, 1.5, 1, 0.5],
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

      {/* Interactive mouse following gradient */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, rgba(240, 147, 251, 0.1) 50%, transparent 70%)",
          filter: "blur(50px)",
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Elegant corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-80 h-80"
        style={{
          background:
            "radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80"
        style={{
          background:
            "radial-gradient(circle, rgba(240, 147, 251, 0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1.4, 1, 1.4],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Central flowing element */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(118, 75, 162, 0.15), transparent)",
          filter: "blur(80px)",
          borderRadius: "50%",
        }}
        animate={{
          rotate: [0, 360],
          scaleX: [1, 1.5, 1],
          scaleY: [1, 0.8, 1],
        }}
        transition={{
          duration: 40,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Animated mesh grid */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(102, 126, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px", "0px 0px"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default ElegantMovingBackground;
