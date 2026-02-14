// ─── Chat Messages ───
export type MessageRole = "user" | "agent";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// ─── Agent Configuration ───
export type Persona = "english" | "saudi";
export type Language = "en" | "ar";
export type TTSVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export interface AgentConfig {
  persona: Persona;
  language: Language;
  tts_voice: TTSVoice;
  transcribe: boolean;
}

// ─── API Types ───
export interface TokenResponse {
  token: string;
  url: string;
  room_metadata: string;
}

export interface ChatResponse {
  response: string;
  persona: string;
  language: string;
  session_id: string;
}

// ─── Voice State ───
export type VoiceStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

// ─── App Mode ───
export type AppMode = "text" | "voice";

// ─── Transcript Entry ───
export interface TranscriptEntry {
  speaker: "user" | "agent";
  text: string;
  timestamp: string;
}
