import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

const galleryImages = [
  {
    src: "/images/navy-jet-takeoff.png",
    alt: "Naval fighter jet launching from carrier deck at sunrise",
    caption: "Carrier Operations",
  },
  {
    src: "/images/cockpit-view.png",
    alt: "Fighter jet cockpit with digital displays over ocean",
    caption: "Cockpit Systems",
  },
  {
    src: "/images/aircraft-carrier.png",
    alt: "Aircraft carrier fleet sailing through open ocean",
    caption: "Fleet Command",
  },
  {
    src: "/images/navy-crew-deck.png",
    alt: "Navy aviation crew on carrier deck at sunset",
    caption: "Flight Deck Ops",
  },
  {
    src: "/images/helicopter-formation.png",
    alt: "Naval helicopter formation over the ocean at sunset",
    caption: "Rotary Wing",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <header className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Hero Image */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/navy-jet-takeoff.png"
            alt="Naval aviation operations"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </div>
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        {/* Bottom gradient fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-40 -z-10 bg-gradient-to-t from-canvas to-transparent" />

        <div className="max-w-[1280px] mx-auto px-8 w-full pt-24 pb-16">
          <div className="max-w-2xl">
            <span className="inline-block text-caption-uppercase uppercase text-brand-ochre mb-5 tracking-[0.2em] font-semibold bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
              Indian Navy Aviation Department
            </span>
            <h1 className="font-display text-display-xl text-white mb-6 drop-shadow-lg">
              Master the skies
              <br />
              with intelligence
            </h1>
            <p className="text-body-md text-white/80 mb-8 max-w-xl leading-relaxed">
              AeroMentor transforms aviation education with AI-powered chat,
              auto-generated quizzes, and intelligent analytics. Built for the
              Indian Navy&apos;s next generation of aviators.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/register"
                id="hero-cta-register"
                className="bg-brand-ochre text-ink h-[52px] px-8 rounded-xl font-button text-button hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-brand-ochre/30"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                id="hero-cta-login"
                className="bg-white/10 backdrop-blur-sm text-white h-[52px] px-8 rounded-xl font-button text-button border border-white/20 hover:bg-white/20 transition-colors flex items-center"
              >
                Sign In
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="font-display text-display-sm text-white">
                  RAG
                </div>
                <div className="text-caption text-white/50 mt-1">
                  AI Chat Engine
                </div>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div className="text-center">
                <div className="font-display text-display-sm text-white">
                  Auto
                </div>
                <div className="text-caption text-white/50 mt-1">
                  Quiz Generation
                </div>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div className="text-center">
                <div className="font-display text-display-sm text-white">
                  Live
                </div>
                <div className="text-caption text-white/50 mt-1">
                  Analytics
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════ HORIZONTAL IMAGE GALLERY ═══════════════════ */}
      <section className="py-20 overflow-hidden bg-canvas" id="gallery">
        <div className="max-w-[1280px] mx-auto px-8 mb-12">
          <span className="text-caption-uppercase uppercase text-brand-coral tracking-[0.2em] font-semibold">
            Naval Aviation
          </span>
          <h2 className="font-display text-display-lg text-ink mt-2">
            Where training meets excellence
          </h2>
        </div>

        {/* Horizontal scroll strip */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {/* Double the images for seamless infinite scroll */}
            {[...galleryImages, ...galleryImages].map((img, idx) => (
              <div
                key={idx}
                className="relative group flex-shrink-0 w-[400px] h-[280px] rounded-2xl overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="400px"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white font-display font-semibold text-lg">
                    {img.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES SECTION ═══════════════════ */}
      <section className="max-w-[1280px] mx-auto px-8 py-24" id="features">
        <div className="text-center mb-16">
          <span className="text-caption-uppercase uppercase text-brand-teal tracking-[0.2em] font-semibold">
            Capabilities
          </span>
          <h2 className="font-display text-display-lg text-ink mt-2">
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

      {/* ═══════════════════ CINEMATIC SPLIT SECTION ═══════════════════ */}
      <section className="max-w-[1280px] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - Large image */}
          <div className="relative rounded-[24px] overflow-hidden h-[480px] group">
            <Image
              src="/images/cockpit-view.png"
              alt="Inside a naval fighter jet cockpit"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="text-caption-uppercase uppercase text-brand-ochre tracking-[0.2em] font-semibold">
                Immersive Learning
              </span>
              <h3 className="font-display text-display-sm text-white mt-2">
                Train like you fly
              </h3>
              <p className="text-body-sm text-white/70 mt-2 max-w-sm">
                Course materials modeled on real-world cockpit procedures and
                operational protocols.
              </p>
            </div>
          </div>

          {/* Right - Stacked cards */}
          <div className="flex flex-col gap-6">
            <div className="relative rounded-[24px] overflow-hidden h-[226px] group flex-1">
              <Image
                src="/images/aircraft-carrier.png"
                alt="Aircraft carrier fleet in formation"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-white font-display font-semibold text-lg">
                  Comprehensive Curriculum
                </span>
                <p className="text-white/60 text-sm mt-1">
                  Covering fixed-wing, rotary-wing, and carrier ops
                </p>
              </div>
            </div>
            <div className="relative rounded-[24px] overflow-hidden h-[226px] group flex-1">
              <Image
                src="/images/helicopter-formation.png"
                alt="Naval helicopter formation at sunset"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-white font-display font-semibold text-lg">
                  Multi-Platform Training
                </span>
                <p className="text-white/60 text-sm mt-1">
                  Rotary wing, fixed wing, and UAV systems
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FULL-BLEED CTA SECTION ═══════════════════ */}
      <section className="relative py-32 my-16 overflow-hidden" id="cta">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/navy-crew-deck.png"
            alt="Navy crew on flight deck"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-brand-teal/85" />
        <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />

        <div className="max-w-[1280px] mx-auto px-8 text-center relative z-10">
          <h3 className="font-display text-display-md text-white mb-4">
            Built for the modern aviator
          </h3>
          <p className="text-body-md text-white/70 max-w-xl mx-auto mb-10">
            Join the platform trusted by India&apos;s naval aviation department.
            AI-powered training that adapts to how you learn.
          </p>
          <Link
            href="/register"
            id="cta-register"
            className="inline-flex items-center gap-2 bg-white text-ink h-[52px] px-8 rounded-xl font-button text-button hover:bg-brand-ochre hover:text-ink transition-colors shadow-xl"
          >
            Start Training Today
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/15">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-display text-display-md text-white">
                  RAG
                </span>
              </div>
              <p className="text-white/60 text-sm">
                AI Chat with source citations
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-display text-display-md text-white">
                  Auto
                </span>
              </div>
              <p className="text-white/60 text-sm">
                Quiz generation from materials
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-display text-display-md text-white">
                  Live
                </span>
              </div>
              <p className="text-white/60 text-sm">
                Real-time analytics dashboard
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
