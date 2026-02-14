import { memo } from "react";
import { X, Globe, User, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import type { Persona, Language, TTSVoice } from "../types";

const PERSONAS: { value: Persona; label: string; desc: string }[] = [
  { value: "english", label: "English", desc: "Clear & professional" },
  { value: "saudi", label: "Saudi", desc: "Saudi Arabic dialect" },
];

const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "ar", label: "العربية", flag: "🇸🇦" },
];

const VOICES: { value: TTSVoice; label: string; desc: string }[] = [
  { value: "alloy", label: "Alloy", desc: "Neutral" },
  { value: "echo", label: "Echo", desc: "Male, clear" },
  { value: "fable", label: "Fable", desc: "British" },
  { value: "onyx", label: "Onyx", desc: "Deep male" },
  { value: "nova", label: "Nova", desc: "Female, warm" },
  { value: "shimmer", label: "Shimmer", desc: "Female, soft" },
];

export const SettingsPanel = memo(function SettingsPanel() {
  const { settingsOpen, toggleSettings, config, updateConfig } = useAppStore();

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettings}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-80 glass border-l border-glass-border overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-glass-border/50">
              <h2 className="font-display text-sm font-bold tracking-wider uppercase text-text-primary">
                Settings
              </h2>
              <button
                onClick={toggleSettings}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Persona */}
              <Section icon={User} title="Persona">
                <div className="grid grid-cols-2 gap-2">
                  {PERSONAS.map((p) => (
                    <OptionCard
                      key={p.value}
                      selected={config.persona === p.value}
                      onClick={() => updateConfig({ persona: p.value })}
                      label={p.label}
                      desc={p.desc}
                    />
                  ))}
                </div>
              </Section>

              {/* Language */}
              <Section icon={Globe} title="Language">
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((l) => (
                    <OptionCard
                      key={l.value}
                      selected={config.language === l.value}
                      onClick={() => updateConfig({ language: l.value })}
                      label={`${l.flag} ${l.label}`}
                    />
                  ))}
                </div>
              </Section>

              {/* Voice */}
              <Section icon={Volume2} title="TTS Voice">
                <div className="grid grid-cols-2 gap-2">
                  {VOICES.map((v) => (
                    <OptionCard
                      key={v.value}
                      selected={config.tts_voice === v.value}
                      onClick={() => updateConfig({ tts_voice: v.value })}
                      label={v.label}
                      desc={v.desc}
                    />
                  ))}
                </div>
              </Section>

              {/* Transcription Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl glass-light">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Live Transcription
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Show voice conversation as text
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateConfig({ transcribe: !config.transcribe })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    config.transcribe ? "bg-neon-cyan/30" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-200 ${
                      config.transcribe
                        ? "translate-x-5 bg-neon-cyan glow-cyan"
                        : "bg-text-muted"
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
});

// ─── Sub-components ───

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof User;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-neon-blue" />
        <span className="font-display text-[11px] font-semibold tracking-wider uppercase text-text-secondary">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  label,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  desc?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl text-left transition-all duration-200 ${
        selected
          ? "glass border-neon-blue/40 glow-blue"
          : "glass-light hover:border-white/10"
      }`}
    >
      <p
        className={`text-sm font-medium ${
          selected ? "text-neon-cyan" : "text-text-primary"
        }`}
      >
        {label}
      </p>
      {desc && (
        <p className="text-[11px] text-text-muted mt-0.5">{desc}</p>
      )}
    </button>
  );
}
