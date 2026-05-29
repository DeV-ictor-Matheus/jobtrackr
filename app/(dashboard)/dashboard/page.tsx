import { Briefcase, Clock, Trophy, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <h1 className="font-heading text-xl font-semibold">Painel</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total" value={summary.total} icon={Briefcase} />
        <StatCard label="Em andamento" value={summary.inProgress} icon={Clock} />
        <StatCard label="Ofertas" value={summary.offers} icon={Trophy} />
        <StatCard label="Recusadas" value={summary.rejected} icon={XCircle} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Candidaturas por status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBarChart data={statusChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Candidaturas por mês</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ApplicationsTrendChart data={trendData} />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Ainda não há candidaturas para exibir.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
