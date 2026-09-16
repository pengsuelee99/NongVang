"use client";

import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export default function TextReveal({
  text,
  className = "",
  delay = 0.2,
  speed = 0.03,
  as: Component = "p",
}: Props) {
  // Split lines first to preserve line breaks
  const lines = text.split("\n");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: speed,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="inline-block"
      >
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="block">
            {line.split(" ").map((word, wordIdx) => (
              <motion.span
                key={wordIdx}
                variants={wordVariants}
                className="inline-block mr-1.5"
              >
                {word}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Component>
  );
}
