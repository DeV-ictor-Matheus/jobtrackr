"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApplicationFormFields, {
  applicationToFormValues,
  emptyApplicationForm,
  formValuesToNewApplication,
  type ApplicationFormValues,
} from "@/components/board/ApplicationFormFields";
import { createClient } from "@/lib/supabase/client";
import {
  createApplication,
  deleteApplication,
  updateApplication,
} from "@/lib/supabase/queries";
import type { Application } from "@/types/application";

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  application: Application | null;
  onSaved: (application: Application) => void;
  onDeleted: (id: string) => void;
}

export default function ApplicationModal({
  open,
  onOpenChange,
  userId,
  application,
  onSaved,
  onDeleted,
}: ApplicationModalProps) {
  const isEditing = application !== null;
  const [values, setValues] =
    useState<ApplicationFormValues>(emptyApplicationForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset the form whenever the modal opens for a new or different application.
  useEffect(() => {
    if (open) {
      setValues(
        application ? applicationToFormValues(application) : emptyApplicationForm,
      );
      setErrorMessage(null);
    }
  }, [open, application]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const supabase = createClient();
    const payload = formValuesToNewApplication(values);
    const savedApplication = isEditing
      ? await updateApplication(supabase, application.id, payload)
      : await createApplication(supabase, userId, payload);

    setIsSaving(false);

    if (!savedApplication) {
      setErrorMessage("Não foi possível salvar a candidatura. Tente novamente.");
      return;
    }

    onSaved(savedApplication);
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!application) return;

    setIsDeleting(true);
    setErrorMessage(null);

    const supabase = createClient();
    const wasDeleted = await deleteApplication(supabase, application.id);

    setIsDeleting(false);

    if (!wasDeleted) {
      setErrorMessage("Não foi possível excluir a candidatura. Tente novamente.");
      return;
    }

    onDeleted(application.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar candidatura" : "Nova candidatura"}
          </DialogTitle>
          <DialogDescription>Empresa e vaga são obrigatórias.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ApplicationFormFields values={values} onChange={setValues} />
          {errorMessage ? (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <DialogFooter className="sm:justify-between">
            {isEditing ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
              >
                <Trash2 className="size-4" />
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={isSaving || isDeleting}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
