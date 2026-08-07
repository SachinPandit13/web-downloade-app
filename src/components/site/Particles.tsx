"use client";

import { useEffect, useState } from "react";

interface Dot {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  hue: string;
}

export default function Particles({ count = 28 }: { count?: number }) {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    setDots(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
        hue: Math.random() > 0.5 ? "var(--primary)" : "var(--accent)",
      })),
    );
  }, [count]);

  if (dots.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full animate-float-slow"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: d.hue,
            opacity: 0.4,
            boxShadow: `0 0 ${d.size * 6}px ${d.hue}`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

