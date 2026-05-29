import { cn } from "@/lib/utils";

interface ColumnHeaderProps {
  label: string;
  count: number;
  dotClassName: string;
}

export default function ColumnHeader({
  label,
  count,
  dotClassName,
}: ColumnHeaderProps) {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span className={cn("size-2.5 rounded-full", dotClassName)} />
      <span className="text-sm font-medium text-neutral-100">{label}</span>
      <span className="ml-auto flex min-w-6 items-center justify-center rounded-full border border-zinc-800 bg-[#1a1a1a] px-2 py-0.5 text-xs font-medium text-zinc-400">
        {count}
      </span>
    </div>
  );
}
