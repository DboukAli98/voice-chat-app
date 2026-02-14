import { useCallback, useRef, useEffect } from "react";
import {
  Room,
  RoomEvent,
  ConnectionState,
  Track,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
} from "livekit-client";
import { useAppStore } from "../store/useAppStore";
import {
  getVoiceToken,
  generateRoomName,
  connectTranscriptWs,
} from "../lib/api";

export function useVoiceChat() {
  const {
    config,
    voiceStatus,
    setVoiceStatus,
    roomName,
    setRoomName,
    addTranscript,
    addMessage,
    clearTranscripts,
  } = useAppStore();

  const roomRef = useRef<Room | null>(null);
  const transcriptWsRef = useRef<WebSocket | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(async () => {
    if (voiceStatus === "connecting" || voiceStatus === "connected") return;

    setVoiceStatus("connecting");
    clearTranscripts();

    const newRoomName = generateRoomName();
    setRoomName(newRoomName);

    try {
      // Get token from API
      const tokenData = await getVoiceToken(newRoomName, config);

      // Create and connect LiveKit room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      roomRef.current = room;

      // Room event listeners
      room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
        switch (state) {
          case ConnectionState.Connected:
            setVoiceStatus("connected");
            break;
          case ConnectionState.Disconnected:
            setVoiceStatus("disconnected");
            break;
          case ConnectionState.Reconnecting:
            setVoiceStatus("connecting");
            break;
        }
      });

      room.on(RoomEvent.Disconnected, () => {
        setVoiceStatus("disconnected");
        setRoomName(null);
      });

      // Handle remote audio tracks - attach to audio element for playback
      room.on(
        RoomEvent.TrackSubscribed,
        (
          track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant,
        ) => {
          if (track.kind === Track.Kind.Audio) {
            const audioElement = track.attach();
            audioElement.id = `audio-${participant.identity}-${track.sid}`;
            document.body.appendChild(audioElement);
          }
        },
      );

      room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
        track.detach().forEach((el) => el.remove());
      });

      // Connect to room
      await room.connect(tokenData.url, tokenData.token);

      // Enable microphone
      await room.localParticipant.setMicrophoneEnabled(true);

      setVoiceStatus("connected");

      // Connect transcript WebSocket if transcription is enabled
      if (config.transcribe) {
        try {
          const ws = connectTranscriptWs(
            newRoomName,
            (speaker, text) => {
              addTranscript({
                speaker,
                text,
                timestamp: new Date().toISOString(),
              });
              // Also add to chat messages for unified view
              addMessage(speaker === "user" ? "user" : "agent", text);
            },
            (error) => {
              console.warn("Transcript WS error:", error);
            },
          );
          transcriptWsRef.current = ws;
        } catch (e) {
          console.warn("Could not connect transcript WS:", e);
        }
      }
    } catch (err) {
      console.error("Voice connection failed:", err);
      setVoiceStatus("error");
      setRoomName(null);
    }
  }, [
    config,
    voiceStatus,
    setVoiceStatus,
    setRoomName,
    addTranscript,
    addMessage,
    clearTranscripts,
  ]);

  const disconnect = useCallback(() => {
    // Close transcript WS
    if (transcriptWsRef.current) {
      transcriptWsRef.current.close();
      transcriptWsRef.current = null;
    }

    // Disconnect LiveKit room
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }

    setVoiceStatus("disconnected");
    setRoomName(null);
  }, [setVoiceStatus, setRoomName]);

  const toggleMute = useCallback(async () => {
    if (!roomRef.current) return;
    const localParticipant = roomRef.current.localParticipant;
    const isMuted = !localParticipant.isMicrophoneEnabled;
    await localParticipant.setMicrophoneEnabled(isMuted);
  }, []);

  return {
    connect,
    disconnect,
    toggleMute,
    voiceStatus,
    roomName,
    room: roomRef.current,
  };
}
