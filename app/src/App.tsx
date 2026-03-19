import { useEffect, useRef, useState } from 'react';
import './App.css';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Certificates from './sections/Certificates';
import Experience from './sections/Experience';
import GitHubOverview from './sections/GitHubOverview';
import Projects from './sections/Projects';
import Footer from './sections/Footer';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      <ParticleBackground />
      <CustomCursor />
      
      {/* Navigation */}
      <Navigation scrollY={scrollY} />
      
      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Certificates />
        <Experience />
        <GitHubOverview />
        <Projects />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
