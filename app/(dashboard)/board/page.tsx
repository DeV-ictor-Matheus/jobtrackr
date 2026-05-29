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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-50">
          Candidaturas
        </h1>
        <p className="text-sm text-zinc-400">
          Acompanhe cada etapa do seu processo seletivo.
        </p>
      </div>
      <BoardClient
        userId={user?.id ?? ""}
        initialApplications={applications ?? []}
      />
    </div>
  );
}
