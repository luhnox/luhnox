import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth scrolling, which the reference runs the whole page on and which does
 * more for how the site feels than any single section does — the eased travel
 * is what makes the staggered cards and sticky column read as one movement
 * rather than as separate jumps.
 *
 * Honours prefers-reduced-motion by simply not starting: the browser's native
 * scrolling is the correct behaviour for anyone who asked for less animation.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      // Touch devices already scroll smoothly, and overriding it there fights
      // the platform rather than helping.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // scrollIntoView is driven by the browser, so Lenis has to be told to take
    // over or the nav links jump while the wheel glides.
    const handleAnchor = (event: Event) => {
      const target = (event.target as HTMLElement)?.closest('a[href^="#"]');
      const href = target?.getAttribute('href');

      if (!href || href === '#') return;

      const element = document.querySelector(href);
      if (!element) return;

      event.preventDefault();
      lenis.scrollTo(element as HTMLElement, { offset: -80 });
    };

    document.addEventListener('click', handleAnchor);

    return () => {
      document.removeEventListener('click', handleAnchor);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
