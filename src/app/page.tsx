"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

// Dynamically import Three.js WebGL Canvas with ssr: false for Next.js prerendering safety
const ThreeCanvas = dynamic(() => import("@/components/ThreeCanvas"), {
  ssr: false,
});

import Particles from "@/components/Particles";
import CursorTrail from "@/components/CursorTrail";
import Opening from "@/components/Opening";
import BirthdayReveal from "@/components/BirthdayReveal";
import TimeTickerSection from "@/components/TimeTickerSection";
import StoryReelSection from "@/components/StoryReelSection";
import CinematicStoryStream from "@/components/CinematicStoryStream";
import InteractivePhotoUnlock from "@/components/InteractivePhotoUnlock";
import MemoriesSection from "@/components/MemoriesSection";
import LetterSection from "@/components/LetterSection";
import InteractiveWish from "@/components/InteractiveWish";
import SouvenirCard from "@/components/SouvenirCard";
import Lightbox from "@/components/Lightbox";
import MusicPlayer from "@/components/MusicPlayer";
import Footer from "@/components/Footer";
import { CONFIG } from "@/config";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const handleOpenSurprise = () => {
    setIsOpen(true);
    // Start music on user interaction
    setIsPlayingMusic(true);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200 font-sans">
      {/* 3D WebGL Background Scene (Three.js client-side) */}
      <ThreeCanvas />

      {/* Dynamic Background Particles */}
      <Particles />

      {/* Floating Cursor/Touch Particle Trail */}
      <CursorTrail />

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <Opening key="opening" onOpen={handleOpenSurprise} />
        ) : (
          <motion.div
            key="main-experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 space-y-4 sm:space-y-6 pb-16 max-w-4xl mx-auto px-4"
          >
            {/* Hero Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="py-2"
            >
              <BirthdayReveal />
            </motion.div>

            {/* Live Memory Time Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="py-2"
            >
              <TimeTickerSection />
            </motion.div>

            {/* 1-Year TikTok Story Reels (วิดีโอ 61 คลิป) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className="py-2"
            >
              <StoryReelSection />
            </motion.div>

            {/* Quote Cards: ຂໍ້ຄິດເເລະກຳລັງໃຈດີໆ (วางต่อจากวิดีโอทันที ชิดแนบสนิท!) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className="py-2"
            >
              <MemoriesSection onSelectPhoto={(idx) => setActivePhotoIndex(idx)} />
            </motion.div>

            {/* Interactive Photo Unlock Box & Gallery (รูปภาพ 216 รูป) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className="py-2"
            >
              <InteractivePhotoUnlock onSelectPhoto={(idx) => setActivePhotoIndex(idx)} />
            </motion.div>

            {/* Sibling Letter (จดหมายจากอ้าย) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className="py-2"
            >
              <LetterSection />
            </motion.div>

            {/* Birthday Wish Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className="py-2"
            >
              <InteractiveWish />
            </motion.div>

            {/* Digital Souvenir Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className="py-2"
            >
              <SouvenirCard />
            </motion.div>

            {/* Footer */}
            <motion.div className="py-2">
              <Footer />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Audio Player */}
      {isOpen && (
        <MusicPlayer
          musicSrc={CONFIG.musicSrc}
          isPlaying={isPlayingMusic}
          setIsPlaying={setIsPlayingMusic}
        />
      )}

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && CONFIG.photos && (
        <Lightbox
          photos={CONFIG.photos}
          currentIndex={activePhotoIndex}
          onClose={() => setActivePhotoIndex(null)}
          onPrev={() =>
            setActivePhotoIndex(
              (activePhotoIndex - 1 + CONFIG.photos.length) % CONFIG.photos.length
            )
          }
          onNext={() =>
            setActivePhotoIndex((activePhotoIndex + 1) % CONFIG.photos.length)
          }
        />
      )}
    </main>
  );
}
