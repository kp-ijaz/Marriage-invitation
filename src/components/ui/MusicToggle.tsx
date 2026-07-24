"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useMusic } from "@/components/providers/MusicProvider";

export default function MusicToggle() {
  const { isPlaying, hasError, toggle } = useMusic();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border bg-ivory shadow-[0_10px_28px_rgba(184,134,11,0.22)] transition-all hover:shadow-[0_14px_36px_rgba(184,134,11,0.3)] ${
          hasError
            ? "border-red-400 ring-2 ring-red-300/60"
            : isPlaying
              ? "border-gold music-toggle-active"
              : "border-gold/60 hover:border-gold music-toggle-idle"
        }`}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        aria-pressed={isPlaying}
      >
        {isPlaying && <span className="music-toggle-ping" aria-hidden />}
        {isPlaying ? (
          <Volume2 className="music-toggle-icon relative z-10 h-6 w-6 text-gold" strokeWidth={2} />
        ) : (
          <VolumeX className="music-toggle-icon-idle relative z-10 h-6 w-6 text-gold" strokeWidth={2} />
        )}
      </button>
      {hasError && (
        <span className="sr-only" role="status" aria-live="polite">
          Music could not play. Tap again or check the audio file.
        </span>
      )}
    </div>
  );
}
