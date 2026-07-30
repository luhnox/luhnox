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
/**
 * The live instance, module-scoped so an overlay can freeze the page behind it.
 *
 * Without this, Lenis keeps driving the page while a modal is open: the wheel
 * scrolls the section underneath instead of the dialog, and `overflow: hidden`
 * on <body> does not stop it, because Lenis animates scroll position itself
 * rather than leaving it to the browser.
 */
let activeLenis: Lenis | null = null;

export function pauseSmoothScroll() {
  activeLenis?.stop();
}

export function resumeSmoothScroll() {
  activeLenis?.start();
}

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

    activeLenis = lenis;

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
      if (activeLenis === lenis) activeLenis = null;
    };
  }, []);
}
