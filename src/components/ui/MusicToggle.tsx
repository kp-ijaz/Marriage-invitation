"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AUDIO } from "@/lib/constants";

const STORAGE_KEY = "nikah-music-enabled";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = AUDIO.volume;
    audio.preload = "auto";

    const onPlay = () => {
      setIsPlaying(true);
      setHasError(false);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
      setHasError(true);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    const startMusic = async () => {
      if (!audio.paused) {
        setIsPlaying(true);
        return true;
      }

      try {
        await audio.play();
        sessionStorage.setItem(STORAGE_KEY, "true");
        setHasError(false);
        setIsPlaying(true);
        return true;
      } catch {
        return false;
      }
    };

    const onFirstInteraction = () => {
      void startMusic();
    };

    if (!audio.paused) {
      setIsPlaying(true);
    }

    void startMusic().then((started) => {
      if (!started) {
        window.addEventListener("click", onFirstInteraction, { once: true });
        window.addEventListener("touchstart", onFirstInteraction, { once: true });
      }
    });

    return () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      sessionStorage.setItem(STORAGE_KEY, "false");
      return;
    }

    try {
      await audio.play();
      sessionStorage.setItem(STORAGE_KEY, "true");
      setHasError(false);
    } catch {
      setIsPlaying(false);
      setHasError(true);
      sessionStorage.setItem(STORAGE_KEY, "false");
    }
  };

  return (
    <div className="relative">
      <audio
        ref={audioRef}
        src={AUDIO.src}
        loop
        preload="auto"
        autoPlay
        className="hidden"
      />
      <button
        type="button"
        onClick={toggle}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border bg-ivory shadow-[0_10px_28px_rgba(184,134,11,0.22)] transition-all hover:shadow-[0_14px_36px_rgba(184,134,11,0.3)] ${
          hasError
            ? "border-red-400 ring-2 ring-red-300/60"
            : isPlaying
              ? "border-gold music-toggle-active"
              : "border-gold/60 hover:border-gold"
        }`}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        aria-pressed={isPlaying}
      >
        {isPlaying && <span className="music-toggle-ping" aria-hidden />}
        {isPlaying ? (
          <Volume2 className="music-toggle-icon relative z-10 h-6 w-6 text-gold" strokeWidth={2} />
        ) : (
          <VolumeX className="relative z-10 h-6 w-6 text-gold" strokeWidth={2} />
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
