import type {
  AgentConfig,
  TokenResponse,
  ChatResponse,
} from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "";

// ─── Voice Agent Endpoints ───

export async function getVoiceToken(
  roomName: string,
  config: AgentConfig
): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/api/voice-agent/create-room`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room_name: roomName,
      persona: config.persona,
      language: config.language,
      tts_voice: config.tts_voice,
      transcribe: config.transcribe,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Failed to get voice token");
  }

  return res.json();
}

// ─── Text Chat Endpoints ───

export async function sendChatMessage(
  message: string,
  config: AgentConfig,
  sessionId?: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      persona: config.persona,
      language: config.language,
      session_id: sessionId,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Chat request failed");
  }

  return res.json();
}

// ─── Streaming Chat WebSocket ───

export function createChatStream(
  config: AgentConfig,
  sessionId: string,
  onChunk: (content: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): WebSocket {
  const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}${API_BASE}/api/chat/stream`;

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    // Ready to send messages
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "chunk":
        onChunk(data.content);
        break;
      case "done":
        onDone();
        break;
      case "error":
        onError(data.error);
        break;
    }
  };

  ws.onerror = () => {
    onError("WebSocket connection error");
  };

  return ws;
}

// ─── Live Transcript WebSocket ───

export function connectTranscriptWs(
  roomName: string,
  onTranscript: (speaker: "user" | "agent", text: string) => void,
  onError?: (error: Event) => void
): WebSocket {
  const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}${API_BASE}/api/voice-agent/transcripts/live/${roomName}`;

  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "transcript") {
      onTranscript(data.speaker, data.text);
    }
  };

  ws.onerror = (e) => {
    onError?.(e);
  };

  // Keep alive
  const ping = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send("ping");
    }
  }, 30_000);

  const origClose = ws.close.bind(ws);
  ws.close = (...args) => {
    clearInterval(ping);
    origClose(...args);
  };

  return ws;
}

// ─── Generate Room Name ───

export function generateRoomName(): string {
  return `room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
