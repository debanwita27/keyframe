import React from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { DriftCamera, FilmGrain, GradientDrift, Vignette } from "../moves";

/**
 * The Jitter → Remotion bridge.
 *
 * There is no official joint documentation, but Jitter exports Lottie and
 * `@remotion/lottie` plays it, so the handoff is: author the fiddly vector /
 * easing work in Jitter, export Lottie, then let Remotion do what Jitter cannot —
 * data-driven copy, per-locale variants, beat-locked sequencing, and the
 * analyzer feedback loop.
 *
 * Crucially Remotion DRIVES the Lottie by frame rather than letting it play on
 * its own clock, so the composite stays deterministic and frame-reproducible.
 *
 * Caveats worth knowing before committing a project to this path:
 *  - `@remotion/lottie` renders via lottie-web, so anything lottie-web does not
 *    support will not appear. Blend modes and some effects are the usual gaps.
 *  - Keep TEXT in Remotion, not in the Lottie. Lottie text depends on font
 *    handling in the player and is the most common source of drift between the
 *    Jitter preview and the render.
 *  - Match the frame rate. A 60fps Jitter export inside a 30fps composition will
 *    play at half speed unless you resample on export.
 */
export const LottieBridge: React.FC = () => {
  const [handle] = React.useState(() => delayRender("loading lottie"));
  const [data, setData] = React.useState<LottieAnimationData | null>(null);

  React.useEffect(() => {
    fetch(staticFile("lottie/probe.json"))
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [handle]);

  return (
    <AbsoluteFill style={{ background: "#0B0A0F" }}>
      <GradientDrift colors={["#3A0F7A", "#1B0B3D"]} bg="#0B0A0F" periodF={260} opacity={0.55} />
      <DriftCamera ampPct={1.2} periodF={240} zoom={1.04}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          {/* the Jitter-authored asset, driven by Remotion's frame clock */}
          {data && <Lottie animationData={data} style={{ width: 520, height: 520 }} />}
        </AbsoluteFill>
      </DriftCamera>
      {/* our own treatment stack still applies on top of the imported asset */}
      <FilmGrain opacity={0.05} />
      <Vignette strength={0.2} />
    </AbsoluteFill>
  );
};
