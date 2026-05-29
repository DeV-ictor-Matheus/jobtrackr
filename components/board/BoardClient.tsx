"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import ApplicationCard from "@/components/board/ApplicationCard";
import ApplicationModal from "@/components/board/ApplicationModal";
import BoardColumn from "@/components/board/BoardColumn";
import { boardColumns } from "@/components/board/boardColumns";
import { createClient } from "@/lib/supabase/client";
import { updateApplicationStatus } from "@/lib/supabase/queries";
import type { Application, ApplicationStatus } from "@/types/application";

interface BoardClientProps {
  userId: string;
  initialApplications: Application[];
}

export default function BoardClient({
  userId,
  initialApplications,
}: BoardClientProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeApplication, setActiveApplication] =
    useState<Application | null>(null);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Small distance prevents a click from being interpreted as a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function openCreateModal() {
    setEditingApplication(null);
    setIsModalOpen(true);
  }

  function openEditModal(application: Application) {
    setEditingApplication(application);
    setIsModalOpen(true);
  }

  function handleSaved(savedApplication: Application) {
    setApplications((current) => {
      const exists = current.some((item) => item.id === savedApplication.id);
      return exists
        ? current.map((item) =>
            item.id === savedApplication.id ? savedApplication : item,
          )
        : [savedApplication, ...current];
    });
  }

  function handleDeleted(id: string) {
    setApplications((current) => current.filter((item) => item.id !== id));
  }

  function handleDragStart(event: DragStartEvent) {
    const dragged = applications.find((item) => item.id === event.active.id);
    setActiveApplication(dragged ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveApplication(null);

    const { active, over } = event;
    if (!over) return;

    const applicationId = String(active.id);
    const nextStatus = String(over.id) as ApplicationStatus;
    const movedApplication = applications.find(
      (item) => item.id === applicationId,
    );

    if (!movedApplication || movedApplication.status === nextStatus) return;

    const previousApplications = applications;
    // Optimistic update: reflect the move immediately so the board feels instant.
    setApplications((current) =>
      current.map((item) =>
        item.id === applicationId ? { ...item, status: nextStatus } : item,
      ),
    );
    setErrorMessage(null);

    const supabase = createClient();
    const updatedApplication = await updateApplicationStatus(
      supabase,
      applicationId,
      nextStatus,
    );

    if (!updatedApplication) {
      setApplications(previousApplications);
      setErrorMessage("Não foi possível mover a candidatura. Tente novamente.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {errorMessage ? (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : (
          <span />
        )}
        <Button onClick={openCreateModal}>
          <Plus className="size-4" />
          Nova candidatura
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-2">
          {boardColumns.map(({ status, label, dotClassName }) => (
            <BoardColumn
              key={status}
              status={status}
              label={label}
              dotClassName={dotClassName}
              applications={applications.filter(
                (item) => item.status === status,
              )}
              onSelectApplication={openEditModal}
            />
          ))}
        </div>
        <DragOverlay>
          {activeApplication ? (
            <ApplicationCard application={activeApplication} />
          ) : null}
        </DragOverlay>
      </DndContext>
      <ApplicationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        userId={userId}
        application={editingApplication}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
