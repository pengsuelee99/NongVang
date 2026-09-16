"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, Mic, Star, Flame, Heart } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { playBlowOutSFX, playCelebrationSFX } from "@/utils/sfx";

export default function InteractiveWish() {
  const [isBlown, setIsBlown] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const [blowStrength, setBlowStrength] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Enable microphone wind detection
  const startMicListening = async () => {
    try {
      if (isBlown) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsMicListening(true);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkBlow = () => {
        if (isBlown) return;
        analyser.getByteFrequencyData(dataArray);

        // Calculate low-frequency noise (wind blow energy)
        let sum = 0;
        for (let i = 0; i < 15; i++) {
          sum += dataArray[i];
        }
        const average = sum / 15;
        const normalized = Math.min(average / 120, 1);
        setBlowStrength(normalized);

        // Blow threshold met!
        if (average > 75) {
          extinguishCandle();
          return;
        }

        requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch (err) {
      console.log("Microphone access declined or unavailable - tap fallback ready.");
      setIsMicListening(false);
    }
  };

  // Stop mic stream
  const stopMicListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    setIsMicListening(false);
  };

  const extinguishCandle = () => {
    if (isBlown) return;
    setIsBlown(true);
    stopMicListening();

    // Play blow SFX & celebration SFX
    playBlowOutSFX();
    setTimeout(playCelebrationSFX, 400);

    // Fireworks confetti blast
    const end = Date.now() + 3 * 1000;
    const colors = ["#e8a0bf", "#9b72cf", "#c9b8e8", "#ffffff", "#ffd1dc"];

    (function frame() {
      triggerConfetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: colors,
      });
      triggerConfetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  useEffect(() => {
    return () => {
      stopMicListening();
    };
  }, []);

  return (
    <section className="relative max-w-xl mx-auto px-6 py-16 text-center z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 sm:p-10 bg-slate-900/60 border border-pink-500/20 backdrop-blur-xl shadow-2xl shadow-purple-950/30 overflow-hidden relative"
      >
        {/* Glow halo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-3 rounded-full bg-pink-500/10 text-pink-300 mb-4">
          <Gift className="w-6 h-6 animate-bounce" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif text-slate-100 mb-2">
          Make a Birthday Wish 🎂
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-8 font-light">
          ຫຼັບຕາອະທິຖານໃນໃຈ ແລ້ວເປົ່າລົມໃສ່ໄມໂຄຣໂຟນ (ຫຼືແຕະທີ່ເປວໄຟ) ເພື່ອເປົ່າທຽນວັນເກີດ!
        </p>

        {/* Interactive Candle & Cake Display */}
        <div className="relative my-8 flex flex-col items-center justify-center">
          {/* Flame animation */}
          <div
            onClick={extinguishCandle}
            className="cursor-pointer group flex flex-col items-center justify-center p-4 transition-transform active:scale-95"
            title="ແຕະທີ່ເປວໄຟເພື່ອເປົ່າທຽນ"
          >
            <AnimatePresence mode="wait">
              {!isBlown ? (
                <motion.div
                  key="flame"
                  animate={{
                    scale: [1, 1.15, 0.95, 1.05, 1],
                    rotate: [-2, 3, -3, 2, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="relative flex flex-col items-center"
                >
                  {/* Flame Glow Halo */}
                  <div className="absolute -top-4 w-12 h-12 bg-amber-400/40 rounded-full blur-xl animate-pulse" />
                  <Flame className="w-12 h-12 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] fill-amber-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="smoke"
                  initial={{ opacity: 1, y: 0, scale: 0.5 }}
                  animate={{ opacity: 0, y: -40, scale: 1.5 }}
                  transition={{ duration: 1.5 }}
                  className="flex flex-col items-center text-slate-400 font-mono text-xs"
                >
                  <span>💨 ✨</span>
                  <span className="text-[10px]">Wish Made!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Candle Stick */}
            <div className="w-4 h-14 bg-gradient-to-b from-pink-300 to-purple-400 rounded-t-sm shadow-md border-t border-white/40 my-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 transform -rotate-45 translate-y-2" />
            </div>

            {/* Cake Base */}
            <div className="w-32 h-12 bg-gradient-to-r from-slate-900 via-pink-950/40 to-slate-900 border border-pink-500/30 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
              <div className="flex gap-1 text-xs text-pink-300/80">
                <span>🎂</span>
                <span>✨</span>
                <span>🎂</span>
              </div>
            </div>
          </div>

          {/* Blow strength bar if mic active */}
          {isMicListening && !isBlown && (
            <div className="mt-2 w-36 text-center space-y-1">
              <span className="text-[10px] text-pink-300 font-mono">ກຳລັງຟັງສຽງເປົ່າລົມ...</span>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-pink-500/30">
                <div
                  className="h-full bg-pink-400 transition-all duration-100"
                  style={{ width: `${blowStrength * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {!isBlown ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            {!isMicListening ? (
              <button
                onClick={startMicListening}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-pink-200 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 transition-all duration-300"
              >
                <Mic className="w-3.5 h-3.5 text-pink-400" />
                <span>ເປີດໄມເພື່ອເປົ່າທຽນ 🎙️</span>
              </button>
            ) : (
              <span className="text-xs text-pink-300 font-mono animate-pulse">
                🎙️ ເປົ່າລົມໃສ່ໄມໂຄຣໂຟນໄດ້ເລີຍ!
              </span>
            )}

            <button
              onClick={extinguishCandle}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium text-slate-900 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 hover:from-pink-200 hover:to-indigo-200 shadow-lg shadow-pink-500/20 transition-all duration-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-900" />
              <span>ແຕະເພື່ອເປົ່າທຽນ 🎂</span>
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 text-pink-100 space-y-2 text-center shadow-lg"
          >
            <div className="flex justify-center gap-1.5 text-pink-300 mb-1">
              <Star className="w-4 h-4 fill-pink-400" />
              <Heart className="w-4 h-4 fill-purple-400" />
              <Star className="w-4 h-4 fill-pink-400" />
            </div>
            <h4 className="font-serif text-lg sm:text-xl text-slate-100">
              "ຂໍໃຫ້ທຸກຄວາມປາດຖະໜາແລະພອນຂໍທີ່ແອບຂໍ ເກີດຂຶ້ນແທ້ທັງໝົດເດີ"
            </h4>
            <p className="text-xs text-slate-400 font-mono pt-1">
              Happy Birthday Nong Vong! 🎂✨🎉
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
