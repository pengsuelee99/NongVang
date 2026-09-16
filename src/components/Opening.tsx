"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "@/config";
import { Gift, Sparkles, Heart } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { playCelebrationSFX, playSparkleSFX } from "@/utils/sfx";
import Card3DTilt from "@/components/Card3DTilt";
import TextReveal from "@/components/TextReveal";
import ShinyButton from "@/components/ShinyButton";

export default function Opening({ onOpen }: { onOpen: () => void }) {
  const [step, setStep] = useState<"intro" | "gift">("intro");
  const [isOpening, setIsOpening] = useState(false);

  const handleGiftClick = () => {
    setIsOpening(true);

    // Play SFX
    playCelebrationSFX();

    // Blast 3D celebratory confetti
    triggerConfetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.6 },
      colors: ["#e8a0bf", "#9b72cf", "#c9b8e8", "#ffffff", "#ffd1dc"],
    });

    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  const handleIntroClick = () => {
    playSparkleSFX();
    setStep("gift");
  };

  return (
    <motion.section
      key="opening"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-6 text-center overflow-hidden select-none"
      exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)", transition: { duration: 1 } }}
    >
      {/* Soft background 3D ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <AnimatePresence mode="wait">
        {step === "intro" ? (
          <motion.div
            key="step-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.6 } }}
            className="space-y-8 max-w-sm"
          >
            {/* Smooth Typewriter Text Reveal */}
            <TextReveal
              as="h2"
              text={`Happy Birthday, ${CONFIG.name}...`}
              delay={0.3}
              speed={0.08}
              className="font-serif text-3xl sm:text-4xl text-pink-200/95 tracking-wide drop-shadow-md"
            />

            <TextReveal
              as="p"
              text="ມີຂອງຂວັນ ສຸດພິເສດມາໃຫ້ເຈົ້າ."
              delay={1.2}
              speed={0.05}
              className="text-slate-300 text-base font-light leading-relaxed"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
            >
              <ShinyButton onClick={handleIntroClick} variant="primary">
                ລອງເປີດກ່ອງນີ້ເບິ່ງ ✨
              </ShinyButton>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="step-gift"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-xs flex flex-col items-center"
          >
            <p className="text-xs uppercase tracking-widest text-pink-300/80 font-mono">
              ກົດເຂົ້າໄປເບິ່ງ 🎁
            </p>

            {/* 3D Tilt Card Wrapper */}
            <Card3DTilt>
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                animate={isOpening ? { scale: [1, 1.4, 0], rotate: [0, -15, 25, 0], opacity: [1, 1, 0] } : { y: [0, -10, 0] }}
                transition={isOpening ? { duration: 1 } : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
                onClick={handleGiftClick}
                className="relative cursor-pointer group p-9 rounded-3xl bg-slate-900/60 border border-pink-500/40 backdrop-blur-2xl shadow-2xl shadow-pink-500/30 flex flex-col items-center justify-center transform-gpu"
              >
                {/* 3D Outer Halo */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-2xl group-hover:opacity-100 opacity-70 transition-opacity" />

                <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-br from-pink-500/30 via-purple-600/40 to-indigo-600/30 border border-pink-300/50 text-pink-200 shadow-xl">
                  <Gift className="w-16 h-16 text-pink-200 drop-shadow-[0_0_25px_rgba(232,160,191,0.8)]" />
                </div>

                <div className="relative z-10 mt-5 flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
                  <span>ລອງເປີດກ່ອງນີ້ເບິ່ງ</span>
                </div>
              </motion.div>
            </Card3DTilt>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
