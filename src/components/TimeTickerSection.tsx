"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Heart } from "lucide-react";
import { CONFIG } from "@/config";

export default function TimeTickerSection() {
  const [secondsElapsed, setSecondsElapsed] = useState(365 * 24 * 3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(secondsElapsed / (24 * 3600));
  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor(secondsElapsed / 60);

  return (
    <section className="relative max-w-4xl mx-auto px-4 py-12 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 bg-slate-900/40 border border-purple-500/20 backdrop-blur-md text-center shadow-xl relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs tracking-wider uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3">
          <Clock className="w-3.5 h-3.5 text-pink-400" />
          Live Memory Counter
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif text-slate-100 mb-2">
          ທຸກໆວິນາທີແຫ່ງຄວາມຊົງຈຳ ⏳
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-8 font-light">
          1 ປີທີ່ຜ່ານມາຂອງ {CONFIG.name} ເຕັມໄປດ້ວຍຄວາມງົດງາມແລະການເຕີບໂຕ
        </p>

        {/* Live Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-mono text-pink-300 font-bold">
              {days.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
              ມື້ແຫ່ງຄວາມຊົງຈຳ
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-mono text-purple-300 font-bold">
              {hours.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
              ຊົ່ວໂມງແຫ່ງຮອຍຍິ້ມ
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-mono text-indigo-300 font-bold">
              {minutes.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
              ນາທີແຫ່ງຄວາມສຸກ
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-mono text-pink-400 font-bold flex items-center gap-1">
              <span>∞</span>
              <Heart className="w-5 h-5 fill-pink-400" />
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
              ກຳລັງໃຈທີ່ມີໃຫ້ສະເໝີ
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
