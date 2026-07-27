import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Github } from 'lucide-react';
import SelectionHeading from '@/components/SelectionHeading';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
}

const PROJECTS: Project[] = [
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
const CARD_PLACEMENT = [
  { rotate: '-1.6deg', offset: 'md:mt-0' },
  { rotate: '1.4deg', offset: 'md:mt-24' },
  { rotate: '1.1deg', offset: 'md:mt-0' },
  { rotate: '-1.3deg', offset: 'md:mt-24' },
  { rotate: '-0.9deg', offset: 'md:mt-0' },
];

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
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
          <span className="hidden shrink-0 text-4xl md:block" aria-hidden="true">
            💡
          </span>
          <SelectionHeading label="Portfolio">
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-[2.6rem]">
              Building small things, and finishing them.
            </h2>
          </SelectionHeading>
        </div>

        <div className="mt-20 grid gap-x-16 gap-y-20 md:grid-cols-2">
          {PROJECTS.map((project, index) => {
            const placement = CARD_PLACEMENT[index % CARD_PLACEMENT.length];

            return (
              <a
                key={project.id}
                href={project.demoUrl || project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block transition-all duration-700 ${placement.offset} ${
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
                    className="aspect-[4/3] w-full rounded-lg object-cover"
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
              </a>
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
    </section>
  );
};

export default Projects;
