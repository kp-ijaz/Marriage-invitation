export const MUSIC_PLAY_EVENT = "nikah:play-music";

export function requestMusicPlay() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MUSIC_PLAY_EVENT));
}
