"use client";

import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { GlassesModel } from './GlassesModel';
import { Suspense } from 'react';

export function HeroExperience() {
    return (
        <div className="h-full w-full absolute inset-0 z-0">
            <Canvas
                shadows={false}
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 4], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
                <fog attach="fog" args={['#0a0a0a', 5, 20]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Suspense fallback={null}>
                    <GlassesModel position={[0, 0, 0]} />
                    <Environment preset="city" />
                    {/* Removed expensive ContactShadows for mobile/lag fix */}
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
