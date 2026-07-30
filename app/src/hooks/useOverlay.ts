import { useEffect, useRef } from 'react';
import { pauseSmoothScroll, resumeSmoothScroll } from '@/hooks/useSmoothScroll';

/**
 * The BEHAVIOUR every overlay on this site shares — scroll lock, Escape, and
 * returning focus — with the LOOK left to the caller.
 *
 * Split out because two overlays (project details, certificate lightbox) need
 * all of this identically while animating differently, and the parts that are
 * easy to get subtly wrong are the shared ones:
 *
 *   * Lenis has to be paused, not just `overflow: hidden`. Lenis animates
 *     scroll position itself, so the page keeps gliding behind a "locked" body.
 *   * The previous overflow value is restored rather than cleared, so closing
 *     an overlay cannot hand the page a style it never had.
 *   * Focus goes back where it came from. Without that, dismissing an overlay
 *     drops keyboard focus to the top of the document and the reader loses
 *     their place in the page.
 */
export function useOverlay(isOpen: boolean, onClose: () => void) {
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    lastFocused.current = document.activeElement as HTMLElement | null;

    pauseSmoothScroll();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      resumeSmoothScroll();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;
    lastFocused.current?.focus?.();
  }, [isOpen]);
}

/** Shared easing so both overlays open with the same motion. */
export const OVERLAY_EASE = 'power3.out';

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
