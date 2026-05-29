"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import ApplicationCard from "@/components/board/ApplicationCard";
import type { Application } from "@/types/application";

interface DraggableApplicationCardProps {
  application: Application;
  onSelect: (application: Application) => void;
}

export default function DraggableApplicationCard({
  application,
  onSelect,
}: DraggableApplicationCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: application.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab touch-none active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
      onClick={() => onSelect(application)}
      {...listeners}
      {...attributes}
    >
      <ApplicationCard application={application} />
    </div>
  );
}
