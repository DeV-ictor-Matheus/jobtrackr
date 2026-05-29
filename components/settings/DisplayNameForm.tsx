"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface DisplayNameFormProps {
  initialDisplayName: string;
}

interface Feedback {
  type: "success" | "error";
  message: string;
}

export default function DisplayNameForm({
  initialDisplayName,
}: DisplayNameFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const trimmedName = displayName.trim();
  const isUnchanged = trimmedName === initialDisplayName.trim();

  async function handleSave() {
    if (!trimmedName || isSaving) return;

    setIsSaving(true);
    setFeedback(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { display_name: trimmedName, full_name: trimmedName },
    });

    setIsSaving(false);

    if (error) {
      console.error("Failed to update display name:", error.message);
      setFeedback({
        type: "error",
        message: "Não foi possível salvar. Tente novamente.",
      });
      return;
    }

    setFeedback({ type: "success", message: "Nome de exibição atualizado." });
    // Refresh server components so the profile and sidebar reflect the new name.
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="display-name" className="text-zinc-300">
          Nome de exibição
        </Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Como você quer ser chamado"
          className="max-w-sm border-zinc-800 bg-[#0a0a0a] text-neutral-100"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving || isUnchanged || !trimmedName}
          className="bg-indigo-500 text-white hover:bg-indigo-600"
        >
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
        {feedback ? (
          <span
            role="status"
            className={cn(
              "flex items-center gap-1 text-xs",
              feedback.type === "success" ? "text-emerald-400" : "text-red-400",
            )}
          >
            {feedback.type === "success" ? (
              <Check className="size-3.5" />
            ) : null}
            {feedback.message}
          </span>
        ) : null}
      </div>
    </div>
  );
}
