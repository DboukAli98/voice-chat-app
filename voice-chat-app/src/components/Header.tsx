import { memo } from "react";
import { MessageSquare, Mic, Settings, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import type { AppMode } from "../types";

export const Header = memo(function Header() {
  const { mode, setMode, toggleSettings, voiceStatus } = useAppStore();

  const modes: { key: AppMode; icon: typeof MessageSquare; label: string }[] = [
    { key: "text", icon: MessageSquare, label: "Text" },
    { key: "voice", icon: Mic, label: "Voice" },
  ];

  return (
    <header className="relative z-20 flex items-center justify-between px-5 py-3 border-b border-glass-border/50">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center w-9 h-9">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-blue/30 to-neon-cyan/20 glow-blue" />
          <Zap className="relative w-5 h-5 text-neon-cyan" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-display text-sm font-bold tracking-wider text-text-primary uppercase leading-none">
            NEXUS
          </h1>
          <p className="font-mono text-[10px] text-text-muted tracking-widest mt-0.5">
            AI VOICE AGENT
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl glass">
        {modes.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-colors duration-200"
          >
            {mode === key && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-blue/20 to-neon-cyan/10 border border-neon-blue/30"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              className={`relative w-3.5 h-3.5 ${
                mode === key ? "text-neon-cyan" : "text-text-muted"
              }`}
            />
            <span
              className={`relative ${
                mode === key ? "text-text-primary" : "text-text-muted"
              }`}
            >
              {label}
            </span>
            {/* Live indicator for voice */}
            {key === "voice" && voiceStatus === "connected" && (
              <span className="relative w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Settings */}
      <button
        onClick={toggleSettings}
        className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-4.5 h-4.5" />
      </button>
    </header>
  );
});
