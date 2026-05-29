import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#1a1a1a] p-4">
      <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <span className="text-xl font-semibold text-neutral-100">{value}</span>
      </div>
    </div>
  );
}
