import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SourceCitation } from "./source-citation";
import { MarkdownRenderer } from "./markdown-renderer";
import type { Citation } from "@/types/chat";
import { Copy, Check, Volume2, Square } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

export function MessageBubble({
  role,
  content,
  citations = [],
  isStreaming,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const [isCopied, setIsCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleSpeak = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsSynthesizing(true);
        const res = await fetch("/api/audio/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: content, voice: "hf_beta", speed: 0.9 }),
        });
        
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => setIsPlaying(false);
          
          setIsSynthesizing(false);
          setIsPlaying(true);
          audio.play();
        } else {
          setIsSynthesizing(false);
          setIsPlaying(false);
        }
      } catch (e) {
        console.error("TTS Error:", e);
        setIsSynthesizing(false);
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex gap-4 max-w-[85%] animate-fade-in",
        isUser && "self-end flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
          isUser
            ? "bg-brand-lavender text-ink border border-hairline"
            : "bg-surface-card text-surface-tint border border-hairline"
        )}
      >
        <span className="text-[11px] font-bold font-display select-none">
          {isUser ? "You" : "AI"}
        </span>
      </div>
      <div
        className={cn(
          "flex flex-col gap-2",
          isUser && "items-end"
        )}
      >
        <div
          className={cn(
            "px-5 py-4 rounded-2xl text-ink text-body-md leading-relaxed shadow-sm",
            isUser
              ? "bg-brand-peach rounded-tr-sm whitespace-pre-wrap"
              : "bg-surface-card rounded-tl-sm"
          )}
        >
          {isUser ? (
            content
          ) : (
            <MarkdownRenderer content={content} />
          )}
          {isStreaming && !content && (
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 bg-surface-tint rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-surface-tint rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 bg-surface-tint rounded-full animate-bounce [animation-delay:0.3s]" />
            </span>
          )}
        </div>
        
        {!isUser && !isStreaming && content && (
          <div className="flex items-center gap-3 px-2 text-outline">
            <button 
              onClick={handleCopy} 
              aria-label="Copy response"
              className="focus-ring flex items-center gap-1.5 hover:text-ink transition-colors text-xs font-medium px-2 py-1.5 rounded-md hover:bg-surface-card" 
              title="Copy response"
            >
              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {isCopied ? "Copied" : "Copy"}
            </button>
            <button 
              onClick={toggleSpeak} 
              aria-label={isPlaying ? "Stop speaking" : "Listen to response"}
              className={cn(
                "focus-ring flex items-center gap-1.5 transition-colors text-xs font-medium px-2 py-1.5 rounded-md hover:bg-surface-card",
                isPlaying && "text-brand-teal"
              )} 
              title={isPlaying ? "Stop speaking" : "Listen to response"}
            >
              {isPlaying ? <Square className="h-3.5 w-3.5 fill-current" /> : <Volume2 className="h-3.5 w-3.5" />}
              {isPlaying ? "Stop" : "Listen"}
            </button>
            {citations.length > 0 && (
              <SourceCitation citations={citations} compact />
            )}
          </div>
        )}

        {citations.length > 0 && isStreaming && (
          <SourceCitation citations={citations} compact />
        )}
      </div>
    </div>
  );
}
