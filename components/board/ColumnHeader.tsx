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
    <div className="flex items-center gap-2 px-1">
      <span className={cn("size-2 rounded-full", dotClassName)} />
      <span className="text-sm font-medium">{label}</span>
      <span className="ml-auto text-xs text-muted-foreground">{count}</span>
    </div>
  );
}
