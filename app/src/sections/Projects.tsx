import { useEffect, useRef, useState } from 'react';
import { Github, ExternalLink, Code2, Star, GitFork } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  stars?: number;
  forks?: number;
}

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects: Project[] = [
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

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple/5 rounded-full blur-[150px]" />

      <div className="container mx-auto max-w-7xl relative">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block px-4 py-2 text-sm font-medium text-purple bg-purple/10 rounded-full mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A selection of my recent work. Each project represents a unique challenge and solution.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${0.2 + index * 0.15}s` }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative glass rounded-2xl overflow-hidden hover:shadow-glow-lg transition-all duration-500">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredProject === project.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
                  
                  {/* Overlay Links */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-500 ${
                      hoveredProject === project.id
                        ? 'opacity-100 backdrop-blur-sm'
                        : 'opacity-0'
                    }`}
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/10 hover:bg-purple rounded-full transition-all duration-300 hover:scale-110"
                      aria-label="View on GitHub"
                    >
                      <Github size={24} />
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 hover:bg-purple rounded-full transition-all duration-300 hover:scale-110"
                        aria-label="View Demo"
                      >
                        <ExternalLink size={24} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title & Stats */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {project.stars !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star size={14} />
                          <span>{project.stars}</span>
                        </div>
                      )}
                      {project.forks !== undefined && (
                        <div className="flex items-center gap-1">
                          <GitFork size={14} />
                          <span>{project.forks}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-purple/10 text-purple rounded-full"
                      >
                        <Code2 size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div
          className={`text-center mt-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          <a
            href="https://github.com/luhnox"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple hover:bg-purple-dark rounded-full transition-all duration-300 hover:shadow-glow"
          >
            <Github size={20} />
            <span>View All Projects on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
