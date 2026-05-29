import type { Application, ApplicationStatus } from "@/types/application";

const monthAbbreviations = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export interface ApplicationSummary {
  total: number;
  inProgress: number;
  offers: number;
  rejected: number;
}

export interface MonthlyCount {
  month: string;
  label: string;
  count: number;
}

export function countByStatus(
  applications: Application[],
): Record<ApplicationStatus, number> {
  const counts: Record<ApplicationStatus, number> = {
    applied: 0,
    test: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };

  for (const application of applications) {
    counts[application.status] += 1;
  }

  return counts;
}

export function summarize(applications: Application[]): ApplicationSummary {
  const counts = countByStatus(applications);

  return {
    total: applications.length,
    inProgress: counts.applied + counts.test + counts.interview,
    offers: counts.offer,
    rejected: counts.rejected,
  };
}

export function countByMonth(applications: Application[]): MonthlyCount[] {
  const buckets = new Map<string, number>();

  for (const application of applications) {
    // Prefer the apply date; fall back to creation date when it is missing.
    const date = new Date(application.apply_date ?? application.created_at);
    if (Number.isNaN(date.getTime())) continue;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(monthKey, (buckets.get(monthKey) ?? 0) + 1);
  }

  return [...buckets.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([month, count]) => {
      const [year, monthNumber] = month.split("-");
      const label = `${monthAbbreviations[Number(monthNumber) - 1]}/${year.slice(2)}`;
      return { month, label, count };
    });
}
