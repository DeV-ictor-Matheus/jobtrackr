import Link from "next/link";

import BrandLogo from "@/components/layout/BrandLogo";
import SidebarNav from "@/components/layout/SidebarNav";
import SignOutButton from "@/components/layout/SignOutButton";

interface DashboardSidebarProps {
  userEmail: string;
}

export default function DashboardSidebar({ userEmail }: DashboardSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-800 bg-[#111111] md:flex">
      <div className="flex items-center justify-center border-b border-zinc-800 bg-gradient-to-b from-indigo-500/10 to-transparent px-5 py-7">
        <Link
          href="/board"
          aria-label="Ir para o board"
          className="cursor-pointer rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <BrandLogo size="xl" />
        </Link>
      </div>
      <div className="flex-1 px-3 py-4">
        <SidebarNav />
      </div>
      <div className="border-t border-zinc-800 p-3">
        <p className="truncate px-3 py-1 text-xs text-zinc-400">{userEmail}</p>
        <SignOutButton />
      </div>
    </aside>
  );
}
