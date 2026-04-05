import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { FaJava } from 'react-icons/fa6';
import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiLua,
  SiPhp,
  SiPython,
} from 'react-icons/si';

interface Skill {
  name: string;
  level: number;
  color: string;
  icon: ReactNode;
}

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
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

  const skills: Skill[] = [
    { name: 'JavaScript', level: 70, color: '#F7DF1E', icon: <SiJavascript size={22} /> },
    { name: 'Python', level: 40, color: '#3776AB', icon: <SiPython size={22} /> },
    { name: 'PHP', level: 25, color: '#777BB4', icon: <SiPhp size={22} /> },
    { name: 'Lua', level: 50, color: '#000080', icon: <SiLua size={22} /> },
    { name: 'Java', level: 33, color: '#007396', icon: <FaJava size={22} /> },
    {
      name: 'HTML/CSS',
      level: 85,
      color: '#E34F26',
      icon: (
        <div className="flex items-center gap-0.5">
          <SiHtml5 size={14} />
          <SiCss size={14} />
        </div>
      ),
    },
  ];

  // Calculate orbit positions
  const getOrbitPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Background decoration */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 rounded-full blur-[100px]" /> */}

      <div className="container mx-auto max-w-7xl relative">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block px-4 py-2 text-sm font-medium text-purple bg-purple/10 rounded-full mb-4">
            My Skills
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Technical <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Over the years, I've honed my skills in various programming languages and technologies. 
            Here's a snapshot of my technical arsenal.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Orbital Animation */}
          <div
            className={`relative flex justify-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
              {/* Center - Sun (Core) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-24 h-24 md:w-32 md:h-32 glass rounded-full flex items-center justify-center animate-pulse-glow border-2 border-purple/50">
                  <span className="text-2xl md:text-3xl font-bold gradient-text">Core</span>
                </div>
              </div>

              {/* Orbit Rings - Static Background */}
              <div className="absolute inset-0 border border-dashed border-purple/20 rounded-full" />
              <div className="absolute inset-8 border border-dashed border-blue-500/20 rounded-full" />
              <div className="absolute inset-16 border border-dashed border-purple/10 rounded-full" />

              {/* Rotating Orbits Container */}
              <div className="absolute inset-0">
                {/* Orbit 1 - Inner Ring (8 skills rotating) */}
                <div
                  className="absolute inset-0 animate-orbit"
                  style={{ animationDuration: '30s' }}
                >
                  {skills.map((skill, index) => {
                    const radius = 120;
                    const pos = getOrbitPosition(index, skills.length, radius);
                    const isHovered = hoveredSkill === skill.name;

                    return (
                      <div
                        key={skill.name}
                        className="absolute top-1/2 left-1/2"
                        style={{
                          transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                        }}
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        <div
                          className="animate-counter-rotate"
                          style={{ animationDuration: '30s' }}
                        >
                          <div
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                              isHovered ? 'scale-150 shadow-lg' : 'scale-100'
                            }`}
                            style={{
                              backgroundColor: `${skill.color}25`,
                              border: `2px solid ${skill.color}`,
                              color: skill.color,
                              boxShadow: isHovered ? `0 0 20px ${skill.color}80` : 'none',
                            }}
                          >
                            {skill.icon}
                          </div>
                          {isHovered && (
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap glass px-3 py-1 rounded-full text-xs">
                              {skill.name}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Skill Tags */}
          <div
            className={`flex flex-wrap gap-4 content-start transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: '0.5s' }}
          >
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="group flex items-center gap-0 overflow-hidden px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 cursor-default bg-zinc-900/60 border border-white/5 hover:bg-zinc-800/60"
                style={{
                  borderColor: hoveredSkill === skill.name ? `${skill.color}66` : 'rgba(255, 255, 255, 0.08)',
                }}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div
                  className="shrink-0 transition-colors"
                  style={{
                    color: skill.color,
                  }}
                >
                  {skill.icon}
                </div>

                <span
                  className={`whitespace-nowrap text-white/90 font-medium transition-all duration-300 ${
                    hoveredSkill === skill.name ? 'max-w-[120px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'
                  }`}
                >
                  {skill.name}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Additional Skills Tags */}
        <div
          className={`mt-16 flex flex-wrap justify-center gap-3 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          {['Git', 'MySQL', 'MongoDB', 'REST API', 'VS Code'].map(
            (tag) => (
              <span
                key={tag}
                className="px-4 py-2 glass rounded-full text-sm text-gray-300 hover:text-white hover:bg-purple/20 transition-all duration-300 cursor-default"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
