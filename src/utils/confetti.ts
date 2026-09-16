export function triggerConfetti(options?: any) {
  if (typeof window === "undefined") return;
  import("canvas-confetti")
    .then((confetti) => {
      confetti.default(options);
    })
    .catch(() => {});
}
