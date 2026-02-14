import { memo } from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../types";

interface Props {
  message: ChatMessageType;
}

export const ChatBubble = memo(function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30"
            : "bg-gradient-to-br from-neon-cyan/20 to-neon-green/10 border border-neon-cyan/20"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-neon-blue" />
        ) : (
          <Bot className="w-4 h-4 text-neon-cyan" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[75%] px-4 py-3 rounded-2xl ${
          isUser
            ? "msg-user rounded-tr-md"
            : "msg-agent rounded-tl-md"
        }`}
      >
        <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-[2px] h-4 ml-0.5 bg-neon-cyan animate-pulse align-middle" />
          )}
        </p>

        {/* Timestamp */}
        <p
          className={`mt-1.5 font-mono text-[10px] text-text-muted ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
});

// ─── Typing Indicator ───

export const TypingIndicator = memo(function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex gap-3"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-neon-cyan/20 to-neon-green/10 border border-neon-cyan/20">
        <Bot className="w-4 h-4 text-neon-cyan" />
      </div>
      <div className="msg-agent px-5 py-4 rounded-2xl rounded-tl-md">
        <div className="flex gap-1.5">
          <span className="typing-dot w-2 h-2 rounded-full bg-neon-cyan" />
          <span className="typing-dot w-2 h-2 rounded-full bg-neon-cyan" />
          <span className="typing-dot w-2 h-2 rounded-full bg-neon-cyan" />
        </div>
      </div>
    </motion.div>
  );
});
