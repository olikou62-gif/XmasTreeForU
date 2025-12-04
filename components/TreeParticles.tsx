import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState } from '../types';

interface TreeParticlesProps {
  state: TreeMorphState;
  count?: number;
}

const tempObject = new THREE.Object3D();
const tempPos = new THREE.Vector3();
const tempColor = new THREE.Color();

// Color Palette
const COLORS = ['#C0C0C0', '#FF007F', '#008000', '#00FFFF', '#FFFFFF'];

const TreeParticles: React.FC<TreeParticlesProps> = ({ state, count = 2500 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Initialize particle data (positions, colors)
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      // 1. SCATTER POSITION (Random Sphere)
      const rScatter = 15 + Math.random() * 15;
      const thetaScatter = Math.random() * Math.PI * 2;
      const phiScatter = Math.acos(2 * Math.random() - 1);
      
      const scatterPos = new THREE.Vector3(
        rScatter * Math.sin(phiScatter) * Math.cos(thetaScatter),
        rScatter * Math.sin(phiScatter) * Math.sin(thetaScatter),
        rScatter * Math.cos(phiScatter)
      );

      // 2. TREE POSITION (Cone Volume)
      // Cone setup: Height 14 (-6 to 8), Base Radius 5
      const height = 14;
      const yTree = (Math.random() * height) - 6; // -6 to 8
      
      // Normalized height (0 at bottom, 1 at top) for radius calc
      const hNorm = (yTree + 6) / height; 
      const coneRadiusAtY = 5 * (1 - hNorm); // Radius shrinks as we go up
      
      // Use spiral or random distribution inside the cone volume for density
      const rTree = Math.sqrt(Math.random()) * coneRadiusAtY; // Sqrt for uniform circle distribution
      const thetaTree = Math.random() * Math.PI * 2;
      
      const treePos = new THREE.Vector3(
        rTree * Math.cos(thetaTree),
        yTree,
        rTree * Math.sin(thetaTree)
      );

      // 3. COLOR & ATTRIBUTES
      const color = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]);
      // Add some metallic brightness
      if (Math.random() > 0.8) color.multiplyScalar(2); 

      data.push({
        id: i,
        scatterPos,
        treePos,
        color,
        scale: Math.random() * 0.5 + 0.2,
        currentPos: scatterPos.clone(), // Start at scattered
        rotationPhase: Math.random() * Math.PI
      });
    }
    return data;
  }, [count]);

  // Initial color setting
  useLayoutEffect(() => {
    if (meshRef.current) {
      particles.forEach((p, i) => {
        meshRef.current!.setColorAt(i, p.color);
      });
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [particles]);

  useFrame((stateThree, delta) => {
    if (!meshRef.current) return;

    const targetIsTree = state === TreeMorphState.TREE_SHAPE;
    // Lerp speed - adjust for feel
    const speed = 3.5 * delta; 

    particles.forEach((particle, i) => {
      // Determine target based on state
      const target = targetIsTree ? particle.treePos : particle.scatterPos;
      
      // Interpolate position
      particle.currentPos.lerp(target, speed);

      // Add a gentle float/wobble when in tree state
      const time = stateThree.clock.elapsedTime;
      const wobble = targetIsTree ? Math.sin(time * 2 + particle.rotationPhase) * 0.05 : 0;
      
      // Rotation for visual interest
      tempObject.position.copy(particle.currentPos);
      if (targetIsTree) {
         tempObject.position.y += wobble;
      } else {
         // Slowly rotate around center in scatter mode
         const orbitSpeed = 0.1;
         const x = tempObject.position.x;
         const z = tempObject.position.z;
         tempObject.position.x = x * Math.cos(orbitSpeed * delta) - z * Math.sin(orbitSpeed * delta);
         tempObject.position.z = x * Math.sin(orbitSpeed * delta) + z * Math.cos(orbitSpeed * delta);
         // Update particle scatter pos to keep it moving indefinitely in scatter mode
         particle.scatterPos.copy(tempObject.position); 
      }

      tempObject.scale.setScalar(particle.scale);
      tempObject.rotation.x = time * 0.5 + particle.id;
      tempObject.rotation.y = time * 0.3 + particle.id;
      
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* A simple tetrahedron or low-poly cone for "cyber needle" look */}
      <coneGeometry args={[0.15, 0.4, 4]} />
      <meshStandardMaterial 
        toneMapped={false}
        roughness={0.2}
        metalness={0.9}
        emissive="#ff007f"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
};

export default TreeParticles;
