"use client";

import { useRef, useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [value]);

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
        <div className="relative flex items-end gap-3 bg-surface-soft border border-hairline rounded-2xl p-2 focus-within:border-ink transition-colors shadow-sm">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your course materials..."
            rows={1}
            disabled={disabled}
            className="w-full bg-transparent border-none focus:ring-0 resize-none text-body-md text-ink py-3 px-2 min-h-[48px] max-h-[120px] outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className="w-12 h-12 bg-ink text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity shrink-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {disabled ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-[11px] text-outline">
            AeroMentor can make mistakes. Verify critical information.
          </span>
        </div>
      </div>
    </div>
  );
}
