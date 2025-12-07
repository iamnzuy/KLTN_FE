'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Bounds } from '@react-three/drei';
import * as THREE from 'three';

// This component loads and manages the GLTF model
const Model = ({ path, partColors }: { path: string; partColors: Record<string, string> }) => {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useMemo(() => {
    console.log("DEBUG: Applying colors. Configured parts:", Object.keys(partColors));
    clonedScene.traverse((child) => {
      const mesh = child as unknown as THREE.Mesh;
      if (!mesh?.isMesh) {
        return;
      }
      console.log(`DEBUG: Found mesh in 3D model: '${mesh.name}'`);
      const color = partColors[mesh.name];
      if (color) {
        console.log(`DEBUG: MATCH! Applying color ${color} to '${mesh.name}'`);
        mesh.material = (mesh.material as unknown as THREE.MeshStandardMaterial).clone();
        (mesh.material as THREE.MeshStandardMaterial).color.set(color);
        (mesh.material as unknown as THREE.MeshStandardMaterial).needsUpdate = true;
      }
    });
  }, [partColors, clonedScene]);

  return <primitive object={clonedScene} />;
};

const LoadingFallback = () => (
  <Html center>
    <div className="p-4 bg-white/70 rounded-lg backdrop-blur-md shadow-md">
      <p className="text-gray-800 font-semibold">Loading 3D Model...</p>
    </div>
  </Html>
);

// Main canvas viewer component with auto-fitting and improved setup
const CanvasViewer = ({ modelPath, partColors }: { modelPath: string; partColors: Record<string, string> }) => {
  if (!modelPath) {
    return <div className="flex items-center justify-center h-full">3D model not specified.</div>;
  }
  
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.0} 
        castShadow 
      />
      <spotLight position={[-5, 10, 2]} angle={0.2} penumbra={1} intensity={0.8} castShadow />

      <Suspense fallback={<LoadingFallback />}>
        {/* Use Bounds to auto-fit the model to the screen */}
        <Bounds fit clip observe margin={1.2}>
          <Model path={modelPath} partColors={partColors} key={modelPath} />
        </Bounds>
      </Suspense>

      <OrbitControls makeDefault />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </Canvas>
  );
};

export default CanvasViewer;
