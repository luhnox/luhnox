import { Heart, Github, Instagram, Music2, ArrowUp, Linkedin } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Experience', href: '#experience' },
    { name: 'Overview', href: '#overview' },
    { name: 'Projects', href: '#projects' },
  ];

  const socialLinks = [
    { icon: <Github size={18} />, href: 'https://github.com/luhnox', label: 'GitHub' },
    { icon: <Instagram size={18} />, href: 'https://www.instagram.com/luhnox_/', label: 'Instagram' },
    { icon: <Music2 size={18} />, href: 'https://www.tiktok.com/@luhnoxq', label: 'TikTok' },
    { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/in/muhammad-fery-iskandar-147a25266/', label: 'LinkedIn' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative py-16 px-6 border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />

      <div className="container mx-auto max-w-7xl relative">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#home" className="inline-block text-3xl font-bold gradient-text mb-4">
              luhnox
            </a>
            <p className="text-gray-400 mb-6 max-w-md">
              Full Stack Developer & UI Designer crafting digital experiences that blend 
              technical precision with creative fluidity. Let's build something amazing together.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center glass rounded-lg text-gray-400 hover:text-white hover:bg-purple/20 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-gray-400 hover:text-purple transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="mailto:luhnoxq@gmail.com"
                  className="hover:text-purple transition-colors duration-300"
                >
                  luhnoxq@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+6289629671669"
                  className="hover:text-purple transition-colors duration-300"
                >
                  +62 896-2967-1669
                </a>
              </li>
              <li>Banjarmasin, Indonesia</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} luhnox. All rights reserved. Made with{' '}
            <Heart size={14} className="inline text-red-500 fill-red-500" />
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-purple transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-purple transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-purple hover:bg-purple-dark rounded-full flex items-center justify-center shadow-glow transition-all duration-300 hover:scale-110 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;
