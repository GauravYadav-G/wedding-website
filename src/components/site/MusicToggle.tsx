"use client";
import { useRef, useState } from "react";
import { Music2, Pause } from "lucide-react";
export default function MusicToggle() {
  const songUrl = process.env.NEXT_PUBLIC_WEDDING_SONG_URL || "/artwork/wedding-music.mp3";
  const songTitle = process.env.NEXT_PUBLIC_WEDDING_SONG_TITLE || "Wedding melody";
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const toggle = async () => {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) { player.pause(); return; }
    try { player.volume = .35; await player.play(); setError(false); } catch { setError(true); }
  };
  return <div className="music-dock">
    <audio ref={audio} src={songUrl} preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button type="button" onClick={toggle} aria-pressed={playing} aria-label={playing ? `Pause ${songTitle}` : `Play ${songTitle}`} title={songTitle} className="music-control">
      {playing ? <Pause size={14} /> : <Music2 size={14} />}<span>{playing ? songTitle : "Play music"}</span><span className={`music-bars ${playing ? "is-playing" : ""}`} aria-hidden="true"><i /><i /><i /></span>
    </button>
    {error && <span className="music-error" role="status">Tap to try again</span>}
  </div>;
}
