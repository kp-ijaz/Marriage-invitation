"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AUDIO } from "@/lib/constants";

type MusicContextValue = {
  isPlaying: boolean;
  hasError: boolean;
  startMusic: () => void;
  toggle: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return context;
}

export default function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.volume = AUDIO.volume;

    if (!audio.paused) {
      setIsPlaying(true);
      setHasError(false);
      return;
    }

    const playAttempt = audio.play();

    if (playAttempt === undefined) {
      setIsPlaying(!audio.paused);
      return;
    }

    playAttempt
      .then(() => {
        setIsPlaying(true);
        setHasError(false);
      })
      .catch(() => {
        setIsPlaying(false);
        setHasError(true);
      });
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    startMusic();
  }, [startMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = AUDIO.volume;
    audio.preload = "auto";
    audio.load();

    const onPlay = () => {
      setIsPlaying(true);
      setHasError(false);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
      setHasError(true);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    const onLinkClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("a")) {
        startMusic();
      }
    };

    document.addEventListener("click", onLinkClick, { capture: true });

    return () => {
      document.removeEventListener("click", onLinkClick, { capture: true });
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, [startMusic]);

  return (
    <MusicContext.Provider value={{ isPlaying, hasError, startMusic, toggle }}>
      <audio ref={audioRef} loop preload="auto" playsInline className="hidden">
        {AUDIO.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </audio>
      {children}
    </MusicContext.Provider>
  );
}
