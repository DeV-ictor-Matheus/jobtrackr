import { Briefcase } from "lucide-react";

import SidebarNav from "@/components/layout/SidebarNav";
import SignOutButton from "@/components/layout/SignOutButton";

interface DashboardSidebarProps {
  userEmail: string;
}

export default function DashboardSidebar({ userEmail }: DashboardSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Briefcase className="size-4" />
        </span>
        <span className="font-heading text-base font-semibold text-sidebar-foreground">
          JobTrackr
        </span>
      </div>
      <div className="flex-1 px-2">
        <SidebarNav />
      </div>
      <div className="border-t border-sidebar-border p-2">
        <p className="truncate px-3 py-1 text-xs text-sidebar-foreground/60">
          {userEmail}
        </p>
        <SignOutButton />
      </div>
    </aside>
  );
}
