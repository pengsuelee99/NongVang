"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Plus,
  Link as LinkIcon,
  RefreshCw,
  Settings,
  Music,
  Sparkles,
  Heart,
  Check,
  Volume2,
  Youtube,
  Tv,
  Scissors,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { CONFIG } from "@/config";

interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  youtubeId?: string;
  audioUrl?: string;
}

interface Props {
  onPlaySong?: () => void;
}

export default function AestheticMusicLounge({ onPlaySong }: Props = {}) {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: "yt-pap-1",
      title: "P.A.P BEAT BAND ft. NT one - Es koj puas nco kuv thiab (แล้วเธอคิดถึงฉันไหม)",
      artist: "P.A.P BEAT BAND",
      cover: "https://img.youtube.com/vi/cmlgBhyAZA0/hqdefault.jpg",
      duration: "04:15",
      youtubeId: "cmlgBhyAZA0",
    },
    {
      id: "yt-mena-2",
      title: "Mena Xyooj ft. Paj Tshiab Xyooj - Yawg cuas yog niam qub kiav roj",
      artist: "Mena Xyooj",
      cover: "https://img.youtube.com/vi/sXR9DvAIyO4/hqdefault.jpg",
      duration: "04:30",
      youtubeId: "sXR9DvAIyO4",
    },
    {
      id: "yt-part3-3",
      title: "Niam tais yog txiv qub hluas nkauj (Part 3)",
      artist: "Official Hmong Audio",
      cover: "https://img.youtube.com/vi/LHxHU7zQ2TE/hqdefault.jpg",
      duration: "05:10",
      youtubeId: "LHxHU7zQ2TE",
    },
    {
      id: "yt-part4-4",
      title: "Niam tais yog txiv qub hluas nkauj (Part 4)",
      artist: "Official Hmong Audio",
      cover: "https://img.youtube.com/vi/WMWMNyDdU-o/hqdefault.jpg",
      duration: "04:55",
      youtubeId: "WMWMNyDdU-o",
    },
    {
      id: "yt-part5-5",
      title: "Niam tais yog txiv qub hluas nkauj (Part 5)",
      artist: "Official Hmong Audio",
      cover: "https://img.youtube.com/vi/Rd8s3GlJQdc/hqdefault.jpg",
      duration: "05:20",
      youtubeId: "Rd8s3GlJQdc",
    },
    {
      id: "yt-hb-6",
      title: "Happy Birthday, Nong Vang 🌸 (Special Acoustic)",
      artist: "Nong Vang Birthday Edition",
      cover: "/images/img_1.jpg",
      duration: "03:45",
      audioUrl: CONFIG.musicSrc,
    },
    {
      id: "yt-lao-7",
      title: "ຄວາມສຸກແລະຮອຍຍິ້ມ 💖 (Lao Acoustic Chill)",
      artist: "Lao Warm Vibe",
      cover: "/images/img_4.jpg",
      duration: "03:50",
      audioUrl: CONFIG.musicSrc,
    },
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Web Audio API ambient chime generator fallback
  const playSynthChime = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Pentatonic soft acoustic notes
      const freqs = [329.63, 392.00, 440.00, 523.25, 659.25, 783.99];
      const freq = freqs[Math.floor(Math.random() * freqs.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.3);
    } catch (e) {
      // Ignore audio context errors
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // If HTML5 audio fails, use synth chime fallback
          playSynthChime();
          synthTimerRef.current = setInterval(playSynthChime, 2200);
        });
      }
    } else {
      if (audioRef.current) audioRef.current.pause();
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    }

    return () => {
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    };
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      playSynthChime();
      onPlaySong?.();
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowVideoEmbed(true);
    playSynthChime();
    onPlaySong?.();
  };

  // Add YouTube URL to playlist dynamically
  const handleAddYoutubeUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    // Extract YouTube Video ID
    let ytId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = inputUrl.match(regExp);

    if (match && match[2].length === 11) {
      ytId = match[2];
    }

    const newTrack: Track = {
      id: `yt-custom-${Date.now()}`,
      title: ytId ? `YouTube Song (${ytId})` : inputUrl.slice(0, 35),
      artist: "YouTube Imported Track",
      cover: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "/images/img_6.jpg",
      duration: "03:30",
      youtubeId: ytId || undefined,
      audioUrl: CONFIG.musicSrc,
    };

    setTracks((prev) => [newTrack, ...prev]);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    setShowVideoEmbed(true);
    setInputUrl("");
    setShowAddSuccess(true);
    onPlaySong?.();
    setTimeout(() => setShowAddSuccess(false), 3000);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  return (
    <section className="relative max-w-2xl mx-auto px-4 py-6 z-10 font-sans">
      {/* Container Dashboard Window matching Screenshot with Pink/Purple site colors */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl p-5 sm:p-7 bg-[#0f0a1c]/90 border border-pink-500/20 backdrop-blur-2xl shadow-2xl shadow-purple-950/50 text-slate-100 overflow-hidden"
      >
        {/* Glow ambient background matching site aesthetic */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Dashboard Header Bar matching Screenshot */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-pink-500/15 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Music className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              All Songs
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 text-slate-300 hover:text-pink-300 hover:border-pink-500/40 transition-all shadow-sm"
              title="Refresh Queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 text-slate-300 hover:text-pink-300 hover:border-pink-500/40 transition-all shadow-sm"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* YouTube Link Input Form */}
        <form onSubmit={handleAddYoutubeUrl} className="mb-5 relative z-10">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-pink-500/25 focus-within:border-pink-400/60 transition-colors shadow-inner">
            <div className="pl-3 text-pink-400">
              <Youtube className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="วางลิงก์ YouTube เพื่อดึงเพลงมาใส่เพลย์ลิสต์..."
              className="w-full bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 shadow-md shadow-pink-500/20 transition-all shrink-0 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ดึงเพลง YouTube</span>
            </button>
          </div>

          {showAddSuccess && (
            <p className="text-[11px] text-pink-300 mt-2 pl-2 flex items-center gap-1 font-mono">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> ดึงเพลงจาก YouTube เข้าสู่เพลย์ลิสต์เรียบร้อยแล้ว! ✨
            </p>
          )}
        </form>

        {/* NOW PLAYING Featured Card matching Screenshot */}
        <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-purple-950/40 via-slate-950/70 to-pink-950/30 border border-pink-500/20 shadow-xl overflow-hidden mb-6 group">
          {/* Light ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* YouTube Embedded Video Container directly inside the app */}
          {showVideoEmbed && currentTrack.youtubeId ? (
            <div className="mb-4 relative rounded-2xl overflow-hidden border border-pink-500/30 shadow-2xl aspect-video bg-black/95">
              <iframe
                key={`${currentTrack.youtubeId}-${isPlaying}`}
                src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&rel=0&playsinline=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
            {/* Album Cover Thumbnail with Glowing Pink Border */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-pink-400/30 shrink-0 shadow-lg shadow-purple-950/80 group">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-pink-400 animate-ping" />
                </div>
              )}
            </div>

            {/* Track Info Details */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-pink-400 font-mono font-bold">
                  NOW PLAYING
                </span>

                {currentTrack.youtubeId && (
                  <button
                    onClick={() => setShowVideoEmbed(!showVideoEmbed)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300 hover:bg-pink-500/30 transition-colors inline-flex items-center gap-1"
                  >
                    <Tv className="w-3 h-3" />
                    {showVideoEmbed ? "ปิดวิดีโอ" : "ดูวิดีโอ"}
                  </button>
                )}

                {currentTrack.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300 hover:bg-pink-500/30 transition-colors inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    YouTube ↗
                  </a>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-slate-300 truncate font-mono">
                {currentTrack.artist}
              </p>
              <p className="text-[11px] text-slate-400/90 font-light line-clamp-1">
                Enjoy the best audio experience. Select a track from the queue or add a new link.
              </p>

              {/* Action Buttons Bar matching Screenshot */}
              <div className="pt-2 flex items-center gap-2">
                {/* Glowing Play Now Button */}
                <button
                  onClick={togglePlay}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 shadow-lg shadow-pink-500/25 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Now</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Play Now</span>
                    </>
                  )}
                </button>

                {/* Scissors Cut Button */}
                <button
                  className="p-2 rounded-xl bg-slate-900/80 border border-pink-500/20 text-slate-400 hover:text-pink-300 transition-colors"
                  title="Trim/Scissors"
                >
                  <Scissors className="w-4 h-4" />
                </button>

                {/* Dropdown Action Button */}
                <button
                  className="p-2 rounded-xl bg-slate-900/80 border border-pink-500/20 text-slate-400 hover:text-pink-300 transition-colors"
                  title="More Options"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Progress Bar inside NOW PLAYING card */}
          <div className="mt-5 space-y-1 relative z-10 pt-2 border-t border-white/5">
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-pink-500/20">
              <div
                className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0:00</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>
        </div>

        {/* SONG QUEUE LIST (Track Table matching Screenshot) */}
        <div className="space-y-2 relative z-10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1 font-mono">
            Song Queue ({tracks.length})
          </h4>

          {tracks.map((track, idx) => {
            const isSelected = idx === currentTrackIndex;
            return (
              <motion.div
                key={track.id}
                whileHover={{ x: 4 }}
                onClick={() => selectTrack(idx)}
                className={`cursor-pointer rounded-2xl p-3 flex items-center gap-3.5 transition-all duration-200 border ${
                  isSelected
                    ? "bg-purple-950/60 border-pink-400/40 shadow-md shadow-purple-950/50 text-white"
                    : "bg-slate-950/40 border-white/5 text-slate-300 hover:bg-slate-900/60 hover:border-pink-500/20"
                }`}
              >
                {/* Track Number */}
                <span className="text-xs font-mono text-slate-400 font-bold w-4 text-center">
                  {idx + 1}
                </span>

                {/* Thumbnail */}
                <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-950">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-purple-900/60 flex items-center justify-center">
                      <Volume2 className="w-4 h-4 text-pink-300 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Track Title & Artist */}
                <div className="flex-1 min-w-0">
                  <h5 className={`text-xs sm:text-sm font-medium truncate ${isSelected ? "text-pink-300 font-bold" : "text-slate-200"}`}>
                    {track.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 truncate font-mono">
                    {track.artist}
                  </p>
                </div>

                {/* Track Duration */}
                <span className="text-xs font-mono text-slate-400 shrink-0">
                  {track.duration}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Hidden Audio element for fallback tracks */}
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl || CONFIG.musicSrc}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => selectTrack((currentTrackIndex + 1) % tracks.length)}
          loop
        />
      </motion.div>
    </section>
  );
}
