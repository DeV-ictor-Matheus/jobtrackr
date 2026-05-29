import type { Application } from "@/types/application";

interface ApplicationCardProps {
  application: Application;
}

const tagStyles =
  "inline-flex w-fit items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400";

export default function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-[#1a1a1a] p-4 transition-all hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-neutral-100">
          {application.company}
        </span>
        <span className="text-sm font-normal text-zinc-400">
          {application.role}
        </span>
      </div>
      {application.platform || application.stack ? (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {application.platform ? (
            <span className={tagStyles}>{application.platform}</span>
          ) : null}
          {application.stack ? (
            <span className={tagStyles}>{application.stack}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
