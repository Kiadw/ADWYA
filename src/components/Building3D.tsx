'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Float, ContactShadows, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function PalmTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 1, 8]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 7, 7]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.1, 0]} scale={[1.5, 0.3, 1.5]}>
        <sphereGeometry args={[0.3, 7, 7]} />
        <meshStandardMaterial color="#3CB371" roughness={0.6} />
      </mesh>
    </group>
  );
}

function StopSign({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, 0.6, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <Text
        position={[0, 0.6, 0.04]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        STOP
      </Text>
    </group>
  );
}

function AdwyaBuilding() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Building Base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {/* Left Wing */}
      <mesh position={[-2.5, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[2.5, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* Upper Floor */}
      <mesh position={[0, 1.3, -0.2]}>
        <boxGeometry args={[2.5, 0.6, 1.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>

      {/* Windows Base */}
      <mesh position={[0, 0.5, 1.01]}>
        <boxGeometry args={[3.8, 0.6, 0.01]} />
        <meshStandardMaterial color="#0ea5e9" opacity={0.6} transparent roughness={0} metalness={0.8} />
      </mesh>
      
      {/* Windows Upper */}
      <mesh position={[0, 1.3, 0.56]}>
        <boxGeometry args={[2.3, 0.4, 0.01]} />
        <meshStandardMaterial color="#0ea5e9" opacity={0.6} transparent roughness={0} metalness={0.8} />
      </mesh>

      {/* Logo Sign on Roof */}
      <mesh position={[-0.8, 1.8, 0]}>
        <boxGeometry args={[1.2, 0.3, 0.1]} />
        <meshStandardMaterial color="#0f766e" />
      </mesh>
      <Text position={[-0.8, 1.8, 0.06]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
        ADWYA أدوية
      </Text>

      {/* Entrance Gate */}
      <mesh position={[0, 0.2, 2.5]}>
        <boxGeometry args={[1.5, 0.4, 0.2]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Ground/Pavement */}
      <mesh position={[0, -0.05, 1.5]}>
        <boxGeometry args={[7, 0.1, 4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {/* Palm Trees */}
      <PalmTree position={[-1.5, 0, 1.5]} />
      <PalmTree position={[1.5, 0, 1.5]} />
      <PalmTree position={[-2.5, 0, 1.2]} />
      <PalmTree position={[2.5, 0, 1.2]} />

      {/* Stop Sign at Gate */}
      <StopSign position={[0.5, 0, 2.7]} />
    </group>
  );
}

export default function Building3D() {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-slate-200" style={{ background: 'linear-gradient(to bottom, #e0f2fe, #f8fafc)' }}>
      <Canvas camera={{ position: [5, 4, 7], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <AdwyaBuilding />
        </Float>
        <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
