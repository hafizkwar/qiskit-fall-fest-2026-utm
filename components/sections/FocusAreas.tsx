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
              className="focus-card group relative h-[400px] border border-white/10 overflow-hidden flex flex-col justify-end p-8"
            >
              {/* Background Image */}
              {area.image && (
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${area.image})` }}
                />
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-black-deep/80 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-sm text-utm-gold bg-black-deep/50 px-3 py-1 rounded-sm border border-utm-gold/30 backdrop-blur-sm">{area.id}</span>
                  <ArrowUpRight className="text-white/50 group-hover:text-utm-gold transition-colors duration-300" size={24} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold tracking-wide text-white mb-3 group-hover:text-utm-gold transition-colors duration-300">
                    {area.title}
                  </h3>
                  
                  <p className="text-sm font-light text-off-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {area.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
