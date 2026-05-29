"use client";

import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import ColumnHeader from "@/components/board/ColumnHeader";
import DraggableApplicationCard from "@/components/board/DraggableApplicationCard";
import type { Application, ApplicationStatus } from "@/types/application";

interface BoardColumnProps {
  status: ApplicationStatus;
  label: string;
  dotClassName: string;
  applications: Application[];
  onSelectApplication: (application: Application) => void;
}

export default function BoardColumn({
  status,
  label,
  dotClassName,
  applications,
  onSelectApplication,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-80 shrink-0 flex-col gap-4 rounded-xl border border-zinc-800 bg-[#111111] p-4 transition-colors",
        isOver && "border-indigo-500/60 bg-[#161616]",
      )}
    >
      <ColumnHeader
        label={label}
        count={applications.length}
        dotClassName={dotClassName}
      />
      <div className="flex flex-col gap-3">
        {applications.map((application) => (
          <DraggableApplicationCard
            key={application.id}
            application={application}
            onSelect={onSelectApplication}
          />
        ))}
      </div>
    </div>
  );
}
