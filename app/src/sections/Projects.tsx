import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Github, Lightbulb } from 'lucide-react';
import SelectionHeading from '@/components/SelectionHeading';
import ProjectModal, { type ProjectDetail } from '@/components/ProjectModal';
import Doodle from '@/components/Doodle';

type Project = ProjectDetail;

const PROJECTS: Project[] = [
  {
    id: 6,
    title: 'GTPS Host',
    description:
      'A hosting platform and control panel for Growtopia private servers: a public site, a per-server dashboard for clients, and a super-admin panel.',
    image: '/gtps-host.png',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'SQLite', 'Lua'],
    githubUrl: 'https://github.com/lohanlohan/Website-Bridge',
    demoUrl: 'https://gtps.host',
    overview: [
      'Each customer gets a dashboard scoped to their own server, covering worlds, players, items, roles, store, weather, logs and metrics — around 26 sections in all, plus a super-admin panel that stays workable past 300 servers.',
      'Two parts are more than CRUD: an in-browser Lua editor built on CodeMirror that validates syntax with luaparse before a script can be saved, and a drag-and-drop world planner and sprite editor built on dnd-kit. Every newly provisioned server also ships with a default Lua template baked into a master data file.',
    ],
    facts: [
      { label: 'Role', value: 'Full-stack — platform, dashboard, Lua tooling' },
      { label: 'Stack', value: 'Next.js App Router, better-sqlite3, CodeMirror, dnd-kit' },
      { label: 'Hosting', value: 'Self-hosted VPS — PM2, Nginx, Certbot' },
      { label: 'Scale', value: 'Admin tooling tuned for 300+ servers' },
    ],
  },
  {
    id: 7,
    title: 'GrowLore',
    description:
      'A Growtopia toolkit in two halves that share one database: a free public calculator site, and a paid Discord bot for people running levelling services.',
    image: '/growlore.png',
    tags: ['React 19', 'TypeScript', 'Vite 7', 'discord.js', 'MySQL', 'Vercel'],
    githubUrl: 'https://github.com/luhnox/GrowLore',
    demoUrl: 'https://growlore.site',
    overview: [
      'The public side is roughly fifteen calculators and simulators — levels, guilds, vending, lock conversion — free and account-free, prerendered for SEO via an SSR build step.',
      'The paid side is a Discord bot for level-selling businesses: a dashboard-defined pricelist, quoting that picks the best pack combination, screenshot uploads that read level and XP automatically, per-channel sales reports with refunds and profit, ticket panels with transcripts readable on the site, and a live boost queue.',
      'Three domains — marketing, dashboard and API — run from a single Vercel serverless function, a constraint the routing was designed around rather than scaled past.',
    ],
    facts: [
      { label: 'Role', value: 'Full-stack — site, dashboard, Discord bot' },
      { label: 'Stack', value: 'Vite + React, Express, MySQL, @napi-rs/canvas' },
      { label: 'Hosting', value: 'Vercel (web) + Pterodactyl (bot)' },
      { label: 'Model', value: 'Site free; bot $0.50 per server per week' },
    ],
  },
  {
    id: 1,
    title: 'Portfolio Website',
    description:
      'A personal portfolio website built with React, TypeScript, and Tailwind CSS to showcase my experience, certifications, GitHub activity, and featured projects.',
    image: '/project-thumbnail.jpg',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    githubUrl: 'https://github.com/luhnox/luhnox',
  },
  {
    id: 2,
    title: 'BESTLEVEL Discord Bot',
    description:
      'A Growtopia leveling bot system that automatically calculates XP packages and pricing so customers can buy the exact level progression they need.',
    image: '/bestlevel.png',
    tags: ['Discord Bot', 'Growtopia', 'Calculator System', 'Automation'],
    githubUrl: 'https://github.com/luhnox',
  },
  {
    id: 3,
    title: 'SEWALEVEL Discord Bot',
    description:
      'A Growtopia leveling calculator bot designed for rental-level services, helping users estimate XP requirements and costs quickly and accurately.',
    image: '/sewalevel.png',
    tags: ['Discord Bot', 'Growtopia', 'XP Calculator', 'Service Bot'],
    githubUrl: 'https://github.com/luhnox',
  },
  {
    id: 4,
    title: 'AMANLVL Discord Bot',
    description:
      'A Growtopia utility bot focused on safe and clear level calculations, built to simplify customer ordering with transparent XP-to-price conversion.',
    image: '/amanlvl.png',
    tags: ['Discord Bot', 'Growtopia', 'Order Helper', 'Pricing Logic'],
    githubUrl: 'https://github.com/luhnox',
  },
  {
    id: 5,
    title: 'DUCK COMMUNITY Private Bot',
    description:
      'A private community Discord bot featuring Roblox username verification, AFK command system, and temporary voice channel automation via voiceStateUpdate.',
    image: '/duck.png',
    tags: ['Private Bot', 'Discord', 'Roblox Verification', 'Voice Automation'],
    githubUrl: 'https://github.com/luhnox',
  },
];

/**
 * Rotation and vertical offset per card. The reference lays its work out as
 * prints dropped on a desk rather than as a grid: each sits at a slight angle
 * and no two share a baseline, so the eye travels down instead of scanning
 * rows. Fixed per index rather than random, so it is the same on every render.
 */
/**
 * ⚠️ KEEP THIS LENGTH EVEN. The offsets alternate mt-0 / mt-24 to drop the right
 * column below the left one, and the list is cycled with `% length`. At an ODD
 * length the cycle restarts on the wrong foot — index 4 (mt-0) would be
 * followed by index 5 wrapping to mt-0 as well, putting two flush cards in the
 * same grid row and flattening the stagger exactly there. Six entries keeps
 * every row reading left-flush / right-dropped no matter how many projects ship.
 */
const CARD_PLACEMENT = [
  { rotate: '-1.6deg', offset: 'md:mt-0' },
  { rotate: '1.4deg', offset: 'md:mt-24' },
  { rotate: '1.1deg', offset: 'md:mt-0' },
  { rotate: '-1.3deg', offset: 'md:mt-24' },
  { rotate: '-0.9deg', offset: 'md:mt-0' },
  { rotate: '1.5deg', offset: 'md:mt-24' },
];

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative px-6 py-24 md:py-32">
      <div className="container mx-auto max-w-6xl">
        <div
          className={`flex items-start gap-6 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <Lightbulb className="hidden shrink-0 text-accent md:block" size={36} aria-hidden="true" />
          <SelectionHeading label="Portfolio">
            <h2 className="relative max-w-2xl text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-[2.6rem]">
              Building small things, and finishing them.
              {/* Circled the way somebody marks the line they meant. It only draws
                  once the heading is actually on screen, which is the whole point
                  of the mark — it should look like it just happened. */}
              <Doodle
                name="circle"
                delay={400}
                drift={10}
                className="absolute -right-6 -top-8 hidden h-24 w-24 text-primary md:block"
              />
            </h2>
          </SelectionHeading>
        </div>

        <div className="mt-20 grid gap-x-16 gap-y-20 md:grid-cols-2">
          {PROJECTS.map((project, index) => {
            const placement = CARD_PLACEMENT[index % CARD_PLACEMENT.length];

            return (
              // A button, not a link: this opens the detail overlay in place
              // rather than leaving the page, and an <a> that never navigates
              // lies to the browser — middle-click and "open in new tab" would
              // both promise something it does not do. The real destinations
              // live on the buttons inside the overlay.
              <button
                key={project.id}
                type="button"
                onClick={() => setOpenProject(project)}
                aria-haspopup="dialog"
                className={`group block w-full text-left transition-all duration-700 ${placement.offset} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div
                  className="paper-card overflow-hidden rounded-xl p-2"
                  style={{ transform: `rotate(${placement.rotate})` }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <h3 className="mt-6 inline-flex items-center gap-2 text-xl font-extrabold tracking-tight">
                  {project.title}
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </h3>

                <p className="mt-1.5 max-w-md leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <a
            href="https://github.com/luhnox"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 font-medium text-background transition hover:opacity-90"
          >
            <Github size={18} />
            More on GitHub
          </a>
        </div>
      </div>

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
};

export default Projects;
