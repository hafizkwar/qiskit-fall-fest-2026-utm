"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import QuantumNetwork3D from "../three/QuantumNetwork3D";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function QuantumNetwork() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Slight fade in effect
    gsap.fromTo(containerRef.current, 
      { opacity: 0 }, 
      { 
        opacity: 1, 
        duration: 1.5, 
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        } 
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="relative h-[80vh] bg-[#030303] flex items-center justify-center overflow-hidden border-y border-white/5">
      
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <QuantumNetwork3D />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="absolute top-12 left-0 w-full text-center z-10 pointer-events-none">
        <span className="text-utm-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">03 / ECOSYSTEM</span>
        <h2 className="text-3xl md:text-4xl font-light text-white tracking-widest">
          INTERCONNECTED NETWORK
        </h2>
      </div>

    </section>
  );
}
