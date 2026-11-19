"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, Pause, SkipBack, SkipForward, Heart } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Player() {
  const {
    activeSong,
    isPlaying,
    togglePlay,
    nextSong,
    previousSong,
    addToLibrary,
    myLibrary,
  } = usePlayerStore();

  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 1. YouTube Iframe API'sini sayfaya 1 kere yükle
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };
  }, []);

  const initPlayer = () => {
    if (playerRef.current) return;

    playerRef.current = new window.YT.Player("yt-hidden-player", {
      height: "0",
      width: "0",
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          setIsReady(true);
        },
        onStateChange: (event: any) => {
          // 1 = Oynatılıyor, 0 = Bitti
          if (event.data === 1) {
            setDuration(playerRef.current.getDuration() || 0);
          } else if (event.data === 0) {
            nextSong();
          }
        },
      },
    });
  };

  // 2. Şarkı değiştiğinde ANINDA yükle ve oynat (Hızlı Geçiş)
  useEffect(() => {
    if (!playerRef.current || !isReady || !activeSong) return;

    // loadVideoById, iframe'i baştan kurmak yerine sadece videoyu anında değiştirir
    playerRef.current.loadVideoById(activeSong.id);
  }, [activeSong?.id, isReady]);

  // 3. Oynat/Durdur Butonu Tepkisi
  useEffect(() => {
    if (!playerRef.current || !isReady) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, isReady]);

  // 4. Zaman Çubuğu Takibi
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isReady && isPlaying) {
        try {
          setCurrentTime(playerRef.current.getCurrentTime() || 0);
          setDuration(playerRef.current.getDuration() || 0);
        } catch (e) {}
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, isReady]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const isLiked = activeSong
    ? myLibrary.some((s) => s.id === activeSong.id)
    : false;

  return (
    <>
      {/* GİZLİ YOUTUBE PLAYER CONTAINER - Her zaman DOM'da bekler */}
      <div className="hidden">
        <div id="yt-hidden-player"></div>
      </div>

      {/* PLAYER ARAYÜZÜ */}
      {activeSong && (
        <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 bg-[#121216]/95 backdrop-blur-md border-t border-zinc-800 px-3 py-2 text-white flex flex-col gap-y-1 w-full box-border">
          <div className="flex items-center justify-between gap-x-2 w-full min-w-0">
            <div className="flex items-center gap-x-2 min-w-0 flex-1">
              <img
                src={activeSong.cover}
                alt={activeSong.title}
                className="w-9 h-9 rounded object-cover shrink-0 border border-zinc-700"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-medium truncate text-zinc-100">
                  {activeSong.title}
                </h4>
                <p className="text-[9px] text-zinc-400 truncate">
                  {activeSong.artist}
                </p>
              </div>
              <button
                type="button"
                onClick={() => addToLibrary(activeSong)}
                className="p-1 text-zinc-400 hover:text-white shrink-0"
              >
                <Heart
                  size={14}
                  className={isLiked ? "text-red-500 fill-red-500" : "text-zinc-500"}
                />
              </button>
            </div>

            <div className="flex items-center gap-x-2 shrink-0">
              <button
                type="button"
                onClick={previousSong}
                className="text-zinc-400 hover:text-white p-1"
              >
                <SkipBack size={16} />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition"
              >
                {isPlaying ? (
                  <Pause size={14} />
                ) : (
                  <Play size={14} className="ml-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={nextSong}
                className="text-zinc-400 hover:text-white p-1"
              >
                <SkipForward size={16} />
              </button>
            </div>
          </div>

          <div className="w-full flex items-center gap-x-2 text-[8px] text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </>
  );
}