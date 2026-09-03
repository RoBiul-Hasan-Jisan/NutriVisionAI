/** Decorative page background, kept as a no-op. The animated web canvas
 *  that used to render here didn't fit the product's professional direction,
 *  so this component is retained only so call sites elsewhere don't need to
 *  change — it renders nothing. Page backgrounds are now a flat, calm
 *  surface set by --page in globals.css. */

type Props = {
  className?: string;
  origin?: [number, number];
  arc?: number;
  rotate?: number;
  spokes?: number;
  rings?: number;
  reach?: number;
  color?: string;
  highlight?: string;
  nodeColor?: string;
  opacity?: number;
};

export function SpiderWebBackground(_props: Props) {
  return null;
}
