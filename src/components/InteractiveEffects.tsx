"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

interface ParticleFieldProps {
  count: number;
  mousePosition: { x: number; y: number };
}

function ParticleField({ count, mousePosition }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>(new Float32Array(count * 3));
  const velocities = useRef<Float32Array>(new Float32Array(count * 3));

  useEffect(() => {
    // Initialize particle positions
    for (let i = 0; i < count * 3; i += 3) {
      positions.current[i] = (Math.random() - 0.5) * 10;
      positions.current[i + 1] = (Math.random() - 0.5) * 10;
      positions.current[i + 2] = (Math.random() - 0.5) * 10;

      velocities.current[i] = (Math.random() - 0.5) * 0.01;
      velocities.current[i + 1] = (Math.random() - 0.5) * 0.01;
      velocities.current[i + 2] = (Math.random() - 0.5) * 0.01;
    }
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const mouseX =
      typeof window !== "undefined"
        ? (mousePosition.x / window.innerWidth) * 2 - 1
        : 0;
    const mouseY =
      typeof window !== "undefined"
        ? -(mousePosition.y / window.innerHeight) * 2 + 1
        : 0;

    // Update particle positions
    for (let i = 0; i < count * 3; i += 3) {
      // Mouse attraction effect
      const dx = mouseX * 5 - positions.current[i];
      const dy = mouseY * 5 - positions.current[i + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 2) {
        velocities.current[i] += dx * 0.0001;
        velocities.current[i + 1] += dy * 0.0001;
      }

      // Apply velocity
      positions.current[i] += velocities.current[i];
      positions.current[i + 1] += velocities.current[i + 1];
      positions.current[i + 2] += velocities.current[i + 2];

      // Boundary wrapping
      if (positions.current[i] > 5) positions.current[i] = -5;
      if (positions.current[i] < -5) positions.current[i] = 5;
      if (positions.current[i + 1] > 5) positions.current[i + 1] = -5;
      if (positions.current[i + 1] < -5) positions.current[i + 1] = 5;
    }

    pointsRef.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions.current, 3),
    );
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions.current}>
      <PointMaterial
        size={0.02}
        color="#06b6d4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </Points>
  );
}

interface CursorTrailProps {
  mousePosition: { x: number; y: number };
}

export function CursorTrail({ mousePosition }: CursorTrailProps) {
  const [trail, setTrail] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  useEffect(() => {
    const trailPoint = {
      x: mousePosition.x,
      y: mousePosition.y,
      id: Date.now(),
    };

    setTrail((prev) => {
      const newTrail = [trailPoint, ...prev.slice(0, 19)]; // Keep only last 20 points
      return newTrail;
    });
  }, [mousePosition.x, mousePosition.y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
          style={{
            left: point.x - 4,
            top: point.y - 4,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

interface FloatingElementsProps {
  mousePosition: { x: number; y: number };
}

export function FloatingElements({ mousePosition }: FloatingElementsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <ParticleField count={100} mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}

interface HoverEffectProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverEffect({ children, className = "" }: HoverEffectProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={className}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: 2,
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-lg blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ zIndex: -1 }}
      />
    </motion.div>
  );
}

export default FloatingElements;
