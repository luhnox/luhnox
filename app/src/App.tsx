import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import './App.css';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';

const About = lazy(() => import('./sections/About'));
const Skills = lazy(() => import('./sections/Skills'));
const Certificates = lazy(() => import('./sections/Certificates'));
const Experience = lazy(() => import('./sections/Experience'));
const GitHubOverview = lazy(() => import('./sections/GitHubOverview'));
const Projects = lazy(() => import('./sections/Projects'));
const Footer = lazy(() => import('./sections/Footer'));
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));
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
                <div className="rounded-3xl border border-white/10 bg-white/5" style={{ minHeight: fallbackMinHeight }} />
              </div>
            </section>
          }
        >
          {children}
        </Suspense>
      ) : (
        <section className={fallbackClassName}>
          <div className="container mx-auto max-w-7xl">
            <div className="rounded-3xl border border-white/10 bg-white/5" style={{ minHeight: fallbackMinHeight }} />
          </div>
        </section>
      )}
    </div>
  );
};

function App() {
  const [scrollY, setScrollY] = useState(0);
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
    <div ref={mainRef} className="relative min-h-screen bg-dark text-white overflow-x-hidden">
      {/* Particle Background */}
      {enhancementsReady && (
        <Suspense fallback={null}>
          <ParticleBackground />
          <CustomCursor />
        </Suspense>
      )}
      
      {/* Navigation */}
      <Navigation scrollY={scrollY} />
      
      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
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
      </main>
      
      {/* Footer */}
      <DeferredSection fallbackMinHeight="12rem">
        <Footer />
      </DeferredSection>
    </div>
  );
}

export default App;
