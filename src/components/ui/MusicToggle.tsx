"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AUDIO } from "@/lib/constants";
import { MUSIC_PLAY_EVENT } from "@/lib/music";

const STORAGE_KEY = "nikah-music-enabled";

function waitUntilReady(audio: HTMLAudioElement) {
  return new Promise<void>((resolve) => {
    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      resolve();
      return;
    }

    const onReady = () => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("loadeddata", onReady);
      resolve();
    };

    audio.addEventListener("canplaythrough", onReady);
    audio.addEventListener("loadeddata", onReady);
    audio.load();
  });
}

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    if (!audio.paused) {
      setIsPlaying(true);
      setHasError(false);
      return true;
    }

    try {
      await waitUntilReady(audio);
      await audio.play();
      sessionStorage.setItem(STORAGE_KEY, "true");
      setHasError(false);
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, []);

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

    const onFirstInteraction = () => {
      void tryPlay();
    };

    const onMusicRequest = () => {
      void tryPlay();
    };

    const interactionOptions: AddEventListenerOptions = {
      capture: true,
      once: true,
      passive: true,
    };

    void tryPlay().then((started) => {
      if (started) return;

      document.addEventListener("pointerdown", onFirstInteraction, interactionOptions);
      document.addEventListener("keydown", onFirstInteraction, interactionOptions);
      document.addEventListener("scroll", onFirstInteraction, interactionOptions);
      window.addEventListener(MUSIC_PLAY_EVENT, onMusicRequest);
    });

    return () => {
      document.removeEventListener("pointerdown", onFirstInteraction, interactionOptions);
      document.removeEventListener("keydown", onFirstInteraction, interactionOptions);
      document.removeEventListener("scroll", onFirstInteraction, interactionOptions);
      window.removeEventListener(MUSIC_PLAY_EVENT, onMusicRequest);
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [tryPlay]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      sessionStorage.setItem(STORAGE_KEY, "false");
      return;
    }

    try {
      await waitUntilReady(audio);
      await audio.play();
      sessionStorage.setItem(STORAGE_KEY, "true");
      setHasError(false);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setHasError(true);
      sessionStorage.setItem(STORAGE_KEY, "false");
    }
  };

  return (
    <div className="relative">
      <audio ref={audioRef} loop preload="auto" className="hidden">
        {AUDIO.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </audio>
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
