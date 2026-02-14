import { create } from "zustand";
import type {
  AppMode,
  ChatMessage,
  AgentConfig,
  VoiceStatus,
  TranscriptEntry,
} from "../types";

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface AppState {
  // ─── Mode ───
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // ─── Config ───
  config: AgentConfig;
  updateConfig: (partial: Partial<AgentConfig>) => void;

  // ─── Settings Panel ───
  settingsOpen: boolean;
  toggleSettings: () => void;

  // ─── Chat Messages ───
  messages: ChatMessage[];
  addMessage: (role: ChatMessage["role"], content: string) => string;
  appendToMessage: (id: string, content: string) => void;
  finalizeMessage: (id: string) => void;
  clearMessages: () => void;

  // ─── Chat Session ───
  sessionId: string | null;
  setSessionId: (id: string) => void;

  // ─── Voice State ───
  voiceStatus: VoiceStatus;
  setVoiceStatus: (status: VoiceStatus) => void;
  roomName: string | null;
  setRoomName: (name: string | null) => void;

  // ─── Transcripts ───
  transcripts: TranscriptEntry[];
  addTranscript: (entry: TranscriptEntry) => void;
  clearTranscripts: () => void;

  // ─── Loading ───
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // ─── Mode ───
  mode: "text",
  setMode: (mode) => set({ mode }),

  // ─── Config ───
  config: {
    persona: "english",
    language: "en",
    tts_voice: "nova",
    transcribe: true,
  },
  updateConfig: (partial) =>
    set((s) => ({ config: { ...s.config, ...partial } })),

  // ─── Settings ───
  settingsOpen: false,
  toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen })),

  // ─── Chat Messages ───
  messages: [],
  addMessage: (role, content) => {
    const id = uid();
    set((s) => ({
      messages: [
        ...s.messages,
        {
          id,
          role,
          content,
          timestamp: new Date(),
          isStreaming: role === "agent",
        },
      ],
    }));
    return id;
  },
  appendToMessage: (id, content) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + content } : m
      ),
    })),
  finalizeMessage: (id) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, isStreaming: false } : m
      ),
    })),
  clearMessages: () => set({ messages: [] }),

  // ─── Session ───
  sessionId: null,
  setSessionId: (id) => set({ sessionId: id }),

  // ─── Voice ───
  voiceStatus: "disconnected",
  setVoiceStatus: (status) => set({ voiceStatus: status }),
  roomName: null,
  setRoomName: (name) => set({ roomName: name }),

  // ─── Transcripts ───
  transcripts: [],
  addTranscript: (entry) =>
    set((s) => ({ transcripts: [...s.transcripts, entry] })),
  clearTranscripts: () => set({ transcripts: [] }),

  // ─── Loading ───
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
