"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function GlassesModel(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <Float floatIntensity={2} speed={2}>
            <mesh ref={meshRef} {...props}>
                {/* Placeholder geometry until we have a real model */}
                <torusGeometry args={[1, 0.4, 16, 100]} />
                <MeshTransmissionMaterial
                    backside
                    thickness={0.5}
                    roughness={0.1}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={0.06}
                    anisotropy={0.1}
                    color="#00ffff"
                />
            </mesh>
        </Float>
    );
}
