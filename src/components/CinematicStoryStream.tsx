"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CONFIG } from "@/config";
import { Sparkles, Heart, Eye } from "lucide-react";

interface Props {
  onSelectPhoto: (index: number) => void;
}

export default function CinematicStoryStream({ onSelectPhoto }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pick 12 highlight photos for the continuous pinned zoom stream
  const highlightPhotos = CONFIG.photos.slice(0, 12);

  return (
    <section ref={containerRef} className="relative max-w-2xl mx-auto px-4 py-6 z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 space-y-2"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-pink-500/10 text-pink-300 border border-pink-500/20">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Continuous Photo Journey 📸
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif text-slate-100 tracking-wide">
          ຈັງຫວະຮູບພາບຄວາມຊົງຈຳ 🌸
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-light max-w-md mx-auto">
          ເລື່ອນລົງລຸ່ມເພື່ອຮັບຊົມຮູບພາບທີ່ຄ່ອຍໆຊູມ ແລະ ເລື່ອນຢ່າງນຸ່ມນວນຕໍ່ເນື່ອງ
        </p>
      </motion.div>

      {/* Pinned Continuous Zooming Stream Cards */}
      <div className="space-y-8">
        {highlightPhotos.map((photo, idx) => (
          <PinnedPhotoCard
            key={idx}
            photo={photo}
            index={idx}
            total={highlightPhotos.length}
            onSelect={() => onSelectPhoto(idx)}
          />
        ))}
      </div>
    </section>
  );
}

function PinnedPhotoCard({
  photo,
  index,
  total,
  onSelect,
}: {
  photo: any;
  index: number;
  total: number;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Framer motion scroll-linked zoom effect
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Smooth continuous image zoom-in on scroll
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.1, 1.18]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.4]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -20]);

  return (
    <div ref={cardRef} className="sticky top-24 snap-start snap-always mb-16">
      <motion.div
        style={{ opacity: cardOpacity }}
        className="relative rounded-3xl bg-slate-900/80 border border-pink-500/30 backdrop-blur-2xl shadow-2xl shadow-purple-950/50 overflow-hidden group cursor-pointer"
        onClick={onSelect}
      >
        {/* Pinned Image Frame with Smooth Scale Zoom */}
        <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden bg-slate-950">
          <motion.img
            src={photo.src}
            alt={photo.alt}
            style={{ scale: imageScale }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:brightness-110"
          />

          {/* Vignette Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Hover Zoom Prompt Badge */}
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-slate-950/80 border border-pink-400/40 text-pink-200 backdrop-blur-md shadow-lg">
              <Eye className="w-3.5 h-3.5 text-pink-400" />
              ແຕະເພື່ອເບິ່ງຮູບໃຫຍ່
            </span>
          </div>

          {/* Photo Index Tag */}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-pink-500/20 text-pink-200 border border-pink-400/30 backdrop-blur-md shadow-md">
              #{index + 1} / {total}
            </span>
          </div>
        </div>

        {/* Floating Content Card with Parallax Y Move */}
        <motion.div style={{ y: textY }} className="p-6 sm:p-8 space-y-3 relative z-20 -mt-10 bg-slate-950/90 border-t border-pink-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl text-slate-100 font-medium">
              {photo.title}
            </h3>
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400/40" />
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light italic">
            "{photo.caption}"
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
