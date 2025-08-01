"use client";

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder, Torus } from '@react-three/drei';
import { motion } from 'framer-motion';
import type * as THREE from 'three';

interface RobotProps {
  emotion: 'happy' | 'excited' | 'curious' | 'thinking' | 'celebrating';
  mousePosition: { x: number; y: number };
}

function Robot({ emotion, mousePosition }: RobotProps) {
  const robotRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const { size, camera } = useThree();

  // Convert mouse position to 3D world coordinates
  const mouseX = (mousePosition.x / size.width) * 2 - 1;
  const mouseY = -(mousePosition.y / size.height) * 2 + 1;

  useFrame((state) => {
    if (!robotRef.current) return;

    // Robot follows mouse with smooth movement
    const targetX = mouseX * 2;
    const targetY = mouseY * 1;

    robotRef.current.position.x += (targetX - robotRef.current.position.x) * 0.05;
    robotRef.current.position.y += (targetY - robotRef.current.position.y) * 0.05;

    // Gentle floating animation
    robotRef.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

    // Eye tracking (always look at cursor)
    if (eyeLeftRef.current && eyeRightRef.current) {
      const eyeTargetX = mouseX * 0.3;
      const eyeTargetY = mouseY * 0.3;

      eyeLeftRef.current.position.x = eyeTargetX;
      eyeLeftRef.current.position.y = eyeTargetY;
      eyeRightRef.current.position.x = eyeTargetX;
      eyeRightRef.current.position.y = eyeTargetY;
    }

    // Emotion-based animations
    if (mouthRef.current) {
      switch (emotion) {
        case 'happy':
          mouthRef.current.scale.x = 1.2;
          mouthRef.current.rotation.z = 0;
          break;
        case 'excited':
          mouthRef.current.scale.x = 1.5;
          mouthRef.current.scale.y = 1.2;
          break;
        case 'celebrating':
          robotRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.2;
          break;
        case 'thinking':
          robotRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 3) * 0.1;
          break;
      }
    }
  });

  // Eye colors based on emotion
  const getEyeColor = () => {
    switch (emotion) {
      case 'happy': return '#4ade80';
      case 'excited': return '#f59e0b';
      case 'celebrating': return '#ec4899';
      case 'thinking': return '#3b82f6';
      default: return '#06b6d4';
    }
  };

  return (
    <group ref={robotRef} position={[0, 0, 0]}>
      {/* Robot Body */}
      <Box position={[0, -0.5, 0]} scale={[0.8, 1, 0.6]}>
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.3}
          roughness={0.2}
          emissive="#1e40af"
          emissiveIntensity={0.1}
        />
      </Box>

      {/* Robot Head */}
      <Sphere position={[0, 0.3, 0]} scale={[0.6, 0.6, 0.6]}>
        <meshStandardMaterial
          color="#374151"
          metalness={0.4}
          roughness={0.1}
          emissive="#3b82f6"
          emissiveIntensity={0.05}
        />
      </Sphere>

      {/* Eyes */}
      <Sphere ref={eyeLeftRef} position={[-0.15, 0.4, 0.3]} scale={[0.08, 0.08, 0.05]}>
        <meshStandardMaterial color={getEyeColor()} emissive={getEyeColor()} emissiveIntensity={0.3} />
      </Sphere>
      <Sphere ref={eyeRightRef} position={[0.15, 0.4, 0.3]} scale={[0.08, 0.08, 0.05]}>
        <meshStandardMaterial color={getEyeColor()} emissive={getEyeColor()} emissiveIntensity={0.3} />
      </Sphere>

      {/* Mouth */}
      <Torus
        ref={mouthRef}
        position={[0, 0.2, 0.3]}
        args={[0.08, 0.02, 8, 16, Math.PI]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Torus>

      {/* Antenna */}
      <Cylinder position={[0, 0.7, 0]} scale={[0.02, 0.2, 0.02]}>
        <meshStandardMaterial color="#6b7280" />
      </Cylinder>
      <Sphere position={[0, 0.85, 0]} scale={[0.05, 0.05, 0.05]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </Sphere>

      {/* Arms */}
      <Cylinder position={[-0.6, -0.1, 0]} rotation={[0, 0, Math.PI / 6]} scale={[0.08, 0.4, 0.08]}>
        <meshStandardMaterial color="#d1d5db" />
      </Cylinder>
      <Cylinder position={[0.6, -0.1, 0]} rotation={[0, 0, -Math.PI / 6]} scale={[0.08, 0.4, 0.08]}>
        <meshStandardMaterial color="#d1d5db" />
      </Cylinder>

      {/* Hands */}
      <Sphere position={[-0.8, -0.4, 0]} scale={[0.1, 0.1, 0.1]}>
        <meshStandardMaterial color="#9ca3af" />
      </Sphere>
      <Sphere position={[0.8, -0.4, 0]} scale={[0.1, 0.1, 0.1]}>
        <meshStandardMaterial color="#9ca3af" />
      </Sphere>

      {/* Celebrating particles */}
      {emotion === 'celebrating' && (
        <>
          <Sphere position={[0.5, 1, 0.5]} scale={[0.02, 0.02, 0.02]}>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
          </Sphere>
          <Sphere position={[-0.5, 1.2, 0.3]} scale={[0.02, 0.02, 0.02]}>
            <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
          </Sphere>
          <Sphere position={[0.3, 1.1, -0.3]} scale={[0.02, 0.02, 0.02]}>
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
          </Sphere>
        </>
      )}
    </group>
  );
}

interface RobotCompanionProps {
  emotion?: 'happy' | 'excited' | 'curious' | 'thinking' | 'celebrating';
  onCartAdd?: () => void;
  onProductClick?: () => void;
}

export function RobotCompanion({ emotion: externalEmotion, onCartAdd, onProductClick }: RobotCompanionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [internalEmotion, setInternalEmotion] = useState<'happy' | 'excited' | 'curious' | 'thinking' | 'celebrating'>('happy');
  const [isVisible, setIsVisible] = useState(true);

  // Use external emotion if provided, otherwise use internal emotion
  const currentEmotion = externalEmotion || internalEmotion;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Change emotion based on cursor speed (only if no external emotion is provided)
      if (!externalEmotion) {
        const speed = Math.sqrt(e.movementX ** 2 + e.movementY ** 2);
        if (speed > 10) {
          setInternalEmotion('excited');
        } else if (speed > 5) {
          setInternalEmotion('curious');
        } else {
          setInternalEmotion('happy');
        }
      }
    };

    const handleClick = () => {
      if (!externalEmotion) {
        setInternalEmotion('celebrating');
        setTimeout(() => setInternalEmotion('happy'), 2000);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('click', handleClick);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('click', handleClick);
      };
    }
  }, [externalEmotion]);

  // Hide on mobile devices
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsVisible(!isMobile);
    }
  }, []);

  // Trigger emotions from parent components
  useEffect(() => {
    if (onCartAdd && !externalEmotion) {
      setInternalEmotion('celebrating');
      setTimeout(() => setInternalEmotion('happy'), 3000);
    }
  }, [onCartAdd, externalEmotion]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed bottom-4 right-4 w-32 h-32 z-50 pointer-events-none"
      style={{ perspective: '1000px' }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />

        <Robot emotion={currentEmotion} mousePosition={mousePosition} />
      </Canvas>

      {/* Robot speech bubble */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: currentEmotion !== 'happy' ? 1 : 0,
          y: currentEmotion !== 'happy' ? 0 : 10
        }}
        className="absolute -top-8 -left-8 bg-white rounded-lg px-3 py-1 shadow-lg border"
      >
        <span className="text-xs font-medium text-neutral-700">
          {currentEmotion === 'celebrating' && '🎉 Awesome!'}
          {currentEmotion === 'curious' && '🤔 Interesting!'}
          {currentEmotion === 'thinking' && '💭 Searching...'}
          {currentEmotion === 'excited' && '⚡ So cool!'}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default RobotCompanion;
