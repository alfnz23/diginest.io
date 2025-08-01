"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export function BlueprintBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Create initial particles
    const newParticles: Particle[] = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
    setParticles(newParticles);

    // Animate particles
    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + width) % width,
          y: (particle.y + particle.speedY + height) % height,
        })),
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] opacity-40">
      {/* Blueprint base */}
      <div className="absolute inset-0 bg-slate-50" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 100px 100px, 100px 100px",
        }}
      />

      {/* Technical drawings */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="smallGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(59, 130, 246, 0.1)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Background grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Technical drawings */}

        {/* Circuit board style - top left */}
        <g transform="translate(50, 50)" opacity="0.15">
          <rect
            x="0"
            y="0"
            width="200"
            height="150"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />
          <circle
            cx="20"
            cy="20"
            r="8"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1.5"
          />
          <circle
            cx="60"
            cy="20"
            r="8"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1.5"
          />
          <circle
            cx="100"
            cy="20"
            r="8"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1.5"
          />
          <circle
            cx="140"
            cy="20"
            r="8"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1.5"
          />
          <circle
            cx="180"
            cy="20"
            r="8"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1.5"
          />

          <path
            d="M20,20 L60,20 L60,60 L100,60 L100,20 L140,20 L140,80 L180,80"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />

          <rect
            x="40"
            y="40"
            width="40"
            height="20"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
          />
          <rect
            x="120"
            y="60"
            width="40"
            height="20"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
          />
        </g>

        {/* Gear system - top right */}
        <g transform="translate(calc(100vw - 300), 80)" opacity="0.12">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
          />
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="2"
          />

          <circle
            cx="120"
            cy="50"
            r="30"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="2"
          />
          <circle
            cx="120"
            cy="50"
            r="18"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
          />
          <circle
            cx="120"
            cy="50"
            r="6"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="2"
          />

          {/* Gear teeth */}
          <path
            d="M50,10 L55,15 L45,15 Z M90,50 L85,55 L85,45 Z M50,90 L45,85 L55,85 Z M10,50 L15,45 L15,55 Z"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
          />
        </g>

        {/* Mechanical blueprint - center */}
        <g
          transform="translate(calc(50vw - 150), calc(50vh - 100))"
          opacity="0.1"
        >
          <rect
            x="0"
            y="0"
            width="300"
            height="200"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
            strokeDasharray="10,5"
          />

          {/* Machine frame */}
          <rect
            x="20"
            y="20"
            width="260"
            height="160"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1.5"
          />
          <rect
            x="40"
            y="40"
            width="220"
            height="120"
            fill="none"
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="1"
          />

          {/* Internal components */}
          <circle
            cx="100"
            cy="100"
            r="30"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />
          <circle
            cx="200"
            cy="100"
            r="25"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />

          {/* Connecting lines */}
          <path
            d="M130,100 L175,100"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />
          <path
            d="M100,70 L100,40"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1.5"
          />
          <path
            d="M200,75 L200,40"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1.5"
          />

          {/* Dimension lines */}
          <g opacity="0.6">
            <path
              d="M20,200 L280,200"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="1"
            />
            <path
              d="M20,195 L20,205 M280,195 L280,205"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="1"
            />
            <text
              x="150"
              y="215"
              textAnchor="middle"
              fontSize="12"
              fill="rgba(59, 130, 246, 0.6)"
            >
              260
            </text>
          </g>
        </g>

        {/* Technical annotations - bottom left */}
        <g transform="translate(50, calc(100vh - 200))" opacity="0.08">
          <rect
            x="0"
            y="0"
            width="250"
            height="150"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <text x="10" y="20" fontSize="14" fill="rgba(59, 130, 246, 0.5)">
            TECHNICAL SPECIFICATIONS
          </text>
          <text x="10" y="40" fontSize="10" fill="rgba(59, 130, 246, 0.4)">
            • Digital Product System v2.1
          </text>
          <text x="10" y="55" fontSize="10" fill="rgba(59, 130, 246, 0.4)">
            • Multi-layer Architecture
          </text>
          <text x="10" y="70" fontSize="10" fill="rgba(59, 130, 246, 0.4)">
            • Optimized Performance
          </text>
          <text x="10" y="85" fontSize="10" fill="rgba(59, 130, 246, 0.4)">
            • Secure Payment Gateway
          </text>

          <circle
            cx="220"
            cy="75"
            r="20"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
          />
          <text
            x="220"
            y="80"
            textAnchor="middle"
            fontSize="8"
            fill="rgba(59, 130, 246, 0.4)"
          >
            DigiNest
          </text>
        </g>

        {/* Flow diagram - bottom right */}
        <g
          transform="translate(calc(100vw - 300), calc(100vh - 180))"
          opacity="0.1"
        >
          <rect
            x="10"
            y="10"
            width="60"
            height="30"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1"
          />
          <text
            x="40"
            y="28"
            textAnchor="middle"
            fontSize="8"
            fill="rgba(59, 130, 246, 0.5)"
          >
            Browse
          </text>

          <path
            d="M70,25 L90,25"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
          />

          <rect
            x="90"
            y="10"
            width="60"
            height="30"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1"
          />
          <text
            x="120"
            y="28"
            textAnchor="middle"
            fontSize="8"
            fill="rgba(59, 130, 246, 0.5)"
          >
            Select
          </text>

          <path
            d="M150,25 L170,25"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
          />

          <rect
            x="170"
            y="10"
            width="60"
            height="30"
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1"
          />
          <text
            x="200"
            y="28"
            textAnchor="middle"
            fontSize="8"
            fill="rgba(59, 130, 246, 0.5)"
          >
            Purchase
          </text>

          <path
            d="M200,40 L200,60 L120,60 L120,50"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
          />
        </g>

        {/* Arrow marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(59, 130, 246, 0.4)" />
          </marker>
        </defs>
      </svg>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-blue-400"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 4px rgba(59, 130, 246, 0.5)",
            }}
          />
        ))}
      </div>

      {/* Additional floating elements */}
      <div className="absolute inset-0">
        <div className="animate-float-slow absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-30" />
        <div className="animate-float-medium absolute top-40 right-1/4 w-3 h-3 bg-blue-500 rounded-full opacity-25" />
        <div className="animate-float-fast absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-35" />
        <div className="animate-float-slow absolute bottom-20 right-1/3 w-2.5 h-2.5 bg-blue-400 rounded-full opacity-20" />
        <div className="animate-float-medium absolute top-1/2 left-20 w-2 h-2 bg-blue-500 rounded-full opacity-30" />
        <div className="animate-float-fast absolute top-1/3 right-20 w-1 h-1 bg-blue-300 rounded-full opacity-40" />
      </div>
    </div>
  );
}

export default BlueprintBackground;
