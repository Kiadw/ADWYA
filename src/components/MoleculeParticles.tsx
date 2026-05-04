'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * SMILES structures from ADWYA medications database.
 * We parse these into approximate 3D point-cloud coordinates 
 * using a procedural spatial hash approach.
 */
const MOLECULES = [
  { name: 'Losartan (ZARTAN)', smiles: 'CCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NN=N[NH]4)CO)Cl', color: '#6366f1' },
  { name: 'Paracetamol (ADWALGIC)', smiles: 'CC(=O)NC1=CC=C(C=C1)O', color: '#10b981' },
  { name: 'Metformine (METADWYA)', smiles: 'CN(C)C(=N)NC(=N)N', color: '#3b82f6' },
  { name: 'Amoxicilline (ADWAMOX)', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C', color: '#f59e0b' },
  { name: 'Fluoxetine (ADWATINE)', smiles: 'CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F', color: '#ec4899' },
  { name: 'Ibuprofene (IBADWYA)', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', color: '#8b5cf6' },
  { name: 'Omeprazole (ADWAZOL)', smiles: 'CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=CC=CC=C3N2', color: '#14b8a6' },
  { name: 'Amlodipine (ADWLOR)', smiles: 'CCOC(=O)C1=C(NC(=C(C1C2=CC=CC=C2Cl)C(=O)OC)C)COCCN', color: '#f97316' },
];

/** Generate 3D positions from SMILES string using procedural hash */
function generateMoleculePoints(smiles: string, basePos: THREE.Vector3, spread: number): Float32Array {
  const atoms: number[] = [];
  const atomChars = smiles.replace(/[^A-Za-z]/g, '');
  const bonds = smiles.length;
  
  // Generate atom positions using a spiral-chain layout
  let x = 0, y = 0, z = 0;
  let angle = 0;
  const step = 0.28;
  
  for (let i = 0; i < atomChars.length; i++) {
    const charCode = atomChars.charCodeAt(i);
    const branchFactor = (charCode % 7) / 7;
    
    angle += 0.8 + branchFactor * 1.5;
    const dz = Math.sin(angle * 0.7) * step * 0.6;
    
    x += Math.cos(angle) * step;
    y += Math.sin(angle) * step;
    z += dz;
    
    // Main atom
    atoms.push(
      basePos.x + x * spread,
      basePos.y + y * spread,
      basePos.z + z * spread
    );
    
    // Bond midpoints (extra particles for density)
    if (i > 0) {
      const px = atoms[(i - 1) * 3];
      const py = atoms[(i - 1) * 3 + 1];
      const pz = atoms[(i - 1) * 3 + 2];
      const cx = atoms[i * 3];
      const cy = atoms[i * 3 + 1];
      const cz = atoms[i * 3 + 2];
      
      for (let t = 0.25; t < 1; t += 0.25) {
        atoms.push(
          px + (cx - px) * t + (Math.random() - 0.5) * 0.015 * spread,
          py + (cy - py) * t + (Math.random() - 0.5) * 0.015 * spread,
          pz + (cz - pz) * t + (Math.random() - 0.5) * 0.015 * spread
        );
      }
    }
    
    // Ring branching particles
    if (smiles[i] === '(' || smiles[i] === '=') {
      for (let j = 0; j < 2; j++) {
        atoms.push(
          basePos.x + x * spread + (Math.random() - 0.5) * 0.08 * spread,
          basePos.y + y * spread + (Math.random() - 0.5) * 0.08 * spread,
          basePos.z + z * spread + (Math.random() - 0.5) * 0.08 * spread
        );
      }
    }
  }
  
  return new Float32Array(atoms);
}

/** Single floating molecule rendered as point cloud */
function MoleculeCloud({ smiles, basePosition, color, spread = 1.2 }: {
  smiles: string; basePosition: [number, number, number]; color: string; spread?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const basePos = useMemo(() => new THREE.Vector3(...basePosition), [basePosition]);
  const positions = useMemo(() => generateMoleculePoints(smiles, basePos, spread), [smiles, basePos, spread]);
  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);
  const pointCount = positions.length / 3;
  
  // Generate sizes (atom positions are bigger, bond midpoints smaller)
  const sizes = useMemo(() => {
    const s = new Float32Array(pointCount);
    for (let i = 0; i < pointCount; i++) {
      s[i] = i % 4 === 0 ? 2.5 : 1.2;
    }
    return s;
  }, [pointCount]);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    
    // Gentle floating animation
    ref.current.rotation.y = time * 0.08;
    ref.current.rotation.x = Math.sin(time * 0.15) * 0.05;
    
    // Subtle particle breathing
    const posArray = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < posArray.length; i += 3) {
      const idx = i / 3;
      posArray[i] = originalPositions[i] + Math.sin(time * 1.5 + idx * 0.3) * 0.008;
      posArray[i + 1] = originalPositions[i + 1] + Math.cos(time * 1.2 + idx * 0.5) * 0.008;
      posArray[i + 2] = originalPositions[i + 2] + Math.sin(time * 0.9 + idx * 0.7) * 0.005;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={pointCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={pointCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Scene containing all floating molecules */
function MoleculeScene() {
  const positions: [number, number, number][] = [
    [-3.5, 1.5, -2],
    [3, 2, -1],
    [-2, -1.5, -3],
    [4, -1, -2],
    [-4.5, 0, -1.5],
    [1.5, -2.5, -2.5],
    [0, 3, -3],
    [-1, 0.5, -4],
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366f1" />
      <pointLight position={[-10, -5, 5]} intensity={0.3} color="#10b981" />
      
      {MOLECULES.map((mol, i) => (
        <Float key={mol.name} speed={0.5 + i * 0.1} rotationIntensity={0.02} floatIntensity={0.15 + i * 0.05}>
          <MoleculeCloud
            smiles={mol.smiles}
            basePosition={positions[i]}
            color={mol.color}
            spread={1.0 + (i % 3) * 0.3}
          />
        </Float>
      ))}
    </>
  );
}

export default function MoleculeParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <MoleculeScene />
      </Canvas>
    </div>
  );
}
