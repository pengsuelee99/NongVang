"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  icon: string;
  size: number;
  rotation: number;
}

export default function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const icons = ["💖", "✨", "🌸", "⭐", "💕", "✨"];

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (Math.random() > 0.35) return; // Limit particle density

      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x,
        y,
        icon: icons[Math.floor(Math.random() * icons.length)],
        size: Math.floor(Math.random() * 12) + 12,
        rotation: Math.floor(Math.random() * 60) - 30,
      };

      setParticles((prev) => [...prev.slice(-18), newParticle]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, scale: 0.6, x: p.x - 10, y: p.y - 10, rotate: p.rotation }}
            animate={{
              opacity: 0,
              scale: 1.3,
              y: p.y - 65,
              x: p.x + (Math.random() * 30 - 15),
              rotate: p.rotation + 45,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              fontSize: `${p.size}px`,
            }}
          >
            {p.icon}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
