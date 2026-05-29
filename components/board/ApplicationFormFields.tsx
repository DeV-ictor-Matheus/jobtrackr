"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { boardColumns } from "@/components/board/boardColumns";
import type {
  Application,
  ApplicationStatus,
  NewApplication,
} from "@/types/application";

export interface ApplicationFormValues {
  company: string;
  role: string;
  platform: string;
  stack: string;
  status: ApplicationStatus;
  apply_date: string;
  link: string;
  notes: string;
}

export const emptyApplicationForm: ApplicationFormValues = {
  company: "",
  role: "",
  platform: "",
  stack: "",
  status: "applied",
  apply_date: "",
  link: "",
  notes: "",
};

export function applicationToFormValues(
  application: Application,
): ApplicationFormValues {
  return {
    company: application.company,
    role: application.role,
    platform: application.platform ?? "",
    stack: application.stack ?? "",
    status: application.status,
    apply_date: application.apply_date ?? "",
    link: application.link ?? "",
    notes: application.notes ?? "",
  };
}

export function formValuesToNewApplication(
  values: ApplicationFormValues,
): NewApplication {
  const toNullable = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  return {
    company: values.company.trim(),
    role: values.role.trim(),
    platform: toNullable(values.platform),
    stack: toNullable(values.stack),
    status: values.status,
    apply_date: toNullable(values.apply_date),
    link: toNullable(values.link),
    notes: toNullable(values.notes),
  };
}

interface ApplicationFormFieldsProps {
  values: ApplicationFormValues;
  onChange: (values: ApplicationFormValues) => void;
}

export default function ApplicationFormFields({
  values,
  onChange,
}: ApplicationFormFieldsProps) {
  function setField<Key extends keyof ApplicationFormValues>(
    key: Key,
    value: ApplicationFormValues[Key],
  ) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="company">Empresa</Label>
        <Input
          id="company"
          value={values.company}
          onChange={(event) => setField("company", event.target.value)}
          required
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="role">Vaga</Label>
        <Input
          id="role"
          value={values.role}
          onChange={(event) => setField("role", event.target.value)}
          required
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Select
          value={values.status}
          onValueChange={(value) =>
            setField("status", value as ApplicationStatus)
          }
        >
          <SelectTrigger id="status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {boardColumns.map(({ status, label }) => (
              <SelectItem key={status} value={status}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="platform">Plataforma</Label>
          <Input
            id="platform"
            value={values.platform}
            onChange={(event) => setField("platform", event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="apply_date">Data</Label>
          <Input
            id="apply_date"
            type="date"
            value={values.apply_date}
            onChange={(event) => setField("apply_date", event.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="stack">Tecnologias</Label>
        <Input
          id="stack"
          value={values.stack}
          onChange={(event) => setField("stack", event.target.value)}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="link">Link da vaga</Label>
        <Input
          id="link"
          type="url"
          value={values.link}
          onChange={(event) => setField("link", event.target.value)}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={values.notes}
          onChange={(event) => setField("notes", event.target.value)}
        />
      </div>
    </div>
  );
}
