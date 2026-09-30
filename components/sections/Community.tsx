"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { people } from "@/data/people";

export default function Community() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(".person-card", 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="community" ref={containerRef} className="py-32 bg-black-deep relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-20">
          <span className="text-utm-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">05 / Committee</span>
          <h2 className="section-title font-light">
            OUR QUANTUM <br />
            <span className="font-bold">COMMITTEE</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {people.map((person) => (
            <div 
              key={person.id} 
              className="person-card group relative p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden mb-6 rounded-sm bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={person.photo} 
                  alt={person.name} 
                  className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-utm-gold transition-colors duration-300">
                {person.name}
              </h3>
              <div className="text-sm text-off-white/80 font-medium mb-3">{person.position}</div>
              <div className="text-xs font-mono text-white/40 uppercase">{person.area}</div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
