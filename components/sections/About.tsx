"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.from(".about-fade", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="py-32 relative border-t border-white/5 bg-black-deep">
      
      {/* Visual motif */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-utm-gold/20 stroke-[0.1] fill-none">
          <path d="M0,50 Q25,30 50,50 T100,50" />
          <path d="M0,60 Q25,40 50,60 T100,60" />
          <path d="M0,70 Q25,50 50,70 T100,70" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          <div ref={textRef} className="max-w-2xl">
            <div className="about-fade mb-6">
              <span className="text-utm-gold text-xs font-bold tracking-[0.2em] uppercase">01 / About</span>
            </div>
            <h2 className="about-fade section-title mb-8 font-light text-balance">
              ABOUT<br />
              <span className="font-bold">UTM QUANTUM COMMUNITY</span>
            </h2>
            <p className="about-fade text-lg text-off-white/70 font-light leading-relaxed mb-8 text-balance">
              UTM Quantum Community brings together researchers, students, academics and collaborators interested in quantum science and emerging quantum technologies. We serve as a central hub for sharing knowledge, fostering innovation, and preparing the next generation of quantum pioneers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:ml-auto">
            <div className="about-fade p-8 border border-white/10 glass-card">
              <div className="text-4xl font-light text-white mb-2">50+</div>
              <div className="text-xs tracking-wider text-muted-gray uppercase">RESEARCHERS</div>
            </div>
            <div className="about-fade p-8 border border-white/10 glass-card">
              <div className="text-4xl font-light text-white mb-2">200+</div>
              <div className="text-xs tracking-wider text-muted-gray uppercase">STUDENTS</div>
            </div>
            <div className="about-fade p-8 border border-white/10 glass-card">
              <div className="text-4xl font-light text-utm-gold mb-2">15+</div>
              <div className="text-xs tracking-wider text-muted-gray uppercase">COLLABORATIONS</div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
