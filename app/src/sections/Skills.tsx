import { useEffect, useRef, useState } from 'react';

interface Skill {
  name: string;
  level: number;
  color: string;
  icon: string;
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
    { name: 'JavaScript', level: 70, color: '#F7DF1E', icon: 'JS' },
    { name: 'TypeScript', level: 65, color: '#3178C6', icon: 'TS' },
    { name: 'React', level: 50, color: '#61DAFB', icon: 'Re' },
    { name: 'Node.js', level: 57, color: '#339933', icon: 'No' },
    { name: 'Python', level: 40, color: '#3776AB', icon: 'Py' },
    { name: 'PHP', level: 45, color: '#777BB4', icon: 'Ph' },
    { name: 'Lua', level: 50, color: '#000080', icon: 'Lu' },
    { name: 'Java', level: 60, color: '#007396', icon: 'Ja' },
    { name: 'HTML/CSS', level: 85, color: '#E34F26', icon: 'HC' },
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 rounded-full blur-[100px]" />

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
              {/* Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-24 h-24 md:w-32 md:h-32 glass rounded-full flex items-center justify-center animate-pulse-glow">
                  <span className="text-2xl md:text-3xl font-bold gradient-text">Core</span>
                </div>
              </div>

              {/* Orbit Rings */}
              <div className="absolute inset-0 border border-dashed border-purple/20 rounded-full animate-orbit" />
              <div
                className="absolute inset-8 border border-dashed border-blue-500/20 rounded-full animate-counter-rotate"
                style={{ animationDuration: '25s' }}
              />
              <div
                className="absolute inset-16 border border-dashed border-purple/10 rounded-full animate-orbit"
                style={{ animationDuration: '30s' }}
              />

              {/* Skill Orbs */}
              {skills.slice(0, 8).map((skill, index) => {
                const radius = 140;
                const pos = getOrbitPosition(index, 8, radius);
                const isHovered = hoveredSkill === skill.name;

                return (
                  <div
                    key={skill.name}
                    className="absolute top-1/2 left-1/2 transition-all duration-500"
                    style={{
                      transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                    }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-300 ${
                        isHovered ? 'scale-150 shadow-glow-lg' : 'scale-100'
                      }`}
                      style={{
                        backgroundColor: `${skill.color}20`,
                        border: `2px solid ${skill.color}`,
                        color: skill.color,
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
                );
              })}
            </div>
          </div>

          {/* Right - Skill Bars */}
          <div
            className={`space-y-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: '0.5s' }}
          >
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="group"
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: `${skill.color}20`,
                        color: skill.color,
                      }}
                    >
                      {skill.icon}
                    </div>
                    <span className="font-medium text-white">{skill.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{skill.level}%</span>
                </div>
                <div className="h-2 bg-dark-lighter rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isVisible ? 'w-full' : 'w-0'
                    }`}
                    style={{
                      width: isVisible ? `${skill.level}%` : '0%',
                      backgroundColor: skill.color,
                      transitionDelay: `${0.6 + index * 0.1}s`,
                      boxShadow: hoveredSkill === skill.name ? `0 0 20px ${skill.color}` : 'none',
                    }}
                  />
                </div>
              </div>
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
          {['Git', 'MySQL', 'MongoDB', 'REST API', 'GraphQL', 'Docker', 'Linux', 'Figma', 'VS Code'].map(
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
