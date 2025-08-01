"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SimpleRobotProps {
  emotion?: 'happy' | 'excited' | 'curious' | 'thinking' | 'celebrating';
}

export function SimpleRobot({ emotion = 'happy' }: SimpleRobotProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide on mobile for better performance
    if (typeof navigator !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsVisible(!isMobile);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  if (!isVisible) return null;

  // Calculate robot position (follows mouse but stays in corner area)
  const robotX = Math.min(Math.max(mousePosition.x * 0.1, 20), 100);
  const robotY = Math.min(Math.max(mousePosition.y * 0.1, 20), 100);

  // Eye positions based on mouse
  const eyeX = typeof window !== 'undefined' ? (mousePosition.x / window.innerWidth - 0.5) * 6 : 0;
  const eyeY = typeof window !== 'undefined' ? (mousePosition.y / window.innerHeight - 0.5) * 6 : 0;

  const getEyeColor = () => {
    switch (emotion) {
      case 'happy': return '#10b981';
      case 'excited': return '#f59e0b';
      case 'celebrating': return '#ec4899';
      case 'thinking': return '#3b82f6';
      case 'curious': return '#8b5cf6';
      default: return '#06b6d4';
    }
  };

  const getMouthShape = () => {
    switch (emotion) {
      case 'happy': return 'M 25 35 Q 40 45 55 35';
      case 'excited': return 'M 25 35 Q 40 50 55 35';
      case 'celebrating': return 'M 25 35 Q 40 50 55 35';
      case 'thinking': return 'M 30 40 L 50 40';
      case 'curious': return 'M 35 35 Q 40 45 45 35';
      default: return 'M 30 40 L 50 40';
    }
  };

  const getEmoji = () => {
    switch (emotion) {
      case 'celebrating': return '🎉';
      case 'curious': return '🤔';
      case 'thinking': return '💭';
      case 'excited': return '⚡';
      default: return '';
    }
  };

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{
        bottom: 20,
        right: 20,
      }}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        x: robotX * 0.3,
        y: -robotY * 0.3,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
        opacity: { duration: 1 },
        scale: { duration: 1 },
        rotate: { duration: 1 }
      }}
    >
      {/* Robot Container */}
      <div className="relative">
        {/* Robot Body */}
        <motion.div
          className="relative"
          animate={{
            rotateZ: emotion === 'celebrating' ? [0, 5, -5, 0] : 0,
            scale: emotion === 'excited' ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotateZ: { repeat: emotion === 'celebrating' ? Number.POSITIVE_INFINITY : 0, duration: 0.5 },
            scale: { repeat: emotion === 'excited' ? Number.POSITIVE_INFINITY : 0, duration: 0.8 }
          }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-lg">
            {/* Body */}
            <rect x="20" y="30" width="40" height="40" rx="8" fill="#374151" stroke="#1f2937" strokeWidth="2"/>

            {/* Head */}
            <circle cx="40" cy="20" r="15" fill="#4b5563" stroke="#1f2937" strokeWidth="2"/>

            {/* Eyes */}
            <motion.circle
              cx={35 + eyeX}
              cy={18 + eyeY}
              r="3"
              fill={getEyeColor()}
              animate={{
                scale: emotion === 'excited' ? [1, 1.3, 1] : 1,
                fill: getEyeColor()
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.circle
              cx={45 + eyeX}
              cy={18 + eyeY}
              r="3"
              fill={getEyeColor()}
              animate={{
                scale: emotion === 'excited' ? [1, 1.3, 1] : 1,
                fill: getEyeColor()
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Eye Reflections */}
            <circle cx={36 + eyeX} cy={17 + eyeY} r="1" fill="white" opacity="0.8"/>
            <circle cx={46 + eyeX} cy={17 + eyeY} r="1" fill="white" opacity="0.8"/>

            {/* Mouth */}
            <motion.path
              d={getMouthShape()}
              stroke="#1f2937"
              strokeWidth="2"
              fill="none"
              animate={{
                d: getMouthShape(),
                strokeWidth: emotion === 'celebrating' ? [2, 3, 2] : 2
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Antenna */}
            <line x1="40" y1="5" x2="40" y2="10" stroke="#6b7280" strokeWidth="2"/>
            <motion.circle
              cx="40"
              cy="4"
              r="2"
              fill="#ef4444"
              animate={{
                fill: emotion === 'thinking' ? '#3b82f6' : '#ef4444',
                scale: emotion === 'thinking' ? [1, 1.5, 1] : 1
              }}
              transition={{
                scale: { repeat: emotion === 'thinking' ? Number.POSITIVE_INFINITY : 0, duration: 1 }
              }}
            />

            {/* Arms */}
            <motion.rect
              x="10"
              y="35"
              width="15"
              height="6"
              rx="3"
              fill="#4b5563"
              animate={{
                rotate: emotion === 'celebrating' ? [0, 20, -20, 0] : 0
              }}
              transition={{
                repeat: emotion === 'celebrating' ? Number.POSITIVE_INFINITY : 0,
                duration: 0.6
              }}
              style={{ transformOrigin: '17px 38px' }}
            />
            <motion.rect
              x="55"
              y="35"
              width="15"
              height="6"
              rx="3"
              fill="#4b5563"
              animate={{
                rotate: emotion === 'celebrating' ? [0, -20, 20, 0] : 0
              }}
              transition={{
                repeat: emotion === 'celebrating' ? Number.POSITIVE_INFINITY : 0,
                duration: 0.6
              }}
              style={{ transformOrigin: '62px 38px' }}
            />

            {/* Body Details */}
            <rect x="30" y="40" width="20" height="2" rx="1" fill="#1f2937"/>
            <rect x="30" y="45" width="20" height="2" rx="1" fill="#1f2937"/>
            <circle cx="35" cy="55" r="3" fill="#1f2937"/>
            <circle cx="45" cy="55" r="3" fill="#1f2937"/>
          </svg>
        </motion.div>

        {/* Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0 }}
          animate={{
            opacity: emotion !== 'happy' ? 1 : 0,
            y: emotion !== 'happy' ? 0 : 10,
            scale: emotion !== 'happy' ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute -top-12 -left-8 bg-white rounded-lg px-3 py-2 shadow-lg border-2 border-gray-200"
        >
          <div className="text-lg font-medium text-gray-700">
            {getEmoji()}
            {emotion === 'celebrating' && ' Awesome!'}
            {emotion === 'curious' && ' Interesting!'}
            {emotion === 'thinking' && ' Searching...'}
            {emotion === 'excited' && ' So cool!'}
          </div>
          {/* Speech bubble tail */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200" />
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-2px] w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-white" />
        </motion.div>

        {/* Particle Effects for Celebrating */}
        {emotion === 'celebrating' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`celebration-particle-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#fbbf24', '#ec4899', '#06b6d4', '#10b981', '#8b5cf6', '#ef4444'][i],
                  left: `${20 + i * 10}%`,
                  top: `${20 + (i % 2) * 20}%`,
                }}
                animate={{
                  y: [-20, -40, -20],
                  x: [0, (i % 2 === 0 ? 10 : -10), 0],
                  opacity: [1, 0.5, 1],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default SimpleRobot;
