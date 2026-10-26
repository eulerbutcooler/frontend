"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { cn, toTitleCase } from "@/lib/utils";
import { Logo } from "@/components/icons/Logo";
import { MermaidDiagram } from "./mermaid-diagram";
import { MathEquation } from "./math-equation";
import { WingmanDrawer } from "./wingman-drawer";
import type { LessonTopic, TopicSlide } from "@/types/quiz";

interface TopicSlidesViewerProps {
  topics: LessonTopic[];
  activeTopicIndex?: number;
  subjectTitle?: string;
  courseId?: string;
  onTopicChange?: (index: number) => void;
  onCompleteLesson?: () => void;
}

export function TopicSlidesViewer({
  topics,
  activeTopicIndex = 0,
  subjectTitle,
  courseId,
  onTopicChange,
  onCompleteLesson,
}: TopicSlidesViewerProps) {
  const [topicIdx, setTopicIdx] = useState(activeTopicIndex);
  const [slideIdx, setSlideIdx] = useState(0);
  const [isWingmanOpen, setIsWingmanOpen] = useState(false);

  // Sync external topic index changes
  React.useEffect(() => {
    setTopicIdx(activeTopicIndex);
    setSlideIdx(0);
  }, [activeTopicIndex]);

  if (!topics || topics.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400 h-full">
        <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
        <h3 className="text-base font-semibold text-gray-700">No AI Briefing Slides Available</h3>
        <p className="text-[13px] text-gray-400 max-w-sm mt-1">
          Briefing slides are generated automatically from course manuals. You can view reference files in the next tab.
        </p>
      </div>
    );
  }

  const currentTopic = topics[topicIdx] || topics[0];
  const slides = currentTopic.slides || [];
  const currentSlide: TopicSlide | undefined = slides[slideIdx];
  const totalSlides = slides.length;

  const goToSlide = (newSlideIdx: number) => {
    if (newSlideIdx >= 0 && newSlideIdx < totalSlides) {
      setSlideIdx(newSlideIdx);
    }
  };

  const goToNext = () => {
    if (slideIdx < totalSlides - 1) {
      setSlideIdx(slideIdx + 1);
    } else if (topicIdx < topics.length - 1) {
      const nextT = topicIdx + 1;
      setTopicIdx(nextT);
      setSlideIdx(0);
      onTopicChange?.(nextT);
    } else {
      onCompleteLesson?.();
    }
  };

  const goToPrev = () => {
    if (slideIdx > 0) {
      setSlideIdx(slideIdx - 1);
    } else if (topicIdx > 0) {
      const prevT = topicIdx - 1;
      setTopicIdx(prevT);
      const prevSlides = topics[prevT]?.slides || [];
      setSlideIdx(Math.max(0, prevSlides.length - 1));
      onTopicChange?.(prevT);
    }
  };

  // Keyboard navigation for slides
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slideIdx, topicIdx, totalSlides, topics.length]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white select-text">
      {/* Running Topic Header */}
      <div className="px-8 py-3.5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 shrink-0">
            Topic {topicIdx + 1} of {topics.length}
          </span>
          <span className="text-[14px] font-semibold text-gray-800 truncate">
            {toTitleCase(currentTopic.title)}
          </span>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12px] font-medium text-gray-400">
            Slide {slideIdx + 1} of {Math.max(1, totalSlides)}
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            {slides.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all cursor-pointer",
                  idx === slideIdx
                    ? "w-6 bg-blue-600"
                    : "w-1.5 bg-gray-200 hover:bg-gray-300"
                )}
                title={`Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Slide & Wingman Area (slides shift left when Wingman opens) */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Main Slide Content Area with Fixed Side & Bottom Navigation */}
        <div className="relative flex-1 min-h-0 flex flex-col transition-all duration-300">
          {/* Fixed Left End Floating Button */}
          <button
            type="button"
            onClick={goToPrev}
            disabled={slideIdx === 0 && topicIdx === 0}
            aria-label="Previous Slide"
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-white border border-gray-200/90 shadow-md hover:shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all hover:scale-105 active:scale-95 cursor-pointer",
              slideIdx === 0 && topicIdx === 0 && "opacity-0 pointer-events-none"
            )}
            title="Previous Slide (←)"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Fixed Right End Floating Button */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={
              slideIdx === totalSlides - 1 && topicIdx === topics.length - 1
                ? "Finish Briefing"
                : slideIdx === totalSlides - 1
                ? "Next Topic (→)"
                : "Next Slide (→)"
            }
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Scrollable Slide Content (isolated, buttons do not scroll with text) */}
          <div className="flex-1 overflow-y-auto px-12 md:px-16 lg:px-20 py-8 flex flex-col">
            {currentSlide ? (
              <div className="max-w-4xl w-full mx-auto my-auto py-6">
                {/* Single Slide Heading */}
                <h2 className="text-3xl md:text-4xl lg:text-[38px] font-bold text-gray-900 tracking-tight mb-10 leading-snug">
                  {currentSlide.title}
                </h2>

                {/* Bullets: Clean open typography with subtle check icons */}
                {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                  <div className="space-y-7 mb-10">
                    {currentSlide.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                        <p className="text-[20px] md:text-[22px] leading-[1.7] text-gray-800 font-normal">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formula / Equations: Rendered with KaTeX */}
                {currentSlide.formula_or_rule && (
                  <MathEquation formula={currentSlide.formula_or_rule} />
                )}

                {/* Mermaid Diagram */}
                {currentSlide.diagram_mermaid && (
                  <div className="my-6 p-4 rounded-xl border border-gray-100 bg-slate-50/50">
                    <MermaidDiagram code={currentSlide.diagram_mermaid} />
                  </div>
                )}

                {/* Warning / Emergency / Summary Callout */}
                {currentSlide.warning && (
                  <div className="my-6 p-5 rounded-xl border border-amber-200 bg-amber-50/70 shadow-2xs">
                    <p className="text-[13px] font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                      Operational Note
                    </p>
                    <p className="text-[17px] md:text-[18px] text-amber-950 font-medium leading-relaxed">
                      {currentSlide.warning}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-base">
                Slide content loading…
              </div>
            )}
          </div>

          {/* Floating Wingman Trigger Button */}
          {!isWingmanOpen && (
            <button
              type="button"
              onClick={() => setIsWingmanOpen(true)}
              aria-label="Ask Wingman"
              className="absolute bottom-16 right-6 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-950 text-white shadow-xl hover:shadow-2xl border border-slate-700/60 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:bg-blue-500 transition-colors">
                <Logo className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] font-semibold tracking-tight text-white pr-1">
                Wingman
              </span>
            </button>
          )}

          {/* Fixed Slide Navigation Footer */}
          <div className="shrink-0 px-8 py-3.5 border-t border-gray-100 flex items-center justify-between bg-white z-10 w-full">
            <button
              type="button"
              onClick={goToPrev}
              disabled={slideIdx === 0 && topicIdx === 0}
              className="h-9 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Slide
            </button>

            <span className="text-[12px] font-medium text-gray-400">
              {slideIdx + 1} / {Math.max(1, totalSlides)}
            </span>

            <button
              type="button"
              onClick={goToNext}
              className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {slideIdx === totalSlides - 1 && topicIdx === topics.length - 1 ? (
                "Finish Briefing"
              ) : slideIdx === totalSlides - 1 ? (
                "Next Topic"
              ) : (
                "Next Slide"
              )}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Wingman Copilot Drawer */}
        <WingmanDrawer
          isOpen={isWingmanOpen}
          onClose={() => setIsWingmanOpen(false)}
          slideTitle={currentSlide?.title || ""}
          slideBullets={currentSlide?.bullets || []}
          topicTitle={currentTopic?.title || ""}
          subjectTitle={subjectTitle}
          courseId={courseId}
          formula={currentSlide?.formula_or_rule}
          warning={currentSlide?.warning}
          slideIndex={slideIdx}
          totalSlides={totalSlides}
        />
      </div>
    </div>
  );
}
