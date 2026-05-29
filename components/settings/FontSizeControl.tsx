"use client";

import { useFontScale } from "@/lib/hooks/useFontScale";
import { FONT_SCALE_OPTIONS } from "@/lib/utils/fontScale";
import { cn } from "@/lib/utils";

const PREVIEW_SIZES: Record<string, string> = {
  small: "text-sm",
  default: "text-base",
  large: "text-lg",
  xlarge: "text-xl",
};

export default function FontSizeControl() {
  const { fontScale, setFontScale } = useFontScale();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FONT_SCALE_OPTIONS.map((option) => {
          const isActive = option.id === fontScale;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setFontScale(option.id)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border bg-[#0a0a0a] px-3 py-4 transition-colors",
                isActive
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                  : "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-neutral-100",
              )}
            >
              <span
                className={cn(
                  "font-semibold leading-none",
                  PREVIEW_SIZES[option.id],
                )}
              >
                {option.description}
              </span>
              <span className="text-xs">{option.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-zinc-500">
        A preferência é salva neste navegador e aplicada em todo o JobTrackr.
      </p>
    </div>
  );
}
