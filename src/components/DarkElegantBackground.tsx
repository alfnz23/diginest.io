"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DarkElegantBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export function DarkElegantBackground({ intensity = 'medium' }: DarkElegantBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const particleCount = intensity === 'low' ? 20 : intensity === 'medium' ? 40 : 60;
  const shadowCount = intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #404040 75%, #1a1a1a 100%)',
        backgroundSize: '400% 400%'
      }}
    >
      {/* Base animated dark gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 25%, #2d2d2d 50%, #404040 75%, #1a1a1a 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Floating dark shadows */}
      {[...Array(shadowCount)].map((_, i) => {
        const size = 150 + i * 100;
        const delay = i * 3;
        const duration = 25 + i * 5;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;

        return (
          <motion.div
            key={`shadow-${i}-${Date.now()}`}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: "radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, rgba(45, 45, 45, 0.2) 50%, transparent 70%)",
              filter: 'blur(30px)',
            }}
            initial={{
              x: `${startX}%`,
              y: `${startY}%`,
            }}
            animate={{
              x: [`${startX}%`, `${(startX + 60) % 100}%`, `${startX}%`],
              y: [`${startY}%`, `${(startY + 40) % 100}%`, `${startY}%`],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
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

      {/* Moving shadow waves */}
      {[...Array(4)].map((_, i) => {
        const delay = i * 4;
        const height = 100 + i * 50;
        const yPos = 15 + i * 20;

        return (
          <motion.div
            key={`wave-${i}-${Date.now()}`}
            className="absolute w-full"
            style={{
              height: height,
              top: `${yPos}%`,
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(0, 0, 0, 0.5) 25%,
                rgba(45, 45, 45, 0.4) 50%,
                rgba(64, 64, 64, 0.3) 75%,
                transparent 100%)`,
              borderRadius: '50%',
              filter: 'blur(25px)',
            }}
            animate={{
              x: ['-100%', '100%'],
              scaleY: [1, 1.3, 1],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 30 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Dark geometric shapes */}
      {[...Array(8)].map((_, i) => {
        const size = 40 + (i % 3) * 30;
        const x = 10 + (i * 12) % 80;
        const y = 15 + (i * 15) % 70;
        const rotation = i * 45;

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
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 35 + i * 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {i % 3 === 0 && (
              <div
                className="w-full h-full border border-gray-600/30 rounded-full"
                style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}
              />
            )}
            {i % 3 === 1 && (
              <div
                className="w-full h-full border border-gray-500/30 rotate-45"
                style={{
                  background: 'linear-gradient(45deg, rgba(0,0,0,0.3), rgba(45,45,45,0.2))',
                  boxShadow: '0 0 15px rgba(0,0,0,0.4)'
                }}
              />
            )}
            {i % 3 === 2 && (
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(64,64,64,0.2) 0%, transparent 70%)',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
                }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Dark particles */}
      {[...Array(particleCount)].map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = 1 + Math.random() * 4;
        const duration = 20 + Math.random() * 15;
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
              background: 'radial-gradient(circle, rgba(128, 128, 128, 0.6), rgba(64, 64, 64, 0.3))',
              boxShadow: '0 0 8px rgba(128, 128, 128, 0.3)',
            }}
            animate={{
              y: [0, -150, -300, -150, 0],
              x: [0, 30, -30, 15, 0],
              opacity: [0, 0.7, 1, 0.5, 0],
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

      {/* Mouse shadow effect */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, rgba(45, 45, 45, 0.2) 50%, transparent 70%)',
          filter: 'blur(40px)',
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Corner dark accents */}
      <motion.div
        className="absolute top-0 left-0 w-80 h-80"
        style={{
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.6) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80"
        style={{
          background: 'radial-gradient(circle, rgba(45, 45, 45, 0.5) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 7,
        }}
      />

      {/* Central flowing shadow */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), rgba(64, 64, 64, 0.2), transparent)',
          filter: 'blur(60px)',
          borderRadius: '50%',
        }}
        animate={{
          rotate: [0, 360],
          scaleX: [1, 1.4, 1],
          scaleY: [1, 0.7, 1],
        }}
        transition={{
          duration: 50,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Dark grid overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(128, 128, 128, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 128, 128, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px', '0px 0px'],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default DarkElegantBackground;
