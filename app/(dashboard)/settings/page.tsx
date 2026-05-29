import { redirect } from "next/navigation";

import AccountSignOutButton from "@/components/settings/AccountSignOutButton";
import DisplayNameForm from "@/components/settings/DisplayNameForm";
import ExportApplicationsButton from "@/components/settings/ExportApplicationsButton";
import FontSizeControl from "@/components/settings/FontSizeControl";
import ProfileCard from "@/components/settings/ProfileCard";
import SettingsSection from "@/components/settings/SettingsSection";
import { getApplications } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: proxy.ts guards this route, but never render account
  // details without a session.
  if (!user) {
    redirect("/login");
  }

  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const email = user.email ?? "";
  const displayName =
    readString(metadata.display_name) ??
    readString(metadata.full_name) ??
    readString(metadata.name) ??
    "";
  const avatarUrl =
    readString(metadata.avatar_url) ?? readString(metadata.picture) ?? null;

  const applications = (await getApplications(supabase)) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-50">
          Configurações
        </h1>
        <p className="text-sm text-zinc-400">
          Gerencie seu perfil, preferências e dados da conta.
        </p>
      </div>

      <div className="flex max-w-2xl flex-col gap-4">
        <SettingsSection
          title="Perfil"
          description="Sua conta conectada via Google."
        >
          <ProfileCard
            name={displayName || email}
            email={email}
            avatarUrl={avatarUrl}
          />
        </SettingsSection>

        <SettingsSection
          title="Preferências"
          description="Defina como seu nome aparece no JobTrackr."
        >
          <DisplayNameForm initialDisplayName={displayName} />
        </SettingsSection>

        <SettingsSection
          title="Acessibilidade"
          description="Ajuste o tamanho da fonte para facilitar a leitura."
        >
          <FontSizeControl />
        </SettingsSection>

        <SettingsSection
          title="Dados"
          description="Baixe um backup das suas candidaturas em formato CSV."
        >
          <ExportApplicationsButton applications={applications} />
        </SettingsSection>

        <SettingsSection
          title="Zona de perigo"
          description="Encerrar a sessão atual neste dispositivo."
          tone="danger"
        >
          <AccountSignOutButton />
        </SettingsSection>
      </div>
    </div>
  );
}
