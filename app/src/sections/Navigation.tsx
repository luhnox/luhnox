import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  scrollY: number;
}

const Navigation = ({ scrollY }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show navigation after scrolling past hero
    setIsVisible(scrollY > 100);
  }, [scrollY]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Experience', href: '#experience' },
    { name: 'Overview', href: '#overview' },
    { name: 'Projects', href: '#projects' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Navigation */}
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="glass rounded-full px-2 py-2 flex items-center gap-1">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
            className="px-4 py-2 font-bold text-lg gradient-text"
          >
            luhnox
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.slice(1).map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-full transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="absolute inset-0 bg-dark/95 backdrop-blur-xl" onClick={() => setIsOpen(false)} />
        <div
          className={`absolute top-24 left-4 right-4 glass rounded-2xl p-6 transition-all duration-500 ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="px-4 py-3 text-lg text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Initial Hero Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="w-full px-6 py-6 flex items-center justify-between">
          <a href="#home" className="font-bold text-2xl gradient-text">
            luhnox
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
