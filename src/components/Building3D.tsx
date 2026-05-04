'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Float, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

// Monochrome, minimalist colors
const COLOR_MAIN = "#f8fafc";
const COLOR_SECONDARY = "#e2e8f0";
const COLOR_GLASS = "#ffffff";
const COLOR_TEXT = "#94a3b8";

function PalmTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 1, 8]} />
        <meshStandardMaterial color={COLOR_SECONDARY} roughness={0.8} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 7, 7]} />
        <meshStandardMaterial color={COLOR_MAIN} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.1, 0]} scale={[1.5, 0.3, 1.5]}>
        <sphereGeometry args={[0.3, 7, 7]} />
        <meshStandardMaterial color={COLOR_MAIN} roughness={0.6} />
      </mesh>
    </group>
  );
}

function AdwyaBuilding() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Building Base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color={COLOR_MAIN} roughness={0.2} />
      </mesh>
      
      {/* Left Wing */}
      <mesh position={[-2.5, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshStandardMaterial color={COLOR_MAIN} roughness={0.2} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[2.5, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshStandardMaterial color={COLOR_MAIN} roughness={0.2} />
      </mesh>

      {/* Upper Floor */}
      <mesh position={[0, 1.3, -0.2]}>
        <boxGeometry args={[2.5, 0.6, 1.5]} />
        <meshStandardMaterial color={COLOR_MAIN} roughness={0.2} />
      </mesh>

      {/* Windows Base */}
      <mesh position={[0, 0.5, 1.01]}>
        <boxGeometry args={[3.8, 0.6, 0.01]} />
        <meshStandardMaterial color={COLOR_GLASS} opacity={0.5} transparent roughness={0.1} metalness={0.5} />
      </mesh>
      
      {/* Windows Upper */}
      <mesh position={[0, 1.3, 0.56]}>
        <boxGeometry args={[2.3, 0.4, 0.01]} />
        <meshStandardMaterial color={COLOR_GLASS} opacity={0.5} transparent roughness={0.1} metalness={0.5} />
      </mesh>

      {/* Logo Sign on Roof */}
      <mesh position={[-0.8, 1.8, 0]}>
        <boxGeometry args={[1.2, 0.3, 0.1]} />
        <meshStandardMaterial color={COLOR_MAIN} />
      </mesh>
      <Text position={[-0.8, 1.8, 0.06]} fontSize={0.15} color={COLOR_TEXT} anchorX="center" anchorY="middle">
        ADWYA أدوية
      </Text>

      {/* Ground/Pavement */}
      <mesh position={[0, -0.05, 1.5]}>
        <boxGeometry args={[8, 0.1, 5]} />
        <meshStandardMaterial color={COLOR_SECONDARY} roughness={0.9} />
      </mesh>

      {/* Palm Trees */}
      <PalmTree position={[-1.5, 0, 1.5]} />
      <PalmTree position={[1.5, 0, 1.5]} />
      <PalmTree position={[-2.5, 0, 1.2]} />
      <PalmTree position={[2.5, 0, 1.2]} />
    </group>
  );
}

export default function Building3D() {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas camera={{ position: [6, 3, 8], fov: 40 }}>
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#f8fafc" />
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
          <AdwyaBuilding />
        </Float>
        <ContactShadows position={[0, -0.1, 0]} opacity={0.2} scale={15} blur={2.5} far={4} />
        <Environment preset="city" environmentIntensity={0.5} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
