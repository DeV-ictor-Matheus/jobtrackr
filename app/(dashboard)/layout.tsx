import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import MobileNav from "@/components/layout/MobileNav";
import { createClient } from "@/lib/supabase/server";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: proxy.ts already guards these routes, but the layout
  // must not render protected content if the session is missing.
  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email ?? "";

  return (
    <div className="flex min-h-svh">
      <DashboardSidebar userEmail={userEmail} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav userEmail={userEmail} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
