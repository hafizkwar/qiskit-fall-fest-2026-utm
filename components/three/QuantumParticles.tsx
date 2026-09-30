"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";

const particleCount = 250;

const initialPositions = new Float32Array(particleCount * 3);
const initialColors = new Float32Array(particleCount * 3);
const color = new THREE.Color();
for (let i = 0; i < particleCount; i++) {
  initialPositions[i * 3] = (Math.random() - 0.5) * 20;
  initialPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  initialPositions[i * 3 + 2] = (Math.random() - 0.5) * 15;
  
  const mixRatio = Math.random();
  if (mixRatio < 0.3) {
    color.set("#500000"); // Maroon
  } else if (mixRatio < 0.6) {
    color.set("#c5a963"); // Gold
  } else {
    color.set("#a0b0d0"); // Cool white/blue for quantum feel
  }
  
  initialColors[i * 3] = color.r;
  initialColors[i * 3 + 1] = color.g;
  initialColors[i * 3 + 2] = color.b;
}

export default function QuantumParticles({ repel = false }: { repel?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, camera, viewport } = useThree();

  const [positions, colors, originalPositions] = useMemo(() => {
    return [initialPositions.slice(), initialColors, initialPositions.slice()];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Very slow rotation
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;

    // Smooth camera follow mouse
    gsap.to(camera.position, {
      x: mouse.x * 2,
      y: mouse.y * 2,
      duration: 2,
      ease: "power2.out"
    });
    
    camera.lookAt(0, 0, 0);

    if (repel) {
      // Calculate mouse in world space (roughly, since Z is varying)
      const mouseWorldX = (mouse.x * viewport.width) / 2;
      const mouseWorldY = (mouse.y * viewport.height) / 2;
      
      const posAttribute = pointsRef.current.geometry.attributes.position;
      const array = posAttribute.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Base positions relative to rotation
        const p = new THREE.Vector3(originalPositions[i3], originalPositions[i3+1], originalPositions[i3+2]);
        p.applyEuler(pointsRef.current.rotation);
        
        const dx = p.x - mouseWorldX;
        const dy = p.y - mouseWorldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const repelRadius = 4;
        
        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius; // 0 to 1
          array[i3] = originalPositions[i3] + (dx / dist) * force * 2;
          array[i3+1] = originalPositions[i3+1] + (dy / dist) * force * 2;
        } else {
          // Return to original
          array[i3] = THREE.MathUtils.lerp(array[i3], originalPositions[i3], 0.1);
          array[i3+1] = THREE.MathUtils.lerp(array[i3+1], originalPositions[i3+1], 0.1);
        }
      }
      posAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
