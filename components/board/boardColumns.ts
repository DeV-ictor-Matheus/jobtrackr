import type { ApplicationStatus } from "@/types/application";

export interface BoardColumnConfig {
  status: ApplicationStatus;
  label: string;
  dotClassName: string;
}

export const boardColumns: BoardColumnConfig[] = [
  { status: "applied", label: "Aplicada", dotClassName: "bg-indigo-500" },
  { status: "test", label: "Teste", dotClassName: "bg-amber-500" },
  { status: "interview", label: "Entrevista", dotClassName: "bg-blue-500" },
  { status: "offer", label: "Oferta", dotClassName: "bg-emerald-500" },
  { status: "rejected", label: "Recusada", dotClassName: "bg-red-500" },
];
