import { useEffect, useRef, useState } from 'react';

/**
 * A hand-drawn mark that draws itself when it scrolls into view, then drifts.
 *
 * NO GSAP HERE, DELIBERATELY. Drawing a stroke is one property — `stroke-dashoffset`
 * from its own length down to zero — and drifting is a keyframe. Both are things the
 * compositor already does, and reaching for an animation library to change one number
 * would put weight in the bundle for something CSS does for free. It is the same
 * reasoning that turned CanvasBackground from a requestAnimationFrame loop into two
 * gradients.
 *
 * The dash length is MEASURED with getTotalLength() rather than written down. A hardcoded
 * dasharray is right until somebody nudges a curve, and then the stroke either finishes
 * early and sits there half-drawn, or overshoots and the tail vanishes before the head
 * arrives — both of which look like a rendering bug rather than a wrong number.
 */

/** viewBox is 0 0 100 100 for all of them, so sizes are interchangeable. */
const PATHS = {
  /** A curved arrow, for pointing at the thing beside it. */
  arrow: [
    'M14 12C32 24 46 42 54 64',
    'M42 54L55 67L64 52',
  ],
  /** A loop drawn round a word, overshooting where it closes as a real one would. */
  circle: [
    'M72 22C40 8 12 28 16 52C20 76 56 88 76 72C92 59 88 30 62 20',
  ],
  /** A four-point sparkle. */
  star: [
    'M50 12C54 38 60 44 86 50C60 55 54 62 50 88C46 62 40 55 14 50C40 44 46 38 50 12Z',
  ],
  /** Two passes of an underline, the way a pen actually does it. */
  underline: [
    'M6 20C30 8 70 8 94 16',
    'M12 32C38 22 66 24 88 30',
  ],
} as const;

export type DoodleName = keyof typeof PATHS;

interface DoodleProps {
  name: DoodleName;
  /** Wrapper classes — this is where position, size and colour go. */
  className?: string;
  /** Milliseconds before the stroke starts, so a cluster does not draw in unison. */
  delay?: number;
  /** Seconds for one drift cycle. Varied per instance for the same reason. */
  drift?: number;
  /** Filled shapes (the sparkle) want a tint behind the stroke. */
  fill?: string;
}

const DRAW_MS = 900;

const Doodle = ({ name, className = '', delay = 0, drift = 7, fill = 'none' }: DoodleProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [lengths, setLengths] = useState<number[]>([]);

  // Measure first, in a layout-safe moment, so the stroke is hidden before it is
  // ever painted. Setting the dash after the element is visible shows one frame of
  // the finished mark, which reads as a flicker.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll('path'));
    setLengths(paths.map((path) => path.getTotalLength()));
  }, [name]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || lengths.length === 0) return;

    // Reduced motion gets the mark, just not the performance of it arriving.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setDrawn(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(svg);
    return () => observer.disconnect();
  }, [lengths]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      fill={fill}
      aria-hidden="true"
      className={`pointer-events-none select-none ${drawn ? 'animate-doodle-drift' : ''} ${className}`}
      style={{ animationDuration: `${drift}s`, animationDelay: `${delay}ms` }}
    >
      {PATHS[name].map((d, i) => {
        const length = lengths[i];
        return (
          <path
            key={d}
            d={d}
            stroke="currentColor"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              length === undefined
                ? // Before the measurement lands there is no honest dash to set, and
                  // a visible full-length stroke would be the flicker described above.
                  { opacity: 0 }
                : {
                    strokeDasharray: length,
                    strokeDashoffset: drawn ? 0 : length,
                    transition: `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
                    transitionDelay: `${delay + i * 160}ms`,
                  }
            }
          />
        );
      })}
    </svg>
  );
};

export default Doodle;
