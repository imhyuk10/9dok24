import { useState, useEffect, useRef } from "react";
import { Settings, Moon, Sun, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/hooks/use-i18n";

interface SettingsPopoverProps {
  onApiSettings: () => void;
  onLogout: () => void;
}

// 국기 SVG 컴포넌트
function FlagKR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 600" className={className}>
      <rect fill="#FFFFFF" width="900" height="600" />
      <circle cx="450" cy="300" r="150" fill="#C60C30" />
      <path d="M450 150 A150 150 0 0 1 450 300 A75 75 0 0 0 450 450 A150 150 0 0 1 450 150" fill="#003478" />
      <path d="M450 225 A75 75 0 0 1 450 375" fill="#C60C30" />
    </svg>
  );
}

function FlagGB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className}>
      <rect fill="#012169" width="60" height="30" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FlagFR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className}>
      <rect fill="#002395" width="20" height="30" />
      <rect fill="#FFFFFF" x="20" width="20" height="30" />
      <rect fill="#ED2939" x="40" width="20" height="30" />
    </svg>
  );
}

function FlagCN({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className}>
      <rect fill="#DE2910" width="30" height="20" />
      <polygon fill="#FFDE00" points="5,2 6.2,5.8 10,5.8 7,8 8.2,11.8 5,9.5 1.8,11.8 3,8 0,5.8 3.8,5.8" />
      <polygon fill="#FFDE00" points="11,1 11.8,3.4 14.2,3.4 12.2,4.9 13,7.3 11,5.8 9,7.3 9.8,4.9 7.8,3.4 10.2,3.4" transform="rotate(25,11,4)" />
      <polygon fill="#FFDE00" points="14,4 14.8,6.4 17.2,6.4 15.2,7.9 16,10.3 14,8.8 12,10.3 12.8,7.9 10.8,6.4 13.2,6.4" transform="rotate(-25,14,7)" />
      <polygon fill="#FFDE00" points="14,8 14.8,10.4 17.2,10.4 15.2,11.9 16,14.3 14,12.8 12,14.3 12.8,11.9 10.8,10.4 13.2,10.4" transform="rotate(25,14,11)" />
      <polygon fill="#FFDE00" points="11,11 11.8,13.4 14.2,13.4 12.2,14.9 13,17.3 11,15.8 9,17.3 9.8,14.9 7.8,13.4 10.2,13.4" transform="rotate(-25,11,14)" />
    </svg>
  );
}

function FlagJP({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className}>
      <rect fill="#FFFFFF" width="30" height="20" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </svg>
  );
}

type LangOption = {
  code: "ko" | "en" | "fr" | "zh" | "ja";
  label: string;
  Flag: ({ className }: { className?: string }) => JSX.Element;
};

const LANG_OPTIONS: LangOption[] = [
  { code: "ko", label: "한국어", Flag: FlagKR },
  { code: "en", label: "EN",    Flag: FlagGB },
  { code: "fr", label: "FR",    Flag: FlagFR },
  { code: "zh", label: "中文",  Flag: FlagCN },
  { code: "ja", label: "日本語", Flag: FlagJP },
];

export default function SettingsPopover({ onApiSettings, onLogout }: SettingsPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t, lang, setLang } = useI18n();

  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    if (typeof localStorage !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        title={t("settingsMenu.title")}
      >
        <Settings className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">{t("settingsMenu.title")}</h3>
            </div>

            <div className="p-2 space-y-1">
              {/* 테마 */}
              <div className="px-3 py-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("settingsMenu.theme")}</p>
                <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
                  <button
                    onClick={() => setThemeState("light")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      theme === "light"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    {t("settingsMenu.light")}
                  </button>
                  <button
                    onClick={() => setThemeState("dark")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      theme === "dark"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    {t("settingsMenu.dark")}
                  </button>
                </div>
              </div>

              {/* 언어 */}
              <div className="px-3 py-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("settingsMenu.language")}</p>
                <div className="grid grid-cols-5 gap-1 bg-secondary/50 rounded-lg p-1">
                  {LANG_OPTIONS.map(({ code, label, Flag }) => (
                    <button
                      key={code}
                      onClick={() => setLang(code)}
                      title={label}
                      className={`flex flex-col items-center gap-1 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                        lang === code
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Flag className="w-5 h-3.5 rounded-[2px] overflow-hidden" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border mt-1 pt-1">
                {/* API 설정 */}
                <button
                  onClick={() => { setOpen(false); onApiSettings(); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  {t("settingsMenu.apiSettings")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* 로그아웃 */}
                <button
                  onClick={() => { setOpen(false); onLogout(); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all"
                >
                  {t("settingsMenu.logout")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
