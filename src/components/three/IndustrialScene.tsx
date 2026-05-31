"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus, Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";

function GearMesh({ position, radius, speed }: { position: [number, number, number]; radius: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, radius * 0.18, 8, 20]} />
      <meshStandardMaterial
        color="#0077FF"
        emissive="#003388"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function EnergyOrb({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color="#00C3FF"
        emissive="#0077FF"
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function ConveyorUnit({ z }: { z: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = ((state.clock.elapsedTime * 0.6 + z) % 8) - 4;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.4, 0.12, 0.3]} />
        <meshStandardMaterial color="#1A2A4A" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function RotatingRing({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += d * speed * 0.5;
      ref.current.rotation.y += d * speed;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.6, 0.04, 8, 40]} />
      <meshStandardMaterial
        color="#00C3FF"
        emissive="#00C3FF"
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function FloatingPanel({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1.2, 0.7, 0.04]} />
      <meshStandardMaterial
        color="#0D1525"
        emissive="#0077FF"
        emissiveIntensity={0.2}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function SceneContents() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} color="#050D1A" />
      <pointLight position={[0, 5, 3]} intensity={2} color="#0077FF" />
      <pointLight position={[-4, 2, -2]} intensity={1.5} color="#00C3FF" />
      <pointLight position={[4, -1, 2]} intensity={1} color="#FF6B00" />

      {/* Gears */}
      <GearMesh position={[-3.5, 1, -2]} radius={0.8} speed={0.4} />
      <GearMesh position={[-2.2, 1.8, -2]} radius={0.5} speed={-0.65} />
      <GearMesh position={[3, -0.5, -3]} radius={1.1} speed={0.25} />

      {/* Energy orbs */}
      <EnergyOrb position={[-1, 1.5, -1]} />
      <EnergyOrb position={[2, 0.5, -1.5]} />
      <EnergyOrb position={[0, 2.5, -2]} />

      {/* Floating panels */}
      <FloatingPanel position={[-2.5, 0.5, -1.5]} />
      <FloatingPanel position={[2.5, 1.2, -2]} />

      {/* Rotating rings */}
      <RotatingRing position={[1, 0, -1]} speed={0.5} />
      <RotatingRing position={[-1.5, -0.5, -2]} speed={0.8} />

      {/* Conveyor items */}
      {[0, 2, 4, 6].map((z) => (
        <ConveyorUnit key={z} z={z} />
      ))}

      {/* Base platform */}
      <mesh position={[0, -2, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial
          color="#050D1A"
          emissive="#0033AA"
          emissiveIntensity={0.05}
          metalness={0.9}
          roughness={0.5}
        />
      </mesh>
    </>
  );
}

export function IndustrialScene() {
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 1, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}
