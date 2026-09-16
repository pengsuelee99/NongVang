"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { playSparkleSFX } from "@/utils/sfx";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
}

export default function ShinyButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  icon,
}: Props) {
  const handleClick = () => {
    playSparkleSFX();
    if (onClick) onClick();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-slate-950 font-semibold shadow-lg shadow-pink-500/25 border border-white/40";
      case "secondary":
        return "bg-slate-900/80 text-pink-200 border border-pink-500/30 hover:border-pink-400/60 shadow-md shadow-purple-950/40 backdrop-blur-md";
      case "outline":
        return "bg-transparent text-slate-200 border border-white/20 hover:border-pink-300/50 backdrop-blur-sm";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.93, y: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      onClick={handleClick}
      className={`relative group inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300 overflow-hidden cursor-pointer select-none ${getVariantStyles()} ${className}`}
    >
      {/* Specular Shine Light Sweep */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon || <Sparkles className="w-4 h-4 text-pink-300 group-hover:rotate-12 transition-transform" />}
        {children}
      </span>
    </motion.button>
  );
}
