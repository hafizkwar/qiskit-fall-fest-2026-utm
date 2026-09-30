"use client";

import { Canvas } from "@react-three/fiber";
import QuantumParticles from "./QuantumParticles";
import { Suspense } from "react";

export default function QuantumScene({ repel = false }: { repel?: boolean }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <QuantumParticles repel={repel} />
        </Suspense>
      </Canvas>
    </div>
  );
}
