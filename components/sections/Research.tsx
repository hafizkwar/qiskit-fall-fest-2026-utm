"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { researchProjects } from "@/data/research";

import { ArrowRight } from "lucide-react";

export default function Research() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.from(".research-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="research" ref={containerRef} className="py-32 bg-black-deep relative">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-20">
          <span className="text-utm-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">04 / Research</span>
          <h2 className="section-title font-light">
            RESEARCH & <br />
            <span className="font-bold">INNOVATION</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {researchProjects.map((project) => (
            <a 
              key={project.id} 
              href={project.link}
              className="research-card group block relative p-6 md:p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Image */}
                <div className="md:col-span-3 aspect-video relative overflow-hidden rounded-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-8 flex flex-col justify-center">
                  <div className="text-utm-gold text-xs font-mono mb-2 uppercase">{project.category}</div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-2 transition-transform duration-300">
                    {project.title}
                  </h3>
                  <p className="text-off-white/60 mb-4 max-w-2xl text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="text-xs text-white/40 uppercase tracking-widest font-mono">
                    PI: {project.researcher}
                  </div>
                </div>

                {/* Arrow */}
                <div className="md:col-span-1 flex justify-end items-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="text-utm-gold" size={32} strokeWidth={1} />
                </div>

              </div>
              
              {/* Illumination */}
              <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-utm-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
