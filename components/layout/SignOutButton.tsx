"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Failed to sign out:", error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={handleSignOut}
    >
      <LogOut className="size-4" />
      Sair
    </Button>
  );
}
