"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "@/config";
import { Sparkles, Share2 } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { playSparkleSFX } from "@/utils/sfx";

export default function SouvenirCard() {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleShare = () => {
    playSparkleSFX();
    if (navigator.share) {
      navigator.share({
        title: `Happy Birthday ${CONFIG.name}!`,
        text: `ສຸກສັນວັນເກີດເດີ ${CONFIG.name}! 🎂✨`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }

    triggerConfetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#e8a0bf", "#9b72cf", "#c9b8e8"],
    });
  };

  return (
    <section className="relative max-w-md mx-auto px-4 py-12 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6"
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs tracking-wider uppercase bg-pink-500/10 text-pink-300 border border-pink-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Digital Birthday Souvenir
        </span>
        <h3 className="text-2xl font-serif text-slate-100">
          ກຳນົດຄວາມຊົງຈຳປະຈຳວັນເກີດ 📸
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          ກຳນົດຂອງຂວັນທີ່ລະລຶກ ສາມາດບັນທຶກຫຼືແຊຣ໌ໄດ້ເລີຍ!
        </p>
      </motion.div>

      {/* Styled Souvenir Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-pink-500/30 shadow-2xl shadow-purple-950/40 text-center space-y-4 overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Profile Avatar */}
        <div className="relative mx-auto w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 shadow-lg">
          <img
            src={CONFIG.avatar}
            alt={CONFIG.name}
            className="w-full h-full rounded-full object-cover border-2 border-slate-950"
          />
        </div>

        {/* Header Text */}
        <div className="space-y-1">
          <h4 className="text-xl font-serif text-slate-100 font-medium">
            {CONFIG.name}
          </h4>
          <p className="text-xs text-pink-300/80 font-mono">
            {CONFIG.username} • Happy Birthday 🎉
          </p>
        </div>

        {/* Card Quote */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light italic">
            "ຂໍໃຫ້ປີນີ້ເປັນປີທີ່ເຕັມไปด้วยຮອຍຍິ້ມ ສຸຂະພາບແຂງແຮງ ແລະມີຄວາມສຸກໃນທຸກໆບົດຂອງຊີວິດເດີ 🎂✨"
          </p>
        </div>

        {/* Stamp & Date Footer */}
        <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 font-mono uppercase tracking-widest border-t border-white/5">
          <span>Official Souvenir Card</span>
          <span className="text-pink-300">September 15, 2026</span>
        </div>

        {/* Share & Save Button */}
        <div className="pt-3">
          <button
            onClick={handleShare}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-medium text-slate-900 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 hover:from-pink-200 hover:to-indigo-200 shadow-lg shadow-pink-500/20 transition-all duration-300"
          >
            <Share2 className="w-4 h-4 text-purple-950" />
            <span>{copied ? "ຄັດລອກລິ້ງການ໌ດຮຽບຮ້ອຍ! ✨" : "ແຊຣ໌ການ໌ດອວຍພອນ 💖"}</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
