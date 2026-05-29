import { Card } from "@/components/ui/card";
import type { Application } from "@/types/application";

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card size="sm" className="gap-1 px-3 py-2">
      <span className="text-sm leading-snug font-medium">{application.role}</span>
      <span className="text-xs text-muted-foreground">{application.company}</span>
      {application.platform ? (
        <span className="text-xs text-muted-foreground">
          {application.platform}
        </span>
      ) : null}
    </Card>
  );
}
