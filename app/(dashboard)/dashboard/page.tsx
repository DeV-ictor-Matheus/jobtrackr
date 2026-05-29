import { Briefcase, Clock, Trophy, XCircle } from "lucide-react";

import ApplicationsTrendChart from "@/components/dashboard/ApplicationsTrendChart";
import StatCard from "@/components/dashboard/StatCard";
import StatusBarChart from "@/components/dashboard/StatusBarChart";
import { statusColors } from "@/components/dashboard/statusColors";
import { boardColumns } from "@/components/board/boardColumns";
import {
  countByMonth,
  countByStatus,
  summarize,
} from "@/lib/utils/applicationStats";
import { getApplications } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const applications = (await getApplications(supabase)) ?? [];

  const summary = summarize(applications);
  const statusCounts = countByStatus(applications);
  const statusChartData = boardColumns.map(({ status, label }) => ({
    label,
    count: statusCounts[status],
    color: statusColors[status],
  }));
  const trendData = countByMonth(applications);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-50">
          Painel
        </h1>
        <p className="text-sm text-zinc-400">
          Uma visão geral de todas as suas candidaturas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={summary.total} icon={Briefcase} />
        <StatCard label="Em andamento" value={summary.inProgress} icon={Clock} />
        <StatCard label="Ofertas" value={summary.offers} icon={Trophy} />
        <StatCard label="Recusadas" value={summary.rejected} icon={XCircle} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-[#111111] p-5">
          <h2 className="text-sm font-medium text-neutral-100">
            Candidaturas por status
          </h2>
          <StatusBarChart data={statusChartData} />
        </section>
        <section className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-[#111111] p-5">
          <h2 className="text-sm font-medium text-neutral-100">
            Candidaturas por mês
          </h2>
          {trendData.length > 0 ? (
            <ApplicationsTrendChart data={trendData} />
          ) : (
            <p className="py-12 text-center text-sm text-zinc-400">
              Ainda não há candidaturas para exibir.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
