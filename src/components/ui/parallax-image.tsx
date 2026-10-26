"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 10px move
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] transition-transform duration-200 ease-out"
         style={{ transform: `translate(${-position.x}px, ${-position.y}px)` }}>
      <Image 
        src={src} 
        alt={alt} 
        fill 
        className="object-cover" 
        priority 
      />
    </div>
  );
}
