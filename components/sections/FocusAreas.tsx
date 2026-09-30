"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { focusAreas } from "@/data/focusAreas";
import { ArrowUpRight } from "lucide-react";

export default function FocusAreas() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.from(".focus-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="focus-areas" ref={containerRef} className="py-32 relative bg-black-deep">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-20">
          <span className="text-utm-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">02 / Focus Areas</span>
          <h2 className="section-title font-light">
            EXPLORE THE <br />
            <span className="font-bold">QUANTUM FRONTIER</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((area) => (
            <div 
              key={area.id} 
              className="focus-card group relative p-8 border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-16">
                <span className="font-mono text-sm text-white/40">{area.id}</span>
                <ArrowUpRight className="text-white/30 group-hover:text-utm-gold transition-colors duration-300" size={20} />
              </div>
              
              <h3 className="text-xl font-bold tracking-wide text-white mb-4 group-hover:text-utm-gold transition-colors duration-300">
                {area.title}
              </h3>
              
              <p className="text-sm font-light text-off-white/60 leading-relaxed group-hover:text-off-white/80 transition-colors duration-300">
                {area.description}
              </p>

              {/* Hover effect particles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-utm-maroon/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
