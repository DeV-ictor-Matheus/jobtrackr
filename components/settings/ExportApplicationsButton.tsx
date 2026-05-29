"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildApplicationsCsv } from "@/lib/utils/exportApplications";
import type { Application } from "@/types/application";

interface ExportApplicationsButtonProps {
  applications: Application[];
}

export default function ExportApplicationsButton({
  applications,
}: ExportApplicationsButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const hasApplications = applications.length > 0;

  function handleExport() {
    if (!hasApplications) return;

    const csv = buildApplicationsCsv(applications);
    // The BOM makes Excel detect UTF-8 and render accents correctly.
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `jobtrackr-candidaturas-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    const plural = applications.length > 1;
    setFeedback(
      `${applications.length} candidatura${plural ? "s" : ""} exportada${plural ? "s" : ""}.`,
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={handleExport}
        disabled={!hasApplications}
        className="border-zinc-800 bg-[#0a0a0a] text-neutral-100 hover:bg-zinc-800/60 hover:text-neutral-50"
      >
        <Download className="size-4" />
        Exportar candidaturas em CSV
      </Button>
      {feedback ? (
        <span role="status" className="text-xs text-emerald-400">
          {feedback}
        </span>
      ) : !hasApplications ? (
        <span className="text-xs text-zinc-500">
          Nenhuma candidatura para exportar.
        </span>
      ) : null}
    </div>
  );
}
