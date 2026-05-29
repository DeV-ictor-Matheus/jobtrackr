import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  tone?: "default" | "danger";
  children: ReactNode;
}

export default function SettingsSection({
  title,
  description,
  tone = "default",
  children,
}: SettingsSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-[#111111] p-5",
        tone === "danger" ? "border-red-500/30" : "border-zinc-800",
      )}
    >
      <div className="flex flex-col gap-1">
        <h2
          className={cn(
            "text-sm font-medium",
            tone === "danger" ? "text-red-400" : "text-neutral-100",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="text-xs text-zinc-400">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
