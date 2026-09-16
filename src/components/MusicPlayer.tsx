"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  musicSrc: string;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function MusicPlayer({ musicSrc, isPlaying, setIsPlaying }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio API ambient synth chime fallback
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

      // Soft ambient pentatonic frequencies (C4, E4, G4, A4, C5, D5)
      const freqs = [261.63, 329.63, 392.00, 440.00, 523.25, 587.33];
      const freq = freqs[Math.floor(Math.random() * freqs.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.6);
    } catch (e) {
      // Ignore web audio errors
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (!audioError && audioRef.current) {
        audioRef.current.play().catch(() => {
          setAudioError(true);
        });
      }

      // If audio file is missing or failed, use synth chime timer
      if (audioError) {
        playSynthChime();
        synthTimerRef.current = setInterval(playSynthChime, 2500);
      }
    } else {
      if (audioRef.current) audioRef.current.pause();
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    }

    return () => {
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    };
  }, [isPlaying, audioError]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    if (audioCtxRef.current) {
      if (!isMuted) {
        audioCtxRef.current.suspend();
      } else {
        audioCtxRef.current.resume();
      }
    }
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={musicSrc}
        loop
        preload="auto"
        onError={() => setAudioError(true)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-pink-500/20 bg-slate-950/80 p-2 backdrop-blur-md shadow-lg shadow-purple-950/40"
      >
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-pink-200 hover:text-white transition-colors"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          <Music className={`w-4 h-4 ${isPlaying ? "animate-spin text-pink-400" : "text-slate-400"}`} style={{ animationDuration: "6s" }} />
          <span>{isPlaying ? "Playing Ambient..." : "Play Music"}</span>

          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3 ml-1">
              <span className="w-0.5 bg-pink-400 animate-pulse h-full"></span>
              <span className="w-0.5 bg-purple-400 animate-pulse h-2/3" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-0.5 bg-pink-300 animate-pulse h-4/5" style={{ animationDelay: "0.4s" }}></span>
            </div>
          )}
        </button>

        <button
          onClick={toggleMute}
          className="p-1.5 text-pink-300/70 hover:text-pink-200 transition-colors border-l border-white/10"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </motion.div>
    </>
  );
}
