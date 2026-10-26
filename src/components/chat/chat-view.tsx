"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import { formatDate, cn } from "@/lib/utils";
import {
  Plus,
  ArrowUp,
  Copy,
  Check,
  MessageSquare,
  AlertCircle,
  Volume2,
  VolumeX,
  Mic,
  Square,
  Loader2,
} from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import type { ChatSession, Message, Citation } from "@/types/chat";

interface ChatViewProps {
  initialSessionId?: string;
}

const GeneratingLogo = () => (
  <svg viewBox="0 0 30 24" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
    <path
      className="chat-logo-stroke"
      d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z"
      fill="#0a0a0a"
      stroke="#0a0a0a"
      strokeWidth="0.5"
    />
    <path
      className="chat-logo-stroke chat-logo-stroke-2"
      d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z"
      fill="#0a0a0a"
      stroke="#0a0a0a"
      strokeWidth="0.5"
    />
  </svg>
);

const SolidLogo = () => (
  <svg viewBox="0 0 30 24" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
    <path
      d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z"
      fill="#0a0a0a"
      stroke="#0a0a0a"
      strokeWidth="0.5"
    />
    <path
      d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z"
      fill="#0a0a0a"
      stroke="#0a0a0a"
      strokeWidth="0.5"
    />
  </svg>
);

export function formatTabTitle(rawTitle?: string | null): string {
  if (!rawTitle) return "New conversation...";
  let text = rawTitle.trim();
  if (!text) return "New conversation...";

  // Remove existing trailing ellipsis if any
  text = text.replace(/\.{2,}$/, "").trim();

  // Capitalize first alphabet
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1);

  // Take first 4 words
  const words = capitalized.split(/\s+/);
  if (words.length > 4) {
    const snippet = words.slice(0, 4).join(" ").replace(/[.,;:!?]+$/, "");
    return `${snippet}...`;
  }

  const cleanEnd = capitalized.replace(/[.,;:!?]+$/, "");
  return `${cleanEnd}...`;
}

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isGenerating?: boolean;
}

export function ChatView({ initialSessionId }: ChatViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    initialSessionId
  );
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputStr, setInputStr] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio / TTS State
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isLoadingTTS, setIsLoadingTTS] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const ttsAbortControllerRef = useRef<AbortController | null>(null);
  const audioQueueRef = useRef<{ id: number; audio: HTMLAudioElement; url: string }[]>([]);
  const isPlayingQueueRef = useRef<boolean>(false);

  // Audio / STT State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);

  const stopSpeaking = useCallback(() => {
    if (ttsAbortControllerRef.current) {
      ttsAbortControllerRef.current.abort();
      ttsAbortControllerRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    while (audioQueueRef.current.length > 0) {
      const item = audioQueueRef.current.shift();
      if (item) {
        item.audio.pause();
        URL.revokeObjectURL(item.url);
      }
    }
    isPlayingQueueRef.current = false;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setIsLoadingTTS(null);
  }, []);

  const playNextInQueue = useCallback((msgId: string) => {
    if (audioQueueRef.current.length === 0) {
      isPlayingQueueRef.current = false;
      setSpeakingMessageId((curr) => (curr === msgId ? null : curr));
      return;
    }

    isPlayingQueueRef.current = true;
    const nextItem = audioQueueRef.current.shift()!;
    audioPlayerRef.current = nextItem.audio;
    setSpeakingMessageId(msgId);
    setIsLoadingTTS(null);

    nextItem.audio.onended = () => {
      URL.revokeObjectURL(nextItem.url);
      playNextInQueue(msgId);
    };

    nextItem.audio.onerror = () => {
      URL.revokeObjectURL(nextItem.url);
      playNextInQueue(msgId);
    };

    nextItem.audio.play().catch((e) => {
      console.warn("Audio play prevented:", e);
      playNextInQueue(msgId);
    });
  }, []);

  const fallbackBrowserSpeech = useCallback((text: string, msgId: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => {
        setIsLoadingTTS(null);
        setSpeakingMessageId(msgId);
      };
      utterance.onend = () => {
        setSpeakingMessageId(null);
      };
      utterance.onerror = () => {
        setSpeakingMessageId(null);
        setIsLoadingTTS(null);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsLoadingTTS(null);
      setSpeakingMessageId(null);
    }
  }, []);

  const handleSpeak = async (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setIsLoadingTTS(msgId);

    const controller = new AbortController();
    ttsAbortControllerRef.current = controller;

    // Clean markdown formatting for clean audio pronunciation
    const cleanText = text
      .replace(/```[\s\S]*?```/g, "Code block omitted.")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .replace(/[#*_~>]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    try {
      const res = await fetch("/api/audio/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("TTS endpoint failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const enqueueChunk = (audioBase64: string, index: number) => {
        try {
          const byteCharacters = atob(audioBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "audio/wav" });
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioQueueRef.current.push({ id: index, audio, url });

          if (!isPlayingQueueRef.current) {
            playNextInQueue(msgId);
          }
        } catch (err) {
          console.warn("Failed to create audio chunk:", err);
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const data = JSON.parse(trimmed);
            if (data.audio) {
              enqueueChunk(data.audio, data.index);
            }
          } catch (e) {
            console.warn("Parse chunk JSON error:", e);
          }
        }
      }

      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer.trim());
          if (data.audio) {
            enqueueChunk(data.audio, data.index);
          }
        } catch (e) {}
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.warn("TTS stream error, falling back to Web Speech:", err);
      fallbackBrowserSpeech(cleanText, msgId);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) return;

        setIsTranscribing(true);
        try {
          const formData = new FormData();
          const ext = mimeType.includes("mp4") ? "mp4" : "webm";
          formData.append("file", audioBlob, `speech.${ext}`);

          const res = await fetch("/api/audio/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error("STT failed");
          }

          const data = await res.json();
          if (data.text) {
            setInputStr((prev) => {
              const trimmed = prev.trim();
              return trimmed ? `${trimmed} ${data.text.trim()}` : data.text.trim();
            });
          }
        } catch (err) {
          console.error("Transcribe failed:", err);
        } finally {
          setIsTranscribing(false);
          inputRef.current?.focus();
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      // Start Web Speech API in parallel for live streaming feedback if available
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = "en-US";
          recognition.onresult = (event: any) => {
            let interim = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              interim += event.results[i][0].transcript;
            }
            if (interim.trim()) {
              setInputStr(interim.trim());
            }
          };
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (e) {}
      }
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Microphone permission was denied or is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
      speechRecognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [stopSpeaking]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Keep currentSessionId in sync with props
  useEffect(() => {
    setCurrentSessionId(initialSessionId);
  }, [initialSessionId]);

  // Fetch previous conversations for the right sidebar
  const { data: rawSessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["chat-sessions"],
    queryFn: () => clientApi.get<ChatSession[]>("/api/v1/chat/sessions"),
  });
  const sessions = Array.isArray(rawSessions) ? rawSessions : [];

  // Fetch history if we have an active session ID
  const { data: rawHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["chat-history", currentSessionId],
    queryFn: () =>
      clientApi.get<Message[]>(
        `/api/v1/chat/sessions/${currentSessionId}/history`
      ),
    enabled: !!currentSessionId,
  });
  const history = Array.isArray(rawHistory) ? rawHistory : [];

  // Track which session history was last loaded into messages
  const lastLoadedSessionIdRef = useRef<string | null>(null);

  // Populate messages when history loads (only on initial load or switching sessions)
  useEffect(() => {
    if (history.length > 0 && !isStreaming) {
      if (lastLoadedSessionIdRef.current !== currentSessionId || messages.length === 0) {
        lastLoadedSessionIdRef.current = currentSessionId || null;
        setMessages(
          history.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            citations: Array.isArray(m.citations) ? m.citations : [],
            isGenerating: false,
          }))
        );
      }
    }
  }, [history, isStreaming, currentSessionId, messages.length]);

  // Focus input when idle
  useEffect(() => {
    if (!isStreaming) {
      inputRef.current?.focus();
    }
  }, [isStreaming, currentSessionId]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartNewChat = () => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    lastLoadedSessionIdRef.current = null;
    setCurrentSessionId(undefined);
    setMessages([]);
    setInputStr("");
    setError(null);
    router.push("/chat");
  };

  const handleSelectSession = (sessionId: string) => {
    if (sessionId === currentSessionId) return;
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    lastLoadedSessionIdRef.current = null;
    setCurrentSessionId(sessionId);
    setMessages([]);
    setError(null);
    router.push(`/chat/${sessionId}`);
  };

  const handleSendMessage = async () => {
    const query = inputStr.trim();
    if (!query || isStreaming) return;

    setError(null);

    // 1. INSTANT optimistic state update (0ms latency!)
    const userMsgId = `usr-${Date.now()}`;
    const assistantMsgId = `asst-${Date.now()}`;

    const newUserMessage: DisplayMessage = {
      id: userMsgId,
      role: "user",
      content: query,
      citations: [],
      isGenerating: false,
    };

    const newAssistantMessage: DisplayMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      citations: [],
      isGenerating: true,
    };

    setMessages((prev) => [...prev, newUserMessage, newAssistantMessage]);
    setInputStr("");
    setIsStreaming(true);

    abortControllerRef.current = new AbortController();

    try {
      let activeId = currentSessionId;

      // If no active session yet, create one immediately
      if (!activeId) {
        const newSession = await clientApi.post<ChatSession>(
          "/api/v1/chat/sessions",
          { course_id: null }
        );
        activeId = newSession.id;
        setCurrentSessionId(activeId);
        lastLoadedSessionIdRef.current = activeId;

        // Update URL cleanly without triggering unmount
        window.history.replaceState(null, "", `/chat/${activeId}`);

        // Invalidate sidebar list so the new conversation immediately shows
        queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
      } else {
        lastLoadedSessionIdRef.current = activeId;
      }

      // Connect directly to SSE endpoint
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeId, query }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        let msg = `Chat failed with status ${res.status}`;
        try {
          const errData = await res.json();
          msg = errData.error || errData.message || msg;
          if (typeof msg === "string" && msg.trim().startsWith("{")) {
            try {
              const inner = JSON.parse(msg);
              msg = inner.error?.message || inner.message || inner.error || msg;
            } catch {}
          }
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lastNewline = buffer.lastIndexOf("\n");
        if (lastNewline === -1) continue;

        const lines = buffer.slice(0, lastNewline).split("\n");
        buffer = buffer.slice(lastNewline + 1);

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") {
            break;
          }

          try {
            const parsed = JSON.parse(payload);
            if (parsed.token !== undefined) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.token,
                  };
                }
                return updated;
              });
            }
            if (parsed.citations && Array.isArray(parsed.citations)) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    citations: parsed.citations,
                  };
                }
                return updated;
              });
            }
          } catch {
            if (payload) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + payload,
                  };
                }
                return updated;
              });
            }
          }
        }
      }

      // Mark generation as complete
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            isGenerating: false,
          };
        }
        return updated;
      });

      // Update right sidebar and history caches
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
      if (activeId) {
        queryClient.invalidateQueries({ queryKey: ["chat-history", activeId] });
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to stream answer");
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              isGenerating: false,
            };
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes chat-logo-redraw {
            0% { stroke-dashoffset: 0; fill-opacity: 1; }
            40% { stroke-dashoffset: 120; fill-opacity: 0; }
            60% { stroke-dashoffset: 120; fill-opacity: 0; }
            100% { stroke-dashoffset: 0; fill-opacity: 1; }
          }
          .chat-logo-stroke {
            stroke-dasharray: 120;
            animation: chat-logo-redraw 1s cubic-bezier(.4,0,.2,1) infinite;
          }
          .chat-logo-stroke-2 {
            animation-delay: 0.15s;
          }
        `,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2 shrink-0">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
            Chat with the RAG powered LLM...
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Ask questions, clarify concepts, and get instant answers based on your course materials
          </p>
        </div>
      </div>

      {/* Main container */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Main Chat Area */}
        <div className="flex-[4] min-w-0 bg-white border border-gray-200 rounded-xl flex flex-col relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-[url('/images/bg.webp')] bg-[center_top_14rem] bg-cover bg-no-repeat opacity-100 pointer-events-none" />

          {/* Dynamic Messages Area */}
          <div
            className={`flex-1 overflow-y-auto px-8 md:px-10 pt-8 pb-32 relative flex flex-col scrollbar-hide transition-opacity duration-500 ${
              messages.length === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="max-w-3xl mx-auto w-full flex flex-col gap-5">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start items-start gap-3"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-[28px] h-[28px] rounded-full border border-gray-200 flex items-center justify-center shrink-0 mt-1 bg-white shadow-none">
                        {msg.isGenerating ? <GeneratingLogo /> : <SolidLogo />}
                      </div>
                    )}

                    <div
                      className={
                        msg.role === "user"
                          ? "bg-[#f3f4f6] text-gray-900 text-[15px] px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]"
                          : "text-gray-900 text-[15px] max-w-[90%] leading-relaxed pt-1.5 flex flex-col gap-2"
                      }
                    >
                      {msg.role === "user" ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}

                      {/* Action buttons on completed assistant response */}
                      {msg.role === "assistant" && !msg.isGenerating && msg.content && (
                        <div className="flex items-center gap-3 pt-1 text-gray-400">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1.5 hover:text-gray-700 transition-colors text-xs font-medium shadow-none cursor-pointer"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                          </button>

                          {/* Speaker button right to copy button */}
                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className={cn(
                              "flex items-center gap-1.5 transition-colors text-xs font-medium shadow-none cursor-pointer",
                              speakingMessageId === msg.id
                                ? "text-blue-600 font-semibold"
                                : "hover:text-gray-700"
                            )}
                            title={speakingMessageId === msg.id ? "Stop audio" : "Listen to response"}
                          >
                            {isLoadingTTS === msg.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                            ) : speakingMessageId === msg.id ? (
                              <VolumeX className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                            ) : (
                              <Volume2 className="h-3.5 w-3.5" />
                            )}
                            <span>
                              {isLoadingTTS === msg.id
                                ? "Loading..."
                                : speakingMessageId === msg.id
                                ? "Stop"
                                : "Listen"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Full-width divider after user message */}
                  {msg.role === "user" && (
                    <div className="w-full h-px bg-gray-100 mt-6 mb-2" />
                  )}
                </div>
              ))}

              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Welcome Screen (fades out when messages arrive) */}
          <div
            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              messages.length === 0
                ? "opacity-100 translate-y-[-10%]"
                : "opacity-0 -translate-y-20"
            }`}
          >
            <div className="w-[48px] h-[48px] rounded-[14px] bg-white border border-gray-200 flex items-center justify-center mb-5 shadow-none">
              <svg
                viewBox="0 0 30 24"
                className="w-[24px] h-[24px] text-blue-500"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <path
                  d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
              See what AeroMentor can do
            </h2>
            <p className="text-[13px] text-gray-400 mt-1 max-w-sm text-center">
              Type your aerodynamics or flight questions to stream answers directly from your course materials.
            </p>
          </div>

          {/* Bottom Gradient Fade: only visible when messages exist, sits behind the input box so messages fade smoothly */}
          <div
            className={`absolute inset-x-0 bottom-0 pointer-events-none z-10 h-36 transition-opacity duration-300 ${
              messages.length === 0 ? "opacity-0" : "opacity-100"
            }`}
            style={{
              background:
                "linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 30%, rgba(255, 255, 255, 0) 100%)",
            }}
          />

          {/* The Chat Input (Animates smoothly between center and bottom) */}
          <div
            className={`absolute left-0 right-0 px-6 md:px-10 z-30 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              messages.length === 0 ? "bottom-[35%]" : "bottom-0 pb-5 pt-2"
            }`}
          >
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white border border-blue-200 rounded-[16px] p-2.5 focus-within:border-blue-500 transition-all relative shadow-none">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    isTranscribing
                      ? "Transcribing with Whisper..."
                      : isRecording
                      ? "Listening... Speak your message now..."
                      : "Enter your message..."
                  }
                  value={inputStr}
                  onChange={(e) => setInputStr(e.target.value)}
                  disabled={isStreaming || isTranscribing}
                  className={cn(
                    "w-full bg-transparent text-[15px] placeholder-gray-400 outline-none border-none py-2 px-3 pb-10 disabled:opacity-60",
                    isRecording ? "text-red-600 font-medium placeholder-red-400" : "text-gray-900"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (isRecording) {
                        stopRecording();
                      }
                      handleSendMessage();
                    }
                  }}
                />

                <div className="absolute bottom-2.5 left-3.5 right-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-medium text-gray-500 hover:bg-gray-100 rounded-md transition-colors shadow-none cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Add context
                    </button>
                    {isRecording && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 animate-pulse bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        Recording audio...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Mic button just left of send arrow */}
                    <button
                      type="button"
                      onClick={handleToggleRecord}
                      disabled={isStreaming || isTranscribing}
                      className={cn(
                        "w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all shadow-none cursor-pointer",
                        isRecording
                          ? "bg-red-500 text-white shadow-md ring-4 ring-red-100 animate-pulse"
                          : isTranscribing
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                      )}
                      title={
                        isTranscribing
                          ? "Transcribing..."
                          : isRecording
                          ? "Stop recording"
                          : "Speak message (Speech to Text)"
                      }
                    >
                      {isTranscribing ? (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      ) : isRecording ? (
                        <Square className="h-3 w-3 fill-current" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </button>

                    {/* Send arrow button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isRecording) {
                          stopRecording();
                        }
                        handleSendMessage();
                      }}
                      disabled={isStreaming || !inputStr.trim() || isRecording || isTranscribing}
                      className="w-[32px] h-[32px] rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-none cursor-pointer"
                      title="Send message"
                    >
                      <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Previous Conversations */}
        <div className="flex-[1] min-w-[240px] max-w-[300px] bg-white border border-gray-200 rounded-xl flex flex-col shrink-0 overflow-hidden">
          {/* Header */}
          <div className="p-3.5 px-4 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-[13px] font-bold text-gray-900 tracking-tight">
              Previous Conversations
            </h2>
            <button
              onClick={handleStartNewChat}
              className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition-colors shadow-none cursor-pointer"
              title="Start a new chat session"
            >
              <Plus className="h-3.5 w-3.5" />
              New
            </button>
          </div>

          {/* Conversations Tab List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-hide">
            {isLoadingSessions ? (
              <div className="p-2 space-y-2">
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-[13px] font-medium text-gray-500">
                  No conversations yet
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Send a message to begin a new chat session.
                </p>
              </div>
            ) : (
              sessions.map((session) => {
                const isActive = session.id === currentSessionId;
                const formattedTitle = formatTabTitle(session.title);

                return (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg flex flex-col gap-0.5 transition-colors duration-150 cursor-pointer shadow-none",
                      isActive
                        ? "bg-gradient-to-b from-blue-50/50 to-blue-100/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_1px_2px_rgba(0,0,0,0.05)] text-blue-700 font-semibold border border-blue-200/60"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1 w-full min-w-0">
                      <h3
                        className={cn(
                          "text-[13px] truncate leading-tight",
                          isActive
                            ? "text-blue-800 font-semibold"
                            : "text-gray-800 font-medium"
                        )}
                        title={session.title}
                      >
                        {formattedTitle}
                      </h3>
                    </div>
                    <p
                      className={cn(
                        "text-[11px]",
                        isActive ? "text-blue-500/80" : "text-gray-400"
                      )}
                    >
                      {formatDate(session.updated_at)}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
