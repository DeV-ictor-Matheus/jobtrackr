import type { ApplicationStatus } from "@/types/application";

export const statusColors: Record<ApplicationStatus, string> = {
  applied: "#6366f1",
  test: "#f59e0b",
  interview: "#3b82f6",
  offer: "#10b981",
  rejected: "#ef4444",
};
