import { useEffect, useRef, useState } from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';

interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  link?: string;
  type: 'work' | 'internship';
}

const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lineProgress, setLineProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate line progress
          setTimeout(() => setLineProgress(100), 300);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const experiences: ExperienceItem[] = [
    {
      id: 1,
      company: 'Samsung Service Center Banjarmasin',
      position: 'Technical Intern',
      duration: '1 Month',
      location: 'Banjarmasin, Indonesia',
      description:
        'Completed an intensive internship program focusing on mobile device diagnostics, hardware repair, and software troubleshooting. Gained hands-on experience with Samsung devices and professional service protocols.',
      link: 'https://www.google.com/maps/place/Samsung+Service+Center+Banjarmasin/@-3.3474012,114.6253441,18.83z',
      type: 'internship',
    },
    {
      id: 2,
      company: 'Freelance Developer',
      position: 'Full Stack Developer',
      duration: '2020 - Present',
      location: 'Remote',
      description:
        'Working with clients worldwide to deliver custom web applications, e-commerce solutions, and automation tools. Specialized in React, Node.js, and PHP development with a focus on performance and user experience.',
      type: 'work',
    },
    {
      id: 3,
      company: 'Open Source Contributor',
      position: 'Developer',
      duration: '2019 - Present',
      location: 'GitHub',
      description:
        'Active contributor to various open-source projects. Passionate about giving back to the community and collaborating with developers worldwide to improve tools and libraries.',
      link: 'https://github.com/luhnox',
      type: 'work',
    },
  ];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple/5 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="container mx-auto max-w-5xl relative">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block px-4 py-2 text-sm font-medium text-purple bg-purple/10 rounded-full mb-4">
            Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Work <span className="gradient-text">History</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            My professional journey and the experiences that have shaped my career as a developer.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-dark-lighter md:-translate-x-1/2">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple to-blue-500 transition-all duration-2000 ease-out"
              style={{ height: `${lineProgress}%` }}
            />
          </div>

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={exp.id}
                  className={`relative flex items-start gap-8 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                  style={{ transitionDelay: `${0.2 + index * 0.2}s` }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-purple rounded-full border-4 border-dark md:-translate-x-1/2 z-10 animate-pulse" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-5/12 ${
                      isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                    }`}
                  >
                    <div className="glass rounded-2xl p-6 hover:shadow-glow transition-all duration-300 group">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase size={18} className="text-purple" />
                            <span className="text-sm text-purple font-medium uppercase tracking-wider">
                              {exp.type}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white group-hover:text-purple transition-colors">
                            {exp.company}
                          </h3>
                          <p className="text-gray-400">{exp.position}</p>
                        </div>
                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-purple transition-colors"
                            aria-label={`Visit ${exp.company}`}
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{exp.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          <a
            href="https://github.com/luhnox"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-purple/20 transition-all duration-300"
          >
            <span>View My GitHub</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Experience;
