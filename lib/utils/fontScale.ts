export type FontScaleId = "small" | "default" | "large" | "xlarge";

export interface FontScaleOption {
  id: FontScaleId;
  label: string;
  description: string;
  // Percentage applied to the root <html> font-size. Tailwind sizes are
  // rem-based, so this scales the whole interface proportionally.
  percent: number;
}

export const FONT_SCALE_STORAGE_KEY = "jobtrackr:font-scale";

export const DEFAULT_FONT_SCALE: FontScaleId = "default";

export const FONT_SCALE_OPTIONS: FontScaleOption[] = [
  { id: "small", label: "Pequeno", description: "A", percent: 90 },
  { id: "default", label: "Padrão", description: "A", percent: 100 },
  { id: "large", label: "Grande", description: "A", percent: 112 },
  { id: "xlarge", label: "Muito grande", description: "A", percent: 125 },
];

export function getFontScaleOption(id: FontScaleId): FontScaleOption {
  return (
    FONT_SCALE_OPTIONS.find((option) => option.id === id) ??
    FONT_SCALE_OPTIONS[1]
  );
}

function isFontScaleId(value: unknown): value is FontScaleId {
  return FONT_SCALE_OPTIONS.some((option) => option.id === value);
}

export function readStoredFontScale(): FontScaleId {
  if (typeof window === "undefined") return DEFAULT_FONT_SCALE;

  const stored = window.localStorage.getItem(FONT_SCALE_STORAGE_KEY);
  return isFontScaleId(stored) ? stored : DEFAULT_FONT_SCALE;
}

export function applyFontScale(id: FontScaleId): void {
  if (typeof document === "undefined") return;

  const { percent } = getFontScaleOption(id);
  document.documentElement.style.fontSize = `${percent}%`;
}

export function storeFontScale(id: FontScaleId): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, id);
}
