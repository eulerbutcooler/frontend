"use client";

import { useState } from "react";
import { X } from "lucide-react";

import type { CourseFigure } from "@/types/course";

interface FigureImageProps {
  figure?: CourseFigure | null;
  className?: string;
}

/**
 * A captioned figure referenced by a slide or question. The URL is a
 * short-lived presigned link supplied by the backend with the course content.
 */
export function FigureImage({ figure, className }: FigureImageProps) {
  const [open, setOpen] = useState(false);

  if (!figure?.url) return null;

  return (
    <>
      <figure className={className}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 cursor-zoom-in"
          aria-label="Open figure full size"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={figure.url}
            alt={figure.caption || "Figure"}
            loading="lazy"
            className="w-full max-h-[320px] object-contain"
          />
        </button>
        <figcaption className="mt-2 text-[12px] leading-relaxed text-gray-500">
          {figure.caption}
        </figcaption>
      </figure>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-white/80 hover:text-white"
            onClick={() => setOpen(false)}
            aria-label="Close figure"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={figure.url}
            alt={figure.caption || "Figure"}
            className="max-h-full max-w-full object-contain rounded-lg"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
