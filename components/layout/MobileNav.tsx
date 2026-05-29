"use client";

import { useState } from "react";
import { Briefcase, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SidebarNav from "@/components/layout/SidebarNav";
import SignOutButton from "@/components/layout/SignOutButton";

interface MobileNavProps {
  userEmail: string;
}

export default function MobileNav({ userEmail }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex items-center gap-2 border-b border-border bg-background px-4 py-3 md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Abrir menu">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="flex-row items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="size-4" />
            </span>
            <SheetTitle>JobTrackr</SheetTitle>
          </SheetHeader>
          <div className="flex-1 px-2">
            <SidebarNav onNavigate={() => setIsOpen(false)} />
          </div>
          <div className="border-t border-border p-2">
            <p className="truncate px-3 py-1 text-xs text-muted-foreground">
              {userEmail}
            </p>
            <SignOutButton />
          </div>
        </SheetContent>
      </Sheet>
      <span className="font-heading text-base font-semibold">JobTrackr</span>
    </header>
  );
}
