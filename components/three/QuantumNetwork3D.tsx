"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Text, useCursor } from "@react-three/drei";

export default function QuantumNetwork3D() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
  useCursor(hoveredNode !== null, 'pointer', 'auto');

  const nodes = useMemo(() => [
    { pos: [0, 2, 0], label: "RESEARCH" },
    { pos: [-2, -1, 1], label: "EDUCATION" },
    { pos: [2, -1, -1], label: "INDUSTRY" },
    { pos: [0, -3, 0], label: "COMMUNITY" },
    { pos: [-3, 1, -2], label: "STUDENTS" },
    { pos: [3, 1, 2], label: "INNOVATION" }
  ], []);

  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // connect randomly or fully connected for abstract feeling
        // eslint-disable-next-line react-hooks/purity
        if (Math.random() > 0.3) {
          arr.push({ start: i, end: j, points: [nodes[i].pos, nodes[j].pos] });
        }
      }
    }
    return arr;
  }, [nodes]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>, index: number) => {
    e.stopPropagation();
    setHoveredNode(index);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredNode(null);
  };

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node, i) => {
        const isHovered = hoveredNode === i;
        const isDimmed = hoveredNode !== null && hoveredNode !== i;
        const scale = isHovered ? 1.5 : 1;
        const color = isHovered ? "#ffffff" : (isDimmed ? "#555555" : "#c5a963");
        
        return (
          <group 
            key={i} 
            position={new THREE.Vector3(...node.pos)}
            onPointerOver={(e) => handlePointerOver(e, i)}
            onPointerOut={handlePointerOut}
          >
            <mesh scale={scale}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isHovered ? 0.8 : 0.4} />
            </mesh>
            <Text
              position={[0, -0.5, 0]}
              fontSize={0.25}
              color={isHovered ? "white" : (isDimmed ? "#444444" : "#cccccc")}
              anchorX="center"
              anchorY="middle"
            >
              {node.label}
            </Text>
          </group>
        );
      })}
      
      {/* Edges */}
      {lines.map((line, i) => {
        const points = [new THREE.Vector3(...line.points[0]), new THREE.Vector3(...line.points[1])];
        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
        
        // Highlight lines connected to hovered node
        const isConnectedToHovered = hoveredNode !== null && (line.start === hoveredNode || line.end === hoveredNode);
        const isDimmed = hoveredNode !== null && !isConnectedToHovered;
        
        const opacity = isConnectedToHovered ? 0.6 : (isDimmed ? 0.05 : 0.15);
        const color = isConnectedToHovered ? "#ffffff" : "#c5a963";

        const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        const lineObj = new THREE.Line(lineGeom, lineMat);
        return <primitive key={`line-${i}`} object={lineObj} />;
      })}
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}
