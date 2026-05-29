import BoardClient from "@/components/board/BoardClient";
import { getApplications } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function BoardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const applications = await getApplications(supabase);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">Candidaturas</h1>
      <BoardClient
        userId={user?.id ?? ""}
        initialApplications={applications ?? []}
      />
    </div>
  );
}
