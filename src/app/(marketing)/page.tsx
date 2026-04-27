import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "AeroMentor — AI-Powered Aviation Training",
  description:
    "AI-powered learning management system for Indian Navy aviation training with RAG-based chat, auto-generated quizzes, and smart analytics.",
  openGraph: {
    title: "AeroMentor — AI-Powered Aviation Training",
    description:
      "Master aviation knowledge with AI-powered chat, auto quizzes, and analytics.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <header className="max-w-[1280px] mx-auto px-8 pt-[96px] pb-[96px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 flex flex-col items-start">
            <span className="text-caption-uppercase uppercase text-brand-pink mb-4 tracking-widest">
              AI-Powered Training Platform
            </span>
            <h1 className="font-display text-display-xl text-ink mb-6">
              Master the skies
              <br />
              with intelligence
            </h1>
            <p className="text-body-md text-surface-tint mb-8 max-w-xl">
              AeroMentor transforms aviation education with AI-powered chat,
              auto-generated quizzes, and intelligent analytics. Built for the
              Indian Navy&apos;s next generation of aviators.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="bg-ink text-white h-[44px] px-6 rounded-xl font-button text-button hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="bg-canvas text-ink h-[44px] px-6 rounded-xl font-button text-button border border-hairline hover:bg-surface-soft transition-colors flex items-center"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="md:col-span-5 relative hidden md:block">
            <div className="absolute inset-0 bg-brand-peach/20 rounded-full blur-3xl -z-10 transform scale-90" />
            <div className="bg-surface-card rounded-[24px] p-8 border border-hairline">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-brand-coral" />
                <div className="w-3 h-3 rounded-full bg-brand-ochre" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-brand-lavender/30 rounded-full w-3/4" />
                <div className="h-4 bg-brand-mint/30 rounded-full w-1/2" />
                <div className="h-4 bg-brand-peach/30 rounded-full w-5/6" />
                <div className="h-12 bg-brand-teal rounded-xl flex items-center px-4 mt-6">
                  <span className="text-white text-sm font-semibold">
                    Ask me about aviation...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-[1280px] mx-auto px-8 pb-[96px]">
        <div className="text-center mb-16">
          <h2 className="font-display text-display-lg text-ink">
            Platform Capabilities
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 — AI Chat */}
          <div className="bg-brand-pink p-8 rounded-[24px] flex flex-col gap-6">
            <h3 className="text-title-lg font-semibold text-ink">
              AI-Powered Chat
            </h3>
            <p className="text-body-md text-ink/80 flex-grow">
              Ask questions about your course materials. Our RAG engine searches
              ingested documents and provides cited, accurate answers in
              real-time.
            </p>
            <div className="bg-white border border-hairline rounded-xl p-4 mt-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-caption-uppercase uppercase text-surface-tint">
                  Response Quality
                </span>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-brand-pink w-3/4 rounded-full" />
              </div>
            </div>
          </div>

          {/* Feature 2 — Analytics */}
          <div className="bg-brand-teal p-8 rounded-[24px] flex flex-col gap-6">
            <h3 className="text-title-lg font-semibold text-white">
              Smart Analytics
            </h3>
            <p className="text-body-md text-white/80 flex-grow">
              Track student performance, quiz scores, and engagement metrics.
              Visual dashboards give instructors actionable insights at a
              glance.
            </p>
            <div className="bg-white border border-hairline rounded-xl p-4 mt-auto">
              <div className="flex gap-2 items-end h-12">
                <div className="w-4 bg-brand-teal rounded-sm h-[40%] opacity-40" />
                <div className="w-4 bg-brand-teal rounded-sm h-[70%] opacity-70" />
                <div className="w-4 bg-brand-teal rounded-sm h-full" />
                <div className="w-4 bg-brand-teal rounded-sm h-[50%] opacity-50" />
              </div>
            </div>
          </div>

          {/* Feature 3 — Quizzes */}
          <div className="bg-brand-lavender p-8 rounded-[24px] flex flex-col gap-6">
            <h3 className="text-title-lg font-semibold text-ink">
              Auto Quizzes
            </h3>
            <p className="text-body-md text-ink/80 flex-grow">
              Quizzes are automatically generated from uploaded course
              materials. Multiple difficulty levels ensure progressive skill
              validation.
            </p>
            <div className="bg-white border border-hairline rounded-xl p-4 mt-auto flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-lavender flex items-center justify-center font-display font-bold text-sm text-ink select-none">
                Q
              </div>
              <div>
                <div className="text-button font-semibold text-ink">
                  Auto-Generated
                </div>
                <div className="text-caption-uppercase uppercase text-surface-tint mt-0.5">
                  Easy • Medium • Hard
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-[1280px] mx-auto px-8 pb-[96px]">
        <div className="bg-brand-teal rounded-[24px] p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          <div className="relative z-10">
            <h3 className="font-display text-display-sm mb-8">
              Built for the modern aviator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-display text-display-md">RAG</span>
                </div>
                <p className="text-white/70 text-sm">
                  AI Chat with source citations
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-display text-display-md">Auto</span>
                </div>
                <p className="text-white/70 text-sm">
                  Quiz generation from materials
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-display text-display-md">Live</span>
                </div>
                <p className="text-white/70 text-sm">
                  Real-time analytics dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
