import { useEffect, useRef, useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';

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

const EXPERIENCES: ExperienceItem[] = [
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

/** One pastel per entry, cycling — the numbers are the section's only colour. */
const NUMBER_TINTS = ['bg-[#ffe27a]', 'bg-[#9be8c0]', 'bg-[#ffc2d8]', 'bg-[#bcd4ff]'];

/**
 * Experience, laid out the way the reference does it: a column on the left
 * that stays put while the entries scroll past it inside a ruled channel, each
 * numbered in a pastel square.
 *
 * It replaces a centre-spine timeline with cards alternating left and right,
 * which reads as a chronology of equal weights where this reads as a list you
 * work down.
 */
const Experience = () => {
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
    <section id="experience" ref={sectionRef} className="relative px-6 py-24 md:py-32">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          {/* Stays with you for the length of the list. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              <span className="mb-3 block text-3xl" aria-hidden="true">
                👑
              </span>
              <h2 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-6xl">
                Work
                <br />
                Experience
              </h2>
              <p className="mt-5 max-w-xs text-muted-foreground">
                Internships and training that taught me how things actually break, and how to fix them.
              </p>
              <a
                href="https://www.linkedin.com/in/muhammad-fery-iskandar-147a25266/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 font-medium text-foreground underline underline-offset-4 transition hover:text-primary"
              >
                Showcase in Linkedin
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          {/* The channel the entries live in. */}
          <div className="relative lg:border-x lg:border-foreground/80 lg:px-10">
            <ol className="space-y-16">
              {EXPERIENCES.map((item, index) => (
                <li
                  key={item.id}
                  className={`flex gap-5 transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 0.12}s` }}
                >
                  <span
                    className={`flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold text-foreground ${
                      NUMBER_TINTS[index % NUMBER_TINTS.length]
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-extrabold tracking-tight">{item.position}</h3>
                    <p className="mt-0.5 font-bold text-foreground/80">{item.company}</p>

                    <p className="mt-4 leading-relaxed text-muted-foreground">{item.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      <span>{item.duration}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} />
                        {item.location}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 transition hover:text-foreground"
                        >
                          Map
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
