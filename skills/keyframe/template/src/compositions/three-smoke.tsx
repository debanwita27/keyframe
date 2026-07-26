import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { EASE, at, osc, t } from "../moves";

/**
 * Proof that the 3D path renders headlessly, and the starting point for the
 * reference techniques flagged `needs-3d` in refs/specs — chrome logo tumble,
 * ribbon tunnel, wireframe globe orbit.
 *
 * Everything is still a pure function of `frame`: no useFrame/clock, no
 * requestAnimationFrame. That is what keeps a 3D shot deterministic and
 * therefore renderable frame-by-frame.
 */

const Knot: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = (frame / 150) * Math.PI * 2;
  const settle = t(frame, 0, 40, "expoOut");
  return (
    <mesh
      rotation={[spin * 0.6, spin, 0]}
      scale={at(settle, 0.4, 1.25) + osc(frame, 120) * 0.03}
    >
      <torusKnotGeometry args={[1, 0.34, 180, 32]} />
      <meshStandardMaterial color="#8000FF" metalness={0.95} roughness={0.16} />
    </mesh>
  );
};

/** A ring of extruded planks the camera flies through — the ribbon-tunnel spec. */
const Tunnel: React.FC<{ count?: number }> = ({ count = 14 }) => {
  const frame = useCurrentFrame();
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const ang = (i / count) * Math.PI * 2 + frame / 260;
        const r = 3.1;
        return (
          <mesh
            key={i}
            position={[Math.cos(ang) * r, Math.sin(ang) * r, -2 + ((i * 1.4 + frame / 8) % 12) - 6]}
            rotation={[0, 0, ang]}
          >
            <boxGeometry args={[1.5, 0.14, 0.14]} />
            <meshStandardMaterial
              color={`hsl(${(275 + i * 6 + frame * 0.6) % 360}, 85%, 62%)`}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export const ThreeSmoke: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0B0A0F" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 48, position: [0, 0, 5.4] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 6]} intensity={2.4} />
        <directionalLight position={[-5, -3, 2]} intensity={1.1} color="#B57CFF" />
        <Tunnel />
        <Knot />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
