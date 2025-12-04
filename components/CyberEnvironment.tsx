import React from 'react';
import { Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, Glitch } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

const CyberEnvironment: React.FC = () => {
  return (
    <>
      {/* Background Ambience */}
      <color attach="background" args={['#05020a']} />
      <fog attach="fog" args={['#05020a', 10, 50]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} color="#4a00e0" />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ff007f" distance={50} decay={2} />
      <pointLight position={[-10, -5, -10]} intensity={2} color="#00ffcc" distance={50} decay={2} />
      <spotLight 
        position={[0, 20, 0]} 
        angle={0.5} 
        penumbra={1} 
        intensity={3} 
        color="#ffffff" 
        castShadow 
      />

      {/* Particle Effects */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles 
        count={200} 
        scale={20} 
        size={4} 
        speed={0.4} 
        opacity={0.5} 
        color="#ff007f" 
      />

      {/* Post Processing for Y2K/Cyberpunk Feel */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6}
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        {/* Subtle chromatic aberration/glitch can be added via Glitch, but keeping it clean for now */}
      </EffectComposer>

      {/* Floor Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
        <planeGeometry args={[100, 100, 20, 20]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          wireframe 
          emissive="#ff007f" 
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
};

export default CyberEnvironment;