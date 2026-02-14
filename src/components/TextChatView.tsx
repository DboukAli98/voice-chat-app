import { memo, useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Trash2, Sparkles } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useTextChat } from "../hooks/useTextChat";
import { ChatBubble, TypingIndicator } from "./ChatBubble";

export const TextChatView = memo(function TextChatView() {
  const { messages, isLoading, clearMessages } = useAppStore();
  const { sendMessage } = useTextChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // Auto-resize textarea
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    },
    []
  );

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isLoading &&
                !messages.some((m) => m.isStreaming) && <TypingIndicator />}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Input Bar */}
      <div className="relative px-4 pb-4 pt-2">
        {/* Clear button */}
        {messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearMessages}
            className="absolute -top-8 right-5 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-text-muted hover:text-neon-pink hover:bg-neon-pink/10 transition-colors font-mono"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </motion.button>
        )}

        <div className="flex items-end gap-2 p-2 rounded-2xl glass glow-blue">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none px-3 py-2 max-h-[120px] leading-relaxed"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br from-neon-blue to-neon-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-95"
          >
            <Send className="w-4 h-4 text-void" />
          </button>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-2 font-mono tracking-wider">
          SHIFT+ENTER for new line • ENTER to send
        </p>
      </div>
    </div>
  );
});

// ─── Empty State ───

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/10 border border-neon-blue/20 flex items-center justify-center glow-blue">
          <Sparkles className="w-8 h-8 text-neon-cyan" />
        </div>
        {/* Decorative rings */}
        <div className="absolute -inset-3 rounded-3xl border border-neon-cyan/10 voice-ring" />
        <div className="absolute -inset-6 rounded-3xl border border-neon-blue/5 voice-ring-outer" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-lg font-bold tracking-wider text-text-primary mb-2">
          NEXUS AI
        </h2>
        <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
          Start a conversation by typing below. Switch to voice mode for a
          hands-free experience.
        </p>
      </motion.div>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-2 mt-6 justify-center"
      >
        {["Hello!", "What can you do?", "Tell me about yourself"].map(
          (suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                // Dispatch a quick message
                const input = document.querySelector("textarea");
                if (input) {
                  const nativeSetter = Object.getOwnPropertyDescriptor(
                    HTMLTextAreaElement.prototype,
                    "value"
                  )?.set;
                  nativeSetter?.call(input, suggestion);
                  input.dispatchEvent(new Event("input", { bubbles: true }));
                  input.focus();
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary glass-light hover:text-neon-cyan hover:border-neon-cyan/20 transition-colors"
            >
              {suggestion}
            </button>
          )
        )}
      </motion.div>
    </div>
  );
}
