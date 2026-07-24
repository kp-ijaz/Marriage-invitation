"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LOGO } from "@/lib/constants";
import { requestMusicPlay } from "@/lib/music";

/**
 * M & A logo welcome — short cinematic hold, then handoff to Hero.
 */
export default function OpeningScreen() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    setVisible(true);
  }, []);

  const dismiss = () => {
    requestMusicPlay();
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;

    if (shouldReduceMotion) {
      const timer = window.setTimeout(() => setVisible(false), 400);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => setVisible(false), 8000);

    return () => window.clearTimeout(timer);
  }, [visible, shouldReduceMotion]);

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center overflow-hidden bg-warm-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.25 : 0.9,
            ease: [0.4, 0, 0.2, 1],
          }}
          onPointerDown={dismiss}
          role="button"
          tabIndex={0}
          aria-label="Tap to open invitation and play music"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              dismiss();
            }
          }}
        >
          <div className="opening-bg-layer" />
          {!shouldReduceMotion && (
            <motion.div
              className="opening-shimmer-layer"
              initial={{ x: "-35%" }}
              animate={{ x: "35%" }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            />
          )}

          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.86 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 1.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src={LOGO.src}
              alt={LOGO.alt}
              width={1024}
              height={665}
              priority
              className="opening-logo opening-calligraphy-glow pointer-events-none"
            />
            {!shouldReduceMotion && (
              <p className="opening-tap-hint mt-8 text-center font-body text-sm tracking-[0.22em] text-charcoal/55 uppercase">
                Tap to open
              </p>
            )}
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
