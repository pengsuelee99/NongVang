"use client";

import { motion } from "framer-motion";
import { CONFIG } from "@/config";
import { Sparkles, Heart } from "lucide-react";
import TextReveal from "@/components/TextReveal";

export default function BirthdayReveal() {
  const quoteText = "ສຸກສັນວັນເກີດເດີ ຜູ້ງາມເຕັມໄປດ້ວຍຄວາມສົດໃສແລະຮອຍຍິ້ມ. ຂໍໃຫ້ປີນີ້ເປັນປີທີ່ດີທີ່ສຸດ ເຕັມໄປດ້ວຍຄວາມສຸກແລະຮອຍຍິ້ມເດີ 🎂✨";

  return (
    <section className="relative max-w-3xl mx-auto px-6 pt-24 pb-16 text-center z-10">
      {/* Glow ambient circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-pink-500/15 via-purple-500/15 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Sparkles */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="inline-flex p-3 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 mb-6 shadow-lg shadow-pink-500/10"
      >
        <Sparkles className="w-6 h-6 text-pink-400" />
      </motion.div>

      {/* Title Greeting with Staggered Word Reveal */}
      <TextReveal
        as="h1"
        text={`ສຸກສັນວັນເກີດ, ${CONFIG.name} 🌸`}
        delay={0.2}
        speed={0.06}
        className="text-4xl sm:text-6xl font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-100 drop-shadow-sm mb-4"
      />

      {/* BIG Happy Birthday Heading */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4"
      >
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-fuchsia-200 to-indigo-200 drop-shadow-[0_0_30px_rgba(232,160,191,0.5)]">
          Happy Birthday,
        </h1>
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-300 drop-shadow-[0_0_30px_rgba(155,114,207,0.5)] mt-1">
          Nong Vang 🌸
        </h1>
      </motion.div>

      {/* TikTok Profile Handle & Stats Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex items-center justify-center gap-3 mb-8"
      >
        <a
          href={CONFIG.tiktokProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-pink-300/90 bg-slate-900/60 border border-pink-500/20 hover:border-pink-500/40 hover:bg-slate-900/80 transition-all duration-300 shadow-md"
        >
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/50" />
          <span>{CONFIG.username}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{CONFIG.stats.followers} Followers</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{CONFIG.stats.likes} Likes</span>
        </a>
      </motion.div>

      {/* Warm Opening Quote in Lao with Typewriter Reveal */}
      <TextReveal
        as="p"
        text={quoteText}
        delay={0.8}
        speed={0.04}
        className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-xl mx-auto italic"
      />
    </section>
  );
}
