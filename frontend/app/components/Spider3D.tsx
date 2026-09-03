import type { ReactNode } from "react";

/** Decorative hero accent, kept as a no-op. The 3D character model that used
 *  to render here didn't fit the product's professional direction, so this
 *  component is retained only so call sites elsewhere don't need to change —
 *  it renders nothing. */

export function Spider3D(_props: {
  className?: string;
  scale?: number;
  pose?: [number, number, number];
  side?: "left" | "right";
  hideBelowVerts?: number;
  model?: string;
  interactive?: boolean;
  fallback?: ReactNode;
}) {
  return null;
}
