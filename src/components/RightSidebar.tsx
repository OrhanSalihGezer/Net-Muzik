"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { X, Disc } from "lucide-react";

export default function RightSidebar() {
  const { activeSong, isRightSidebarOpen, toggleRightSidebar } = usePlayerStore();

  if (!isRightSidebarOpen || !activeSong) return null;

  return (
    <div className="w-80 bg-[#121212] my-2 mr-2 rounded-lg p-4 flex flex-col gap-y-4 overflow-y-auto text-white select-none">
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm">Çalan Şarkı</span>
        <button onClick={toggleRightSidebar} className="text-neutral-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="w-full aspect-square rounded-lg overflow-hidden shadow-2xl">
        <img src={activeSong.cover} alt={activeSong.title} className="w-full h-full object-cover" />
      </div>

      <div>
        <h2 className="text-xl font-bold truncate">{activeSong.title}</h2>
        <p className="text-sm text-neutral-400 mt-1">{activeSong.artist}</p>
      </div>

      <div className="bg-[#181818] p-4 rounded-xl border border-neutral-800 flex items-center gap-x-3">
        <Disc size={24} className="text-[#1ed760] animate-spin-slow" />
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Yayın Kaynağı</span>
          <span className="text-sm font-semibold">YouTube HQ Engine</span>
        </div>
      </div>
    </div>
  );
}