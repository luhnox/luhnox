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
      position: 'Internship',
      duration: '1 Month',
      location: 'Banjarmasin, Indonesia',
      description:
        'Completed a 1-month internship as a mobile technician, focusing on issue diagnostics, hardware repair, and software troubleshooting for smartphones.',
      link: 'https://www.google.com/maps/place/Samsung+Service+Center+Banjarmasin/@-3.3474012,114.6253441,18.83z',
      type: 'internship',
    },
    {
      id: 2,
      company: 'PTIK ULM',
      position: 'Internship',
      duration: '3 Months',
      location: 'Banjarbaru, Indonesia',
      description:
        'Completed a 3-month internship focused on repairing damaged LAN cables in the Agriculture and Health buildings, while also learning to build database-driven websites using PHP and phpMyAdmin.',
      link: 'https://www.google.com/maps/place/PTIK+ULM/@-3.4458117,114.8436607,19.75z',
      type: 'internship',
    },
    {
      id: 3,
      company: 'Bengkel HP',
      position: 'Internship',
      duration: '3 Months',
      location: 'Martapura, Indonesia',
      description:
        'Completed a 3-month internship as a smartphone technician, handling device repairs, component checks, and common troubleshooting cases.',
      link: 'https://www.google.com/maps/place/Bengkel+hp/@-3.3638229,114.8676337,19.25z',
      type: 'internship',
    },
    {
      id: 4,
      company: 'SMK Negeri 1 Martapura',
      position: 'Training Program',
      duration: '2 Months',
      location: 'Martapura, Indonesia',
      description:
        'Joined a 2-month school training program covering both fundamentals and hands-on smartphone repair, including fault identification and service procedures.',
      link: 'https://www.google.com/maps/place/SMK+NEGERI+1+MARTAPURA/@-3.4330645,114.8626404,16.44z',
      type: 'internship',
    },
  ];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Background decoration */}
      {/* <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple/5 rounded-full blur-[120px] -translate-y-1/2" /> */}

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
      </div>
    </section>
  );
};

export default Experience;
