"use client";

import { Heart } from "lucide-react";
import { CONFIG } from "@/config";

export default function Footer() {
  return (
    <footer className="relative max-w-4xl mx-auto px-6 py-12 text-center z-10 border-t border-white/5 mt-16">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-500/40" />
          <span>especially for {CONFIG.name}</span>
        </div>
        <p className="text-[11px] text-slate-400/80 font-mono uppercase tracking-widest">
          Happy Birthday • Always in your corner
        </p>
      </div>
    </footer>
  );
}
