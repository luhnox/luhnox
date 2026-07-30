import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import './App.css';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import { useSmoothScroll } from './hooks/useSmoothScroll';

const About = lazy(() => import('./sections/About'));
const Skills = lazy(() => import('./sections/Skills'));
const Certificates = lazy(() => import('./sections/Certificates'));
const Experience = lazy(() => import('./sections/Experience'));
const GitHubOverview = lazy(() => import('./sections/GitHubOverview'));
const Projects = lazy(() => import('./sections/Projects'));
const Footer = lazy(() => import('./sections/Footer'));
const CanvasBackground = lazy(() => import('./components/CanvasBackground'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));

interface DeferredSectionProps {
  children: ReactNode;
  fallbackClassName?: string;
  fallbackMinHeight?: string;
  rootMargin?: string;
}

const DeferredSection = ({
  children,
  fallbackClassName = 'relative px-6 py-24 md:py-32',
  fallbackMinHeight = '24rem',
  rootMargin = '500px 0px',
}: DeferredSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={sectionRef}>
      {isVisible ? (
        <Suspense
          fallback={
            <section className={fallbackClassName}>
              <div className="container mx-auto max-w-7xl">
                <div className="rounded-3xl border border-border bg-muted/40" style={{ minHeight: fallbackMinHeight }} />
              </div>
            </section>
          }
        >
          {children}
        </Suspense>
      ) : (
        <section className={fallbackClassName}>
          <div className="container mx-auto max-w-7xl">
            <div className="rounded-3xl border border-border bg-muted/40" style={{ minHeight: fallbackMinHeight }} />
          </div>
        </section>
      )}
    </div>
  );
};

function App() {
  const [scrollY, setScrollY] = useState(0);
  useSmoothScroll();
  const [enhancementsReady, setEnhancementsReady] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const schedule =
      window.requestIdleCallback ??
      ((callback: IdleRequestCallback) => window.setTimeout(() => callback({} as IdleDeadline), 1500));
    const cancelSchedule =
      window.cancelIdleCallback ??
      ((handle: number) => window.clearTimeout(handle));

    const idleId = schedule(() => setEnhancementsReady(true));

    return () => cancelSchedule(idleId);
  }, []);

  useEffect(() => {
    const disableContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const disableTextSelection = (event: Event) => {
      const target = event.target as HTMLElement | null;

      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        return;
      }

      event.preventDefault();
    };

    window.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('selectstart', disableTextSelection);

    return () => {
      window.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('selectstart', disableTextSelection);
    };
  }, []);

  return (
    // overflow-x-CLIP, not hidden. `overflow-x: hidden` forces overflow-y to
    // `auto`, which makes this div a scroll container — and a sticky descendant
    // then sticks to THIS box instead of the viewport. Since the box grows with
    // its content it never scrolls, so the pinned hero below would silently do
    // nothing. `clip` clips without creating a scroll container.
    <div ref={mainRef} className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      {/* Canvas backdrop */}
      {enhancementsReady && (
        <Suspense fallback={null}>
          <CanvasBackground />
          <CustomCursor />
        </Suspense>
      )}
      
      {/* Navigation */}
      <Navigation scrollY={scrollY} />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* The hero is pinned and everything after it rises over the top of it.
            Two layers, so the stacking order is explicit rather than a
            consequence of document order: the hero sits at z-0 and the rest of
            the page at z-10.

            Neither layer gets an opaque background on purpose — that would hide
            the fixed dot-grid backdrop and its vignette for every section below
            the fold. The hero is faded to nothing by GSAP before the incoming
            content reaches it instead, so there is no bleed-through to cover. */}
        <div className="relative z-0">
          <Hero />
        </div>

        <div className="relative z-10">
        <DeferredSection fallbackMinHeight="28rem">
          <About />
        </DeferredSection>
        <DeferredSection fallbackMinHeight="30rem">
          <Skills />
        </DeferredSection>
        <DeferredSection fallbackMinHeight="34rem">
          <Certificates />
        </DeferredSection>
        <DeferredSection fallbackMinHeight="28rem">
          <Experience />
        </DeferredSection>
        <DeferredSection fallbackMinHeight="34rem">
          <GitHubOverview />
        </DeferredSection>
        <DeferredSection fallbackMinHeight="40rem">
          <Projects />
        </DeferredSection>
        </div>
      </main>
      
      {/* Footer */}
      <DeferredSection fallbackMinHeight="12rem">
        <Footer />
      </DeferredSection>
    </div>
  );
}

export default App;
