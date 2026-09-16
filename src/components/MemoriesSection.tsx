"use client";

import { motion } from "framer-motion";
import { CONFIG } from "@/config";
import { Sparkles } from "lucide-react";

interface Props {
  onSelectPhoto: (index: number) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function MemoriesSection({ onSelectPhoto }: Props) {
  return (
    <section className="relative max-w-4xl mx-auto px-6 py-12 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs tracking-wider uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Words to hold onto
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-slate-100 tracking-wide">
          ຂໍ້ຄິດເເລະກຳລັງໃຈດີໆ 💖
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CONFIG.memories.map((item, idx) => (
          <motion.div
            key={idx}
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="relative group rounded-2xl p-6 bg-slate-900/40 border border-white/10 backdrop-blur-md hover:border-pink-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-lg shadow-purple-950/20"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[11px] uppercase tracking-widest text-pink-300/60 font-mono">
                {item.label}
              </span>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light italic">
              "{item.quote}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
