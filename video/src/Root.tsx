import React from "react";
import { Composition } from "remotion";
import { PRODUCT_OS_DURATION, ProductOSLaunch } from "./compositions/product-os";
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
