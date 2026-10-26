// @ts-nocheck
/* eslint-disable */
import './home.css';
import HeroScripts from './HeroScripts';

export default function HomePage() {
  return (
    <>


      {/* PostHog Analytics */}{/* Reddit Pixel */}{/* JSON-LD Structured Data */} <div className="bg-bg min-h-screen antialiased overflow-x-hidden" data-astro-cid-j7pv25f6="">  {/* intentionally empty */} <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-bg/95 backdrop-blur-sm" data-nav-inner="" data-astro-cid-5blmo7yk=""> {/* Full-width bar. Inner wrapper matches the main content container
       (1232px) so the navbar's left/right gutters align with every
       section below it. Layout is flex [logo | links | cta cluster]:
       with seven links the row is too wide to lock to the bar's true
       centre inside 1232px (the old 1fr/auto/1fr grid forced equal side
       columns and drove "Products" into the Login button), so the links
       centre in the space BETWEEN logo and cluster instead — equal
       flanking gaps, and the columns can never overlap. */} <div className="mx-auto w-full max-w-[1232px]" data-astro-cid-5blmo7yk=""> <div className="flex items-center justify-between w-full py-3.5 px-6" data-astro-cid-5blmo7yk=""> {/* Logo */} <a href="https://supermemory.ai/" className="nav-tap flex items-center gap-2.5 shrink-0 justify-self-start" data-astro-cid-5blmo7yk=""> <span className="logo-hover max-xl:w-[175px] max-xl:h-5" data-astro-cid-tvrurpns=""> <svg viewBox="0 0 210 24" fill="none" width="210" height="24" data-astro-cid-tvrurpns=""> <g clip-path="url(#logo-icon-praq2q)" className="logo-icon" data-astro-cid-tvrurpns=""> <path className="logo-stroke logo-stroke-1" d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z" fill="#0B1015" stroke="#0B1015" strokeWidth="0.5" data-astro-cid-tvrurpns=""></path> <path className="logo-stroke logo-stroke-2" d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z" fill="#0B1015" stroke="#0B1015" strokeWidth="0.5" data-astro-cid-tvrurpns=""></path> </g> <g className="logo-text" data-astro-cid-tvrurpns=""><text x="38" y="20" fill="#0B1015" fontFamily="var(--font-display), sans-serif" fontSize="20" fontWeight="700" letterSpacing="-0.5px">AeroMentor</text></g> <defs data-astro-cid-tvrurpns=""> <clipPath id="logo-icon-praq2q" data-astro-cid-tvrurpns=""> <rect width="29.6" height="24" fill="white" transform="translate(-0.006)" data-astro-cid-tvrurpns=""></rect> </clipPath> <clipPath id="logo-text-praq2q" data-astro-cid-tvrurpns=""> <rect width="159" height="18" fill="white" transform="translate(40.087 6)" data-astro-cid-tvrurpns=""></rect> </clipPath> </defs> </svg> </span> </a> {/* Nav links (hidden on mobile). Sits in the centre column of
           the grid, so its midpoint is the bar's midpoint. */} <div className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-5 px-4" data-astro-cid-5blmo7yk=""></div> {/* Right side: Login + Register (desktop) / Hamburger
           (mobile). `justify-self-end` pins this cluster to the right
           edge of its grid column so the spacing between Start
           Building and the nav's right edge equals the spacing between
           the logo and the nav's left edge. */} <div className="flex items-center gap-4 shrink-0" data-astro-cid-5blmo7yk=""> {/* Login dropdown (desktop only) */} <a href="/login" className="nav-tap flex items-center justify-center h-10 px-5 border border-border bg-[#fafafa] font-body text-[15px] font-medium tracking-[-0.01em] text-text hidden xl:flex" data-astro-cid-5blmo7yk="">Login</a> {/* Register CTA (desktop only) — matches Hero primary CTA.
             Split-button: filled-blue label + 44px arrow slot, with
             bg-color hover, arrow nudge on hover, and press scale. */} <a href="/register" className="nav-btn-primary hidden xl:flex" data-astro-cid-5blmo7yk=""> <span className="nav-btn-primary-label" data-astro-cid-5blmo7yk="">Register</span> <span className="nav-btn-primary-arrow" aria-hidden="true" data-astro-cid-5blmo7yk=""> <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" data-astro-cid-5blmo7yk=""><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" data-astro-cid-5blmo7yk=""></path></svg> </span> </a> {/* Mobile menu button — hamburger ↔ close icon cross-fade via
             data-open. Both SVGs stack in the same slot; CSS animates
             opacity + scale on each. */} <button type="button" className="mobile-toggle nav-tap xl:hidden flex items-center justify-center w-10 h-10 -mr-2 text-text" aria-label="Toggle menu" aria-expanded="false" data-mobile-toggle="" data-open="false" data-astro-cid-5blmo7yk=""> <span className="mobile-toggle-slot" data-astro-cid-5blmo7yk=""> <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mobile-toggle-icon mobile-toggle-icon--menu" data-astro-cid-5blmo7yk=""> <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" data-astro-cid-5blmo7yk=""></path> </svg> <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mobile-toggle-icon mobile-toggle-icon--close" data-astro-cid-5blmo7yk=""> <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" data-astro-cid-5blmo7yk=""></path> </svg> </span> </button> </div> </div> {/* Mobile menu drawer.
         Uses the grid-rows `0fr → 1fr` trick to animate height without
         knowing the content height in advance. The outer .mobile-menu
         is always in the DOM (no display:none); its data-open attribute
         flips grid-template-rows from 0fr to 1fr, and the inner wrapper
         clips overflow during the transition so links don't reflow. */} <div className="mobile-menu xl:hidden border-t border-border" data-mobile-menu="" data-open="false" data-astro-cid-5blmo7yk=""> <div className="mobile-menu-inner" data-astro-cid-5blmo7yk=""> <div className="flex flex-col py-4 px-6 gap-1" data-astro-cid-5blmo7yk=""> {/* Primary CTA, full width — tucked at the bottom of the
               mobile drawer so the menu doesn't take the page's primary
               action off-screen. Same visual family as the desktop nav
               CTA (.nav-btn-primary), just stretched. */} <a href="/register" className="nav-btn-primary mobile-nav-cta mt-3 flex" data-astro-cid-5blmo7yk=""> <span className="nav-btn-primary-label" data-astro-cid-5blmo7yk="">Register</span> <span className="nav-btn-primary-arrow" aria-hidden="true" data-astro-cid-5blmo7yk=""> <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" data-astro-cid-5blmo7yk=""><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" data-astro-cid-5blmo7yk=""></path></svg> </span> </a> </div> </div> </div> </div> </nav>  <main className="relative z-[2] flex flex-col items-center w-full" data-astro-cid-j7pv25f6=""> {/* Hero — FULL BLEED, outside container.
			     Pad-top clears the fixed navbar; Hero owns its own breathing room.
			     The ASCII hands plate now lives INSIDE the Hero, above the
			     headline, so there's no separate band below. */} <div className="w-full pt-[56px]" data-astro-cid-j7pv25f6=""> <section className="hero-wrap relative z-[1] w-full flex flex-col items-stretch text-center pt-4 max-md:pt-3 overflow-hidden" style={{ minHeight: '100vh' }} data-astro-cid-bbe6dxrz=""> <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-[-2]" src="/images/Create_a_minimalistic_looping(1).mp4"></video> <div className="absolute inset-0 w-full h-full bg-white/65 z-[-1]"></div> {/* Hero dot backdrop — WebGL ordered-dither halftone.
       A fragment shader renders a grid of dots whose survival is gated by a
       Bayer 8×8 ordered-dither threshold compared against a smooth radial
       intensity field (densest at the bottom-center, fading toward the top).
       Same technique as mem0's hero — softer, more organic scatter than any
       CSS mask. Falls back to no backdrop if WebGL isn't available. */} <canvas className="hero-dots" data-hero-dots="" aria-hidden="true" data-astro-cid-bbe6dxrz="" width="1896" height="931"></canvas> {/* Centered content block — fills the remaining vertical space and centers
       its children vertically. */} <div className="hero-center flex-1 flex flex-col items-center justify-center px-6 max-md:px-4 pt-12 max-md:pt-8 pb-8 max-md:pb-6" data-astro-cid-bbe6dxrz="">
              {/* Headline.
         Line wrap is intentional, not browser-balanced:
           - xl (≥1280): single line, brain mid-sentence
           - <xl: forced break after "cloud" so line 2 reads
             `for [brain] agents.` — brain anchors the second line
             with "for" and "agents" flanking it symmetrically.
         The <br className="xl:hidden"/> implements the break; on xl+ the
         <br/> is `display: none` so the browser flows it as one line. */} <h1 className="hero-step hero-headline font-heading font-medium text-text max-w-[920px]
             text-[72px] leading-[1.04] tracking-[-0.058em]
             xl:max-w-[1100px]
             max-xl:text-[60px]
             max-lg:text-[44px] max-lg:tracking-[-0.05em]
             max-md:text-[42px] max-md:leading-[1.06] max-md:tracking-[-0.046em]" data-astro-cid-bbe6dxrz="">
                AI-driven training<br className="xl:hidden" data-astro-cid-bbe6dxrz="" /> for <span className="hero-headline-brain-wrap" aria-hidden="true" data-astro-cid-bbe6dxrz=""> <img src="/Gemini_Generated_Image_lu4xmqlu4xmqlu4x-removebg-preview.webp" alt="" className="hero-headline-brain" loading="eager" fetchPriority="high" data-astro-cid-bbe6dxrz="" /> <canvas id="headline-brain-canvas" width="363" height="363" className="hero-headline-brain-canvas" data-astro-cid-bbe6dxrz=""></canvas> </span> Naval officers<span className="text-blue" data-astro-cid-bbe6dxrz="">.</span> </h1> {/* Subhead */} <p className="hero-step hero-subhead max-w-[600px] font-body text-text-muted
             text-[15px] leading-[1.6] tracking-[-0.012em]
             max-md:text-[14px] max-md:max-w-[420px]" style={{ textWrap: 'pretty' }} data-astro-cid-bbe6dxrz="">
                AeroMentor gives your training programs state-of-the-art AI assistance, smart quizzes,
                personalized progress tracking, and instant RAG-based feedback. Built for modern aviation.
              </p> {/* CTA group: 400px wide on desktop, contains a 2-col equal-width button
         row + npx pill + a quiet "personal supermemory" link beneath.
         On mobile the columns collapse to a stack (still equal width). */} <div className="hero-step hero-cta-group cta-group flex flex-col items-stretch gap-3" data-astro-cid-bbe6dxrz=""> {/* Two equal-width CTAs */} <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1 max-md:gap-2.5" data-astro-cid-bbe6dxrz=""> <a href="/register" className="btn-primary" data-astro-cid-bbe6dxrz=""> <span className="btn-primary-label" data-astro-cid-bbe6dxrz="">Register</span> <span className="btn-primary-arrow" aria-hidden="true" data-astro-cid-bbe6dxrz=""> <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" data-astro-cid-bbe6dxrz=""><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" data-astro-cid-bbe6dxrz=""></path></svg> </span> </a> <a href="mailto:amaninsane139@gmail.com" target="_blank" rel="noopener" className="btn-secondary justify-center" data-astro-cid-bbe6dxrz=""> <span data-astro-cid-bbe6dxrz="">Talk to the team</span> </a> </div> </div> {/* Customer logo ticker{/* Customer logo ticker — lives inside `.hero-center` so it shares the
         staggered entrance and breathes with the rest of the hero copy. */}
              <div className="hero-step hero-ticker-step w-full" data-astro-cid-bbe6dxrz="">
                <div className="hero-ticker" aria-label="Companies using Aeromentor" data-astro-cid-3rtzm5mn="">
                  <p className="hero-ticker-eyebrow font-body" data-astro-cid-3rtzm5mn="">
                    Trusted by elite naval officers at
                  </p>
                  <div className="font-heading text-2xl mt-3 font-medium text-text" data-astro-cid-3rtzm5mn="">
                    Naval Institute of Aviation Technology
                  </div>
                </div>

              </div>
            </div>
          </section>
            <div className="hero-hands w-full" data-astro-cid-bbe6dxrz="" style={{ opacity: 1, filter: 'none' }}>
              <div className="hands-strip" data-astro-cid-bbe6dxrz="">
                <div className="hands-bleed relative" data-hands-stage="" data-astro-cid-bbe6dxrz="">
                  <video data-hands-fast="" src="/Supermemory_files/ascii-art_fIE5.mp4" autoPlay={true} loop={true} muted={true} playsInline={true} aria-hidden="true" className="hands-video" data-astro-cid-bbe6dxrz="" style={{ transform: 'translate(0px)' }} data-faded="true"></video>
                  <video data-hands-slow="" src="/Supermemory_files/ascii-art%20(2)_fIE5.mp4" loop={true} muted={true} playsInline={true} aria-hidden="true" className="hands-video hands-video--slow" data-astro-cid-bbe6dxrz="" style={{ transform: 'translate(0px)' }} data-faded="true"></video>
                  <div className="hands-mark pointer-events-none" data-astro-cid-bbe6dxrz="">
                    <svg viewBox="0 0 153 125" fill="none" className="w-full h-auto" data-astro-cid-bbe6dxrz="">
                      <path d="M152.99 49.308H96.211V0H77.866v53.5c0 5.682 2.245 11.14 6.236 15.16l46.36 46.713 12.972-13.069-34.242-34.502H153V49.32Z" fill="#F5F9FF" data-astro-cid-bbe6dxrz=""></path>
                      <path d="M9.566 22.707 43.808 57.208H0v18.484h56.779V125h18.344V71.5c0-5.682-2.245-11.14-6.236-15.16L22.537 9.638 9.566 22.707Z" fill="#F5F9FF" data-astro-cid-bbe6dxrz=""></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* Single full-bleed hairline marks the end of the hero. The
			     cream + dots continue underneath; this is the only horizontal
			     divider on the page. */}
          <div className="w-full border-t border-border" data-astro-cid-j7pv25f6=""></div>
          {/* Rest of content in container, framed by vertical lines */}
          <div className="w-full max-w-[1232px]" data-astro-cid-j7pv25f6="">
            <div className="w-full flex flex-col items-center" data-astro-cid-j7pv25f6="">
              <div className="w-full" id="catalog-section" data-astro-cid-p4n2ralz="">
                <div className="section-header w-full container-edge bg-bg" data-section-header="" data-astro-cid-wk2votdk="" data-pinned="true">
                  <div className="section-header-inner flex items-center gap-3 px-8 max-md:px-4 py-3" data-astro-cid-wk2votdk="">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      <span className="text-blue mr-1" data-astro-cid-wk2votdk="">〉</span>PRODUCT CATALOG
                    </span>
                    <span className="flex-1" aria-hidden="true" data-astro-cid-wk2votdk=""></span>
                    <span className="font-mono text-[11px] tracking-[0.06em] text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      [<span className="text-blue" data-astro-cid-wk2votdk="">1</span>/9]
                    </span>
                  </div>
                </div>

                <div className="w-full container-edge bg-bg" data-astro-cid-p4n2ralz="">
                  {/* Two-column catalog:
         LEFT  = eyebrow + heading + sub + numbered spine + active-card text
         RIGHT = full-height plinth (illustration), with peek card below */}
                  <div className="catalog-grid" data-catalog="" data-interval="5000" data-astro-cid-p4n2ralz="">
                    {/* LEFT COLUMN */}
                    <div className="catalog-left" data-astro-cid-p4n2ralz="">
                      <div className="catalog-heading" data-astro-cid-p4n2ralz="">
                        <h2 className="catalog-heading-title font-heading" style={{ textWrap: 'balance' }} data-astro-cid-p4n2ralz="">
                          All the tools to build the perfect training program
                          <span className="text-blue" data-astro-cid-p4n2ralz="">for your cadets.</span>
                        </h2>
                        <p className="catalog-heading-sub font-body" data-astro-cid-p4n2ralz="">
                          Focused tools for evaluating, tracking, indexing, and enhancing cadet performance.
                        </p>
                      </div>
                      <ol className="catalog-spine-list" role="tablist" data-astro-cid-p4n2ralz="">
                        <li className="catalog-spine-row" data-astro-cid-p4n2ralz="">
                          <button type="button" className="catalog-spine-item" data-spine-btn="" data-index="0" aria-label="View Continual Learning" aria-current="true" role="tab" data-astro-cid-p4n2ralz="">
                            <span className="catalog-spine-num font-mono" data-astro-cid-p4n2ralz="">01</span>
                            <span className="catalog-spine-title font-heading" data-astro-cid-p4n2ralz="">Continual Learning &amp; Tracking</span>
                            <span className="catalog-spine-dot" aria-hidden="true" data-astro-cid-p4n2ralz=""></span>
                            <span className="catalog-spine-progress" aria-hidden="true" data-astro-cid-p4n2ralz="">
                              <span className="catalog-spine-progress-fill" data-progress-fill="" data-astro-cid-p4n2ralz=""></span>
                            </span>
                          </button>
                        </li>
                        <li className="catalog-spine-row" data-astro-cid-p4n2ralz="">
                          <button type="button" className="catalog-spine-item" data-spine-btn="" data-index="1" aria-label="View Instant RAG Feedback" aria-current="false" role="tab" data-astro-cid-p4n2ralz="">
                            <span className="catalog-spine-num font-mono" data-astro-cid-p4n2ralz="">02</span>
                            <span className="catalog-spine-title font-heading" data-astro-cid-p4n2ralz="">Instant RAG Feedback</span>
                            <span className="catalog-spine-dot" aria-hidden="true" data-astro-cid-p4n2ralz=""></span>
                            <span className="catalog-spine-progress" aria-hidden="true" data-astro-cid-p4n2ralz="">
                              <span className="catalog-spine-progress-fill" data-progress-fill="" data-astro-cid-p4n2ralz=""></span>
                            </span>
                          </button>
                        </li>
                        <li className="catalog-spine-row" data-astro-cid-p4n2ralz="">
                          <button type="button" className="catalog-spine-item" data-spine-btn="" data-index="2" aria-label="View Aviation Manuals" aria-current="false" role="tab" data-astro-cid-p4n2ralz="">
                            <span className="catalog-spine-num font-mono" data-astro-cid-p4n2ralz="">03</span>
                            <span className="catalog-spine-title font-heading" data-astro-cid-p4n2ralz="">Aviation Manuals</span>
                            <span className="catalog-spine-dot" aria-hidden="true" data-astro-cid-p4n2ralz=""></span>
                            <span className="catalog-spine-progress" aria-hidden="true" data-astro-cid-p4n2ralz="">
                              <span className="catalog-spine-progress-fill" data-progress-fill="" data-astro-cid-p4n2ralz=""></span>
                            </span>
                          </button>
                        </li>
                        <li className="catalog-spine-row" data-astro-cid-p4n2ralz="">
                          <button type="button" className="catalog-spine-item" data-spine-btn="" data-index="3" aria-label="View Officer Profiles" aria-current="false" role="tab" data-astro-cid-p4n2ralz="">
                            <span className="catalog-spine-num font-mono" data-astro-cid-p4n2ralz="">04</span>
                            <span className="catalog-spine-title font-heading" data-astro-cid-p4n2ralz="">Officer Profiles</span>
                            <span className="catalog-spine-dot" aria-hidden="true" data-astro-cid-p4n2ralz=""></span>
                            <span className="catalog-spine-progress" aria-hidden="true" data-astro-cid-p4n2ralz="">
                              <span className="catalog-spine-progress-fill" data-progress-fill="" data-astro-cid-p4n2ralz=""></span>
                            </span>
                          </button>
                        </li>
                      </ol>
                    </div>
                    {/* RIGHT COLUMN: plinth (illustration) → text card → peek card */}
                    <div className="catalog-right" data-astro-cid-p4n2ralz="">
                      <div className="catalog-stage" data-stage="" data-astro-cid-p4n2ralz="">
                        <article className="catalog-card" data-card="" data-index="0" aria-hidden="false" data-astro-cid-p4n2ralz="">
                          <div className="catalog-card-plinth" data-astro-cid-p4n2ralz="">
                            <img src="/Supermemory_files/Memory%20Router_fIE5.svg" alt="" className="catalog-card-illustration" loading="eager" decoding="async" data-astro-cid-p4n2ralz="" />
                          </div>
                        </article>
                        <article className="catalog-card" data-card="" data-index="1" aria-hidden="true" data-astro-cid-p4n2ralz="">
                          <div className="catalog-card-plinth" data-astro-cid-p4n2ralz="">
                            <img src="/Supermemory_files/Document%20Retrieval_fIE5.svg" alt="" className="catalog-card-illustration" loading="lazy" decoding="async" data-astro-cid-p4n2ralz="" />
                          </div>
                        </article>
                        <article className="catalog-card" data-card="" data-index="2" aria-hidden="true" data-astro-cid-p4n2ralz="">
                          <div className="catalog-card-plinth" data-astro-cid-p4n2ralz="">
                            <img src="/Supermemory_files/File%20Systems_fIE5.svg" alt="" className="catalog-card-illustration" loading="lazy" decoding="async" data-astro-cid-p4n2ralz="" />
                          </div>
                        </article>
                        <article className="catalog-card" data-card="" data-index="3" aria-hidden="true" data-astro-cid-p4n2ralz="">
                          <div className="catalog-card-plinth" data-astro-cid-p4n2ralz="">
                            <img src="/Supermemory_files/User%20Profiles_fIE5.svg" alt="" className="catalog-card-illustration" loading="lazy" decoding="async" data-astro-cid-p4n2ralz="" />
                          </div>
                        </article>

                      </div>
                      {/* Active card text, lives under the plinth on the right.
             Crossfades in lockstep with the plinth. No card stroke / no
             background fill — it sits flush on the page bg. */}
                      <div className="catalog-text-stage" data-astro-cid-p4n2ralz="">
                        <div className="catalog-text-card" data-text-card="" data-index="0" aria-hidden="false" data-astro-cid-p4n2ralz="">
                          <p className="catalog-text-eyebrow font-mono" data-astro-cid-p4n2ralz="">
                            01 · PROGRESS
                          </p>
                          <h3 className="catalog-text-title font-heading" data-astro-cid-p4n2ralz="">
                            Continual Learning &amp; Tracking
                          </h3>
                          <p className="catalog-text-desc font-body" data-astro-cid-p4n2ralz="">
                            State-of-the-art training memory that tracks every cadet's progress. Automatically identifies knowledge gaps and adapts the curriculum based on individual learning curves.
                          </p>
                        </div>
                        <div className="catalog-text-card" data-text-card="" data-index="1" aria-hidden="true" data-astro-cid-p4n2ralz="">
                          <p className="catalog-text-eyebrow font-mono" data-astro-cid-p4n2ralz="">
                            02 · RETRIEVAL
                          </p>
                          <h3 className="catalog-text-title font-heading" data-astro-cid-p4n2ralz="">
                            Instant RAG Feedback
                          </h3>
                          <p className="catalog-text-desc font-body" data-astro-cid-p4n2ralz="">
                            Hybrid search and structured context across thousands of aviation manuals at sub-300ms latency. Provides cadets with precise, verifiable answers during quizzes and simulations.
                          </p>
                        </div>
                        <div className="catalog-text-card" data-text-card="" data-index="2" aria-hidden="true" data-astro-cid-p4n2ralz="">
                          <p className="catalog-text-eyebrow font-mono" data-astro-cid-p4n2ralz="">
                            03 · FILESYSTEMS
                          </p>
                          <h3 className="catalog-text-title font-heading" data-astro-cid-p4n2ralz="">
                            Aviation Manuals
                          </h3>
                          <p className="catalog-text-desc font-body" data-astro-cid-p4n2ralz="">
                            A unified filesystem mount for all your technical documentation. Standard operating procedures, safety guidelines, and aircraft specs are automatically indexed and searchable.
                          </p>
                        </div>
                        <div className="catalog-text-card" data-text-card="" data-index="3" aria-hidden="true" data-astro-cid-p4n2ralz="">
                          <p className="catalog-text-eyebrow font-mono" data-astro-cid-p4n2ralz="">
                            04 · PROFILES
                          </p>
                          <h3 className="catalog-text-title font-heading" data-astro-cid-p4n2ralz="">
                            Officer Profiles
                          </h3>
                          <p className="catalog-text-desc font-body" data-astro-cid-p4n2ralz="">
                            Comprehensive behavioral and performance profiles that stay coherent across training modules. Evaluators get a complete view of each officer's strengths and areas for improvement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full" data-astro-cid-4c6nu67j="">
                <div className="section-header w-full container-edge bg-bg" data-section-header="" data-astro-cid-wk2votdk="" data-pinned="true">
                  <div className="section-header-inner flex items-center gap-3 px-8 max-md:px-4 py-3" data-astro-cid-wk2votdk="">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      <span className="text-blue mr-1" data-astro-cid-wk2votdk="">〉</span>WHAT WE DO
                    </span>
                    <span className="flex-1" aria-hidden="true" data-astro-cid-wk2votdk=""></span>
                    <span className="font-mono text-[11px] tracking-[0.06em] text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      [<span className="text-blue" data-astro-cid-wk2votdk="">2</span>/9]
                    </span>
                  </div>
                </div>
                <section className="w-full container-edge bg-bg px-8 max-md:px-4 pt-14 max-md:pt-10 pb-28 max-md:pb-16" data-astro-cid-4c6nu67j="">
                  {/* Heading + intro — centered, original 40px scale. Inline blue pill
       containing the SM logomark sits between the first two clauses; the
       second clause is set in brand blue. */}
                  <div className="flex flex-col items-center gap-5 mb-12 max-md:mb-8 mx-auto text-center max-w-[800px]" data-astro-cid-4c6nu67j="">
                    <h2 className="font-heading text-[40px] font-medium tracking-[-0.04em] leading-[1.05] text-text max-lg:text-[32px] max-md:text-[24px]" style={{ textWrap: 'balance' }} data-astro-cid-4c6nu67j="">
                      Bring your cadets
                      <span className="wwd-mark" aria-hidden="true" data-astro-cid-4c6nu67j="">
                        <svg viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-astro-cid-4c6nu67j="">
                          <path d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z" fill="currentColor" data-astro-cid-4c6nu67j=""></path>
                          <path d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z" fill="currentColor" data-astro-cid-4c6nu67j=""></path>
                        </svg>
                      </span>
                      <span className="text-blue" data-astro-cid-4c6nu67j="">We build the curriculum.</span>
                      Your officers just soar.
                    </h2>
                    <p className="max-w-[500px] font-body text-base font-medium leading-[1.7] text-text-muted" style={{ textWrap: 'pretty' }} data-astro-cid-4c6nu67j="">
                      Naval aviation training for the modern era. One platform, complete readiness.
                    </p>
                  </div>
                  {/* Two product surfaces: drenched API card on the left, light Personal
       card on the right. Equal widths (50/50), framed by the same hairline
       rectangle as the compare row below. */}
                  <div className="surfaces-frame grid grid-cols-2 max-lg:grid-cols-1 mb-12 max-md:mb-10" data-astro-cid-4c6nu67j="">
                    {/* API surface — drenched */}
                    <a href="https://console.aeromentor.com/" className="surface-card surface-card--drenched group relative p-12 max-md:p-7 max-sm:p-6 flex flex-col gap-[22px] max-md:gap-5 border-r border-border max-lg:border-r-0 max-lg:border-b" data-astro-cid-4c6nu67j="">
                      <canvas className="pixel-hover-canvas" data-pixel-canvas="" data-colors="#FFFFFF,#F5F9FF,#C5DBF2" data-gap="6" data-speed="28" data-trigger="" aria-hidden="true" data-astro-cid-t3qvapxg="" width="582" height="550" style={{ width: '582px', height: '550px' }}></canvas>

                      <div className="flex items-center gap-2.5" data-astro-cid-4c6nu67j="">
                        <span className="surface-glyph surface-glyph--inv" aria-hidden="true" data-astro-cid-4c6nu67j="">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-astro-cid-4c6nu67j="">
                            <path d="M9 3.5c-2 0-2.5 1-2.5 2.5v3c0 1.5-1 2.5-2.5 3 1.5.5 2.5 1.5 2.5 3v3c0 1.5.5 2.5 2.5 2.5" data-astro-cid-4c6nu67j=""></path>
                            <path d="M15 3.5c2 0 2.5 1 2.5 2.5v3c0 1.5 1 2.5 2.5 3-1.5.5-2.5 1.5-2.5 3v3c0 1.5-.5 2.5-2.5 2.5" data-astro-cid-4c6nu67j=""></path>
                          </svg>
                        </span>
                        <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-white/85 uppercase" data-astro-cid-4c6nu67j="">For instructors &amp; teams</span>
                      </div>
                      <h3 className="font-heading text-[38px] font-medium tracking-[-0.04em] leading-[1.05] text-white max-md:text-[26px]" data-astro-cid-4c6nu67j="">
                        The Aeromentor Platform
                      </h3>
                      <p className="font-body text-[15.5px] font-medium leading-[1.6] text-white/85 max-w-[440px]" style={{ textWrap: 'pretty' }} data-astro-cid-4c6nu67j="">
                        State-of-the-art training memory. Simulation, RAG, and performance tracking. One platform, complete readiness.
                      </p>
                      <div className="surface-stats grid grid-cols-3 max-sm:grid-cols-1 gap-[9px] max-sm:gap-0 border border-dashed border-white/[0.18] p-6 max-sm:p-5 mt-2" data-astro-cid-4c6nu67j="">
                        <div className="flex flex-col gap-1" data-astro-cid-4c6nu67j="">
                          <span className="font-heading text-[32px] max-md:text-[28px] font-medium tracking-[-0.028em] leading-none text-white tabular-nums" data-astro-cid-4c6nu67j="">&lt;300ms</span>
                          <span className="font-mono text-[10.5px] font-medium tracking-[0.14em] text-white/60 uppercase" data-astro-cid-4c6nu67j="">RAG Latency</span>
                        </div>
                        <div className="flex flex-col gap-1 border-l border-dashed border-white/[0.18] pl-6 max-sm:border-l-0 max-sm:border-t max-sm:pl-0 max-sm:pt-4 max-sm:mt-1" data-astro-cid-4c6nu67j="">
                          <span className="font-heading text-[32px] max-md:text-[28px] font-medium tracking-[-0.028em] leading-none text-white tabular-nums" data-astro-cid-4c6nu67j="">10,000+</span>
                          <span className="font-mono text-[10.5px] font-medium tracking-[0.14em] text-white/60 uppercase" data-astro-cid-4c6nu67j="">Flight hours logged</span>
                        </div>
                        <div className="flex flex-col gap-1 border-l border-dashed border-white/[0.18] pl-6 max-sm:border-l-0 max-sm:border-t max-sm:pl-0 max-sm:pt-4 max-sm:mt-1" data-astro-cid-4c6nu67j="">
                          <span className="font-heading text-[32px] max-md:text-[28px] font-medium tracking-[-0.028em] leading-none text-white" data-astro-cid-4c6nu67j="">#1</span>
                          <span className="font-mono text-[10.5px] font-medium tracking-[0.14em] text-white/60 uppercase" data-astro-cid-4c6nu67j="">In Training Outcomes</span>
                        </div>
                      </div>
                      <p className="font-body text-[13px] text-white/75" data-astro-cid-4c6nu67j="">
                        Secure · On-Premise Ready · Comprehensive Analytics
                      </p>
                      <span className="surface-cta surface-cta--inv mt-auto" data-astro-cid-4c6nu67j="">
                        Start training in 5 minutes
                        <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" data-astro-cid-4c6nu67j="">
                          <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" data-astro-cid-4c6nu67j=""></path>
                        </svg>
                      </span>
                    </a>
                    {/* Personal surface — light */}
                    <a href="https://app.aeromentor.com/" className="surface-card surface-card--light group relative p-12 max-md:p-7 max-sm:p-6 flex flex-col gap-[22px] max-md:gap-5" data-astro-cid-4c6nu67j="">
                      <canvas className="pixel-hover-canvas" data-pixel-canvas="" data-colors="#0562EF,#6FA8F5,#C5DBF2" data-gap="6" data-speed="28" data-trigger="" aria-hidden="true" data-astro-cid-t3qvapxg="" width="582" height="550" style={{ width: '582px', height: '550px' }}></canvas>
                      <div className="flex items-center gap-2.5" data-astro-cid-4c6nu67j="">
                        <span className="surface-glyph surface-glyph--brand" aria-hidden="true" data-astro-cid-4c6nu67j="">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-astro-cid-4c6nu67j="">
                            <circle cx="12" cy="8" r="3.5" data-astro-cid-4c6nu67j=""></circle>
                            <path d="M5 20c0-3.5 3.13-6 7-6s7 2.5 7 6" data-astro-cid-4c6nu67j=""></path>
                          </svg>
                        </span>
                        <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-text-dim uppercase" data-astro-cid-4c6nu67j="">For Cadets</span>
                      </div>
                      <h3 className="font-heading text-[32px] font-medium tracking-[-0.035em] leading-[1.08] text-text max-md:text-[24px]" data-astro-cid-4c6nu67j="">
                        Personal Dashboard
                      </h3>
                      <p className="font-body text-[14.5px] font-medium leading-[1.65] text-text-muted max-w-[360px]" style={{ textWrap: 'pretty' }} data-astro-cid-4c6nu67j="">
                        One unified progress tracker across all your modules. What you learn, Aeromentor remembers.
                      </p>
                      <div className="flex flex-col gap-0 border-t border-border" data-astro-cid-4c6nu67j="">
                        <div className="flex items-center justify-between gap-4 py-3.5 border-b border-border" data-astro-cid-4c6nu67j="">
                          <div className="flex items-center gap-2.5 min-w-0" data-astro-cid-4c6nu67j="">
                            <span className="surface-row-icon" aria-hidden="true" data-astro-cid-4c6nu67j="">
                              <img src="/Supermemory_files/favicon_fIE5.svg" alt="" width="18" height="18" loading="lazy" decoding="async" data-astro-cid-4c6nu67j="" />
                            </span>
                            <span className="font-heading text-[14.5px] font-medium text-text truncate" data-astro-cid-4c6nu67j="">Aeromentor App</span>
                          </div>
                          <span className="font-body text-[12.5px] text-text-dim text-right shrink-0" data-astro-cid-4c6nu67j="">Training portal</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 py-3.5 border-b border-border" data-astro-cid-4c6nu67j="">
                          <div className="flex items-center gap-2.5 min-w-0" data-astro-cid-4c6nu67j="">
                            <span className="surface-row-icon" aria-hidden="true" data-astro-cid-4c6nu67j="">
                              <img src="/Supermemory_files/favicon_fIE5.svg" alt="" width="18" height="18" loading="lazy" decoding="async" data-astro-cid-4c6nu67j="" />
                            </span>
                            <span className="font-heading text-[14.5px] font-medium text-text truncate" data-astro-cid-4c6nu67j="">Simulator Integration</span>
                          </div>
                          <span className="font-body text-[12.5px] text-text-dim text-right shrink-0" data-astro-cid-4c6nu67j="">Real-time feedback</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 py-3.5" data-astro-cid-4c6nu67j="">
                          <div className="flex items-center gap-2.5 min-w-0" data-astro-cid-4c6nu67j="">
                            <span className="surface-row-icon" aria-hidden="true" data-astro-cid-4c6nu67j="">
                              <img src="/Supermemory_files/favicon_fIE5.svg" alt="" width="18" height="18" loading="lazy" decoding="async" data-astro-cid-4c6nu67j="" />
                            </span>
                            <span className="font-heading text-[14.5px] font-medium text-text truncate" data-astro-cid-4c6nu67j="">Aviation Manuals</span>
                          </div>
                          <span className="font-body text-[12.5px] text-text-dim text-right shrink-0" data-astro-cid-4c6nu67j="">One-click access</span>
                        </div>
                      </div>

                      <span className="surface-cta mt-auto" data-astro-cid-4c6nu67j="">
                        Access your dashboard
                        <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" data-astro-cid-4c6nu67j="">
                          <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" data-astro-cid-4c6nu67j=""></path>
                        </svg>
                      </span>
                    </a>
                  </div>
                  {/* Aeromentor-vs-RAG wedge: dashed frame, interior vertical divider, ticks at all 6 intersections */}
                  <div className="cf-frame grid grid-cols-2 max-md:grid-cols-1" data-astro-cid-4c6nu67j="">
                    {/* 4 outer corners + 2 interior crosses where the vertical divider hits top/bottom */}
                    <span className="cf-tick cf-tick-tl" data-astro-cid-4c6nu67j=""></span>
                    <span className="cf-tick cf-tick-tr" data-astro-cid-4c6nu67j=""></span>
                    <span className="cf-tick cf-tick-bl" data-astro-cid-4c6nu67j=""></span>
                    <span className="cf-tick cf-tick-br" data-astro-cid-4c6nu67j=""></span>
                    {/* Vector DB / RAG — legacy / rejected.
         Visual rejection cues:
         (1) Status chip with an × glyph reads "LEGACY".
         (2) Headline carries a hairline strikethrough at decoration-color
             matched to text-dim so it doesn't shout, just registers.
         (3) Bullet markers are × glyphs instead of dashes.
         (4) Whole cell is slightly faded via opacity so it visually
             recedes against the active Aeromentor side. */}
                    <div className="cf-cell cf-cell-r cf-cell--legacy p-10 max-md:p-6 relative flex flex-col" data-astro-cid-4c6nu67j="">
                      <span className="cf-tick cf-tick-cross hidden md:block" style={{ top: '-5px', right: '-5px' }} data-astro-cid-4c6nu67j=""></span>
                      <span className="cf-tick cf-tick-cross hidden md:block" style={{ bottom: '-5px', right: '-5px' }} data-astro-cid-4c6nu67j=""></span>
                      <div className="flex items-center gap-2.5 mb-3" data-astro-cid-4c6nu67j="">
                        <span className="cf-status cf-status--legacy" aria-hidden="true" data-astro-cid-4c6nu67j="">
                          <svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" data-astro-cid-4c6nu67j="">
                            <path d="M2 2l6 6M8 2l-6 6" data-astro-cid-4c6nu67j=""></path>
                          </svg>
                        </span>
                        <h3 className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-text-dim" data-astro-cid-4c6nu67j="">
                          Legacy · Static Manuals
                        </h3>
                      </div>
                      <p className="cf-headline cf-headline--legacy font-heading text-[22px] font-medium tracking-[-0.03em] leading-[1.3] text-text-muted max-md:text-[19px]" style={{ textWrap: 'balance' }} data-astro-cid-4c6nu67j="">
                        Reads chapters. Tests on chapters. Each cadet starts from zero.
                      </p>
                      <ul className="mt-8 flex flex-col gap-[14px] font-body text-[14px] text-text-dim" data-astro-cid-4c6nu67j="">
                        <li className="flex items-start gap-3" data-astro-cid-4c6nu67j="">
                          <span className="cf-mark cf-mark--legacy mt-[2px]" aria-hidden="true" data-astro-cid-4c6nu67j="">
                            <svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" data-astro-cid-4c6nu67j="">
                              <path d="M2 2l6 6M8 2l-6 6" data-astro-cid-4c6nu67j=""></path>
                            </svg>
                          </span>
                          <span data-astro-cid-4c6nu67j="">Static PDFs, generic quizzes</span>
                        </li>
                        <li className="flex items-start gap-3" data-astro-cid-4c6nu67j="">
                          <span className="cf-mark cf-mark--legacy mt-[2px]" aria-hidden="true" data-astro-cid-4c6nu67j="">
                            <svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" data-astro-cid-4c6nu67j="">
                              <path d="M2 2l6 6M8 2l-6 6" data-astro-cid-4c6nu67j=""></path>
                            </svg>
                          </span>
                          <span data-astro-cid-4c6nu67j="">One-size-fits-all; no adaptive logic</span>
                        </li>
                        <li className="flex items-start gap-3" data-astro-cid-4c6nu67j="">
                          <span className="cf-mark cf-mark--legacy mt-[2px]" aria-hidden="true" data-astro-cid-4c6nu67j="">
                            <svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" data-astro-cid-4c6nu67j="">
                              <path d="M2 2l6 6M8 2l-6 6" data-astro-cid-4c6nu67j=""></path>
                            </svg>
                          </span>
                          <span data-astro-cid-4c6nu67j="">Testing, not true learning</span>
                        </li>
                      </ul>
                    </div>
                    {/* Aeromentor — current / in production.
         Visual emphasis cues:
         (1) Status chip is a solid blue square, "IN PRODUCTION".
         (2) Headline is ink-bold, not muted; tight letter-spacing.
         (3) Slightly more left padding gives the cell visual weight. */}
                    <div className="cf-cell cf-cell--current p-10 pl-12 max-md:p-6 flex flex-col" data-astro-cid-4c6nu67j="">
                      <div className="flex items-center gap-2 mb-3" data-astro-cid-4c6nu67j="">
                        <span className="cf-logomark" aria-hidden="true" data-astro-cid-4c6nu67j="">
                          <svg viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-astro-cid-4c6nu67j="">
                            <path d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z" fill="currentColor" data-astro-cid-4c6nu67j=""></path>
                            <path d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z" fill="currentColor" data-astro-cid-4c6nu67j=""></path>
                          </svg>
                        </span>
                        <h3 className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-blue" data-astro-cid-4c6nu67j="">Aeromentor</h3>
                      </div>
                      <p className="font-heading text-[22px] font-medium tracking-[-0.03em] leading-[1.3] text-text max-md:text-[19px]" style={{ textWrap: 'balance' }} data-astro-cid-4c6nu67j="">
                        Training that evolves. Curriculum that adapts, reinforces, and targets weaknesses across every session.
                      </p>
                      <ul className="mt-8 flex flex-col gap-[14px] font-body text-[14px] text-text" data-astro-cid-4c6nu67j="">
                        <li className="flex items-start gap-3" data-astro-cid-4c6nu67j="">
                          <span className="text-blue mt-[7px] block w-2 h-2 bg-current" aria-hidden="true" data-astro-cid-4c6nu67j=""></span><span data-astro-cid-4c6nu67j="">Officer profiles and adaptive learning paths</span>
                        </li>
                        <li className="flex items-start gap-3" data-astro-cid-4c6nu67j="">
                          <span className="text-blue mt-[7px] block w-2 h-2 bg-current" aria-hidden="true" data-astro-cid-4c6nu67j=""></span><span data-astro-cid-4c6nu67j="">Track, adapt, reinforce, master</span>
                        </li>
                        <li className="flex items-start gap-3" data-astro-cid-4c6nu67j="">
                          <span className="text-blue mt-[7px] block w-2 h-2 bg-current" aria-hidden="true" data-astro-cid-4c6nu67j=""></span><span data-astro-cid-4c6nu67j="">One platform: learn, simulate, succeed</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
              <section className="w-full" id="how-it-works" aria-labelledby="how-it-works-heading" data-astro-cid-cmgpsf2k="">
                <div className="section-header w-full container-edge bg-bg" data-section-header="" data-astro-cid-wk2votdk="" data-pinned="true">
                  <div className="section-header-inner flex items-center gap-3 px-8 max-md:px-4 py-3" data-astro-cid-wk2votdk="">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      <span className="text-blue mr-1" data-astro-cid-wk2votdk="">〉</span>HOW IT WORKS
                    </span>
                    <span className="flex-1" aria-hidden="true" data-astro-cid-wk2votdk=""></span>
                    <span className="font-mono text-[11px] tracking-[0.06em] text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      [<span className="text-blue" data-astro-cid-wk2votdk="">3</span>/9]
                    </span>
                  </div>
                </div>
                <h2 id="how-it-works-heading" className="sr-only" data-astro-cid-cmgpsf2k="">
                  How it works
                </h2>
                <div className="w-full container-edge bg-bg" data-astro-cid-cmgpsf2k="">
                  <div className="hiw-headline" data-astro-cid-cmgpsf2k="">
                    <h3 className="hiw-headline-title font-heading text-text" data-astro-cid-cmgpsf2k="">
                      How it
                      <span style={{ color: '#0562ef' }} data-astro-cid-cmgpsf2k="">works.</span>
                    </h3>
                    <p className="hiw-headline-sub font-body" data-astro-cid-cmgpsf2k="">
                      Three phases, one mission. Track, simulate. Then a final step that delivers true combat readiness.
                    </p>
                  </div>
                  <div className="hiw-bento-wrap px-8 max-md:px-4 pb-28 max-md:pb-16" data-astro-cid-cmgpsf2k="">
                    <div className="hiw-bento flex flex-col w-full border border-border bg-bg overflow-clip" data-astro-cid-cmgpsf2k="">
                      {/* Step 01: Image Left, Text Right */}
                      <div className="hiw-cell grid grid-cols-2 max-md:grid-cols-1 border-b border-border" data-astro-cid-cmgpsf2k="">
                        <div className="hiw-illo border-r max-md:border-r-0 max-md:border-b border-border relative flex items-center justify-center overflow-hidden bg-[#e4effd]" style={{ aspectRatio: '2840/2123' }} data-astro-cid-cmgpsf2k="">
                          <img src="/Supermemory_files/ingest_fIE5.webp" alt="" loading="lazy" decoding="async" className="hiw-fig" data-astro-cid-cmgpsf2k="" />
                        </div>
                        <div className="hiw-copy flex flex-col justify-center gap-[14px] p-10 max-md:p-8" data-astro-cid-cmgpsf2k="">
                          <span className="font-mono" style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.18em', lineHeight: '14px', color: '#0562ef', textTransform: 'uppercase' }} data-astro-cid-cmgpsf2k="">
                            01 / TRACK
                          </span>
                          <h4 className="font-heading text-text" style={{ fontSize: '26px', fontWeight: '500', letterSpacing: '-0.02em', lineHeight: '118%', margin: '0', textWrap: 'balance' }} data-astro-cid-cmgpsf2k="">
                            Bring in any type of training data, from anywhere.
                          </h4>
                          <p className="font-body" style={{ fontSize: '15.5px', letterSpacing: '-0.003em', lineHeight: '160%', color: 'rgba(11, 16, 21, 0.62)', margin: '0', textWrap: 'pretty' }} data-astro-cid-cmgpsf2k="">
                            Aeromentor automatically parses flight logs, simulator telemetry, NIAT manuals, and officer evaluations in real-time.
                          </p>
                        </div>
                      </div>

                      {/* Step 02: Text Left, Image Right */}
                      <div className="hiw-cell grid grid-cols-2 max-md:grid-cols-1 border-b border-border" data-astro-cid-cmgpsf2k="">
                        <div className="hiw-copy flex flex-col justify-center gap-[14px] p-10 max-md:p-8 max-md:order-2" data-astro-cid-cmgpsf2k="">
                          <span className="font-mono" style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.18em', lineHeight: '14px', color: '#0562ef', textTransform: 'uppercase' }} data-astro-cid-cmgpsf2k="">
                            02 / SIMULATE
                          </span>
                          <h4 className="font-heading text-text" style={{ fontSize: '26px', fontWeight: '500', letterSpacing: '-0.02em', lineHeight: '118%', margin: '0', textWrap: 'balance' }} data-astro-cid-cmgpsf2k="">
                            Queries from inside our custom engine.
                          </h4>
                          <p className="font-body" style={{ fontSize: '15.5px', letterSpacing: '-0.003em', lineHeight: '160%', color: 'rgba(11, 16, 21, 0.62)', margin: '0', textWrap: 'pretty' }} data-astro-cid-cmgpsf2k="">
                            Aeromentor, manuals, and profiles live in the same queryable graph. Generate dynamic simulator scenarios tailored to individual weaknesses instantly.
                          </p>
                        </div>
                        <div className="hiw-illo border-l max-md:border-l-0 max-md:border-b border-border relative flex items-center justify-center overflow-hidden max-md:order-1" style={{ background: `linear-gradient(0deg, #f9fcff 53.533%, #89bdff 165.59%)`, aspectRatio: '2840/2123' }} data-astro-cid-cmgpsf2k="">
                          <img src="/Supermemory_files/retrieve_fIE5.webp" alt="" loading="lazy" decoding="async" className="hiw-fig" data-astro-cid-cmgpsf2k="" />
                        </div>
                      </div>

                      {/* Step 03: Payoff */}
                      <div className="hiw-payoff relative w-full overflow-clip" style={{ height: '340px', backgroundColor: '#07224f', backgroundImage: 'url("/Supermemory_files/payoff-bg.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: '#faf7f2' }} data-astro-cid-cmgpsf2k="">
                        <img src="/Supermemory_files/payoff-phone-mockup_fIE5.webp" alt="" loading="lazy" decoding="async" className="hiw-payoff-phone" style={{ position: 'absolute', right: '40px', bottom: '-480px', height: '820px', width: 'auto', display: 'block', pointerEvents: 'none', zIndex: '1' }} data-astro-cid-cmgpsf2k="" />
                        <div className="hiw-payoff-text relative z-[2] flex flex-col justify-center gap-[18px] p-[48px_0_48px_40px] h-full box-border" style={{ width: '680px' }} data-astro-cid-cmgpsf2k="">
                          <div className="flex items-center gap-[10px]" data-astro-cid-cmgpsf2k="">
                            <span className="font-mono text-white whitespace-nowrap uppercase" style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.18em', lineHeight: '14px' }} data-astro-cid-cmgpsf2k="">03 / COMBAT READINESS</span>
                          </div>
                          <h4 className="font-heading text-[#faf7f2] m-0" style={{ fontSize: '44px', fontWeight: '500', letterSpacing: '-0.04em', lineHeight: '102%', width: '560px' }} data-astro-cid-cmgpsf2k="">
                            Sub-300ms scenario generation, every session.
                          </h4>
                          <p className="font-body m-0" style={{ fontSize: '15.5px', letterSpacing: '-0.003em', lineHeight: '155%', color: 'rgba(250, 247, 242, 0.7)', width: '520px' }} data-astro-cid-cmgpsf2k="">
                            Steps 01–02 are the build. This is the payoff: instructors generate tailored simulator scenarios and feedback in real-time, not hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="w-full" id="use-cases" aria-labelledby="use-cases-heading" data-astro-cid-5b4siwv2="">
                <div className="section-header w-full container-edge bg-bg" data-section-header="" data-astro-cid-wk2votdk="" data-pinned="true">
                  <div className="section-header-inner flex items-center gap-3 px-8 max-md:px-4 py-3" data-astro-cid-wk2votdk="">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      <span className="text-blue mr-1" data-astro-cid-wk2votdk="">〉</span>USE CASES
                    </span>
                    <span className="flex-1" aria-hidden="true" data-astro-cid-wk2votdk=""></span>
                    <span className="font-mono text-[11px] tracking-[0.06em] text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      [<span className="text-blue" data-astro-cid-wk2votdk="">5</span>/9]
                    </span>
                  </div>
                </div>
                <h2 id="use-cases-heading" className="sr-only" data-astro-cid-5b4siwv2="">
                  Use cases
                </h2>
                <div className="w-full container-edge bg-bg" data-astro-cid-5b4siwv2="">
                  <div className="uc-headline" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '48px', padding: '56px 32px 48px 32px', width: '100%', boxSizing: 'border-box' }} data-astro-cid-5b4siwv2="">
                    <h3 className="font-heading text-text" style={{ fontSize: '47px', fontWeight: '500', letterSpacing: '-0.04em', lineHeight: '1.05', flex: '1', minWidth: '0', maxWidth: '760px', margin: '0' }} data-astro-cid-5b4siwv2="">
                      <span style={{ display: 'block' }} data-astro-cid-5b4siwv2="">Optimized for<span style={{ color: '#0562ef' }} data-astro-cid-5b4siwv2="">speed, accuracy and exam readiness.</span></span>
                      <span style={{ display: 'block' }} data-astro-cid-5b4siwv2="">Or configurable for each use case.</span>
                    </h3>
                    <div className="uc-cta-cluster" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: '0' }} data-astro-cid-5b4siwv2="">
                      <button type="button" data-uc-prev="" aria-label="Previous use case" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', background: '#ffffff', color: '#0b1015', fontSize: '14px', cursor: 'pointer', padding: '0' }} data-astro-cid-5b4siwv2="">
                        ←
                      </button>
                      <button type="button" data-uc-next="" aria-label="Next use case" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', background: '#ffffff', color: '#0b1015', fontSize: '14px', cursor: 'pointer', padding: '0' }} data-astro-cid-5b4siwv2="">
                        →
                      </button>
                    </div>
                  </div>
                  <div className="uc-cards-scroll" style={{ width: '100%', overflowX: 'auto', paddingBottom: '112px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} data-uc-scroller="" data-astro-cid-5b4siwv2="">
                    <div className="uc-cards-row" style={{ display: 'flex', flexDirection: 'row', gap: '20px', padding: '0 56px 0 32px', width: 'max-content', boxSizing: 'border-box', alignItems: 'stretch' }} data-astro-cid-5b4siwv2="">
                      <article className="uc-card" style={{
                        width: '360px', flexShrink: '0', display: 'flex', flexDirection: 'column', gap: '24px', padding: '28px', border: 'none', background: `linear-gradient(
                          160deg,
                          #00c2d8 0%,
                          #0562ef 50%,
                          #0015ff 100%
                        ),
                        radial-gradient(
                          120% 90% at 30% 100%,
                          rgba(0, 21, 255, 0.4) 0%,
                          transparent 60%
                        )`, backgroundBlendMode: 'soft-light, normal', boxSizing: 'border-box', position: 'relative', overflow: 'clip'
                      }} data-astro-cid-5b4siwv2="">
                        <span className="uc-eyebrow font-mono" style={{ color: '#ffffff' }} data-astro-cid-5b4siwv2="">
                          <span className="uc-eyebrow-dot" aria-hidden="true" style={{ background: '#ffffff' }} data-astro-cid-5b4siwv2=""></span>Smart Quizzes</span>
                        <h4 className="font-heading" style={{ fontSize: '28px', fontWeight: '500', letterSpacing: '-0.022em', lineHeight: '1.1', color: '#ffffff', margin: '0', position: 'relative' }} data-astro-cid-5b4siwv2="">Quizzes that adapt to your knowledge gaps.</h4>
                        <p className="font-body" style={{ fontSize: '14.5px', letterSpacing: '-0.003em', lineHeight: '1.55', color: 'rgba(255, 255, 255, 0.78)', margin: '0', position: 'relative' }} data-astro-cid-5b4siwv2="">
                          Persistent context and reasoning memory. Chats, docs, and
                          user data unified so assistants adapt over time.
                        </p>
                      </article>
                      <article className="uc-card" style={{
                        width: '360px', flexShrink: '0', display: 'flex', flexDirection: 'column', gap: '24px', padding: '28px', border: '1px solid var(--color-border)', background: `linear-gradient(
                        160deg,
                        #edf3fc 0%,
                        #faf7f2 100%
                      )`, boxSizing: 'border-box', position: 'relative', overflow: 'clip'
                      }} data-astro-cid-5b4siwv2="">
                        <span className="uc-eyebrow font-mono" style={{ color: '#0562ef' }} data-astro-cid-5b4siwv2="">
                          <span className="uc-eyebrow-dot" aria-hidden="true" style={{ background: '#0562ef' }} data-astro-cid-5b4siwv2=""></span>Aviation Library</span>
                        <h4 className="font-heading" style={{ fontSize: '28px', fontWeight: '500', letterSpacing: '-0.022em', lineHeight: '1.1', color: '#0b1015', margin: '0', position: 'relative' }} data-astro-cid-5b4siwv2="">Extensive library for all aircraft types.</h4>
                        <p className="font-body" style={{ fontSize: '14.5px', letterSpacing: '-0.003em', lineHeight: '1.55', color: 'rgba(11, 16, 21, 0.62)', margin: '0', position: 'relative' }} data-astro-cid-5b4siwv2="">
                          Ingest, sync, and retrieve from any source, so your agents
                          always have the latest context, not stale snapshots.
                        </p>
                      </article>
                      <article className="uc-card" style={{
                        width: '360px', flexShrink: '0', display: 'flex', flexDirection: 'column', gap: '24px', padding: '28px', border: '1px solid var(--color-border)', background: `linear-gradient(
                        160deg,
                        #edf3fc 0%,
                        #faf7f2 100%
                      )`, boxSizing: 'border-box', position: 'relative', overflow: 'clip'
                      }} data-astro-cid-5b4siwv2="">
                        <span className="uc-eyebrow font-mono" style={{ color: '#0562ef' }} data-astro-cid-5b4siwv2="">
                          <span className="uc-eyebrow-dot" aria-hidden="true" style={{ background: '#0562ef' }} data-astro-cid-5b4siwv2=""></span>Tactical Scenarios</span>
                        <h4 className="font-heading" style={{ fontSize: '28px', fontWeight: '500', letterSpacing: '-0.022em', lineHeight: '1.1', color: '#0b1015', margin: '0', position: 'relative' }} data-astro-cid-5b4siwv2="">Advance Technical Queries.</h4>
                        <p className="font-body" style={{ fontSize: '14.5px', letterSpacing: '-0.003em', lineHeight: '1.55', color: 'rgba(11, 16, 21, 0.62)', margin: '0', position: 'relative' }} data-astro-cid-5b4siwv2="">
                          Keep your agents grounded in up-to-date facts from every
                          source (docs, APIs, internal tools), synced and
                          retrievable in milliseconds.
                        </p>
                      </article>
                      <article className="uc-card" style={{
                        width: '360px', flexShrink: '0', display: 'flex', flexDirection: 'column', gap: '24px', padding: '28px', border: '1px solid var(--color-border)', background: `linear-gradient(
                        160deg,
                        #edf3fc 0%,
                        #faf7f2 100%
                      )`, boxSizing: 'border-box', position: 'relative', overflow: 'clip'
                      }} data-astro-cid-5b4siwv2="">
                        <span className="uc-eyebrow font-mono" style={{ color: '#0562ef' }} data-astro-cid-5b4siwv2="">
                          <span className="uc-eyebrow-dot" aria-hidden="true" style={{ background: '#0562ef' }} data-astro-cid-5b4siwv2=""></span>NIAT Focus</span>
                        <h4 className="font-heading" style={{ fontSize: '28px', fontWeight: '500', letterSpacing: '-0.022em', lineHeight: '1.1', color: '#0b1015', margin: '0', position: 'relative' }} data-astro-cid-5b4siwv2="">Used by NIAT only.</h4>
                        <p className="font-body" style={{ fontSize: '14.5px', letterSpacing: '-0.003em', lineHeight: '1.55', color: 'rgba(11, 16, 21, 0.62)', margin: '0', position: 'relative' }} data-astro-cid-5b4siwv2="">
                          Naval docs, manuals, and institutional knowledge: searchable and always current for every cadet.
                        </p>
                      </article>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
          {/* Back to light for social proof + pricing + FAQ + closing wordmark.
			     Wordmark stays inside the same container so the vertical edge
			     lines continue all the way down. */}
          <div className="w-full max-w-[1232px]" data-astro-cid-j7pv25f6="">
            <div className="w-full flex flex-col items-center" data-astro-cid-j7pv25f6="">
              <section className="w-full" id="enterprise" aria-labelledby="enterprise-heading" data-astro-cid-5pummn72="">
                <div className="section-header w-full container-edge bg-bg" data-section-header="" data-astro-cid-wk2votdk="" data-pinned="true">
                  <div className="section-header-inner flex items-center gap-3 px-8 max-md:px-4 py-3" data-astro-cid-wk2votdk="">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      <span className="text-blue mr-1" data-astro-cid-wk2votdk="">〉</span>ACADEMY</span>
                    <span className="flex-1" aria-hidden="true" data-astro-cid-wk2votdk=""></span>
                    <span className="font-mono text-[11px] tracking-[0.06em] text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      [<span className="text-blue" data-astro-cid-wk2votdk="">6</span>/9]
                    </span>
                  </div>
                </div>
                <h2 id="enterprise-heading" className="sr-only" data-astro-cid-5pummn72="">Academy</h2>
                <div className="w-full container-edge bg-bg" data-astro-cid-5pummn72="">
                  <div className="enterprise-headline flex flex-col items-center text-center" style={{ gap: '16px', padding: '56px 96px 48px 96px' }} data-astro-cid-5pummn72="">
                    <h3 className="font-heading text-text" style={{ fontSize: '56px', fontWeight: '500', letterSpacing: '-0.04em', lineHeight: '1.02', maxWidth: '880px', margin: '0' }} data-astro-cid-5pummn72="">Aeromentor <span>trains everywhere.</span>
                    </h3>
                    <p className="font-body" style={{ fontSize: '17px', letterSpacing: '-0.005em', lineHeight: '1.55', color: 'rgba(11, 16, 21, 0.6)', maxWidth: '560px', margin: '4px 0 0 0' }} data-astro-cid-5pummn72="">
                      Aeromentor runs on-prem, on your cloud, or fully air-gapped —
                      with the same API, the same SLAs, and a paper trail your
                      security team will actually read.
                    </p>
                  </div>
                  <div className="enterprise-row-1 border-t border-border" style={{ display: 'flex', minHeight: '290px' }} data-astro-cid-5pummn72="">
                    <div className="enterprise-cell-runtime" style={{ flex: '1 1 0%', position: 'relative', overflow: 'clip', padding: '32px', display: 'flex', flexDirection: 'column', gap: '22px', backgroundImage: 'url(&quot', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'var(--color-bg)', borderRight: '1px solid var(--color-border)' }} data-astro-cid-5pummn72="">
                      <div className="relative" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', outline: '1px solid rgba(5, 98, 239, 0.1)', padding: '8px 12px', display: 'flex', alignItems: 'center', zIndex: '1' }} data-astro-cid-5pummn72="">
                        <span className="font-mono text-blue" style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.18em', lineHeight: '14px', textTransform: 'uppercase' }} data-astro-cid-5pummn72="">
                          01 / ON PREMISES
                        </span>
                      </div>
                      <div className="enterprise-visual-slot relative" style={{ height: '101px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: '0', zIndex: '1' }} data-astro-cid-5pummn72="">
                        <img src="/Supermemory_files/on-prem_fIE5.webp" alt="" loading="lazy" decoding="async" style={{ display: 'block', objectFit: 'contain', flexShrink: '0', width: '101px', height: '101px', marginLeft: '-28px' }} data-astro-cid-5pummn72="" />
                      </div>
                      <div className="relative" style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: '1' }} data-astro-cid-5pummn72="">
                        <h4 className="font-heading text-text" style={{ fontSize: '22px', fontWeight: '500', letterSpacing: '-0.02em', lineHeight: '1.15', margin: '0' }} data-astro-cid-5pummn72="">
                          In your data center.
                        </h4>
                        <p className="font-body" style={{ fontSize: '14.5px', letterSpacing: '-0.003em', lineHeight: '1.55', color: 'rgba(11, 16, 21, 0.62)', margin: '0' }} data-astro-cid-5pummn72="">
                          Self-host on bare metal or your own Kubernetes. Zero data
                          leaves your perimeter.
                        </p>
                      </div>
                    </div>
                    <div className="enterprise-cell-runtime" style={{ flex: '1 1 0%', position: 'relative', overflow: 'clip', padding: '32px', display: 'flex', flexDirection: 'column', gap: '22px', backgroundImage: 'url(&quot', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'var(--color-bg)', borderRight: '1px solid var(--color-border)' }} data-astro-cid-5pummn72="">
                      <div className="relative" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', outline: '1px solid rgba(5, 98, 239, 0.1)', padding: '8px 12px', display: 'flex', alignItems: 'center', zIndex: '1' }} data-astro-cid-5pummn72="">
                        <span className="font-mono text-blue" style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.18em', lineHeight: '14px', textTransform: 'uppercase' }} data-astro-cid-5pummn72="">
                          02 / YOUR CLOUD
                        </span>
                      </div>
                      <div className="enterprise-visual-slot relative" style={{ height: '101px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: '0', zIndex: '1' }} data-astro-cid-5pummn72="">
                        <img src="/Supermemory_files/your-cloud_fIE5.webp" alt="" loading="lazy" decoding="async" style={{ display: 'block', objectFit: 'contain', flexShrink: '0', width: '67px', height: '67px' }} data-astro-cid-5pummn72="" />
                      </div>
                      <div className="relative" style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: '1' }} data-astro-cid-5pummn72="">
                        <h4 className="font-heading text-text" style={{ fontSize: '22px', fontWeight: '500', letterSpacing: '-0.02em', lineHeight: '1.15', margin: '0' }} data-astro-cid-5pummn72="">
                          In your VPC.
                        </h4>
                        <p className="font-body" style={{ fontSize: '14.5px', letterSpacing: '-0.003em', lineHeight: '1.55', color: 'rgba(11, 16, 21, 0.62)', margin: '0' }} data-astro-cid-5pummn72="">
                          Deploy to AWS, GCP, or Azure inside your account. BYOC
                          from day one.
                        </p>
                      </div>
                    </div>
                    <div className="enterprise-cell-runtime" style={{ flex: '1 1 0%', position: 'relative', overflow: 'clip', padding: '32px', display: 'flex', flexDirection: 'column', gap: '22px', backgroundImage: 'url(&quot', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'var(--color-bg)' }} data-astro-cid-5pummn72="">
                      <div className="relative" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', outline: '1px solid rgba(5, 98, 239, 0.1)', padding: '8px 12px', display: 'flex', alignItems: 'center', zIndex: '1' }} data-astro-cid-5pummn72="">
                        <span className="font-mono text-blue" style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.18em', lineHeight: '14px', textTransform: 'uppercase' }} data-astro-cid-5pummn72="">
                          03 / LOCAL
                        </span>
                      </div>
                      <div className="enterprise-visual-slot relative" style={{ height: '101px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: '0', zIndex: '1' }} data-astro-cid-5pummn72="">
                        <img src="/Supermemory_files/local_fIE5.webp" alt="" loading="lazy" decoding="async" style={{ display: 'block', objectFit: 'contain', flexShrink: '0', width: '88px', height: '81px' }} data-astro-cid-5pummn72="" />
                      </div>
                      <div className="relative" style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: '1' }} data-astro-cid-5pummn72="">
                        <h4 className="font-heading text-text" style={{ fontSize: '22px', fontWeight: '500', letterSpacing: '-0.02em', lineHeight: '1.15', margin: '0' }} data-astro-cid-5pummn72="">
                          On your laptop.
                        </h4>
                        <p className="font-body" style={{ fontSize: '14.5px', letterSpacing: '-0.003em', lineHeight: '1.55', color: 'rgba(11, 16, 21, 0.62)', margin: '0' }} data-astro-cid-5pummn72="">
                          Run the full stack on a workstation for offline dev,
                          demos, or sensitive work.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              <section className="w-full" id="faq" aria-labelledby="faq-heading" data-astro-cid-z6gx6xcw="">
                <div className="section-header w-full container-edge bg-bg" data-section-header="" data-astro-cid-wk2votdk="" data-pinned="true">
                  <div className="section-header-inner flex items-center gap-3 px-8 max-md:px-4 py-3" data-astro-cid-wk2votdk="">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      <span className="text-blue mr-1" data-astro-cid-wk2votdk="">〉</span>FAQ
                    </span>
                    <span className="flex-1" aria-hidden="true" data-astro-cid-wk2votdk=""></span>
                    <span className="font-mono text-[11px] tracking-[0.06em] text-text-dim shrink-0" data-astro-cid-wk2votdk="">
                      [<span className="text-blue" data-astro-cid-wk2votdk="">9</span>/9]
                    </span>
                  </div>
                </div>
                <div className="w-full container-edge bg-bg" data-faq-root="" data-astro-cid-z6gx6xcw="">
                  {/* Asymmetric header bar: eyebrow + heading left, filter pills right */}
                  <div className="faq-header flex items-end justify-between gap-8 px-8 max-md:px-4 pt-14 pb-10 max-md:pt-10 max-md:pb-7 max-md:flex-col max-md:items-start max-md:gap-6 border-b border-border" data-astro-cid-z6gx6xcw="">
                    <div className="flex flex-col gap-3 max-w-[640px]" data-astro-cid-z6gx6xcw="">
                      <h2 id="faq-heading" className="font-heading text-[44px] font-medium tracking-[-0.04em] leading-[1.05] text-text max-lg:text-[36px] max-md:text-[28px]" style={{ textWrap: 'balance' }} data-astro-cid-z6gx6xcw="">
                        The fine print,
                        <span className="text-blue" data-astro-cid-z6gx6xcw="">in plain English.</span>
                      </h2>
                    </div>
                  </div>
                  {/* Accordion: full-width rows separated by hairlines, single-open behavior */}
                  <ol className="faq-list list-none" role="list" data-astro-cid-z6gx6xcw="">
                    <li className="faq-row" data-faq-row="" data-open="false" data-faq-category="billing" data-first="true" data-astro-cid-z6gx6xcw="">
                      <button type="button" className="faq-q w-full flex items-center justify-between gap-6 px-8 max-md:px-4 py-5 text-left transition-colors duration-200" aria-expanded="false" aria-controls="faq-a-01" id="faq-q-01" data-faq-trigger="" data-astro-cid-z6gx6xcw="">
                        <div className="flex items-baseline gap-5 min-w-0" data-astro-cid-z6gx6xcw="">
                          <span className="faq-num font-mono text-[12px] text-text-dim shrink-0 w-7" data-astro-cid-z6gx6xcw="">01</span>
                          <span className="faq-q-text font-heading text-[18px] font-medium tracking-[-0.01em] leading-[1.35] text-text max-md:text-[16px]" data-astro-cid-z6gx6xcw="">
                            What training modules are included?
                          </span>
                        </div>
                        <span className="faq-toggle shrink-0 inline-flex items-center justify-center w-5 h-5" aria-hidden="true" data-astro-cid-z6gx6xcw="">
                          <svg viewBox="0 0 10 10" className="w-3 h-3" data-astro-cid-z6gx6xcw="">
                            <line className="faq-toggle-h" x1="1.5" y1="5" x2="8.5" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" data-astro-cid-z6gx6xcw=""></line>
                            <line className="faq-toggle-v" x1="5" y1="1.5" x2="5" y2="8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" data-astro-cid-z6gx6xcw=""></line>
                          </svg>
                        </span>
                      </button>
                      <div className="faq-a-wrap" id="faq-a-01" role="region" aria-labelledby="faq-q-01" data-faq-panel="" data-astro-cid-z6gx6xcw="">
                        <div className="faq-a-inner" data-astro-cid-z6gx6xcw="">
                          <div className="faq-a px-8 max-md:px-4 pb-7 max-md:pb-5 flex flex-col gap-3.5 max-w-[860px]" style={{ paddingLeft: 'calc(2rem + 28px + 1.25rem)' }} data-astro-cid-z6gx6xcw="">
                            <p className="font-body text-[15.5px] leading-[1.65] text-text max-md:text-[14.5px]" data-astro-cid-z6gx6xcw="">
                              Aeromentor includes all fundamental modules for naval aviators, from basic flight ops to advanced tactical queries. Everything is accessible via our single unified platform.
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="faq-row" data-faq-row="" data-open="false" data-faq-category="billing" data-first="false" data-astro-cid-z6gx6xcw="">
                      <button type="button" className="faq-q w-full flex items-center justify-between gap-6 px-8 max-md:px-4 py-5 text-left transition-colors duration-200" aria-expanded="false" aria-controls="faq-a-02" id="faq-q-02" data-faq-trigger="" data-astro-cid-z6gx6xcw="">
                        <div className="flex items-baseline gap-5 min-w-0" data-astro-cid-z6gx6xcw="">
                          <span className="faq-num font-mono text-[12px] text-text-dim shrink-0 w-7" data-astro-cid-z6gx6xcw="">02</span>
                          <span className="faq-q-text font-heading text-[18px] font-medium tracking-[-0.01em] leading-[1.35] text-text max-md:text-[16px]" data-astro-cid-z6gx6xcw="">
                            Is my base's training data secure?
                          </span>
                        </div>
                        <span className="faq-toggle shrink-0 inline-flex items-center justify-center w-5 h-5" aria-hidden="true" data-astro-cid-z6gx6xcw="">
                          <svg viewBox="0 0 10 10" className="w-3 h-3" data-astro-cid-z6gx6xcw="">
                            <line className="faq-toggle-h" x1="1.5" y1="5" x2="8.5" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" data-astro-cid-z6gx6xcw=""></line>
                            <line className="faq-toggle-v" x1="5" y1="1.5" x2="5" y2="8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" data-astro-cid-z6gx6xcw=""></line>
                          </svg>
                        </span>
                      </button>
                      <div className="faq-a-wrap" id="faq-a-02" role="region" aria-labelledby="faq-q-02" data-faq-panel="" data-astro-cid-z6gx6xcw="">
                        <div className="faq-a-inner" data-astro-cid-z6gx6xcw="">
                          <div className="faq-a px-8 max-md:px-4 pb-7 max-md:pb-5 flex flex-col gap-3.5 max-w-[860px]" style={{ paddingLeft: 'calc(2rem + 28px + 1.25rem)' }} data-astro-cid-z6gx6xcw="">
                            <p className="font-body text-[15.5px] leading-[1.65] text-text max-md:text-[14.5px]" data-astro-cid-z6gx6xcw="">
                              Absolutely. Aeromentor is deployed with strict access controls. Your naval docs, manuals, and institutional knowledge are isolated and only queryable by authorized cadets and instructors.
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="faq-row" data-faq-row="" data-open="false" data-faq-category="billing" data-first="false" data-astro-cid-z6gx6xcw="">
                      <button type="button" className="faq-q w-full flex items-center justify-between gap-6 px-8 max-md:px-4 py-5 text-left transition-colors duration-200" aria-expanded="false" aria-controls="faq-a-03" id="faq-q-03" data-faq-trigger="" data-astro-cid-z6gx6xcw="">
                        <div className="flex items-baseline gap-5 min-w-0" data-astro-cid-z6gx6xcw="">
                          <span className="faq-num font-mono text-[12px] text-text-dim shrink-0 w-7" data-astro-cid-z6gx6xcw="">03</span>
                          <span className="faq-q-text font-heading text-[18px] font-medium tracking-[-0.01em] leading-[1.35] text-text max-md:text-[16px]" data-astro-cid-z6gx6xcw="">
                            Can instructors track cadet progress?
                          </span>
                        </div>
                        <span className="faq-toggle shrink-0 inline-flex items-center justify-center w-5 h-5" aria-hidden="true" data-astro-cid-z6gx6xcw="">
                          <svg viewBox="0 0 10 10" className="w-3 h-3" data-astro-cid-z6gx6xcw="">
                            <line className="faq-toggle-h" x1="1.5" y1="5" x2="8.5" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" data-astro-cid-z6gx6xcw=""></line>
                            <line className="faq-toggle-v" x1="5" y1="1.5" x2="5" y2="8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" data-astro-cid-z6gx6xcw=""></line>
                          </svg>
                        </span>
                      </button>
                      <div className="faq-a-wrap" id="faq-a-03" role="region" aria-labelledby="faq-q-03" data-faq-panel="" data-astro-cid-z6gx6xcw="">
                        <div className="faq-a-inner" data-astro-cid-z6gx6xcw="">
                          <div className="faq-a px-8 max-md:px-4 pb-7 max-md:pb-5 flex flex-col gap-3.5 max-w-[860px]" style={{ paddingLeft: 'calc(2rem + 28px + 1.25rem)' }} data-astro-cid-z6gx6xcw="">
                            <p className="font-body text-[15.5px] leading-[1.65] text-text max-md:text-[14.5px]" data-astro-cid-z6gx6xcw="">
                              Yes. Instructors can monitor module completion, review specific technical queries made by cadets, and dynamically adjust simulator scenarios to address knowledge gaps.
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="faq-row" data-faq-row="" data-open="false" data-faq-category="billing" data-first="false" data-astro-cid-z6gx6xcw="">
                      <button type="button" className="faq-q w-full flex items-center justify-between gap-6 px-8 max-md:px-4 py-5 text-left transition-colors duration-200" aria-expanded="false" aria-controls="faq-a-04" id="faq-q-04" data-faq-trigger="" data-astro-cid-z6gx6xcw="">
                        <div className="flex items-baseline gap-5 min-w-0" data-astro-cid-z6gx6xcw="">
                          <span className="faq-num font-mono text-[12px] text-text-dim shrink-0 w-7" data-astro-cid-z6gx6xcw="">04</span>
                          <span className="faq-q-text font-heading text-[18px] font-medium tracking-[-0.01em] leading-[1.35] text-text max-md:text-[16px]" data-astro-cid-z6gx6xcw="">
                            How often are the training materials updated?
                          </span>
                        </div>
                        <span className="faq-toggle shrink-0 inline-flex items-center justify-center w-5 h-5" aria-hidden="true" data-astro-cid-z6gx6xcw="">
                          <svg viewBox="0 0 10 10" className="w-3 h-3" data-astro-cid-z6gx6xcw="">
                            <line className="faq-toggle-h" x1="1.5" y1="5" x2="8.5" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" data-astro-cid-z6gx6xcw=""></line>
                            <line className="faq-toggle-v" x1="5" y1="1.5" x2="5" y2="8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" data-astro-cid-z6gx6xcw=""></line>
                          </svg>
                        </span>
                      </button>
                      <div className="faq-a-wrap" id="faq-a-04" role="region" aria-labelledby="faq-q-04" data-faq-panel="" data-astro-cid-z6gx6xcw="">
                        <div className="faq-a-inner" data-astro-cid-z6gx6xcw="">
                          <div className="faq-a px-8 max-md:px-4 pb-7 max-md:pb-5 flex flex-col gap-3.5 max-w-[860px]" style={{ paddingLeft: 'calc(2rem + 28px + 1.25rem)' }} data-astro-cid-z6gx6xcw="">
                            <p className="font-body text-[15.5px] leading-[1.65] text-text max-md:text-[14.5px]" data-astro-cid-z6gx6xcw="">
                              Our custom engine pulls in data from updated naval manuals and aviation best practices in real time, ensuring all training scenarios reflect the latest operational standards.
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </section>
            </div>
          </div>
        </main>
        <footer className="footer-drenched relative z-10 overflow-clip" data-astro-cid-sz7xmlte="" style={{ backgroundImage: 'url(/images/after.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {/* Top band: editorial copy + link columns. Editorial flex-grows 1.4,
       column container flex-grows 2 → editorial gets ~41% of width. */}
          <div className="footer-top" data-astro-cid-sz7xmlte="" style={{ justifyContent: 'space-between', width: '100%' }}>
            <div className="footer-editorial" data-astro-cid-sz7xmlte="">
              <div className="footer-editorial-stack" data-astro-cid-sz7xmlte="">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/images/crest.webp" alt="Crest" className="h-20 w-auto object-contain" />
                  <img src="/images/niat.webp" alt="NIAT Logo" className="h-20 w-auto object-contain" />
                </div>
                <h2 className="footer-h2" style={{ fontSize: '36px', lineHeight: 1.2 }} data-astro-cid-sz7xmlte="">
                  N.I.A.T
                </h2>
                <p className="font-heading text-lg font-medium text-white/90 mt-1" data-astro-cid-sz7xmlte="">
                  Naval Institute of Aeronautical Technology
                </p>
                <p className="footer-sub mt-4 text-white/80" style={{ maxWidth: '420px', lineHeight: 1.6 }} data-astro-cid-sz7xmlte="">
                  The premier aviation technical training establishment of the Indian Navy, providing high-quality technical training related to naval aviation and maintenance of air assets.
                </p>
              </div>
            </div>
            <div className="footer-col" data-astro-cid-sz7xmlte="" style={{ flex: 'none' }}>
              <div className="footer-col-label" data-astro-cid-sz7xmlte="">
                PAGES
              </div>
              <div className="footer-col-links" data-astro-cid-sz7xmlte="">
                <a href="/home" className="footer-link" data-astro-cid-sz7xmlte="">
                  Home </a><a href="/dashboard" className="footer-link" data-astro-cid-sz7xmlte="">
                  Dashboard </a><a href="/courses" className="footer-link" data-astro-cid-sz7xmlte="">
                  Courses </a><a href="/quizzes" className="footer-link" data-astro-cid-sz7xmlte="">
                  Quizzes </a><a href="/login" className="footer-link" data-astro-cid-sz7xmlte="">
                  Login </a><a href="/register" className="footer-link" data-astro-cid-sz7xmlte="">
                  Register
                </a>
              </div>
            </div>
          </div>
          {/* © row, right-aligned. Sits above the wordmark. */}
          <div className="footer-copy-row" data-astro-cid-sz7xmlte="">
            <span className="footer-copy footer-copy-full" data-astro-cid-sz7xmlte="">
              © 2026 · AEROMENTOR INC. · ALL RIGHTS RESERVED
            </span>
            <span className="footer-copy footer-copy-short" data-astro-cid-sz7xmlte="">
              © 2026 · AEROMENTOR INC.
            </span>
          </div>
          {/* Giant ghosted wordmark — stretched to full width.
       The brand glyph badge floats on top, optically centered. */}
          <div className="footer-wordmark-wrap" data-astro-cid-sz7xmlte="">
            <div className="footer-wordmark" aria-hidden="true" data-astro-cid-sz7xmlte="" style={{ color: 'rgba(255, 255, 255, 0.25)', textShadow: '0 4px 24px rgba(255,255,255,0.1)' }}>
              Aeromentor.
            </div>
            <a href="/home" className="footer-mark-badge" aria-label="Aeromentor" data-astro-cid-sz7xmlte="">
              <svg viewBox="0 0 30 24" className="footer-mark-glyph" fill="none" aria-hidden="true" data-astro-cid-sz7xmlte="">
                <path className="footer-mark-stroke footer-mark-stroke-1" d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z" fill="#0562EF" stroke="#0562EF" strokeWidth="0.5" data-astro-cid-sz7xmlte=""></path>
                <path className="footer-mark-stroke footer-mark-stroke-2" d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z" fill="#0562EF" stroke="#0562EF" strokeWidth="0.5" data-astro-cid-sz7xmlte=""></path>
              </svg>
            </a>
          </div>
        </footer>





      </div>
      <HeroScripts />
    </>
  );
}
