"use client";

import { Home, Library, Plus, Disc, Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useState } from "react";

export default function Sidebar() {
  const { myLibrary, userPlaylists, createPlaylist, deletePlaylist, selectPlaylist } = usePlayerStore();
  const [playlistName, setPlaylistName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistName.trim()) {
      createPlaylist(playlistName.trim());
      setPlaylistName("");
      setShowInput(false);
    }
  };

  return (
    <div className="w-56 bg-[#0f0f12] h-full flex flex-col gap-y-2 p-3 select-none">
      {/* Logo */}
      <div className="p-3">
        <Link
          href="/"
          onClick={() => selectPlaylist(null)}
          className="text-lg font-bold text-white tracking-tight"
        >
          Net Müzik
        </Link>
      </div>

      {/* Menü */}
      <nav className="flex flex-col gap-y-1">
        <Link
          href="/"
          onClick={() => selectPlaylist(null)}
          className="flex items-center gap-x-3 text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-800/50 text-sm font-medium transition"
        >
          <Home size={18} />
          <span>Anasayfa</span>
        </Link>
      </nav>

      {/* Listeler */}
      <div className="mt-4 flex-1 flex flex-col gap-y-3 px-1 overflow-y-auto">
        <div className="flex items-center justify-between text-zinc-400">
          <div className="flex items-center gap-x-2">
            <Library size={18} />
            <span className="font-semibold text-xs text-zinc-300">Kitaplığın</span>
          </div>
          <button
            onClick={() => setShowInput(!showInput)}
            className="hover:text-white p-1 text-zinc-400"
            title="Yeni Liste"
          >
            <Plus size={16} />
          </button>
        </div>

        {showInput && (
          <form onSubmit={handleCreatePlaylist} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Liste adı..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full bg-zinc-800 text-white text-xs px-2.5 py-1.5 rounded-md focus:outline-none border border-zinc-700"
              autoFocus
            />
            <button type="submit" className="bg-white text-black font-semibold text-xs px-2.5 rounded-md">
              Ekle
            </button>
          </form>
        )}

        <div className="flex flex-col gap-y-0.5 mt-1">
          {/* Favoriler */}
          <div 
            onClick={() => selectPlaylist(null)}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/40 cursor-pointer text-zinc-300 hover:text-white transition"
          >
            <div className="flex items-center gap-x-2.5 truncate">
              <Heart size={16} className="text-zinc-400" />
              <span className="text-xs font-medium truncate">Favoriler</span>
            </div>
            <span className="text-[10px] text-zinc-500">{myLibrary.length}</span>
          </div>

          {/* Özel Listeler */}
          {userPlaylists.map((pl) => (
            <div
              key={pl.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/40 cursor-pointer text-zinc-400 hover:text-white transition group"
            >
              <div onClick={() => selectPlaylist(pl)} className="flex items-center gap-x-2.5 truncate flex-1">
                <Disc size={16} />
                <span className="text-xs font-medium truncate">{pl.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePlaylist(pl.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}