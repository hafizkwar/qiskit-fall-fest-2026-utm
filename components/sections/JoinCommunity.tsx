"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import QuantumScene from "../three/QuantumScene";

export default function JoinCommunity() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="join" ref={containerRef} className="relative py-48 bg-black-deep overflow-hidden border-t border-white/5">
      
      {/* Background 3D */}
      <div className="absolute inset-0 z-0 opacity-50">
        <QuantumScene repel={true} />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
        <div ref={textRef}>
          <span className="text-utm-gold text-xs font-bold tracking-[0.2em] uppercase mb-8 block">07 / Connect</span>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
            JOIN THE<br />
            QUANTUM COMMUNITY
          </h2>
          
          <p className="text-xl md:text-2xl font-light text-off-white/80 mb-12">
            Connect. Collaborate. Discover.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="/internship" className="px-10 py-5 bg-utm-gold text-black-deep font-bold tracking-widest text-sm hover:bg-white hover:scale-105 transition-all duration-300">
              APPLY FOR INTERNSHIP
            </a>
            <a href="#contact" className="px-10 py-5 border border-white/30 text-white font-bold tracking-widest text-sm hover:border-utm-gold hover:bg-white/5 transition-all duration-300">
              CONTACT US
            </a>
          </div>
        </div>
      </div>
      
    </section>
  );
}
