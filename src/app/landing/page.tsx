"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  Clock3,
  FileText,
  Library,
  Menu,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Library,
    label: "Extensive Library",
    title: "Everything you need, in one intelligent library.",
    description:
      "Access a vast collection of specialized aviation resources and documents.",
    accent: "bg-blue-600",
  },
  {
    icon: Sparkles,
    label: "Auto Quizzes",
    title: "Turn training material into active recall.",
    description:
      "Test your knowledge with instantly generated quizzes tailored to your studies.",
    accent: "bg-sky-400",
  },
  {
    icon: MessageSquareText,
    label: "RAG AI Chatbot",
    title: "Answers grounded in your aviation sources.",
    description:
      "Get accurate, context-aware answers from our intelligent AI tutor anytime.",
    accent: "bg-indigo-500",
  },
];

const faqs = [
  {
    q: "What is Aeromentor?",
    a: "Aeromentor is an advanced RAG-based AI learning platform tailored specifically for naval aviation training, providing instant answers and dynamic quizzes.",
  },
  {
    q: "Who can use this platform?",
    a: "Currently, Aeromentor is optimized for students and instructors at the Naval Institute of Aeronautical Technology (NIAT).",
  },
  {
    q: "Is the AI tutor available 24/7?",
    a: "Yes, our intelligent AI tutor is available round-the-clock to assist with complex aerodynamics, combat scenarios, and navigation concepts.",
  },
  {
    q: "How does the quiz system work?",
    a: "The platform dynamically generates interactive quizzes that adapt to your specific knowledge gaps to ensure comprehensive exam readiness.",
  },
];

function LogoMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      className={`grid size-7 place-items-center rounded-[7px] ${
        inverted ? "bg-white text-blue-700" : "bg-blue-600 text-white"
      }`}
      aria-hidden="true"
    >
      <Sparkles className="size-4" strokeWidth={2.5} />
    </span>
  );
}

function SourceRow({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-600">
        <FileText className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-semibold text-slate-700">{name}</span>
        <span className="block text-[11px] text-slate-400">{meta}</span>
      </span>
      <Check className="size-3.5 text-emerald-500" />
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-8">
      <div className="absolute -inset-x-8 top-8 h-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-[0_35px_90px_rgba(0,0,50,0.42)]">
        <div className="flex h-9 items-center gap-2 border-b border-slate-200 bg-white px-3">
          <span className="size-2 rounded-full bg-red-400" />
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="size-2 rounded-full bg-emerald-400" />
          <div className="mx-auto h-4 w-48 rounded bg-slate-100" />
        </div>
        <div className="grid min-h-[390px] grid-cols-[64px_1fr] bg-slate-50 sm:grid-cols-[170px_1fr]">
          <aside className="border-r border-slate-200 bg-white p-3 sm:p-4">
            <div className="mb-5 flex items-center gap-2">
              <LogoMark />
              <span className="hidden text-[11px] font-bold sm:block">AEROMENTOR</span>
            </div>
            <div className="space-y-2">
              {["Ask", "Library", "Courses", "Quizzes"].map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-2 rounded-md px-2 py-2 text-[11px] font-medium ${
                    index === 0 ? "bg-blue-50 text-blue-700" : "text-slate-400"
                  }`}
                >
                  <span className={`size-2 rounded-sm ${index === 0 ? "bg-blue-600" : "bg-slate-200"}`} />
                  <span className="hidden sm:inline">{item}</span>
                </div>
              ))}
            </div>
          </aside>
          <div className="grid gap-4 p-4 sm:grid-cols-[1fr_230px] sm:p-6">
            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">AI tutor</p>
                  <h3 className="text-sm font-bold text-slate-900">Ask your training library</h3>
                </div>
                <span className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500">4 sources</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-[11px] font-semibold text-slate-800">
                  Explain the primary considerations during a carrier approach.
                </p>
                <div className="space-y-2 text-[11px] leading-relaxed text-slate-500">
                  <p>
                    A carrier approach requires precise control of the aircraft&apos;s lineup, angle of attack,
                    and glide slope. Pilots continuously cross-check visual landing aids and cockpit indications.
                  </p>
                  <p>
                    Aeromentor grounds the response in your uploaded naval aviation material and keeps the
                    relevant references attached to the answer.
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">[1] Flight manual</span>
                  <span className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">[2] NIAT notes</span>
                </div>
              </div>
              <div className="mt-auto flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                <Search className="size-3.5 text-slate-400" />
                <span className="flex-1 text-[11px] text-slate-400">Ask a question about your material...</span>
                <span className="grid size-7 place-items-center rounded-md bg-blue-600 text-white">
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </div>
            <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white sm:block">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Referenced sources</p>
              </div>
              <SourceRow name="Carrier operations.pdf" meta="Pages 82–86" />
              <SourceRow name="Flight fundamentals.pdf" meta="Chapter 12" />
              <SourceRow name="Approach procedures.pdf" meta="Pages 14–19" />
              <div className="relative mx-4 mt-4 h-28 overflow-hidden rounded-md bg-blue-600">
                <Image src="/images/navy-jet-takeoff.png" alt="Navy aircraft taking off" fill className="object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent" />
                <p className="absolute bottom-3 left-3 text-[11px] font-semibold text-white">Training library</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#101321] selection:bg-blue-200">
      <nav aria-label="Primary" className="relative z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/landing" className="flex items-center gap-2.5 text-xs font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <LogoMark />
            AEROMENTOR
          </Link>
          <div className="hidden items-center gap-7 text-[11px] font-medium text-slate-500 md:flex">
            <a href="#features" className="transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">How it works</a>
            <a href="#about" className="transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">About NIAT</a>
            <a href="#faq" className="transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">FAQs</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden px-3 py-2 text-[11px] font-semibold text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:block">Log in</Link>
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Start learning <ArrowRight className="size-3" />
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-slate-100 bg-white px-5 sm:px-8 md:hidden">
            <div className="flex flex-col gap-1 py-3 text-sm font-medium text-slate-600">
              <a href="#features" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 transition-colors hover:bg-slate-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Features</a>
              <a href="#how-it-works" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 transition-colors hover:bg-slate-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">How it works</a>
              <a href="#about" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 transition-colors hover:bg-slate-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">About NIAT</a>
              <a href="#faq" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 transition-colors hover:bg-slate-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">FAQs</a>
            </div>
          </div>
        )}
      </nav>

      <section className="relative px-5 pb-20 pt-20 text-center sm:px-8 sm:pt-28">
        <div className="absolute left-1/2 top-8 -z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-700">
            <span className="size-1.5 rounded-full bg-blue-600" />
            Built for focused aviation learning
          </div>
          <h1 className="text-balance text-[clamp(2.8rem,7vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.065em] text-slate-950">
            Master the skies with <span className="text-blue-600">intelligence.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-sm leading-6 text-slate-500 sm:text-base">
            Your aviation knowledge, organized and connected to an AI tutor that helps you understand,
            recall, and apply every concept.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Start learning <ArrowRight className="size-3.5" />
            </Link>
            <a href="#how-it-works" className="rounded-md border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#050943] pb-20 pt-14 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(37,99,235,0.9),transparent_40%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative mb-10 flex items-center justify-center gap-3 text-white">
          <span className="h-px w-12 bg-blue-300/40" />
          <Sparkles className="size-5 text-blue-200" />
          <span className="h-px w-12 bg-blue-300/40" />
        </div>
        <ProductPreview />
      </section>

      <section id="features" className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">A learning system, not another folder</p>
              <h2 className="max-w-md text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-5xl">
                All the things to build the perfect context for your training.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-slate-500">
                Aeromentor is crafted with cutting-edge aviation insights, so you master the skies safely, every time.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="grid min-h-[430px] overflow-hidden rounded-lg border border-slate-200 bg-white sm:grid-cols-[180px_1fr]">
                <div className="hidden border-r border-slate-100 p-4 sm:block">
                  <div className="mb-6 flex items-center gap-2 text-[11px] font-bold"><LogoMark /> Library</div>
                  {["Flight manuals", "Aerodynamics", "Navigation", "Carrier ops", "Assessments"].map((item, i) => (
                    <div key={item} className={`mb-1 rounded px-2 py-2 text-[11px] ${i === 1 ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-400"}`}>{item}</div>
                  ))}
                </div>
                <div className="p-5 sm:p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Aviation knowledge</p>
                      <h3 className="text-sm font-bold">Aerodynamics</h3>
                    </div>
                    <button className="rounded bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white">Add material</button>
                  </div>
                  <div className="relative mb-5 h-44 overflow-hidden rounded-lg bg-blue-600">
                    <Image src="/lol1.png" alt="Aircraft study material" fill className="object-contain p-5" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/15 px-2 py-1 text-xs font-medium text-white backdrop-blur">12 resources</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Aircraft stability", "Flight controls", "Lift & drag", "High-speed flight"].map((item) => (
                      <div key={item} className="rounded-md border border-slate-100 p-3">
                        <div className="mb-5 size-6 rounded bg-blue-50" />
                        <p className="text-[11px] font-semibold text-slate-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 grid border-y border-slate-200 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article key={feature.label} className={`flex min-h-72 flex-col py-8 md:px-8 ${index !== 2 ? "border-b border-slate-200 md:border-b-0 md:border-r" : ""} ${index === 0 ? "md:pl-0" : ""}`}>
                  <span className={`mb-14 grid size-9 place-items-center rounded-lg text-white ${feature.accent}`}><Icon className="size-4" /></span>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">{feature.label}</p>
                  <h3 className="max-w-xs text-xl font-semibold leading-tight tracking-tight text-slate-900">{feature.title}</h3>
                  <p className="mt-3 max-w-xs text-xs leading-5 text-slate-500">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">How it works</p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl">From source material to mastery.</h2>
            <p className="mt-5 text-sm leading-6 text-slate-500">Discover aerospace mastery through a focused learning loop that keeps your material, questions, and progress connected.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-8 flex items-start justify-between">
                <div><span className="text-[11px] font-bold text-blue-600">01</span><h3 className="mt-2 text-xl font-semibold tracking-tight">Bring in your material</h3></div>
                <BookOpen className="size-5 text-blue-600" />
              </div>
              <div className="rounded-lg bg-slate-950 p-4 shadow-xl">
                <div className="mb-6 flex gap-1.5"><span className="size-1.5 rounded-full bg-slate-600" /><span className="size-1.5 rounded-full bg-slate-600" /><span className="size-1.5 rounded-full bg-slate-600" /></div>
                <div className="grid grid-cols-3 gap-2">
                  {["Manual.pdf", "Course notes", "Procedures"].map((item, i) => <div key={item} className={`rounded-md p-3 ${i === 1 ? "bg-blue-600" : "bg-slate-900 ring-1 ring-white/10"}`}><FileText className="mb-8 size-4 text-white/70" /><p className="truncate text-xs text-white/80">{item}</p></div>)}
                </div>
              </div>
              <p className="mt-6 text-xs leading-5 text-slate-500">Build an extensive library from specialized aviation resources and documents.</p>
            </article>

            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-8 flex items-start justify-between">
                <div><span className="text-[11px] font-bold text-blue-600">02</span><h3 className="mt-2 text-xl font-semibold tracking-tight">Ask, learn, and test</h3></div>
                <BrainCircuit className="size-5 text-blue-600" />
              </div>
              <div className="relative h-44 overflow-hidden rounded-lg bg-blue-600 p-5 shadow-xl">
                <div className="absolute -right-10 -top-14 size-44 rounded-full border-[24px] border-white/10" />
                <div className="relative ml-auto w-[85%] rounded-md bg-white p-3 shadow-lg">
                  <p className="text-[11px] font-semibold text-slate-800">Create a quiz from carrier operations</p>
                  <div className="mt-3 space-y-1.5">{["Approach procedures", "Deck safety", "Flight controls"].map((item, i) => <div key={item} className={`rounded border p-2 text-xs ${i === 0 ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-100 text-slate-400"}`}>{item}</div>)}</div>
                </div>
              </div>
              <p className="mt-6 text-xs leading-5 text-slate-500">Get accurate answers, then use instantly generated quizzes tailored to your studies.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-2xl bg-[#07105f] px-6 py-16 text-white shadow-[0_30px_80px_rgba(20,35,140,0.25)] sm:px-12 sm:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">A smarter training layer</p>
                <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">Sub-200ms graph traversal, every request.</h2>
                <p className="mt-5 max-w-md text-sm leading-6 text-blue-100/70">Aeromentor accelerates your naval aviation training with cutting-edge tech and direct access to relevant learning context.</p>
              </div>
              <div className="relative h-64">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,.55),transparent_55%)]" />
                <svg viewBox="0 0 500 260" className="relative h-full w-full" aria-label="Connected aviation knowledge graph">
                  <g stroke="rgba(147,197,253,.35)" strokeWidth="1">
                    <path d="M250 130L85 55M250 130L105 205M250 130L405 45M250 130L420 195M85 55L145 25M85 55L35 115M105 205L45 225M105 205L175 230M405 45L470 85M405 45L345 20M420 195L470 150M420 195L355 230" />
                  </g>
                  {[[250,130,12],[85,55,7],[105,205,7],[405,45,7],[420,195,7],[145,25,4],[35,115,4],[45,225,4],[175,230,4],[470,85,4],[345,20,4],[470,150,4],[355,230,4]].map(([cx,cy,r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={i === 0 ? "white" : i < 5 ? "#60a5fa" : "#2563eb"} />)}
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-7"><Zap className="mb-16 size-5 text-blue-600" /><p className="text-4xl font-semibold tracking-tight">10x</p><p className="mt-3 text-xs leading-5 text-slate-500">Accelerated learning speed for all fundamental modules and advanced combat scenarios.</p></div>
            <div className="rounded-xl border border-slate-200 p-7"><Clock3 className="mb-16 size-5 text-blue-600" /><p className="text-4xl font-semibold tracking-tight">24/7</p><p className="mt-3 text-xs leading-5 text-slate-500">Direct access to our intelligent AI tutor, ready to explain complex aerodynamics, advanced naval aviation concepts, and tactical navigation on demand.</p></div>
            <div className="rounded-xl border border-slate-200 p-7"><ShieldCheck className="mb-16 size-5 text-blue-600" /><p className="text-4xl font-semibold tracking-tight">#1</p><p className="mt-3 text-xs leading-5 text-slate-500">Highest pass rate for naval aviation institute exams in the industry, backed by rigorous data and student performance metrics.</p></div>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-7 sm:flex sm:items-center sm:justify-between">
            <p className="max-w-3xl text-sm leading-6 text-slate-600">Interactive quizzes adapt dynamically to your knowledge gaps, focusing on your weakest areas to ensure comprehensive readiness.</p>
            <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 sm:mt-0">Adaptive by design</span>
          </div>
        </div>
      </section>

      <section id="about" className="border-y border-slate-200 bg-slate-50 px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-900 shadow-2xl">
            <Image src="/images/cockpit-view.png" alt="View from a naval aircraft cockpit" fill className="object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-7 text-white"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">Naval aviation training</p><p className="mt-2 text-2xl font-semibold">Elevate your knowledge.</p></div>
          </div>
          <div>
            <div className="mb-7 flex items-center gap-4"><Image src="/crest.png" alt="Indian Navy crest" width={64} height={64} className="object-contain" /><Image src="/niat.png" alt="NIAT emblem" width={64} height={64} className="object-contain" /></div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Built for NIAT</p>
            <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-slate-950">Naval Institute of Aeronautical Technology</h2>
            <p className="mt-6 text-sm leading-6 text-slate-500">Established in 1956 at the Naval Base in Kochi, Kerala, NIAT is the premier aviation technical training establishment of the Indian Navy. It trains naval personnel in aeronautical engineering to maintain fixed and rotary-wing naval air assets.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center"><p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Questions, answered</p><h2 className="text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl">Frequently Asked Questions</h2></div>
          <div className="border-t border-slate-200">
            {faqs.map((faq, index) => (
              <details key={faq.q} className="group border-b border-slate-200 py-1" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-sm font-semibold text-slate-900">
                  {faq.q}<span className="grid size-6 shrink-0 place-items-center rounded-full border border-slate-200 text-base font-normal text-blue-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pb-6 text-xs leading-5 text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-5 sm:px-8 sm:pb-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-blue-600 px-6 py-16 text-center text-white sm:px-12 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,.28),transparent_44%)]" />
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative mx-auto max-w-3xl">
            <LogoMark inverted />
            <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">New to Aeromentor?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-blue-100">We&apos;ll walk you through our advanced RAG-based learning environment and how Aeromentor can enhance your naval aviation studies — with comprehensive materials, interactive AI tutoring, and rigorous exam preparation.</p>
            <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-bold text-blue-700 shadow-xl transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Start learning <ArrowRight className="size-3.5" /></Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#050943] px-5 pb-8 pt-16 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 border-b border-white/10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2"><div className="flex items-center gap-2.5 text-xs font-extrabold"><LogoMark inverted />AEROMENTOR</div><p className="mt-5 max-w-sm text-xs leading-5 text-blue-100/60">A context-aware aviation learning environment for comprehensive materials, interactive AI tutoring, and rigorous exam preparation.</p></div>
            <div><p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">Navigation</p><ul className="space-y-3 text-xs text-blue-100/60"><li><Link href="/landing" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Home</Link></li><li><a href="#features" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Platform Features</a></li><li><a href="#how-it-works" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Training Library</a></li><li><a href="#features" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">AI Chatbot</a></li></ul></div>
            <div><p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">Resources</p><ul className="space-y-3 text-xs text-blue-100/60"><li><a href="#about" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">About NIAT</a></li><li><a href="#faq" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">FAQs</a></li><li><a href="#about" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Contact Us</a></li></ul></div>
          </div>
          <div className="flex flex-col gap-4 pt-7 text-[11px] text-blue-100/40 sm:flex-row sm:items-center sm:justify-between"><p>All Rights Reserved | Copyright ©2026 AeroMentor</p><div className="flex gap-6"><a href="#" aria-label="Privacy Policy, placeholder" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Privacy Policy</a><a href="#" aria-label="Terms of Service, placeholder" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Terms of Service</a></div></div>
          <p className="mt-12 select-none text-center text-[clamp(3.4rem,13vw,9.5rem)] font-black leading-none tracking-[-0.08em] text-blue-500/20">AEROMENTOR</p>
        </div>
      </footer>
    </main>
  );
}
