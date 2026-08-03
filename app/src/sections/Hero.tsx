import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Github, Instagram, Mail, Music2, Linkedin } from 'lucide-react';
import { GITHUB_USERNAME, getGitHubHeaders, hasGitHubToken } from '@/lib/github';
import Doodle from '@/components/Doodle';

interface GitHubHeroProfile {
  created_at?: string;
  public_repos?: number;
  total_private_repos?: number;
}

const SOCIALS = [
  { href: 'https://github.com/luhnox', label: 'GitHub', Icon: Github },
  { href: 'https://www.instagram.com/luhnox_/', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.tiktok.com/@luhnoxq', label: 'TikTok', Icon: Music2 },
  { href: 'mailto:luhnoxq@gmail.com', label: 'Email', Icon: Mail },
  { href: 'https://www.linkedin.com/in/muhammad-fery-iskandar-147a25266/', label: 'LinkedIn', Icon: Linkedin },
];

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  // Read off GitHub, so both are facts rather than claims — which is why the
  // first is labelled as time on GitHub and not as years of experience. It
  // used to read "5+ Years" directly above a bio saying "I'm still a
  // beginner", and the two cannot both be true.
  const [heroStats, setHeroStats] = useState({ githubYears: 0, totalProjects: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    const timerId = window.setTimeout(async () => {
      try {
        const endpoint = hasGitHubToken()
          ? 'https://api.github.com/user'
          : `https://api.github.com/users/${GITHUB_USERNAME}`;

        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: getGitHubHeaders(),
        });

        if (!response.ok) return;

        const data = (await response.json()) as GitHubHeroProfile;

        const currentYear = new Date().getFullYear();
        const createdYear = data.created_at ? new Date(data.created_at).getFullYear() : currentYear;
        const safeStartYear = Number.isNaN(createdYear) ? currentYear : createdYear;

        const publicProjects = Number(data.public_repos ?? 0);
        const privateProjects = hasGitHubToken() ? Number(data.total_private_repos ?? 0) : 0;

        setHeroStats({
          githubYears: Math.max(1, currentYear - safeStartYear + 1),
          totalProjects: Math.max(0, publicProjects + privateProjects),
        });
      } catch {
        // Nothing is shown rather than a made-up number if GitHub is down.
      }
    }, 1200);

    return () => {
      window.clearTimeout(timerId);
      controller.abort();
    };
  }, []);

  useEffect(() => setIsLoaded(true), []);

  const contentRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  /**
   * The hero closes as you scroll off it: pinned in place while its contents
   * sink, shrink and blur out, so the next section arrives over an empty stage
   * rather than pushing a full screen of type up and out of frame.
   *
   * The pin is CSS (`sticky top-0`), not ScrollTrigger's own `pin`. Sticky needs
   * no placeholder element and cannot fight Lenis over scroll position, which a
   * pinned+scrubbed trigger sometimes does. GSAP is only asked to interpolate
   * the fade, which is what `scrub` is genuinely good at.
   *
   * `end: '55%'` on purpose, well before the hero is fully scrolled past. The
   * layers below carry no opaque background — that would hide the page's
   * dot-grid backdrop — so the hero has to be at zero opacity BEFORE the
   * incoming section overlaps it, or the two would be legible through each
   * other for half a screen.
   *
   * ⚠️ GSAP IS LOADED DYNAMICALLY, AND HAS TO STAY THAT WAY. The hero is the one
   *    section App.tsx does NOT lazy-load, because it is above the fold — so a
   *    static `import gsap` here lands GSAP + ScrollTrigger in the entry chunk.
   *    Measured: that took the main bundle from 217 kB to 333 kB, on a page whose
   *    every other section is deferred precisely to avoid that. Importing inside
   *    the effect keeps first paint unchanged and costs only that the fade starts
   *    a moment late — invisible, since it does nothing until you scroll.
   */
  useEffect(() => {
    const content = contentRef.current;
    const section = heroRef.current;
    if (!content || !section) return;

    // Reduced motion gets the plain page: pinned, but no scrubbed fade.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      // The effect can be torn down while those two are still in flight; without
      // this the triggers would be created against an unmounted hero.
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const animation = gsap.to(content, {
        opacity: 0,
        scale: 0.94,
        y: -40,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: '55%', scrub: true },
      });

      // The "scroll to explore" prompt goes first and fast. It is an instruction
      // that stops being true the moment it is followed, so it should not still
      // be sitting there at half opacity a third of the way down the page.
      const hint = hintRef.current;
      const hintAnimation = hint
        ? gsap.to(hint, {
            opacity: 0,
            y: 16,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: '18%', scrub: true },
          })
        : null;

      cleanup = () => {
        animation.scrollTrigger?.kill();
        animation.kill();
        hintAnimation?.scrollTrigger?.kill();
        hintAnimation?.kill();
        // The fade leaves inline transform/filter/opacity behind; clearing them
        // matters because a hot reload would otherwise re-mount an invisible hero.
        gsap.set(content, { clearProps: 'opacity,scale,y,filter' });
        if (hint) gsap.set(hint, { clearProps: 'opacity,y' });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const reveal = (delay: string) => ({
    className: `transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`,
    style: { transitionDelay: delay },
  });

  return (
    // h-screen, not min-h-screen: a sticky box has to have a known height for
    // `top-0` to mean anything, and the hero's content already fits one screen.
    <section
      id="home"
      ref={heroRef}
      className="sticky top-0 flex h-screen items-center overflow-hidden px-6"
    >
      <div ref={contentRef} className="container mx-auto max-w-5xl">
        <div {...reveal('0.1s')}>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">
            Hello, I&apos;m
          </p>
        </div>

        {/* The name is the page's largest thing by a wide margin, with the
            portrait reduced to a mark beside it — the reference leads with
            type, not with a photograph. */}
        {/* The marks are positioned against the name rather than the section, so
            they travel with the type at every breakpoint instead of drifting off
            it. `relative` on the heading is what they hang from. */}
        <div {...reveal('0.2s')}>
          <h1 className="relative flex flex-wrap items-center gap-x-5 gap-y-2 text-6xl md:text-8xl font-extrabold tracking-[-0.04em] leading-[0.95]">
            <Doodle
              name="star"
              fill="hsl(var(--primary) / 0.14)"
              delay={700}
              drift={7.5}
              className="absolute -left-8 -top-9 h-12 w-12 text-primary md:-left-12 md:-top-12 md:h-16 md:w-16"
            />
            <span>luhnox</span>
            <img
              src="/hero-profile-396.webp"
              alt="luhnox"
              className="h-14 w-14 md:h-20 md:w-20 rounded-full object-cover ring-1 ring-border shadow-sm"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              width={396}
              height={396}
            />
            <Doodle
              name="arrow"
              delay={1100}
              drift={8.5}
              className="absolute -bottom-10 left-[7.5rem] hidden h-14 w-14 -scale-x-100 text-accent md:block md:left-[14rem]"
            />
          </h1>
        </div>

        {/* Two halves of the same person, set in two different voices. */}
        <div {...reveal('0.3s')}>
          <div className="relative mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="canvas-frame relative px-4 py-1.5 font-serif italic text-3xl md:text-5xl text-foreground">
              Backend Developer
              {/* Underneath the words rather than beside them: this is the one
                  mark that annotates something, so it behaves like annotation. */}
              <Doodle
                name="underline"
                delay={1500}
                drift={9}
                className="absolute -bottom-5 left-2 h-6 w-[85%] text-primary"
              />
            </span>
            <span className="text-2xl md:text-3xl font-bold text-muted-foreground">&amp;</span>
            <span className="rounded-lg bg-foreground px-4 py-2 font-mono text-lg md:text-2xl font-bold text-background">
              <span className="text-accent">&gt;_</span> Learner
            </span>
          </div>
        </div>

        <div {...reveal('0.4s')}>
          <p className="mt-10 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground">
            I&apos;m still a beginner, learning to code and figuring things out one step at a time.
            I&apos;m building small projects, making mistakes, and slowly getting better — all while
            trying to keep it fun and creative.
          </p>
        </div>

        <div {...reveal('0.5s')}>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              onClick={scrollToAbout}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 font-medium text-background transition hover:opacity-90"
            >
              View my work
              <ArrowDown size={18} className="transition-transform group-hover:translate-y-1" />
            </button>

            {heroStats.totalProjects > 0 && (
              <p className="font-mono text-xs text-muted-foreground">
                {heroStats.totalProjects} repositories · {heroStats.githubYears} yrs on GitHub
              </p>
            )}
          </div>
        </div>

        <div {...reveal('0.6s')}>
          <div className="mt-12 flex gap-1">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="rounded-full p-3 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={hintRef}
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '0.8s' }}
      >
        <button
          type="button"
          onClick={scrollToAbout}
          className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Scroll to about section"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Scroll to explore</span>
          <div className="relative h-9 w-5 overflow-hidden rounded-full border border-current">
            <div className="absolute left-1/2 top-1.5 h-1.5 w-1.5 rounded-full bg-current animate-scroll-dot" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default Hero;
