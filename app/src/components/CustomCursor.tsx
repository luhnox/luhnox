import { useEffect, useRef, useState } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, [data-cursor-hover="true"]';

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const canUseCustomCursor =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth > 900;

    setEnabled(canUseCustomCursor);
    document.body.classList.toggle('custom-cursor-enabled', canUseCustomCursor);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.22;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      rafId.current = window.requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
      setIsActive(true);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsActive(false);

    const handlePointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      setIsHovering(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    rafId.current = window.requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('mouseover', handlePointerOver, { passive: true });

    return () => {
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('mouseover', handlePointerOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isActive ? 'is-visible' : ''} ${
          isHovering ? 'is-hover' : ''
        } ${isPressed ? 'is-pressed' : ''}`}
      />
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isActive ? 'is-visible' : ''} ${
          isHovering ? 'is-hover' : ''
        } ${isPressed ? 'is-pressed' : ''}`}
      />
    </>
  );
};

export default CustomCursor;
