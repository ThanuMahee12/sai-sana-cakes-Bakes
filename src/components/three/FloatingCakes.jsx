import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Floating sphere that looks like cake decorations
function FloatingSphere({ position, color, size = 1, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.3}
          radius={1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

// Floating donut/torus shape
function FloatingDonut({ position, color, size = 0.5, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[size, size * 0.4, 16, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

// Particles background
function Particles({ count = 100 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#E0BBE4'), // Lavender
      new THREE.Color('#f8b4d9'), // Pink
      new THREE.Color('#c084fc'), // Purple
      new THREE.Color('#faf5ff'), // Light purple
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count]);

  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.positions.length / 3}
          array={points.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={points.colors.length / 3}
          array={points.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Main scene component
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#E0BBE4" />

      {/* Floating shapes */}
      <FloatingSphere position={[-3, 2, -2]} color="#E0BBE4" size={0.8} speed={1.2} />
      <FloatingSphere position={[3, -1, -3]} color="#c084fc" size={0.6} speed={0.8} />
      <FloatingSphere position={[-2, -2, -1]} color="#f8b4d9" size={0.5} speed={1} />
      <FloatingSphere position={[2.5, 1.5, -2]} color="#faf5ff" size={0.7} speed={1.5} />

      <FloatingDonut position={[4, 0, -2]} color="#E0BBE4" size={0.4} speed={1.3} />
      <FloatingDonut position={[-4, 1, -3]} color="#c084fc" size={0.3} speed={0.9} />
      <FloatingDonut position={[0, -3, -2]} color="#f8b4d9" size={0.35} speed={1.1} />

      {/* Particles */}
      <Particles count={150} />
    </>
  );
}

// Exported component
export default function FloatingCakes() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
