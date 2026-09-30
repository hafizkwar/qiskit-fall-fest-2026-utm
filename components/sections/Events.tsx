"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { events } from "@/data/events";

export default function Events() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.from(".event-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="events" ref={containerRef} className="py-32 bg-black-deep relative">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-utm-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">06 / Activities</span>
            <h2 className="section-title font-light">
              QUANTUM <br />
              <span className="font-bold">EVENTS</span>
            </h2>
          </div>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-48 top-0 bottom-0 w-[1px] bg-white/10 hidden md:block"></div>

          <div className="flex flex-col gap-12">
            {events.map((event) => (
              <div key={event.id} className="event-item relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 group">
                
                {/* Date col */}
                <div className="md:col-span-2 flex md:justify-end md:text-right pt-1">
                  <div className="text-utm-gold font-mono text-sm tracking-widest">{event.date}</div>
                </div>

                {/* Node */}
                <div className="hidden md:flex absolute left-48 -translate-x-1/2 top-2 w-3 h-3 rounded-full border-2 border-utm-gold bg-black-deep group-hover:bg-utm-gold transition-colors duration-300 z-10"></div>

                {/* Content col */}
                <div className="md:col-span-10 pl-0 md:pl-8">
                  <div className="inline-block px-3 py-1 border border-white/20 text-[10px] uppercase tracking-widest text-white/60 mb-4 rounded-sm group-hover:border-utm-gold/50 transition-colors duration-300">
                    {event.category}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-utm-gold transition-colors duration-300">
                    {event.name}
                  </h3>
                  <div className="text-sm text-off-white/60 mb-6 font-light">
                    {event.location}
                  </div>
                  
                  {event.description && (
                    <div className="mt-6 p-6 border border-white/10 bg-white/5 rounded-sm">
                      <p className="text-sm text-white/80 font-medium mb-4 flex items-center gap-2">
                        <span>📲</span> Connect &amp; Follow for Updates:
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs font-mono">
                        <a href="https://www.instagram.com/utmquantum/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-black-deep border border-white/10 hover:border-utm-gold hover:text-utm-gold transition-all duration-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-utm-gold"></span> Instagram
                        </a>
                        <a href="https://www.linkedin.com/in/utm-quantum-aab499433" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-black-deep border border-white/10 hover:border-utm-gold hover:text-utm-gold transition-all duration-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-utm-gold"></span> LinkedIn
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61594253566629" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-black-deep border border-white/10 hover:border-utm-gold hover:text-utm-gold transition-all duration-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-utm-gold"></span> Facebook
                        </a>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
