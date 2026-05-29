import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Application,
  ApplicationStatus,
  NewApplication,
} from "@/types/application";

export async function getApplications(
  supabase: SupabaseClient,
): Promise<Application[] | null> {
  // RLS restricts the result to the logged user's rows (auth.uid() = user_id)
  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch applications:", error.message);
    return null;
  }

  return applications as Application[];
}

export async function createApplication(
  supabase: SupabaseClient,
  userId: string,
  application: NewApplication,
): Promise<Application | null> {
  const { data: createdApplication, error } = await supabase
    .from("applications")
    .insert({ ...application, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error("Failed to create application:", error.message);
    return null;
  }

  return createdApplication as Application;
}

export async function updateApplication(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<NewApplication>,
): Promise<Application | null> {
  const { data: updatedApplication, error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update application:", error.message);
    return null;
  }

  return updatedApplication as Application;
}

export async function updateApplicationStatus(
  supabase: SupabaseClient,
  id: string,
  status: ApplicationStatus,
): Promise<Application | null> {
  const { data: updatedApplication, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update application status:", error.message);
    return null;
  }

  return updatedApplication as Application;
}

export async function deleteApplication(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.from("applications").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete application:", error.message);
    return false;
  }

  return true;
}
