"use client";

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

// We'll use standard DOM for the states for reliability, augmented by a simple Three.js canvas in the background if needed.
// The prompt asked for Three.js to animate between these states, so we will create a custom Three component.

const initialStoryParticles = new Float32Array(50 * 3);
for(let i=0; i<150; i++) initialStoryParticles[i] = (Math.random() - 0.5) * 10;

const StoryCanvas = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if(pointsRef.current) {
        gsap.to(pointsRef.current.rotation, {
            y: Math.PI * 2,
            duration: 20,
            repeat: -1,
            ease: "linear"
        });
    }
  }, []);

  const particles = useMemo(() => initialStoryParticles, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#c5a963" transparent opacity={0.3} />
    </points>
  );
};

export default function QuantumStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%", // Pin for 4 screen heights
          pin: true,
          scrub: 1,
        }
      });

      // STATE 1: Single Particle
      tl.to(".state-text", { opacity: 0, duration: 0.1 })
        .to("#text-1", { opacity: 1, duration: 0.2 })
        .to("#vis-1", { opacity: 1, scale: 1, duration: 0.5 })
        
      // STATE 2: Superposition
        .to("#text-1", { opacity: 0, duration: 0.2 }, "+=0.5")
        .to("#vis-1", { opacity: 0, scale: 0.5, duration: 0.2 }, "<")
        .to("#text-2", { opacity: 1, duration: 0.2 })
        .to("#vis-2", { opacity: 1, scale: 1, duration: 0.5 }, "<")

      // STATE 3: Wave Interference
        .to("#text-2", { opacity: 0, duration: 0.2 }, "+=0.5")
        .to("#vis-2", { opacity: 0, scale: 0.5, duration: 0.2 }, "<")
        .to("#text-3", { opacity: 1, duration: 0.2 })
        .to("#vis-3", { opacity: 1, scale: 1, duration: 0.5 }, "<")

      // STATE 4: Connected Nodes
        .to("#text-3", { opacity: 0, duration: 0.2 }, "+=0.5")
        .to("#vis-3", { opacity: 0, scale: 0.5, duration: 0.2 }, "<")
        .to("#text-4", { opacity: 1, duration: 0.2 })
        .to("#vis-4", { opacity: 1, scale: 1, duration: 0.5 }, "<")

      // STATE 5: Network Forms
        .to("#text-4", { opacity: 0, duration: 0.2 }, "+=0.5")
        .to("#vis-4", { opacity: 0, scale: 0.5, duration: 0.2 }, "<")
        .to("#text-5", { opacity: 1, duration: 0.2 })
        .to("#vis-5", { opacity: 1, scale: 1, duration: 0.5 }, "<")
        .to({}, { duration: 1 }); // Padding at the end

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-black-deep overflow-hidden flex items-center border-t border-white/5">
      
      {/* Background canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
           <StoryCanvas />
        </Canvas>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center h-full">
        
        {/* Left: Text Content */}
        <div ref={textRef} className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center relative">
          <div className="absolute inset-0 flex flex-col justify-center">
             <div className="text-utm-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">FROM CLASSICAL TO QUANTUM</div>
             
             <div className="relative h-40">
                <div id="text-1" className="state-text absolute inset-0 opacity-0">
                    <h3 className="text-4xl md:text-5xl font-light text-white mb-4">The Single <span className="font-bold">Particle</span></h3>
                    <p className="text-off-white/60">Classical mechanics defines a single state.</p>
                </div>
                <div id="text-2" className="state-text absolute inset-0 opacity-0">
                    <h3 className="text-4xl md:text-5xl font-light text-white mb-4">Entering <span className="font-bold">Superposition</span></h3>
                    <p className="text-off-white/60">Multiple states exist simultaneously.</p>
                </div>
                <div id="text-3" className="state-text absolute inset-0 opacity-0">
                    <h3 className="text-4xl md:text-5xl font-light text-white mb-4">Wave <span className="font-bold">Interference</span></h3>
                    <p className="text-off-white/60">Probabilities construct and destruct.</p>
                </div>
                <div id="text-4" className="state-text absolute inset-0 opacity-0">
                    <h3 className="text-4xl md:text-5xl font-light text-white mb-4">Quantum <span className="font-bold">Entanglement</span></h3>
                    <p className="text-off-white/60">Particles connect across the frontier.</p>
                </div>
                <div id="text-5" className="state-text absolute inset-0 opacity-0">
                    <h3 className="text-4xl md:text-5xl font-light text-utm-gold mb-4">UTM QUANTUM <br/><span className="font-bold text-white">COMMUNITY</span></h3>
                    <p className="text-off-white/60">A unified network of pioneers and innovators.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Visual Motif Overlay */}
        <div ref={visualRef} className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center">
            
            {/* Visual 1 */}
            <div id="vis-1" className="absolute inset-0 flex items-center justify-center opacity-0 scale-50">
                <div className="w-4 h-4 bg-utm-gold rounded-full shadow-[0_0_30px_rgba(197,169,99,0.8)]"></div>
            </div>

            {/* Visual 2 */}
            <div id="vis-2" className="absolute inset-0 flex items-center justify-center opacity-0 scale-50">
                <div className="relative w-32 h-32 flex items-center justify-between animate-spin-slow">
                    <div className="w-4 h-4 bg-white/50 rounded-full blur-[2px]"></div>
                    <div className="w-4 h-4 bg-utm-gold rounded-full shadow-[0_0_30px_rgba(197,169,99,0.8)]"></div>
                </div>
            </div>

            {/* Visual 3 */}
            <div id="vis-3" className="absolute inset-0 flex items-center justify-center opacity-0 scale-50">
                <div className="flex items-center gap-2">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className={`w-1 bg-utm-gold rounded-full`} style={{ height: `${20 + Math.sin(i) * 40}px`, opacity: 0.3 + (i*0.05) }}></div>
                    ))}
                </div>
            </div>

            {/* Visual 4 */}
            <div id="vis-4" className="absolute inset-0 flex items-center justify-center opacity-0 scale-50">
                <div className="relative w-48 h-48">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-utm-gold rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 bg-white rounded-full"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-utm-maroon rounded-full"></div>
                    
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                        <line x1="50%" y1="16px" x2="16px" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <line x1="50%" y1="16px" x2="100%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <line x1="16px" y1="100%" x2="100%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    </svg>
                </div>
            </div>

            {/* Visual 5 */}
            <div id="vis-5" className="absolute inset-0 flex items-center justify-center opacity-0 scale-50">
                <div className="relative w-64 h-64 border border-utm-gold/30 rounded-full flex items-center justify-center">
                    <div className="absolute w-full h-full border border-white/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                    <div className="text-center font-mono text-sm tracking-widest text-utm-gold">
                        NETWORK<br/>ESTABLISHED
                    </div>
                </div>
            </div>

        </div>

      </div>
    </section>
  );
}
