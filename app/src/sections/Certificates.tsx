import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Award, ExternalLink } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  type: 'landscape' | 'portrait';
  description: string;
}

const Certificates = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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

  const certificates: Certificate[] = [
    {
      id: 1,
      title: 'Certificate of Completion',
      issuer: 'Samsung Tech Institute',
      date: 'December 2023',
      image: '/certificate-completion.jpg',
      type: 'landscape',
      description: 'Successfully completed the Advanced Software Development program, demonstrating proficiency in modern development practices and industry-standard tools.',
    },
    {
      id: 2,
      title: 'Certificate of Competence',
      issuer: 'Samsung Tech Institute',
      date: 'October 2023',
      image: '/certificate-competence.jpg',
      type: 'portrait',
      description: 'Recognized for technical competence in mobile device hardware repair, software diagnostics, and network connectivity solutions.',
    },
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % certificates.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="container mx-auto max-w-7xl relative">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block px-4 py-2 text-sm font-medium text-purple bg-purple/10 rounded-full mb-4">
            Certifications
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            My <span className="gradient-text">Achievements</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional certifications that validate my skills and expertise in the tech industry.
          </p>
        </div>

        {/* Certificates Carousel */}
        <div
          className={`relative transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.3s' }}
        >
          {/* Main Display */}
          <div className="relative flex justify-center items-center min-h-[500px]">
            {certificates.map((cert, index) => {
              const isActive = index === currentIndex;
              const isPrev = index === (currentIndex - 1 + certificates.length) % certificates.length;
              const isNext = index === (currentIndex + 1) % certificates.length;

              let transform = 'translateX(0) scale(0.8) rotateY(0deg)';
              let opacity = 0;
              let zIndex = 0;

              if (isActive) {
                transform = 'translateX(0) scale(1) rotateY(0deg)';
                opacity = 1;
                zIndex = 10;
              } else if (isPrev) {
                transform = 'translateX(-60%) scale(0.8) rotateY(15deg)';
                opacity = 0.5;
                zIndex = 5;
              } else if (isNext) {
                transform = 'translateX(60%) scale(0.8) rotateY(-15deg)';
                opacity = 0.5;
                zIndex = 5;
              }

              return (
                <div
                  key={cert.id}
                  className="absolute transition-all duration-500 ease-out"
                  style={{
                    transform,
                    opacity,
                    zIndex,
                  }}
                >
                  <div
                    className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                      isActive ? 'shadow-glow-lg' : ''
                    }`}
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className={`object-cover ${
                        cert.type === 'landscape'
                          ? 'w-[500px] h-[350px] md:w-[600px] md:h-[400px]'
                          : 'w-[300px] h-[450px] md:w-[350px] md:h-[500px]'
                      }`}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="text-purple" size={20} />
                        <span className="text-sm text-purple font-medium">{cert.issuer}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">{cert.date}</p>
                      {isActive && (
                        <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="p-3 glass rounded-full hover:bg-purple/20 transition-all duration-300 hover:scale-110"
              aria-label="Previous certificate"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {certificates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-purple w-8'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to certificate ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 glass rounded-full hover:bg-purple/20 transition-all duration-300 hover:scale-110"
              aria-label="Next certificate"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* View All Link */}
          <div className="text-center mt-8">
            <a
              href="https://github.com/luhnox"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple hover:text-purple-light transition-colors duration-300"
            >
              View all credentials on GitHub
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
