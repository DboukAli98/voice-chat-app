import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Radio,
  Volume2,
} from "lucide-react";
import { useVoiceChat } from "../hooks/useVoiceChat";
import { useAppStore } from "../store/useAppStore";

export const VoiceChatView = memo(function VoiceChatView() {
  const { connect, disconnect, toggleMute, voiceStatus } = useVoiceChat();
  const { transcripts, config } = useAppStore();

  const isActive =
    voiceStatus === "connected" ||
    voiceStatus === "listening" ||
    voiceStatus === "speaking" ||
    voiceStatus === "thinking";

  const statusConfig = useMemo(
    () => ({
      disconnected: {
        label: "TAP TO CONNECT",
        color: "text-text-muted",
        orbColor: "from-subtle/50 to-elevated/30",
      },
      connecting: {
        label: "CONNECTING...",
        color: "text-neon-blue",
        orbColor: "from-neon-blue/30 to-neon-purple/20",
      },
      connected: {
        label: "LISTENING",
        color: "text-neon-green",
        orbColor: "from-neon-cyan/30 to-neon-green/20",
      },
      listening: {
        label: "LISTENING",
        color: "text-neon-green",
        orbColor: "from-neon-cyan/40 to-neon-green/30",
      },
      thinking: {
        label: "PROCESSING",
        color: "text-neon-purple",
        orbColor: "from-neon-purple/40 to-neon-blue/30",
      },
      speaking: {
        label: "SPEAKING",
        color: "text-neon-cyan",
        orbColor: "from-neon-cyan/50 to-neon-blue/30",
      },
      error: {
        label: "ERROR — TAP TO RETRY",
        color: "text-neon-pink",
        orbColor: "from-neon-pink/30 to-neon-purple/20",
      },
    }),
    []
  );

  const status = statusConfig[voiceStatus];

  return (
    <div className="flex flex-col h-full">
      {/* Main Voice Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Central Orb */}
        <motion.div
          className="relative cursor-pointer select-none"
          onClick={() => {
            if (!isActive) connect();
          }}
          whileTap={!isActive ? { scale: 0.95 } : undefined}
        >
          {/* Outer pulse rings (only when active) */}
          <AnimatePresence>
            {isActive && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute -inset-8 rounded-full border border-neon-cyan/15 voice-ring-outer"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute -inset-4 rounded-full border border-neon-cyan/25 voice-ring"
                />
              </>
            )}
          </AnimatePresence>

          {/* Orb body */}
          <motion.div
            animate={{
              scale: isActive ? [1, 1.05, 1] : 1,
            }}
            transition={{
              repeat: isActive ? Infinity : 0,
              duration: 3,
              ease: "easeInOut",
            }}
            className={`relative w-36 h-36 rounded-full bg-gradient-to-br ${status.orbColor} flex items-center justify-center`}
            style={{
              boxShadow: isActive
                ? "0 0 60px rgba(0,240,255,0.15), 0 0 120px rgba(0,240,255,0.05), inset 0 0 60px rgba(0,240,255,0.1)"
                : "0 0 30px rgba(77,124,255,0.1), inset 0 0 30px rgba(77,124,255,0.05)",
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/5 to-transparent" />

            {/* Icon */}
            {voiceStatus === "connecting" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Radio className="w-10 h-10 text-neon-blue" />
              </motion.div>
            ) : isActive ? (
              <Waveform />
            ) : (
              <Mic className="w-10 h-10 text-text-muted" />
            )}
          </motion.div>
        </motion.div>

        {/* Status Label */}
        <motion.div
          key={voiceStatus}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <p
            className={`font-display text-xs font-bold tracking-[0.3em] ${status.color}`}
          >
            {status.label}
          </p>
          {isActive && (
            <p className="font-mono text-[10px] text-text-muted mt-1.5 tracking-wider">
              {config.persona.toUpperCase()} • {config.language.toUpperCase()} •{" "}
              {config.tts_voice.toUpperCase()}
            </p>
          )}
        </motion.div>

        {/* Controls (visible when connected) */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mt-8"
            >
              <button
                onClick={toggleMute}
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/5 transition-colors"
                title="Toggle Mute"
              >
                <MicOff className="w-5 h-5 text-text-secondary" />
              </button>

              <button
                onClick={disconnect}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-pink/80 to-neon-pink/40 flex items-center justify-center hover:shadow-[0_0_30px_rgba(255,45,138,0.3)] transition-shadow active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </button>

              <button
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/5 transition-colors"
                title="Volume"
              >
                <Volume2 className="w-5 h-5 text-text-secondary" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connect button (visible when disconnected) */}
        <AnimatePresence>
          {!isActive && voiceStatus !== "connecting" && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={connect}
              className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan text-void font-display text-xs font-bold tracking-wider hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-shadow active:scale-95"
            >
              <Phone className="w-4 h-4" />
              START VOICE
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Live Transcript Bar */}
      {config.transcribe && transcripts.length > 0 && (
        <div className="px-4 pb-4">
          <div className="glass rounded-2xl p-4 max-h-40 overflow-y-auto space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span className="font-display text-[10px] font-bold tracking-widest text-text-muted uppercase">
                Live Transcript
              </span>
            </div>
            {transcripts.slice(-8).map((t, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span
                  className={`font-mono font-bold flex-shrink-0 ${
                    t.speaker === "user"
                      ? "text-neon-blue"
                      : "text-neon-cyan"
                  }`}
                >
                  {t.speaker === "user" ? "YOU" : "AI"}
                </span>
                <span className="text-text-secondary">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// ─── Waveform Animation ───

function Waveform() {
  const bars = 5;
  return (
    <div className="flex items-center gap-1 h-10">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-neon-cyan"
          animate={{
            height: [4, 20 + Math.random() * 16, 4],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8 + Math.random() * 0.5,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
