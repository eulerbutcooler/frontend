"use client";

import { useRef, useState, useEffect } from "react";
import { Send, Loader2, Mic, MicOff } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [value]);

  const toggleListening = async () => {
    if (isListening && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          stream.getTracks().forEach(track => track.stop());
          
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");

          try {
            const res = await fetch("/api/audio/transcribe", {
              method: "POST",
              body: formData,
            });
            if (res.ok) {
              const data = await res.json();
              if (data.text) {
                setValue(prev => (prev + " " + data.text).trim());
              }
            }
          } catch (e) {
            console.error("Transcription error:", e);
          }
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-hairline bg-white">
      <div className="p-4 md:p-6">
        <div className="relative flex items-end gap-3 bg-surface-soft border border-hairline rounded-2xl p-2 focus-within:border-ink focus-within:ring-2 focus-within:ring-ink transition-[border-color,box-shadow] shadow-sm">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your course materials..."
            aria-label="Chat message"
            rows={1}
            disabled={disabled}
            className="w-full bg-transparent border-none focus:ring-0 resize-none text-body-md text-ink py-3 px-2 min-h-[48px] max-h-[120px] outline-none disabled:opacity-50"
          />
          <button
            onClick={toggleListening}
            aria-label={isListening ? "Stop listening" : "Start speaking"}
            className={`focus-ring w-12 h-12 rounded-xl flex items-center justify-center transition-[color,background-color,border-color,transform] duration-150 ease-snappy active:scale-[0.97] shrink-0 shadow-sm cursor-pointer ${
              isListening ? "bg-error text-white animate-pulse" : "bg-white text-ink border border-hairline hover:bg-surface-card"
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <button
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="focus-ring w-12 h-12 bg-ink text-white rounded-xl flex items-center justify-center hover:bg-ink/90 transition-[background-color,transform] duration-150 ease-snappy active:scale-[0.97] shrink-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {disabled ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-caption text-surface-tint">
            AeroMentor can make mistakes. Verify critical information.
          </span>
        </div>
      </div>
    </div>
  );
}
