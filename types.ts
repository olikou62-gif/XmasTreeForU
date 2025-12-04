import * as THREE from 'three';

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  id: number;
  scatterPosition: THREE.Vector3;
  treePosition: THREE.Vector3;
  color: THREE.Color;
  scale: number;
  rotationSpeed: number;
  axis: THREE.Vector3;
}

export interface DecorationData {
  id: number;
  type: 'planet' | 'gift' | 'note' | 'ring';
  scatterPosition: THREE.Vector3;
  treePosition: THREE.Vector3;
  color: string;
}
