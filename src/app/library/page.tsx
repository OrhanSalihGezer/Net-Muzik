"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, Trash2, Heart, Library as LibraryIcon, Music, Home as HomeIcon, Plus } from "lucide-react";
import Link from "next/link";

export default function LibraryPage() {
  const {
    myLibrary,
    userPlaylists,
    removeFromLibrary,
    playSong,
    createPlaylist,
    removePlaylist,
  } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<"favorites" | "playlists">("favorites");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName.trim());
    setNewPlaylistName("");
    setShowCreateModal(false);
  };

  const currentPlaylist = userPlaylists.find((p) => p.id === selectedPlaylistId);

  return (
    <div className="flex bg-[#09090b] text-white min-h-screen w-full max-w-full overflow-x-hidden relative">
      {/* MASAÜSTÜ YAN PANEL */}
      <aside className="hidden md:flex flex-col w-64 bg-[#121216] border-r border-zinc-800/80 p-4 gap-y-6 shrink-0 h-screen sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-x-2 text-xl font-bold tracking-wider text-white">
          <Music size={24} />
          <span>Müzik Çalar</span>
        </Link>

        <div className="flex flex-col gap-y-1">
          <Link
            href="/"
            className="flex items-center gap-x-3 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            <HomeIcon size={18} /> Ana Sayfa
          </Link>
          <button
            onClick={() => {
              setActiveTab("favorites");
              setSelectedPlaylistId(null);
            }}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold w-full text-left transition ${
              activeTab === "favorites" && !selectedPlaylistId
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-x-3">
              <Heart size={18} className="text-red-500 fill-red-500" /> Favorilerim
            </span>
            <span className="text-[10px] text-zinc-500">{myLibrary.length}</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-y-2 overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 px-1">
            <span className="flex items-center gap-x-1.5">
              <LibraryIcon size={16} /> Listelerim ({userPlaylists.length})
            </span>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1 hover:bg-zinc-800 rounded-md text-zinc-300 hover:text-white transition"
              title="Yeni Liste Oluştur"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-y-1 pr-1">
            {userPlaylists.length === 0 ? (
              <p className="text-[11px] text-zinc-500 p-2">Henüz liste yok.</p>
            ) : (
              userPlaylists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => {
                    setActiveTab("playlists");
                    setSelectedPlaylistId(pl.id);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs w-full text-left transition truncate ${
                    selectedPlaylistId === pl.id
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <span className="truncate">{pl.name}</span>
                  <span className="text-[10px] text-zinc-500 shrink-0">{pl.songs.length}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* İÇERİK ALANI */}
      <main className="flex-1 p-4 sm:p-6 pb-44 w-full min-w-0 max-w-full overflow-hidden">
        {/* LİSTE OLUŞTURMA MODALI */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <form
              onSubmit={handleCreatePlaylist}
              className="bg-[#16161a] border border-zinc-800 rounded-xl p-5 w-full max-w-sm flex flex-col gap-y-4"
            >
              <h3 className="font-bold text-sm text-white">Yeni Çalma Listesi</h3>
              <input
                type="text"
                placeholder="Liste Adı..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full bg-zinc-900 text-white px-3 py-2 rounded-lg text-xs border border-zinc-800 focus:outline-none focus:border-zinc-600"
                autoFocus
              />
              <div className="flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs bg-white text-black font-semibold hover:bg-zinc-200"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MOBİL SEKME SEÇİCİ */}
        <div className="flex md:hidden items-center justify-between gap-x-2 mb-4 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-x-2">
            <button
              onClick={() => {
                setActiveTab("favorites");
                setSelectedPlaylistId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === "favorites" ? "bg-white text-black" : "bg-zinc-900 text-zinc-400"
              }`}
            >
              Favoriler ({myLibrary.length})
            </button>
            <button
              onClick={() => setActiveTab("playlists")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === "playlists" ? "bg-white text-black" : "bg-zinc-900 text-zinc-400"
              }`}
            >
              Listeler ({userPlaylists.length})
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 text-xs bg-zinc-800 px-2.5 py-1.5 rounded-lg text-white font-medium"
          >
            <Plus size={14} /> Yeni
          </button>
        </div>

        {/* İÇERİK - FAVORİLER */}
        {activeTab === "favorites" && !selectedPlaylistId && (
          <div>
            <h1 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Heart size={20} className="text-red-500 fill-red-500" /> Favori Şarkılarım
            </h1>
            {myLibrary.length === 0 ? (
              <p className="text-xs text-zinc-500 py-10 text-center">Henüz favori şarkı eklemediniz.</p>
            ) : (
              <div className="flex flex-col gap-y-2">
                {myLibrary.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800/50 transition"
                  >
                    <div
                      className="flex items-center gap-x-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => playSong(song)}
                    >
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-white truncate">{song.title}</h4>
                        <p className="text-[10px] text-zinc-400 truncate">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2 shrink-0">
                      <button
                        onClick={() => playSong(song)}
                        className="p-2 bg-white text-black rounded-full hover:scale-105 transition"
                      >
                        <Play size={12} className="ml-0.5" />
                      </button>
                      <button
                        onClick={() => removeFromLibrary(song.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* İÇERİK - ÇALMA LİSTELERİ */}
        {activeTab === "playlists" && (
          <div>
            {currentPlaylist ? (
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                  <div>
                    <h1 className="text-lg font-bold text-white">{currentPlaylist.name}</h1>
                    <p className="text-xs text-zinc-400">{currentPlaylist.songs.length} Şarkı</p>
                  </div>
                  <button
                    onClick={() => {
                      removePlaylist(currentPlaylist.id);
                      setSelectedPlaylistId(null);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2.5 py-1.5 rounded-lg"
                  >
                    <Trash2 size={14} /> Listeyi Sil
                  </button>
                </div>

                {currentPlaylist.songs.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-10 text-center">Bu liste henüz boş. Ana sayfadan şarkı ekleyebilirsiniz.</p>
                ) : (
                  <div className="flex flex-col gap-y-2">
                    {currentPlaylist.songs.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800/50 transition"
                      >
                        <div
                          className="flex items-center gap-x-3 flex-1 min-w-0 cursor-pointer"
                          onClick={() => playSong(song)}
                        >
                          <img
                            src={song.cover}
                            alt={song.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-semibold text-white truncate">{song.title}</h4>
                            <p className="text-[10px] text-zinc-400 truncate">{song.artist}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => playSong(song)}
                          className="p-2 bg-white text-black rounded-full hover:scale-105 transition"
                        >
                          <Play size={12} className="ml-0.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-y-3">
                <h2 className="text-sm font-bold text-white mb-2">Çalma Listeleriniz</h2>
                {userPlaylists.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">Henüz çalma listesi oluşturmadınız.</p>
                ) : (
                  userPlaylists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => setSelectedPlaylistId(pl.id)}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:bg-zinc-800 transition"
                    >
                      <span className="text-xs font-semibold text-white">{pl.name}</span>
                      <span className="text-[10px] text-zinc-400">{pl.songs.length} Şarkı</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MOBİL ALT GEZİNME BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121216] border-t border-zinc-800/80 flex items-center justify-around h-[56px] text-zinc-400 text-[10px]">
        <Link href="/" className="flex flex-col items-center gap-y-1 hover:text-white">
          <HomeIcon size={18} />
          <span>Ana Sayfa</span>
        </Link>
        <button
          onClick={() => {
            setActiveTab("favorites");
            setSelectedPlaylistId(null);
          }}
          className={`flex flex-col items-center gap-y-1 ${
            activeTab === "favorites" ? "text-white" : "hover:text-white"
          }`}
        >
          <Heart size={18} />
          <span>Favoriler</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("playlists");
          }}
          className={`flex flex-col items-center gap-y-1 ${
            activeTab === "playlists" ? "text-white" : "hover:text-white"
          }`}
        >
          <LibraryIcon size={18} />
          <span>Listelerim</span>
        </button>
      </nav>
    </div>
  );
}