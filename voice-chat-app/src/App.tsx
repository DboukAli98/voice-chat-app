import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "./store/useAppStore";
import { Background } from "./components/Background";
import { Header } from "./components/Header";
import { SettingsPanel } from "./components/SettingsPanel";
import { TextChatView } from "./components/TextChatView";
import { VoiceChatView } from "./components/VoiceChatView";

export default function App() {
  const { mode } = useAppStore();

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden">
      <Background />

      {/* Main container */}
      <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto w-full">
        <Header />

        {/* Content area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {mode === "text" ? (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <TextChatView />
              </motion.div>
            ) : (
              <motion.div
                key="voice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <VoiceChatView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Settings overlay */}
      <SettingsPanel />
    </div>
  );
}
