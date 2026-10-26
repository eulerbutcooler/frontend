"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/icons/Logo";

const FACTS = [
  "The Indian Naval Air Arm is the oldest naval aviation branch in Asia, established on May 11, 1953, with the commissioning of INS Garuda.",
  "Chhatrapati Shivaji Maharaj is widely considered the 'Father of the Indian Navy' for his visionary efforts in building a strong naval presence.",
  "Indian Navy Day is celebrated on December 4th to commemorate the success of 'Operation Trident' during the 1971 Indo-Pakistani War.",
  "India is one of the elite few nations with the capability to operate multiple aircraft carriers, projecting power beyond land-based infrastructure.",
  "The modern Indian Navy was officially established on January 26, 1950, the same day India became a Republic, succeeding the Royal Indian Navy.",
  "INS Vikrant marked a historic milestone, making India one of only six nations capable of designing and constructing its own aircraft carriers.",
  "The Indian Navy is vital to the economy, as over 95% of the nation's trade by volume is transported via sea routes protected by the force.",
  "The Arihant-class submarines act as the sea-based component of the country's nuclear deterrent, a critical pillar of national security.",
  "During Operation Trident in 1971, the Indian Navy successfully utilized anti-ship missiles for the first time in the region in a daring night attack.",
  "The elite special forces unit of the Indian Navy, known as MARCOS (Marine Commandos), is capable of conducting highly specialized maritime operations."
];

const FactLogo = () => (
  <>
    <style dangerouslySetInnerHTML={{
      __html: `
      @keyframes fact-logo-redraw {
        0% { stroke-dashoffset: 0; fill-opacity: 1; }
        40% { stroke-dashoffset: 120; fill-opacity: 0; }
        60% { stroke-dashoffset: 120; fill-opacity: 0; }
        100% { stroke-dashoffset: 0; fill-opacity: 1; }
      }
      .fact-logo-stroke {
        stroke-dasharray: 120;
        animation: fact-logo-redraw 1s cubic-bezier(.4,0,.2,1) infinite;
      }
      .fact-logo-stroke-2 {
        animation-delay: 0.15s;
      }
    `}} />
    <svg viewBox="0 0 210 24" fill="none" width="220" height="25">
      <g clipPath="url(#logo-icon-fact)">
        <path className="fact-logo-stroke" d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="0.5"></path>
        <path className="fact-logo-stroke fact-logo-stroke-2" d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="0.5"></path>
      </g>
      <g>
        <text x="38" y="20" fill="#0a0a0a" fontFamily="var(--font-display), sans-serif" fontSize="20" fontWeight="700" letterSpacing="-0.5px">AeroFact</text>
      </g>
      <defs>
        <clipPath id="logo-icon-fact">
          <rect width="29.6" height="24" fill="white" transform="translate(-0.006)"></rect>
        </clipPath>
      </defs>
    </svg>
  </>
);

export function FactCard() {
  const [fact, setFact] = useState<string>("");

  useEffect(() => {
    const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
    setFact(randomFact);
  }, []);

  if (!fact) return null;

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 max-w-[460px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-left">
      <p className="font-body text-[16px] font-medium leading-relaxed text-ink mb-6">
        "{fact}"
      </p>
      <div className="flex items-center gap-3">
        <FactLogo />
      </div>
    </div>
  );
}
