import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// Chromium's GPU rasteriser matters for blur/filter-heavy comps.
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(4);
