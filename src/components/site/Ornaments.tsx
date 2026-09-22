import type { SVGProps } from "react";

type SvgProps = SVGProps<SVGSVGElement>;

/** Decorative mandala ring — stroke follows currentColor. */
export function Mandala({ className = "", ...props }: SvgProps) {
  const petals = Array.from({ length: 12 });
  const dots = Array.from({ length: 24 });
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      className={className}
      {...props}
    >
      <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
      <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="0.8" />
      {petals.map((_, i) => (
        <ellipse
          key={i}
          cx="100"
          cy="42"
          rx="11"
          ry="30"
          stroke="currentColor"
          strokeWidth="1"
          transform={`rotate(${i * 30} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="34" stroke="currentColor" strokeWidth="1" />
      {dots.map((_, i) => (
        <circle
          key={i}
          cx="100"
          cy="67"
          r="1.6"
          fill="currentColor"
          transform={`rotate(${i * 15 + 7.5} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="14" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="5" fill="currentColor" />
    </svg>
  );
}

/** Diya (oil lamp) between two rules — divider ornament. */
export function DiyaDivider({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const line = tone === "dark" ? "#a06f1f" : "#d9b45c";
  const flame = tone === "dark" ? "#d96b2b" : "#e8913f";
  return (
    <svg
      viewBox="0 0 360 56"
      fill="none"
      aria-hidden
      className={className}
    >
      <line x1="4" y1="34" x2="132" y2="34" stroke={line} strokeWidth="1" />
      <line x1="228" y1="34" x2="356" y2="34" stroke={line} strokeWidth="1" />
      <circle cx="4" cy="34" r="2" fill={line} />
      <circle cx="356" cy="34" r="2" fill={line} />
      {/* flame */}
      <path
        d="M180 14c5 6.5 5.5 11.5 0 15.5-5.5-4-5-9 0-15.5Z"
        fill={flame}
      />
      <path
        d="M180 20.5c2.2 3 2.4 5.4 0 7.3-2.4-1.9-2.2-4.3 0-7.3Z"
        fill="#f5e3ae"
      />
      {/* bowl */}
      <path
        d="M154 34a26 14 0 0 0 52 0v-2h-52v2Z"
        fill={line}
        opacity="0.9"
      />
      <path d="M154 32h52" stroke={tone === "dark" ? "#6b1f26" : "#431217"} strokeWidth="1.4" />
    </svg>
  );
}

/** Corner flourish for cards. */
export function CornerFlourish({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden className={className}>
      <path
        d="M6 94C6 44 44 6 94 6"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M16 94c0-40 38-78 78-78"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <circle cx="6" cy="6" r="3" fill="currentColor" />
      <path
        d="M28 60c8-14 18-24 32-32"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeDasharray="2 4"
      />
    </svg>
  );
}

/** Grand temple (mehrab) arch outline for the hero. */
export function ArchOutline({ className = "" }: SvgProps) {
  return (
    <svg
      viewBox="0 0 420 640"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* finial kalash */}
      <circle cx="210" cy="18" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M202 32c0-8 4-12 8-14 4 2 8 6 8 14" stroke="currentColor" strokeWidth="1.2" />
      <path d="M210 4v8" stroke="currentColor" strokeWidth="1.2" />
      {/* outer arch */}
      <path
        d="M30 632V252C30 122 114 38 210 38s180 84 180 214v380"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* inner arch */}
      <path
        d="M52 632V256c0-118 68-186 158-186s158 68 158 186v376"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1 5"
      />
      {/* base ticks */}
      <path d="M30 600h360M30 612h360" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      {/* side lotus buds */}
      <circle cx="30" cy="252" r="4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="390" cy="252" r="4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Small marigold petal used by the falling petals layer. */
export function PetalShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 1C17 7 19 13 12 23 5 13 7 7 12 1Z"
        fill={color}
        opacity="0.85"
      />
    </svg>
  );
}
