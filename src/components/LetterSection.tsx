"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "@/config";
import { Heart, Sparkles, Mail, Lock } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { playCelebrationSFX, playSparkleSFX } from "@/utils/sfx";
import TextReveal from "@/components/TextReveal";
import ShinyButton from "@/components/ShinyButton";

export default function LetterSection() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      playSparkleSFX();
      setTimeout(playCelebrationSFX, 300);
      triggerConfetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#e8a0bf", "#9b72cf", "#c9b8e8", "#ffffff"],
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <section className="relative max-w-2xl mx-auto px-6 py-16 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 border border-pink-500/30 backdrop-blur-2xl shadow-2xl shadow-purple-950/50 overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Envelope Tag */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 text-pink-300 shadow-md">
              <Mail className="w-6 h-6 text-pink-300" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif text-slate-100 flex items-center gap-2">
                <span>ຄຳອວຍພອນຈາກໃຜນະ ຮິຮິຮິ 💌</span>
              </h3>
              <p className="text-xs text-pink-300/80 font-light">ຈາກຄົນທີ່ຄິດຮອດແລະເປັນຫ່ວງສະເໝີ 💖</p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-purple-300/60 animate-pulse" />
        </div>

        {/* Vintage Sealed Envelope View before click */}
        {!isOpen ? (
          <motion.div
            onClick={handleOpenEnvelope}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer my-6 p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-purple-950/40 to-slate-900/90 border border-pink-400/30 shadow-xl flex flex-col items-center text-center space-y-4 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Wax Seal Icon */}
            <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-rose-600 to-pink-500 flex items-center justify-center border-2 border-amber-300/60 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-amber-100 fill-amber-100/40" />
            </div>

            <div className="relative z-10 space-y-1">
              <h4 className="font-serif text-lg text-pink-200 font-medium">
                ຄຳອວຍພອນຈາກໃຜນະ ຮິຮິຮິ ✉️
              </h4>
              <p className="text-xs text-slate-400 font-light">
                (ກົດຢູ່ບ່ອນນີ້ ເພື່ອເປີດອ່ານຈົດໝາຍ 💖)
              </p>
            </div>
          </motion.div>
        ) : (
          /* Opened Parchment Letter View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 pt-2"
          >
            {/* Letter Preview Content in Lao */}
            <TextReveal
              as="div"
              text={CONFIG.letterPreview}
              delay={0.1}
              speed={0.03}
              className="space-y-4 text-slate-200 text-base sm:text-lg leading-relaxed font-light whitespace-pre-line"
            />

            {/* Hidden Letter Section */}
            <div className="pt-6 border-t border-pink-500/20">
              <TextReveal
                as="div"
                text={CONFIG.letterHidden}
                delay={0.3}
                speed={0.03}
                className="text-pink-100 text-base sm:text-lg leading-relaxed whitespace-pre-line font-serif italic"
              />
            </div>
          </motion.div>
        )}

        {/* Read/Close Button */}
        <div className="mt-8 pt-4 flex justify-center">
          <ShinyButton
            onClick={handleOpenEnvelope}
            variant="secondary"
          >
            {isOpen ? "ປິດຈົດໝາຍ ✉️" : "ເປີດອ່ານຈົດໝາຍ 💌"}
          </ShinyButton>
        </div>
      </motion.div>
    </section>
  );
}
