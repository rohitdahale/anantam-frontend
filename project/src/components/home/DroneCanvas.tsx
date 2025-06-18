import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';

const DronePlaceholder = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 1.5, 0.2, 4]} />
        <meshStandardMaterial color="#1a81ff" />
      </mesh>
      
      {/* Propellers */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;
        
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
              <meshStandardMaterial color="#2e2e2e" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[0.8, 0.05, 0.2]} />
              <meshStandardMaterial color="#3aa2ff" />
            </mesh>
          </group>
        );
      })}
      
      {/* Camera/sensors */}
      <mesh position={[0, -0.2, 1]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
};

const DroneModel = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
  });

  // In a real implementation, we would load an actual GLTF model here
  // For now, we'll use our placeholder
  return <DronePlaceholder />;
};

const DroneCanvas = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Suspense fallback={null}>
        <DroneModel />
        <Environment preset="city" />
      </Suspense>
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={1}
      />
    </Canvas>
  );
};

export default DroneCanvas;