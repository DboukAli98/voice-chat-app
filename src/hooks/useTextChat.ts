import { useCallback, useRef } from "react";
import { useAppStore } from "../store/useAppStore";
import { sendChatMessage, createChatStream } from "../lib/api";

export function useTextChat() {
  const {
    config,
    sessionId,
    setSessionId,
    addMessage,
    appendToMessage,
    finalizeMessage,
    setLoading,
    isLoading,
  } = useAppStore();

  const wsRef = useRef<WebSocket | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      // Add user message
      addMessage("user", text.trim());
      setLoading(true);

      // Try streaming first, fallback to REST
      const currentSession = sessionId || `chat-${Date.now()}`;
      if (!sessionId) setSessionId(currentSession);

      let agentMsgId: string | null = null;

      try {
        // Attempt WebSocket streaming
        const ws = createChatStream(
          config,
          currentSession,
          (chunk) => {
            if (!agentMsgId) {
              agentMsgId = addMessage("agent", chunk);
            } else {
              appendToMessage(agentMsgId, chunk);
            }
          },
          () => {
            if (agentMsgId) finalizeMessage(agentMsgId);
            setLoading(false);
          },
          () => {
            // WS failed — fallback to REST
            fallbackRest(text.trim(), currentSession);
          }
        );

        wsRef.current = ws;

        // Wait for connection then send
        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              message: text.trim(),
              persona: config.persona,
              language: config.language,
              session_id: currentSession,
            })
          );
        };

        // If connection fails immediately, use REST
        ws.onerror = () => {
          fallbackRest(text.trim(), currentSession);
        };
      } catch {
        await fallbackRest(text.trim(), currentSession);
      }
    },
    [
      config,
      sessionId,
      isLoading,
      addMessage,
      appendToMessage,
      finalizeMessage,
      setLoading,
      setSessionId,
    ]
  );

  const fallbackRest = useCallback(
    async (text: string, session: string) => {
      try {
        const res = await sendChatMessage(text, config, session);
        addMessage("agent", res.response);
        if (res.session_id) setSessionId(res.session_id);
      } catch (err) {
        addMessage(
          "agent",
          "Sorry, I'm having trouble connecting. Please try again."
        );
        console.error("Chat error:", err);
      } finally {
        setLoading(false);
      }
    },
    [config, addMessage, setSessionId, setLoading]
  );

  return { sendMessage, isLoading };
}
