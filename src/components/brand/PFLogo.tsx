import Svg, { Circle, Defs, G, Mask, Rect } from 'react-native-svg';

export type PFLogoProps = {
  size?: number;
  color?: string;
};

/**
 * Stylised "PF" monogram approximating the Profits First brand mark.
 * Two interlocked rounded letterforms — a P (vertical bar + filled bowl with
 * negative space) above an F (vertical bar + long horizontal stem).
 * The bowl's negative space is carved with an SVG mask so the logo is
 * background-agnostic.
 *
 * To swap for the original artwork later, drop the PNG at
 * `assets/logo-pf.png` and replace usages of <PFLogo /> with
 * <Image source={require('../../assets/logo-pf.png')} resizeMode="contain" />.
 */
export function PFLogo({ size = 80, color = '#dde0e9' }: PFLogoProps) {
  const w = size;
  const h = size * 1.25;
  return (
    <Svg width={w} height={h} viewBox="0 0 100 125" fill="none">
      <Defs>
        {/* White = visible, Black = transparent. We hide a small circle inside the P bowl. */}
        <Mask id="pBowlHole" maskUnits="userSpaceOnUse" x={0} y={0} width={100} height={125}>
          <Rect x={0} y={0} width={100} height={125} fill="#fff" />
          <Circle cx={42} cy={24} r={9} fill="#000" />
        </Mask>
      </Defs>

      {/* P: bar + bowl, with the bowl's negative space carved by the mask */}
      <G mask="url(#pBowlHole)">
        {/* Vertical bar */}
        <Rect x={6} y={4} width={22} height={70} rx={11} fill={color} />
        {/* Bowl: solid disk overlapping the bar from the right */}
        <Circle cx={40} cy={26} r={24} fill={color} />
      </G>

      {/* F: vertical bar (offset right, starts below mid) */}
      <Rect x={40} y={56} width={22} height={64} rx={11} fill={color} />
      {/* F: top horizontal stem (long, attached near the top of the F bar) */}
      <Rect x={62} y={62} width={32} height={22} rx={11} fill={color} />
      {/* F: middle horizontal stem (shorter — sits in the middle of the F) */}
      <Rect x={62} y={92} width={22} height={20} rx={10} fill={color} />
    </Svg>
  );
}
