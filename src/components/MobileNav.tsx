"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-around py-2.5 border-t border-zinc-800/80 bg-[#09090b]">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${
          pathname === "/" ? "text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <Home size={18} />
        Ana Sayfa
      </Link>

      <Link
        href="/library"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${
          pathname === "/library" ? "text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <Library size={18} />
        Menü & Kütüphane
      </Link>
    </nav>
  );
}