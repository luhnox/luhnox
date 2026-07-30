import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface NavigationProps {
  scrollY: number;
}

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Experience', href: '#experience' },
  { name: 'Overview', href: '#overview' },
  { name: 'Projects', href: '#projects' },
];

/**
 * The bar reads left to right: whose site this is, then where you can go.
 *
 * It used to split the links into two halves and sit the wordmark between
 * them, which put "luhnox" in the middle of a sentence of destinations and
 * made it read as one more link.
 */
const Navigation = ({ scrollY }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsScrolled(scrollY > 100);
  }, [scrollY]);

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleClick = (href: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    scrollToSection(href);
  };

  return (
    <>
      {/* One bar for both states: it only gains a surface once the page moves
          under it, rather than swapping itself for a second navigation. */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'border-b border-border bg-background/80 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="#home"
            onClick={handleClick('#home')}
            className="text-lg font-extrabold tracking-tight text-foreground"
          >
            luhnox<span className="text-accent">.</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleClick(link.href)}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile keeps the theme switch OUTSIDE the collapsible menu: changing
              the look is a one-tap setting, not a destination, and burying it
              behind the hamburger would mean opening a menu to close it again. */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden ${isOpen ? 'visible' : 'invisible'}`}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`paper-card absolute inset-x-4 top-20 rounded-2xl p-4 transition-all duration-300 ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleClick(link.href)}
                className="rounded-xl px-4 py-3 text-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
