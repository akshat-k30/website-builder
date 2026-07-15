"use client"

import { Suspense, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"
import { useRef } from "react"

function GlowSphere({
  position,
  color,
  size = 1.5,
  speed = 0.3,
  distort = 0.3,
}: {
  position: [number, number, number]
  color: string
  size?: number
  speed?: number
  distort?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialColor = useMemo(() => new THREE.Color(color), [color])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.05
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 16]} />
        <MeshDistortMaterial
          color={materialColor}
          transparent
          opacity={0.12}
          distort={distort}
          speed={1.5}
          roughness={0.5}
        />
      </mesh>
    </Float>
  )
}

function Scene({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.3} />
      <GlowSphere position={[-3, 1, -5]} color={primaryColor} size={2.5} speed={0.2} distort={0.25} />
      <GlowSphere position={[3, -1, -3]} color={secondaryColor} size={1.8} speed={0.4} distort={0.35} />
      <GlowSphere position={[0, 2, -7]} color={primaryColor} size={3} speed={0.15} distort={0.2} />
    </>
  )
}

interface AmbientSceneProps {
  primaryColor: string
  secondaryColor: string
}

export default function AmbientScene({ primaryColor, secondaryColor }: AmbientSceneProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.6,
        zIndex: 0,
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
          style={{ background: "transparent" }}
        >
          <Scene primaryColor={primaryColor} secondaryColor={secondaryColor} />
        </Canvas>
      </Suspense>
    </div>
  )
}
