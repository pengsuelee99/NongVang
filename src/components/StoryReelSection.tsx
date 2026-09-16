"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "@/config";
import { Sparkles, ExternalLink, ChevronLeft, ChevronRight, Play, Pause, Heart, Volume2, VolumeX } from "lucide-react";

export default function StoryReelSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const reels = CONFIG.storyReels;
  const currentReel = reels[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-advance stories unless paused
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reels.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, reels.length]);

  // Handle video element play / mute when changing slide
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const toggleVideoMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  return (
    <section className="relative max-w-md mx-auto px-4 py-16 z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs tracking-wider uppercase bg-pink-500/10 text-pink-300 border border-pink-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          1 Year Video Reel & Highlights
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-slate-100 tracking-wide">
          ວິດີໂອຄວາມຊົງຈຳ 1 ປີຂອງກະນ້ອງ 🎬
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          ມານ້ອງເປີດໄປນຳກັນ ພ້ອມຄຳອວຍພອນອັນອົບອຸ່ນ
        </p>
      </motion.div>

      {/* Main Story Card (9:16 Portrait Aspect Ratio) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl bg-slate-900/80 border border-pink-500/20 backdrop-blur-xl shadow-2xl shadow-purple-950/40 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Progress Bars (like IG / TikTok Stories) */}
        <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5 px-2">
          {reels.map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer"
              onClick={() => setCurrentIndex(idx)}
            >
              <div
                className={`h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300 ${
                  idx === currentIndex
                    ? isPaused
                      ? "w-full opacity-80"
                      : "animate-progress"
                    : idx < currentIndex
                    ? "w-full"
                    : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Media Frame Container (9:16 height ratio) */}
        <div className="relative aspect-[9/14] w-full overflow-hidden bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReel.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center bg-black"
            >
              {currentReel.video ? (
                <video
                  ref={videoRef}
                  src={currentReel.video}
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentReel.image}
                  alt={currentReel.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Tap Overlay Targets */}
          <div
            className="absolute left-0 top-12 bottom-36 w-1/3 z-20 cursor-pointer"
            onClick={handlePrev}
            title="Previous Story"
          />
          <div
            className="absolute right-0 top-12 bottom-36 w-1/3 z-20 cursor-pointer"
            onClick={handleNext}
            title="Next Story"
          />

          {/* Controls top right: Pause/Play & Video Sound Toggle */}
          <div className="absolute top-6 right-4 z-30 flex items-center gap-2">
            {currentReel.video && (
              <button
                onClick={toggleVideoMute}
                className="p-2 rounded-full bg-slate-950/60 border border-white/20 text-pink-300 backdrop-blur-md hover:text-white transition-colors"
                title={isVideoMuted ? "ເປີດສຽງວິດີໂອ" : "ປິດສຽງວິດີໂອ"}
              >
                {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />}
              </button>
            )}

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-full bg-slate-950/60 border border-white/20 text-white/80 backdrop-blur-md hover:text-white transition-colors"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Reel Tag Badge */}
          <div className="absolute top-6 left-5 z-20 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-pink-500/20 text-pink-200 border border-pink-400/30 backdrop-blur-md shadow-md">
              {currentReel.tag}
            </span>
          </div>

          {/* Bottom Card Content & Sisterhood Message */}
          <div className="absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col gap-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-12">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif text-slate-100 font-medium">
                {currentReel.title}
              </h3>
              <span className="text-[10px] text-pink-300/70 font-mono">
                {currentReel.date}
              </span>
            </div>

            {/* Encapsulated encouragement message */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-pink-500/20 backdrop-blur-md">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light italic">
                "{currentReel.caption}"
              </p>
            </div>

            {/* TikTok Profile / Post Button */}
            <div className="flex items-center justify-between pt-1">
              <a
                href={currentReel.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-pink-200 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 transition-all duration-300 group"
              >
                <span>ເປີດເບິ່ງໂພສເທິງ TikTok 🎵</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <div className="flex items-center gap-1 text-xs text-pink-400">
                <Heart className="w-3.5 h-3.5 fill-pink-400" />
                <span className="text-[11px] font-mono text-slate-400">{currentIndex + 1} / {reels.length}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Slide Navigation Buttons */}
      <div className="flex items-center justify-between mt-4 px-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-pink-300 transition-colors p-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ເລື່ອງກ່ອນໜ້າ</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          {currentIndex + 1} of {reels.length}
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-pink-300 transition-colors p-2"
        >
          <span>ເລື່ອງຖັດໄປ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
