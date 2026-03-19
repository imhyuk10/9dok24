import { useState, useEffect, useCallback } from "react";
import { getLang, setLang, onLangChange, t, type TranslationKey } from "@/lib/i18n";

export function useI18n() {
  const [, rerender] = useState(0);

  useEffect(() => onLangChange(() => rerender((n) => n + 1)), []);

  const translate = useCallback((key: TranslationKey) => t(key), []);
  const lang = getLang();

  return { t: translate, lang, setLang };
}
