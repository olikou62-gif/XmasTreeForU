import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { TreeMorphState, DecorationData } from '../types';

// Mock Geometry components for decorations
const Planet: React.FC<{ color: string }> = ({ color }) => (
  <group>
    <mesh>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.1} emissive={color} emissiveIntensity={0.5} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.7, 0.05, 16, 32]} />
      <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
    </mesh>
  </group>
);

const GiftBox: React.FC<{ color: string }> = ({ color }) => (
  <group>
    <mesh>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0, 0]} scale={[1.05, 1.05, 1.05]}>
      <boxGeometry args={[0.6, 0.1, 0.6]} />
      <meshBasicMaterial color="silver" />
    </mesh>
    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1.05, 1.05, 1.05]}>
      <boxGeometry args={[0.6, 0.1, 0.6]} />
      <meshBasicMaterial color="silver" />
    </mesh>
  </group>
);

const RingIcon: React.FC<{ color: string }> = ({ color }) => (
  <mesh>
    <torusGeometry args={[0.4, 0.08, 16, 32]} />
    <meshStandardMaterial color={color} metalness={1} roughness={0} emissive={color} emissiveIntensity={1} />
  </mesh>
);

// Individual Decoration Instance wrapper to handle the lerping
const DecorationInstance: React.FC<{ data: DecorationData; state: TreeMorphState }> = ({ data, state }) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(data.scatterPosition.clone());

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const target = state === TreeMorphState.TREE_SHAPE ? data.treePosition : data.scatterPosition;
    
    // Smooth lerp
    currentPos.current.lerp(target, 2.5 * delta);
    groupRef.current.position.copy(currentPos.current);
    
    // Slow rotation
    groupRef.current.rotation.y += delta * 0.5;
    groupRef.current.rotation.z += delta * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {data.type === 'planet' && <Planet color={data.color} />}
        {data.type === 'gift' && <GiftBox color={data.color} />}
        {data.type === 'ring' && <RingIcon color={data.color} />}
      </Float>
    </group>
  );
};

interface DecorationsProps {
  state: TreeMorphState;
}

const Decorations: React.FC<DecorationsProps> = ({ state }) => {
  const decorations = useMemo(() => {
    const items: DecorationData[] = [];
    const count = 30; // Fewer hero items
    const colors = ['#FF007F', '#00FFFF', '#FFFF00', '#C0C0C0'];
    const types: DecorationData['type'][] = ['planet', 'gift', 'ring'];

    for (let i = 0; i < count; i++) {
      // Scatter Logic
      const rScatter = 10 + Math.random() * 10;
      const thetaScatter = Math.random() * Math.PI * 2;
      const phiScatter = Math.acos(2 * Math.random() - 1);
      const scatterPos = new THREE.Vector3(
        rScatter * Math.sin(phiScatter) * Math.cos(thetaScatter),
        rScatter * Math.sin(phiScatter) * Math.sin(thetaScatter),
        rScatter * Math.cos(phiScatter)
      );

      // Tree Logic (Outer edges of the cone)
      const height = 14;
      const yTree = (Math.random() * height) - 5; 
      const hNorm = (yTree + 6) / height; 
      const coneRadiusAtY = 5 * (1 - hNorm);
      
      // Place decor exactly on surface or slightly outside
      const rTree = coneRadiusAtY + 0.5; 
      const thetaTree = Math.random() * Math.PI * 2;
      const treePos = new THREE.Vector3(
        rTree * Math.cos(thetaTree),
        yTree,
        rTree * Math.sin(thetaTree)
      );

      items.push({
        id: i,
        type: types[i % types.length],
        color: colors[i % colors.length],
        scatterPosition: scatterPos,
        treePosition: treePos,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {decorations.map((data) => (
        <DecorationInstance key={data.id} data={data} state={state} />
      ))}
    </group>
  );
};

export default Decorations;
