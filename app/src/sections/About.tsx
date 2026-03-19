import { useEffect, useRef, useState } from 'react';
import { Code2, Coffee } from 'lucide-react';
import { fetchGitHubPortfolioStats, GITHUB_USERNAME } from '@/lib/github';

interface StatProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

const AnimatedStat = ({ icon, value, suffix, label, delay }: StatProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div
      ref={ref}
      className={`glass rounded-2xl p-6 text-center transition-all duration-700 hover:scale-105 hover:shadow-glow ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-purple/20 rounded-xl text-purple">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {count}
        <span className="gradient-text">{suffix}</span>
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
};

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [aboutStats, setAboutStats] = useState({ totalProjects: 50, yearsExperience: 5 });
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

  useEffect(() => {
    const controller = new AbortController();

    const loadStats = async () => {
      try {
        const stats = await fetchGitHubPortfolioStats(GITHUB_USERNAME, controller.signal);
        setAboutStats({
          totalProjects: stats.totalProjects,
          yearsExperience: stats.yearsExperience,
        });
      } catch {
        // Keep fallback values if API is unavailable.
      }
    };

    loadStats();

    return () => controller.abort();
  }, []);

  const stats = [
    {
      icon: <Code2 size={28} />,
      value: aboutStats.totalProjects,
      suffix: '+',
      label: 'Projects Completed',
    },
    {
      icon: <Coffee size={28} />,
      value: aboutStats.yearsExperience,
      suffix: '+',
      label: 'Years Experience',
    },
    // { icon: <Users size={28} />, value: 30, suffix: '+', label: 'Happy Clients' },
    // { icon: <Award size={28} />, value: 100, suffix: '%', label: 'Satisfaction Rate' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block px-4 py-2 text-sm font-medium text-purple bg-purple/10 rounded-full mb-4">
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let Me <span className="gradient-text">Introduce</span> Myself
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Text */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Born on <span className="text-white font-medium">March 12, 2007</span>, my journey into the world of 
                programming began during my third year of junior high school. What started as a simple curiosity 
                quickly evolved into an enduring passion for crafting digital solutions.
              </p>
              <p>
                Throughout my academic journey from SMP to SMK (Vocational High School), I dedicated myself to 
                mastering various programming languages and technologies. My expertise spans across 
                <span className="text-purple font-medium"> PHP, JavaScript, Java, Lua, Python, TypeScript, HTML, and CSS</span>.
              </p>
            </div>

            {/* Personal Info */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Birth Date</div>
                <div className="text-white font-medium">March 12, 2007</div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Location</div>
                <div className="text-white font-medium">Banjarmasin, Indonesia</div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Education</div>
                <div className="text-white font-medium">SMK Graduate</div>
              </div>
              {/* <div className="glass rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Availability</div>
                <div className="text-green-400 font-medium">Open to Work</div>
              </div> */}
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <AnimatedStat
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
