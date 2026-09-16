"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "@/config";
import { Lock, Sparkles, Heart, Gift, Grid, Filter } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { playSparkleSFX, playCelebrationSFX } from "@/utils/sfx";
import ShinyButton from "@/components/ShinyButton";

interface Props {
  onSelectPhoto: (index: number) => void;
}

export default function InteractivePhotoUnlock({ onSelectPhoto }: Props) {
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [displayLimit, setDisplayLimit] = useState(24);

  const totalPhotos = CONFIG.photos.length;

  const unlockNextPhoto = (indexToUnlock: number) => {
    if (indexToUnlock < unlockedCount) return;

    if (indexToUnlock + 1 === totalPhotos) {
      playCelebrationSFX();
    } else {
      playSparkleSFX();
    }

    triggerConfetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#e8a0bf", "#9b72cf", "#c9b8e8", "#ffffff", "#ffd1dc"],
    });

    setUnlockedCount((prev) => Math.min(prev + 1, totalPhotos));
  };

  // Category filter items
  const categories = [
    { id: "all", label: "ທຸກໆຮູບ (216)" },
    { id: "ethnic", label: "ຊຸດເຜົ່າມົ້ງ 🌸" },
    { id: "beach", label: "ທ່ຽວທະເລ 🌊" },
    { id: "smiles", label: "ຮອຍຍິ້ມ 😊" },
    { id: "family", label: "ກັບຄອບຄົວ ❤️" },
  ];

  const getFilteredPhotos = () => {
    if (activeCategory === "all") return CONFIG.photos;
    if (activeCategory === "ethnic") return CONFIG.photos.filter((p, i) => i % 5 === 0);
    if (activeCategory === "beach") return CONFIG.photos.filter((p, i) => i % 4 === 0);
    if (activeCategory === "smiles") return CONFIG.photos.filter((p, i) => i % 3 === 0);
    if (activeCategory === "family") return CONFIG.photos.filter((p, i) => i % 7 === 0);
    return CONFIG.photos;
  };

  const filteredPhotos = getFilteredPhotos();

  return (
    <section className="relative max-w-5xl mx-auto px-4 py-16 z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs tracking-wider uppercase bg-pink-500/10 text-pink-300 border border-pink-500/20 mb-3">
          <Gift className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
          Interactive Surprise Vault ({totalPhotos} Photos)
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif text-slate-100 tracking-wide">
          ຄວາມຊົງຈຳລຸ້ນເທື່ອລະຮູບເດີ 🎁
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-2">
          ເປີດເບິ່ງຮູບແລະຄຳອວຍພອນຖັດໄປນະ
        </p>

        {/* Progress bar */}
        <div className="mt-6 max-w-xs mx-auto">
          <div className="flex justify-between items-center text-xs text-pink-300 mb-1.5 font-mono">
            <span>ປົດລັອກຄວາມຊົງຈຳແລ້ວ</span>
            <span>{unlockedCount} / {totalPhotos}</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalPhotos) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Grid of Interactive Unlock Cards (Initial Featured Set) */}
      {!showAllGallery ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONFIG.photos.slice(0, 12).map((photo, index) => {
              const isUnlocked = index < unlockedCount;
              const isNextToUnlock = index === unlockedCount;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  className="relative rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md transition-all duration-300 shadow-xl"
                >
                  <AnimatePresence mode="wait">
                    {isUnlocked ? (
                      /* UNLOCKED CARD STATE */
                      <motion.div
                        key="unlocked"
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex flex-col h-full"
                      >
                        {/* Photo view */}
                        <div
                          onClick={() => {
                            playSparkleSFX();
                            onSelectPhoto(index);
                          }}
                          className="relative aspect-square w-full overflow-hidden cursor-pointer group bg-slate-950"
                        >
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Photo Overlay Badge */}
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-950/70 text-pink-200 border border-white/10 backdrop-blur-md">
                            Photo #{index + 1}
                          </div>

                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="px-3 py-1.5 rounded-full text-xs text-white bg-pink-500/30 border border-pink-400/40 backdrop-blur-md flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              ເບິ່ງຮູບຂະຫຍາຍໃຫຍ່
                            </span>
                          </div>
                        </div>

                        {/* Tailored Brotherly Blessing Caption */}
                        <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-900/80 to-slate-950/90 border-t border-white/5">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-pink-300 font-serif">
                              <span className="font-medium text-slate-200">{photo.title || `ຄວາມຊົງຈຳທີ່ ${index + 1}`}</span>
                              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/60" />
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light italic">
                              "{photo.caption}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : isNextToUnlock ? (
                      /* NEXT TO UNLOCK CARD STATE (PULSING GLOW) */
                      <motion.div
                        key="next-to-unlock"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => unlockNextPhoto(index)}
                        className="cursor-pointer relative aspect-square w-full rounded-2xl p-6 bg-gradient-to-br from-pink-500/20 via-purple-600/20 to-indigo-900/30 border-2 border-pink-400/50 shadow-lg shadow-pink-500/20 flex flex-col items-center justify-center text-center space-y-3 group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 animate-pulse" />

                        <div className="relative z-10 p-4 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 group-hover:scale-110 transition-transform">
                          <Gift className="w-8 h-8 text-pink-300 animate-bounce" />
                        </div>

                        <div className="relative z-10 space-y-1">
                          <span className="text-xs uppercase font-mono tracking-widest text-pink-300">
                            Memory #{index + 1}
                          </span>
                          <h4 className="text-sm font-medium text-slate-100">
                            ກົດເພື່ອປົດລັອກຮູບພາບ 🎁
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            ລຸ້ນຄຳອວຍພອນແລະຮູບຖັດໄປ!
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      /* LOCKED CARD STATE */
                      <div className="relative aspect-square w-full rounded-2xl p-6 bg-slate-950/80 border border-white/5 flex flex-col items-center justify-center text-center space-y-2 opacity-50 select-none">
                        <div className="p-3 rounded-full bg-slate-900 border border-white/10 text-slate-500">
                          <Lock className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono text-slate-500">
                          Memory #{index + 1} Locked
                        </span>
                        <p className="text-[10px] text-slate-600">
                          ປົດລັອກຮູບກ່ອນໜ້ານີ້ເພື່ອເປີດການ໌ດນີ້
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Show All 216 Photos Gallery Expansion Button */}
          <div className="mt-12 text-center">
            <ShinyButton
              onClick={() => {
                setShowAllGallery(true);
                playSparkleSFX();
              }}
              variant="primary"
              icon={<Grid className="w-4 h-4 text-slate-900" />}
            >
              ເປີດເບິ່ງຮູບຄວາມຊົງຈຳທັງໝົດ ({totalPhotos} ຮູບ) ✨
            </ShinyButton>
          </div>
        </>
      ) : (
        /* FULL 216 PHOTO GALLERY VIEW WITH CATEGORY FILTER TABS */
        <div className="space-y-8">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  playSparkleSFX();
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? "bg-pink-500/20 text-pink-200 border-pink-400/50 shadow-md"
                    : "bg-slate-900/60 text-slate-400 border-white/10 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 216 Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.slice(0, displayLimit).map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  playSparkleSFX();
                  onSelectPhoto(index);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-xl aspect-square bg-slate-900 border border-white/10 shadow-md hover:border-pink-400/50 transition-all duration-300"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-xs text-pink-200 font-medium truncate">
                    {photo.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {displayLimit < filteredPhotos.length && (
            <div className="text-center pt-6">
              <ShinyButton
                onClick={() => setDisplayLimit((prev) => prev + 24)}
                variant="secondary"
              >
                ໂຫຼດຮູບເພີ່ມເຕີມ ({filteredPhotos.length - displayLimit} ຮູບທີ່เຫລືອ) ✨
              </ShinyButton>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
