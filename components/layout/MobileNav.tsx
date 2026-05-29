"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BrandLogo from "@/components/layout/BrandLogo";
import SidebarNav from "@/components/layout/SidebarNav";
import SignOutButton from "@/components/layout/SignOutButton";

interface MobileNavProps {
  userEmail: string;
}

export default function MobileNav({ userEmail }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex items-center gap-2 border-b border-zinc-800 bg-[#111111] px-4 py-3 md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menu"
            className="text-zinc-400 hover:bg-zinc-800/60 hover:text-neutral-100"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 border-zinc-800 bg-[#111111] p-0"
        >
          <SheetHeader className="flex-row items-center border-b border-zinc-800 px-5">
            <SheetTitle className="sr-only">JobTrackr</SheetTitle>
            <BrandLogo />
          </SheetHeader>
          <div className="flex-1 px-3 py-4">
            <SidebarNav onNavigate={() => setIsOpen(false)} />
          </div>
          <div className="border-t border-zinc-800 p-3">
            <p className="truncate px-3 py-1 text-xs text-zinc-400">
              {userEmail}
            </p>
            <SignOutButton />
          </div>
        </SheetContent>
      </Sheet>
      <BrandLogo />
    </header>
  );
}
