export type ApplicationStatus =
  | "applied"
  | "test"
  | "interview"
  | "offer"
  | "rejected";

export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  platform: string | null;
  stack: string | null;
  status: ApplicationStatus;
  apply_date: string | null;
  link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type NewApplication = Omit<
  Application,
  "id" | "user_id" | "created_at" | "updated_at"
>;
