"use client";

import { useCallback, useEffect, useState } from "react";

import {
  applyFontScale,
  DEFAULT_FONT_SCALE,
  readStoredFontScale,
  storeFontScale,
  type FontScaleId,
} from "@/lib/utils/fontScale";

export function useFontScale() {
  const [fontScale, setFontScaleState] = useState<FontScaleId>(
    DEFAULT_FONT_SCALE,
  );

  // The inline script in the root layout already applied the stored value to
  // avoid a flash; here we only sync React state to what is persisted.
  useEffect(() => {
    setFontScaleState(readStoredFontScale());
  }, []);

  const setFontScale = useCallback((id: FontScaleId) => {
    setFontScaleState(id);
    applyFontScale(id);
    storeFontScale(id);
  }, []);

  return { fontScale, setFontScale };
}
