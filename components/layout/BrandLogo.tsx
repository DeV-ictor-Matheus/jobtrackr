import { Briefcase, Check } from "lucide-react";

type BrandLogoSize = "sm" | "lg" | "xl";

interface BrandLogoProps {
  size?: BrandLogoSize;
  className?: string;
}

const sizeStyles: Record<
  BrandLogoSize,
  { box: string; icon: string; badge: string; check: string; text: string }
> = {
  sm: {
    box: "size-8",
    icon: "size-4.5",
    badge: "size-4",
    check: "size-2.5",
    text: "text-lg",
  },
  lg: {
    box: "size-12",
    icon: "size-7",
    badge: "size-5.5",
    check: "size-3.5",
    text: "text-2xl",
  },
  xl: {
    box: "size-16",
    icon: "size-9",
    badge: "size-6",
    check: "size-4",
    text: "text-3xl",
  },
};

export default function BrandLogo({
  size = "sm",
  className,
}: BrandLogoProps) {
  const styles = sizeStyles[size];

  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span
        className={`relative flex ${styles.box} items-center justify-center rounded-lg bg-indigo-500 text-white shadow-lg shadow-indigo-500/30`}
      >
        <Briefcase className={styles.icon} strokeWidth={2.25} />
        <span
          className={`absolute -right-1 -bottom-1 flex ${styles.badge} items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-[#1a1a1a] text-indigo-400`}
        >
          <Check className={styles.check} strokeWidth={3.5} />
        </span>
      </span>
      <span className={`${styles.text} font-bold tracking-tight text-neutral-100`}>
        <span className="text-indigo-400">J</span>ob
        <span className="text-indigo-400">T</span>rackr
      </span>
    </span>
  );
}
