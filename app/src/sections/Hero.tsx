import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Github, Instagram, Mail, Music2 } from 'lucide-react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);

    // Mouse move effect for 3D tilt
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      
      const rect = imageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateX = (e.clientY - centerY) / 30;
      const rotateY = (centerX - e.clientX) / 30;
      
      imageRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      if (imageRef.current) {
        imageRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    heroRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      heroRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Greeting */}
            <div
              className={`transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '0.2s' }}
            >
              <span className="inline-block px-4 py-2 text-sm font-medium text-purple bg-purple/10 rounded-full mb-6">
                Hello, I'm
              </span>
            </div>

            {/* Name */}
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-4 transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '0.3s' }}
            >
              <span className="gradient-text">luhnox</span>
            </h1>

            {/* Role */}
            <h2
              className={`text-xl md:text-2xl lg:text-3xl font-light text-gray-300 mb-6 transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '0.4s' }}
            >
              Full Stack Developer & UI Designer
            </h2>

            {/* Description */}
            <p
              className={`text-base md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '0.5s' }}
            >
              I craft digital experiences that blend technical precision with creative fluidity. 
              Specializing in building scalable web applications and immersive user interfaces 
              with expertise in multiple programming languages.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '0.6s' }}
            >
              <button
                onClick={scrollToAbout}
                className="px-8 py-4 bg-purple hover:bg-purple-dark text-white font-medium rounded-full transition-all duration-300 hover:shadow-glow-lg flex items-center justify-center gap-2 group"
              >
                View My Work
                <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
              </button>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border border-white/20 hover:border-purple text-white font-medium rounded-full transition-all duration-300 hover:bg-purple/10 text-center"
              >
                Get In Touch
              </a>
            </div>

            {/* Social Links */}
            <div
              className={`flex gap-4 justify-center lg:justify-start transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '0.7s' }}
            >
              <a
                href="https://github.com/luhnox"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                aria-label="GitHub"
              >
                <Github size={22} />
              </a>
              <a
                href="https://www.instagram.com/luhnox_/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href="https://www.tiktok.com/@luhnoxq"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                aria-label="TikTok"
              >
                <Music2 size={22} />
              </a>
              <a
                href="mailto:luhnoxq@gmail.com"
                className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div
            className={`order-1 lg:order-2 flex justify-center transition-all duration-1000 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: '0.5s' }}
          >
            <div
              ref={imageRef}
              className="relative w-72 h-72 md:w-96 md:h-96 transition-transform duration-300 ease-out"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-purple/30 rounded-full blur-[60px] animate-pulse" />
              
              {/* Image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple/30 animate-pulse-glow">
                <img
                  src="/hero-profile.jpg"
                  alt="luhnox Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-4 py-2 glass rounded-full text-sm font-medium text-purple animate-float">
                5+ Years
              </div>
              <div
                className="absolute -bottom-4 -left-4 px-4 py-2 glass rounded-full text-sm font-medium text-blue-400 animate-float"
                style={{ animationDelay: '1s' }}
              >
                50+ Projects
              </div>
              <div
                className="absolute top-1/2 -right-8 px-4 py-2 glass rounded-full text-sm font-medium text-green-400 animate-float"
                style={{ animationDelay: '2s' }}
              >
                Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1s' }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
