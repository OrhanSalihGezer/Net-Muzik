import { create } from "zustand";

export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

interface PlayerStore {
  activeSong: Song | null;
  isPlaying: boolean;
  myLibrary: Song[];
  userPlaylists: Playlist[];
  isMuted: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  nextSong: () => void;
  previousSong: () => void;
  addToLibrary: (song: Song) => void;
  removeFromLibrary: (id: string) => void;
  createPlaylist: (name: string) => void;
  removePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  activeSong: null,
  isPlaying: false,
  myLibrary: [],
  userPlaylists: [],
  isMuted: false,

  playSong: (song) => set({ activeSong: song, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  nextSong: () => {},
  previousSong: () => {},

  addToLibrary: (song) =>
    set((state) => {
      const exists = state.myLibrary.some((s) => s.id === song.id);
      if (exists) return state;
      return { myLibrary: [...state.myLibrary, song] };
    }),

  removeFromLibrary: (id) =>
    set((state) => ({
      myLibrary: state.myLibrary.filter((s) => s.id !== id),
    })),

  createPlaylist: (name) =>
    set((state) => ({
      userPlaylists: [
        ...state.userPlaylists,
        { id: Date.now().toString(), name, songs: [] },
      ],
    })),

  removePlaylist: (id) =>
    set((state) => ({
      userPlaylists: state.userPlaylists.filter((p) => p.id !== id),
    })),

  addSongToPlaylist: (playlistId, song) =>
    set((state) => ({
      userPlaylists: state.userPlaylists.map((p) => {
        if (p.id === playlistId && !p.songs.some((s) => s.id === song.id)) {
          return { ...p, songs: [...p.songs, song] };
        }
        return p;
      }),
    })),
}));