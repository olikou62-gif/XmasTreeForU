import React from 'react';
import { TreeMorphState } from '../types';
import { Sparkles, Trees, Zap, Music } from 'lucide-react';

interface OverlayProps {
  currentState: TreeMorphState;
  onToggleState: (state: TreeMorphState) => void;
}

const Overlay: React.FC<OverlayProps> = ({ currentState, onToggleState }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-12">
      
      {/* Header */}
      <header className="flex flex-col items-start gap-2">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-300 font-['Orbitron'] tracking-tighter drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]">
          ARIX 
          <span className="text-xl md:text-2xl ml-2 font-light text-white font-['Rajdhani'] tracking-widest uppercase">
            Signature Tree
          </span>
        </h1>
        <div className="flex items-center gap-2 text-xs md:text-sm text-cyan-300 font-mono tracking-widest bg-black/50 p-1 px-2 border border-cyan-800 rounded">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          SYSTEM ONLINE // Y2K_EDITION
        </div>
      </header>

      {/* Center Message (Optional) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center opacity-80 mix-blend-screen pointer-events-none">
        {currentState === TreeMorphState.TREE_SHAPE && (
           <h2 className="text-6xl md:text-9xl font-black text-white/5 font-['Orbitron'] tracking-[1em] animate-pulse">
             MERRY
           </h2>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pointer-events-auto">
        
        <div className="flex flex-col gap-2 font-['Rajdhani'] text-white/70 max-w-xs text-sm">
          <p>
            Welcome to the digital void. Use your mouse/touch to rotate the camera.
            Experience the duality of chaos and order.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => onToggleState(TreeMorphState.SCATTERED)}
            className={`
              relative group flex items-center gap-2 px-6 py-3 rounded-sm border 
              transition-all duration-300 backdrop-blur-sm
              ${currentState === TreeMorphState.SCATTERED 
                ? 'bg-pink-600/20 border-pink-500 text-pink-400 shadow-[0_0_20px_rgba(255,0,127,0.4)]' 
                : 'bg-black/40 border-white/20 text-white/50 hover:border-pink-500/50 hover:text-white'}
            `}
          >
            <Sparkles size={18} />
            <span className="font-['Orbitron'] font-bold tracking-wider">SCATTER</span>
            {currentState === TreeMorphState.SCATTERED && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
            )}
          </button>

          <button 
            onClick={() => onToggleState(TreeMorphState.TREE_SHAPE)}
            className={`
              relative group flex items-center gap-2 px-6 py-3 rounded-sm border 
              transition-all duration-300 backdrop-blur-sm
              ${currentState === TreeMorphState.TREE_SHAPE 
                ? 'bg-green-600/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(0,255,128,0.4)]' 
                : 'bg-black/40 border-white/20 text-white/50 hover:border-green-500/50 hover:text-white'}
            `}
          >
            <Trees size={18} />
            <span className="font-['Orbitron'] font-bold tracking-wider">ASSEMBLE</span>
            {currentState === TreeMorphState.TREE_SHAPE && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
