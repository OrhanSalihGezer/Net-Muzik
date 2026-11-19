"use client";

import { useState, useEffect } from "react";
import { usePlayerStore, Song } from "@/store/usePlayerStore";
import { Search, Heart, Plus, X, Check, Library, Music, Home as HomeIcon } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Tümü", "Türkçe Pop", "Rap", "Rock", "Arabesk", "Lo-Fi", "Oyun & Chill"];

const cleanText = (text: string) => {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
};

export default function Home() {
  const {
    playSong,
    activeSong,
    addToLibrary,
    myLibrary,
    userPlaylists,
    addSongToPlaylist,
    createPlaylist,
  } = usePlayerStore();

  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState<Song | null>(null);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const fetchYouTubeMusic = async (query: string) => {
    setLoading(true);
    const apiKey =
      process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ||
      "AIzaSyDWXzKojg9WOwMrOI0aG1a6Tc9L-8KljEQ";

    try {
      const searchQueryString = `${query} official audio`;
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=24&q=${encodeURIComponent(
          searchQueryString
        )}&type=video&videoCategoryId=10&videoDuration=medium&key=${apiKey}`
      );
      const data = await res.json();

      if (data.items) {
        const formattedSongs: Song[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: cleanText(item.snippet.title),
          artist: cleanText(item.snippet.channelTitle),
          cover:
            item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default?.url,
          category: selectedCategory,
        }));
        setSearchResults(formattedSongs);
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query =
      searchQuery ||
      (selectedCategory === "Tümü" ? "Popüler Türkçe Şarkılar" : selectedCategory);
    const timer = setTimeout(() => {
      fetchYouTubeMusic(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleAddSongToPlaylist = (playlistId: string, song: Song) => {
    addSongToPlaylist(playlistId, song);
    setAddedSuccessId(playlistId);
    setTimeout(() => {
      setAddedSuccessId(null);
      setSongToAddToPlaylist(null);
    }, 600);
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName.trim());
    setNewPlaylistName("");
    setShowCreateModal(false);
  };

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
            className="flex items-center gap-x-3 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-white"
          >
            <HomeIcon size={18} /> Ana Sayfa
          </Link>
          <Link
            href="/library"
            className="flex items-center gap-x-3 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            <Heart size={18} className="text-red-500 fill-red-500" /> Favorilerim ({myLibrary.length})
          </Link>
        </div>

        <div className="flex-1 flex flex-col gap-y-2 overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 px-1">
            <span className="flex items-center gap-x-1.5">
              <Library size={16} /> Listelerim ({userPlaylists.length})
            </span>
            <button
              type="button"
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
                <Link
                  key={pl.id}
                  href="/library"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition truncate"
                >
                  <span className="truncate">{pl.name}</span>
                  <span className="text-[10px] text-zinc-500 shrink-0">{pl.songs.length}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* İÇERİK ALANI */}
      <main className="flex-1 p-3 sm:p-6 pb-44 w-full min-w-0 max-w-full overflow-hidden">
        {/* YENİ LİSTE OLUŞTURMA MODAL */}
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

        {/* LİSTEYE ŞARKI EKLE MODAL */}
        {songToAddToPlaylist && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#16161a] border border-zinc-800 rounded-xl p-5 w-full max-w-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div>
                  <h3 className="font-semibold text-xs text-zinc-400">ÇALMA LİSTESİNE EKLE</h3>
                  <p className="text-sm font-bold text-white truncate max-w-[240px]">
                    {songToAddToPlaylist.title}
                  </p>
                </div>
                <button type="button" onClick={() => setSongToAddToPlaylist(null)} className="text-zinc-400 hover:text-white p-1.5 rounded-full bg-zinc-800/50">
                  <X size={18} />
                </button>
              </div>

              {userPlaylists.length === 0 ? (
                <div className="py-4 text-center text-xs text-zinc-400 flex flex-col gap-3">
                  <span>Henüz hiç çalma listen yok.</span>
                  <button
                    onClick={() => {
                      setSongToAddToPlaylist(null);
                      setShowCreateModal(true);
                    }}
                    className="bg-white text-black py-2 rounded-lg font-semibold"
                  >
                    Yeni Liste Oluştur
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-y-2 max-h-60 overflow-y-auto py-1">
                  {userPlaylists.map((pl) => (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => handleAddSongToPlaylist(pl.id, songToAddToPlaylist)}
                      className="flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition text-left w-full"
                    >
                      <div>
                        <span className="text-xs font-semibold text-white block">{pl.name}</span>
                        <span className="text-[10px] text-zinc-400">{pl.songs.length} Şarkı</span>
                      </div>
                      {addedSuccessId === pl.id ? (
                        <span className="text-green-400 text-xs flex items-center gap-1 font-medium"><Check size={14} /> Eklendi</span>
                      ) : (
                        <span className="text-xs text-zinc-400 font-medium">+ Ekle</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ARAMA VE KATEGORİLER */}
        <div className="flex flex-col gap-3 mb-4 w-full min-w-0">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Şarkı veya sanatçı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 text-white pl-9 pr-3 py-2 rounded-lg text-xs border border-zinc-800 focus:outline-none focus:border-zinc-600 transition"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full pb-1 no-scrollbar shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchQuery("");
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-white text-black font-semibold"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ŞARKI KARTLARI */}
        {loading ? (
          <div className="text-center py-20 text-zinc-500 text-xs">Yükleniyor...</div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 text-xs">Şarkı bulunamadı.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 w-full min-w-0">
            {searchResults.map((song) => {
              const isLiked = myLibrary.some((s) => s.id === song.id);
              const isCurrentPlaying = activeSong?.id === song.id;

              return (
                <div
                  key={song.id}
                  className={`p-2 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden min-w-0 ${
                    isCurrentPlaying
                      ? "bg-zinc-800/90 border-zinc-500"
                      : "bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="flex flex-col gap-y-1.5 min-w-0">
                    <div
                      className="relative aspect-square w-full rounded-lg overflow-hidden cursor-pointer active:scale-95 transition bg-zinc-800"
                      onClick={() => playSong(song)}
                    >
                      <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                      {isCurrentPlaying && (
                        <div className="absolute top-1 left-1 bg-black/80 text-[8px] text-white px-1.5 py-0.5 rounded-full border border-white/20">
                          Çalıyor
                        </div>
                      )}
                    </div>

                    <div className="cursor-pointer min-w-0" onClick={() => playSong(song)}>
                      <h3 className="font-semibold text-[11px] text-zinc-100 line-clamp-2 leading-tight break-all">
                        {song.title}
                      </h3>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-x-1 mt-2 pt-1.5 border-t border-zinc-800/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToLibrary(song);
                      }}
                      className="p-1 text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      <Heart size={14} className={isLiked ? "text-red-500 fill-red-500" : "text-zinc-500"} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSongToAddToPlaylist(song);
                      }}
                      className="p-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MOBİL ALT GEZİNME BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121216] border-t border-zinc-800/80 flex items-center justify-around h-[56px] text-zinc-400 text-[10px]">
        <Link href="/" className="flex flex-col items-center gap-y-1 text-white">
          <HomeIcon size={18} />
          <span>Ana Sayfa</span>
        </Link>
        <Link href="/library" className="flex flex-col items-center gap-y-1 hover:text-white">
          <Heart size={18} />
          <span>Favoriler</span>
        </Link>
        <Link href="/library" className="flex flex-col items-center gap-y-1 hover:text-white">
          <Library size={18} />
          <span>Listelerim</span>
        </Link>
      </nav>
    </div>
  );
}