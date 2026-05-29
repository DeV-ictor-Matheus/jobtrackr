import type { ApplicationStatus } from "@/types/application";

export const statusColors: Record<ApplicationStatus, string> = {
  applied: "#3b82f6",
  test: "#f59e0b",
  interview: "#8b5cf6",
  offer: "#10b981",
  rejected: "#f43f5e",
};
