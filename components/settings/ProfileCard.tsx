import { UserRound } from "lucide-react";

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl: string | null;
}

export default function ProfileCard({
  name,
  email,
  avatarUrl,
}: ProfileCardProps) {
  return (
    <div className="flex items-center gap-4">
      {avatarUrl ? (
        // Google profile photo is served from an external host; a plain img
        // avoids configuring remote patterns for next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name}
          referrerPolicy="no-referrer"
          className="size-14 rounded-full border border-zinc-800 object-cover"
        />
      ) : (
        <span className="flex size-14 items-center justify-center rounded-full border border-zinc-800 bg-indigo-500/10 text-indigo-400">
          <UserRound className="size-6" />
        </span>
      )}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-base font-semibold text-neutral-50">
          {name}
        </span>
        <span className="truncate text-sm text-zinc-400">{email}</span>
      </div>
    </div>
  );
}
