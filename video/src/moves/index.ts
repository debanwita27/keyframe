/**
 * The move library. Compose videos from these — do not hand-roll interpolate()
 * calls in a composition. If a move you need does not exist, add it here first
 * so it gets a name, defaults that already have taste, and reuse.
 *
 * See ../../pipeline/MOVE_VOCAB.md for the spec each of these implements.
 */
export * from "./easings";
export * from "./text";
export * from "./elements";
export * from "./ambient";
export * from "./camera";
export * from "./treatment";
