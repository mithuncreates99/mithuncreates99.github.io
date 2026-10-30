/**
 * Hand-drawn fist pinching a bundle of threads, in pink line-work on plum.
 * Drawn in a local frame (wrist at 0,0, knuckles towards +x), then rotated so
 * the fist points up and to the right. The arm runs off the bottom-left edge.
 */

import { HAND_VIEWBOX } from './handGeometry'

export function HandIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`hand ${className}`}
      viewBox={`0 0 ${HAND_VIEWBOX.w} ${HAND_VIEWBOX.h}`}
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(185 187) rotate(-30)">
        {/* loose thread ends behind the fist */}
        <g className="hand__thread">
          <path d="M60 6 C 30 14, 4 30, -8 58 C -14 74, -4 86, 8 80" />
          <path d="M62 9 C 36 22, 18 44, 14 70 C 12 84, 22 92, 30 84" />
          <path d="M58 4 C 26 8, -6 18, -26 44" />
          <path d="M61 7 C 44 18, 34 40, 36 62 C 37 72, 44 76, 50 72" />
        </g>

        {/* forearm */}
        <path className="hand__skin" d="M-270 -40 C -180 -44, -80 -48, 8 -46 L 14 40 C -80 44, -180 48, -270 52 Z" />
        <path className="hand__ink" d="M-270 -40 C -180 -44, -80 -48, 2 -46" />
        <path className="hand__ink" d="M-270 52 C -180 48, -80 44, 10 40" />

        {/* sleeve and cuff */}
        <path
          className="hand__cloth hand__ink"
          d="M-280 -50 C -220 -52, -160 -56, -104 -56 C -98 -30, -98 20, -104 58 C -160 60, -220 62, -280 64 Z"
        />
        <path
          className="hand__cloth hand__ink"
          d="M-116 -58 L -86 -58 C -80 -30, -80 24, -86 60 L -116 60 C -110 24, -110 -30, -116 -58 Z"
        />
        <path className="hand__fine" d="M-100 -50 C -96 -24, -96 22, -100 52" />
        <circle cx="-101" cy="-30" r="2" className="hand__dot" />
        <path className="hand__fine" d="M-150 -54 C -146 -30, -150 -6, -160 6" />
        <path className="hand__fine" d="M-190 -50 C -182 -36, -184 -16, -196 0" />
        <path className="hand__fine" d="M-176 60 C -170 46, -160 38, -146 34" />
        <path className="hand__fine" d="M-230 58 C -226 46, -214 40, -204 38" />

        {/* forearm shading */}
        <path className="hand__fine" d="M-70 30 l 8 10 M-56 31 l 8 10 M-42 32 l 8 9 M-28 33 l 7 8 M-14 34 l 6 7" />
        <path className="hand__fine" d="M-80 -20 C -50 -24, -24 -26, -2 -28" />

        {/* back of the hand and the curled fingers (open path: no seam at the wrist) */}
        <path
          className="hand__skin hand__ink"
          d="M 2 -46 C 24 -52, 46 -60, 66 -66 C 80 -70, 94 -70, 104 -64 C 122 -58, 140 -46, 150 -28 C 156 -18, 156 -6, 152 4 C 158 10, 160 22, 154 32 C 150 40, 144 44, 138 46 C 142 52, 140 60, 132 64 C 126 68, 118 68, 112 66 C 112 72, 104 76, 96 74 C 80 72, 64 64, 50 56 C 36 50, 22 44, 8 40"
        />
        <path className="hand__mid" d="M152 4 C 144 6, 136 6, 128 4" />
        <path className="hand__mid" d="M138 46 C 132 44, 126 40, 122 36" />
        <path className="hand__mid" d="M112 66 C 108 60, 104 56, 98 52" />
        <path className="hand__fine" d="M140 -38 C 136 -32, 136 -26, 140 -20" />
        <path className="hand__fine" d="M146 -34 C 143 -30, 143 -26, 146 -22" />
        <path className="hand__fine" d="M104 -64 C 110 -54, 112 -44, 110 -34" />
        <path className="hand__fine" d="M14 -40 C 40 -48, 66 -56, 92 -60" />
        <path className="hand__fine" d="M10 26 C 14 30, 16 34, 16 40" />
        <path className="hand__fine" d="M4 22 C 8 28, 10 32, 10 38" />

        {/* threads trapped under the thumb */}
        <g className="hand__thread">
          <path d="M58 6 C 90 0, 120 -4, 150 -8" />
          <path d="M60 8 C 92 3, 122 -1, 152 -5" />
          <path d="M62 10 C 94 6, 124 2, 152 -2" />
        </g>

        {/* sketch over-strokes */}
        <path className="hand__fine" d="M30 -50 C 52 -57, 70 -64, 88 -68" />
        <path className="hand__fine" d="M110 -62 C 126 -55, 140 -44, 148 -32" />

        {/* thumb */}
        <path
          className="hand__skin hand__ink"
          d="M 26 -6 C 44 -20, 64 -30, 86 -32 C 104 -34, 122 -30, 136 -22 C 146 -16, 150 -8, 146 -2 C 142 4, 132 4, 120 2 C 104 2, 90 6, 76 12 C 62 18, 50 28, 38 36 C 30 40, 20 40, 14 34"
        />
        <path className="hand__fine" d="M60 -26 C 76 -32, 94 -35, 112 -33" />
        <path className="hand__skin hand__mid" d="M128 -22 C 134 -22, 140 -18, 142 -12 C 138 -10, 132 -12, 126 -14 Z" />
        <path className="hand__fine" d="M106 -31 C 104 -24, 104 -16, 108 -10" />
        <path className="hand__fine" d="M112 -31 C 110 -26, 110 -20, 112 -14" />
        <path className="hand__fine" d="M40 30 C 52 20, 64 12, 78 8" />
        <path className="hand__fine" d="M48 34 l 6 6 M58 28 l 6 6 M68 22 l 6 6" />
        <path className="hand__fine" d="M120 56 l 4 6 M128 52 l 4 6 M100 64 l 4 6 M90 66 l 3 5" />
      </g>
    </svg>
  )
}
