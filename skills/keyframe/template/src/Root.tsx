import React from "react";
import { Composition } from "remotion";
import { PRODUCT_OS_DURATION, ProductOSLaunch } from "./compositions/product-os";
import { LottieBridge } from "./compositions/lottie-bridge";
import { MaskSmoke } from "./compositions/mask-smoke";
import { ThreeSmoke } from "./compositions/three-smoke";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ProductOSLaunch"
      component={ProductOSLaunch}
      durationInFrames={PRODUCT_OS_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
    {/* Jitter -> Lottie -> Remotion handoff, composited under our own treatment. */}
    <Composition
      id="LottieBridge"
      component={LottieBridge}
      durationInFrames={60}
      fps={30}
      width={1280}
      height={720}
    />
    {/* Verifies the shape-mask family renders in headless Chromium — clip-path
        circle/polygon, SVG stroke-dash and transform-box all differ there. */}
    <Composition
      id="MaskSmoke"
      component={MaskSmoke}
      durationInFrames={60}
      fps={30}
      width={1600}
      height={900}
    />
    {/* Verifies the three.js path renders headlessly; base for the `needs-3d` specs. */}
    <Composition
      id="ThreeSmoke"
      component={ThreeSmoke}
      durationInFrames={150}
      fps={30}
      width={1280}
      height={720}
    />
    {/*
      A vertical cut is NOT just this composition at 1080x1920 — the shots use
      fixed pixel widths tuned to a 1920-wide frame and would overflow. Vertical
      needs its own layout pass per shot (see the `vertical_notes` field on the
      vertical reference specs). Deliberately not registered until that exists.
    */}
  </>
);
