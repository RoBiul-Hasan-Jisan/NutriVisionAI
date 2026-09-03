/** Decorative hero accent, kept as a no-op. The illustrated character that
 *  used to render here didn't fit the product's professional direction, so
 *  this component is retained only so call sites elsewhere don't need to
 *  change — it renders nothing. */

export type Pose = "perch" | "hang" | "crawl";
export type Corner = "tl" | "tr" | "bl" | "br";

type Props = {
  targetId: string;
  corner?: Corner;
  pose?: Pose;
  side?: "left" | "right";
  inset?: number;
  top?: number;
  scale?: number;
  sfx?: string;
};

export function WebShot(_props: Props) {
  return null;
}
