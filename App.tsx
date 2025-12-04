import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { TreeMorphState } from './types';
import TreeParticles from './components/TreeParticles';
import Decorations from './components/Decorations';
import CyberEnvironment from './components/CyberEnvironment';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);

  return (
    <div className="w-full h-full relative bg-black">
      <Overlay 
        currentState={treeState} 
        onToggleState={setTreeState} 
      />
      
      <Canvas dpr={[1, 2]} gl={{ antialias: false, toneMappingExposure: 1.5 }}>
        <PerspectiveCamera makeDefault position={[0, 5, 25]} fov={50} />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false} 
          minDistance={10} 
          maxDistance={40} 
          autoRotate={treeState === TreeMorphState.TREE_SHAPE}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
        />

        <Suspense fallback={null}>
          <CyberEnvironment />
          
          <group position={[0, -2, 0]}>
            <TreeParticles state={treeState} count={4000} />
            <Decorations state={treeState} />
            
            {/* Central Trunk Glow (Only visible in Tree Mode ideally, but we can lerp it or keep it as a core) */}
            <mesh position={[0, 1, 0]} visible={treeState === TreeMorphState.TREE_SHAPE}>
              <cylinderGeometry args={[0.2, 0.8, 12, 16]} />
              <meshStandardMaterial 
                color="#2f1a08" 
                emissive="#ff007f" 
                emissiveIntensity={0.5} 
                transparent 
                opacity={0.8}
              />
            </mesh>
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
