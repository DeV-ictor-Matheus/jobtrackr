import { boardColumns } from "@/components/board/boardColumns";
import type { Application } from "@/types/application";

const statusLabels = new Map(
  boardColumns.map(({ status, label }) => [status, label]),
);

interface CsvColumn {
  header: string;
  value: (application: Application) => string;
}

const csvColumns: CsvColumn[] = [
  { header: "Empresa", value: (application) => application.company },
  { header: "Vaga", value: (application) => application.role },
  { header: "Plataforma", value: (application) => application.platform ?? "" },
  { header: "Stack", value: (application) => application.stack ?? "" },
  {
    header: "Status",
    value: (application) =>
      statusLabels.get(application.status) ?? application.status,
  },
  {
    header: "Data da candidatura",
    value: (application) => application.apply_date ?? "",
  },
  { header: "Link", value: (application) => application.link ?? "" },
  { header: "Notas", value: (application) => application.notes ?? "" },
];

function escapeCsvValue(value: string): string {
  // Wrap in quotes when the value contains a delimiter, quote or line break.
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildApplicationsCsv(applications: Application[]): string {
  const headerRow = csvColumns.map((column) => column.header).join(",");
  const dataRows = applications.map((application) =>
    csvColumns
      .map((column) => escapeCsvValue(column.value(application)))
      .join(","),
  );

  return [headerRow, ...dataRows].join("\r\n");
}
