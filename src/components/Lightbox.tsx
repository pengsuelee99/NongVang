"use client";
import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface Photo { src: string; alt: string; }
interface Props {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ photos, currentIndex, onClose, onPrev, onNext }: Props) {
  const photo = photos[currentIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose, onPrev, onNext]);

  let touchX = 0;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(4,4,12,0.93)] p-5 backdrop-blur-2xl"
      onClick={onClose}
      onTouchStart={e => { touchX = e.touches[0].clientX; }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 50) dx < 0 ? onNext() : onPrev(); }}
      role="dialog" aria-modal aria-label="Photo viewer"
    >
      <motion.img
        key={currentIndex}
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        src={photo.src} alt={photo.alt}
        onClick={e => e.stopPropagation()}
        className="max-h-[88svh] max-w-[92vw] rounded-2xl object-contain shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      />

      {/* Close */}
      <button onClick={onClose}
        className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white/80 text-xl transition-all hover:rotate-90 hover:border-white/30 hover:text-white focus-visible:outline-none">
        ✕
      </button>

      {/* Prev */}
      <button onClick={e => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.07] text-white text-2xl transition hover:bg-white/[0.18] focus-visible:outline-none">
        ‹
      </button>

      {/* Next */}
      <button onClick={e => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.07] text-white text-2xl transition hover:bg-white/[0.18] focus-visible:outline-none">
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {photos.map((_, i) => (
          <div key={i} className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: i === currentIndex ? "20px" : "6px", background: i === currentIndex ? "#e8a0bf" : "rgba(255,255,255,0.25)" }} />
        ))}
      </div>
    </motion.div>
  );
}
