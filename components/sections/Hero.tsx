"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import QuantumScene from "@/components/three/QuantumScene";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fake loading sequence to simulate complex 3D setup as requested
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 500);
      }
      setProgress(current);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading) return;

    const tl = gsap.timeline();

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Entrance Animation Sequence
      tl.to(overlayRef.current, { opacity: 0.7, duration: 2, ease: "power2.inOut" }, 0)
        .fromTo(".hero-element", 
          { y: 50, opacity: 0, filter: "blur(10px)" }, 
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, stagger: 0.2, ease: "power3.out" }, 
          0.5
        );

      // Scroll Transition Animation
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        animation: gsap.timeline()
          .to(textRef.current, { y: -100, opacity: 0 }, 0)
          .to(canvasRef.current, { opacity: 0 }, 0)
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
       tl.to(overlayRef.current, { opacity: 0.7, duration: 0.1 }, 0)
         .to(".hero-element", { opacity: 1, duration: 0.1 }, 0);
    });

    return () => {
      mm.revert();
    };
  }, [loading]);

  return (
    <>
      {/* Loading Screen */}
      <div 
        className={`fixed inset-0 z-50 bg-black-deep flex flex-col items-center justify-center transition-opacity duration-1000 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-t-2 border-r-2 border-utm-gold rounded-full animate-spin"></div>
          <div className="text-center font-mono text-xs tracking-[0.3em] text-utm-gold">
            LOADING QUANTUM ENVIRONMENT<br />
            <span className="text-white mt-2 block">{'─'.repeat(Math.floor(progress/5))} {progress}%</span>
          </div>
        </div>
      </div>

      <section ref={containerRef} className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center pt-20">
        
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            ref={videoRef}
            src="/assets/utm-quantum-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dark Overlay */}
        <div ref={overlayRef} className="absolute inset-0 bg-black-deep opacity-100 z-10 transition-opacity"></div>

        {/* Three.js Environment */}
        <div ref={canvasRef} className="absolute inset-0 z-20">
          {!loading && <QuantumScene />}
        </div>

        {/* Hero Content */}
        <div ref={textRef} className="relative z-30 container mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          
          <div className="hero-element mb-6 inline-flex flex-col items-center gap-4">
            {/* Logos */}
            <div className="flex items-center gap-6 mb-2">
               {/* Using normal img tag to avoid Next.js Image component failing build if images are missing */}
              <img src="/assets/utm-logo.png" alt="UTM Logo" className="h-12 w-auto opacity-90" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <div className="w-[1px] h-10 bg-white/20"></div>
              <img src="/assets/quantum-community-logo.png" alt="Quantum Community" className="h-12 w-auto opacity-90 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <h2 className="text-utm-gold text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
              Universiti Teknologi Malaysia
            </h2>
          </div>

          <h1 className="hero-element hero-title text-white mb-6">
            UTM<br />
            QUANTUM<br />
            COMMUNITY
          </h1>

          <p className="hero-element text-lg md:text-xl text-off-white/80 max-w-2xl font-light mb-10">
            Exploring the Quantum Frontier. Connecting researchers, students and industry through quantum science, computing and emerging quantum technologies.
          </p>

          <div className="hero-element flex flex-col sm:flex-row items-center gap-4">
            <a href="#focus-areas" className="px-8 py-4 bg-white text-black-deep font-semibold tracking-wider text-sm hover:bg-utm-gold hover:text-white transition-all duration-300">
              EXPLORE QUANTUM
            </a>
            <a href="#join" className="px-8 py-4 border border-white/30 text-white font-semibold tracking-wider text-sm hover:border-utm-gold hover:bg-white/5 transition-all duration-300">
              JOIN THE COMMUNITY
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-element absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest text-white/50">SCROLL TO EXPLORE</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
        
      </section>
    </>
  );
}
