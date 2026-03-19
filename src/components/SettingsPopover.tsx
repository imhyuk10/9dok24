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
                <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
                  <button
                    onClick={() => setLang("ko")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      lang === "ko"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FlagKR className="w-4 h-3 rounded-sm overflow-hidden" />
                    한국어
                  </button>
                  <button
                    onClick={() => setLang("en")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      lang === "en"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FlagGB className="w-4 h-3 rounded-sm overflow-hidden" />
                    English
                  </button>
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
