"use client";
import { useEffect, useRef } from "react";

const COLOURS = [
  "rgba(232,160,191,A)",
  "rgba(201,184,232,A)",
  "rgba(155,114,207,A)",
  "rgba(255,255,255,A)",
];

interface Particle {
  x: number; y: number; r: number;
  vx: number; vy: number;
  alpha: number; alphaDir: number;
  colour: string;
}

export default function Particles({ count = 55 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, particles: Particle[] = [], raf: number;

    function resize() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }

    function make(fresh: boolean): Particle {
      return {
        x: Math.random() * W,
        y: fresh ? Math.random() * H : H + 10,
        r: Math.random() * 2 + 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.35 + 0.1),
        alpha: Math.random() * 0.55 + 0.15,
        alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.003,
        colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      };
    }

    function build() { particles = Array.from({ length: count }, () => make(true)); }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        p.alpha += p.alphaDir;
        if (p.alpha <= 0.05 || p.alpha >= 0.8) p.alphaDir *= -1;
        if (p.y < -10) particles[i] = make(false);
        const col = p.colour.replace("A", p.alpha.toFixed(2));
        ctx.shadowBlur = 8; ctx.shadowColor = col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col; ctx.fill(); ctx.shadowBlur = 0;
      });
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", () => { resize(); build(); });
    resize(); build(); draw();
    return () => { cancelAnimationFrame(raf); };
  }, [count]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
