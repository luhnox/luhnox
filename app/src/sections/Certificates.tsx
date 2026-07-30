import { useEffect, useRef, useState } from 'react';
import { Award, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import SelectionHeading from '@/components/SelectionHeading';
import { OVERLAY_EASE, prefersReducedMotion, useOverlay } from '@/hooks/useOverlay';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  type: 'landscape' | 'portrait';
  description: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: 1,
    title: 'Certificate of Completion',
    issuer: 'Samsung Tech Institute',
    date: 'April 2025',
    image: '/certificate-completion.jpg',
    type: 'landscape',
    description:
      'Successfully completed the Advanced Software Development program, demonstrating proficiency in modern development practices and industry-standard tools.',
  },
  {
    id: 2,
    title: 'SMKN 1 Martapura',
    issuer: 'Samsung Tech Institute',
    date: 'July 2025',
    image: '/certificate-competence.jpg',
    type: 'portrait',
    description:
      'Recognized for technical competence in mobile device hardware repair, software diagnostics, and network connectivity solutions.',
  },
];

/**
 * Same placement idea as the Projects grid: a slight tilt and a dropped right
 * column, so certificates read as prints laid on the desk next to the work
 * rather than as a separate widget.
 *
 * ⚠️ Keep this length EVEN — see the note on Projects' CARD_PLACEMENT. It is
 * cycled with `% length`, and an odd length restarts the alternating offsets on
 * the wrong foot, flattening the stagger in one row.
 */
const CARD_PLACEMENT = [
  { rotate: '-1.4deg', offset: 'md:mt-0' },
  { rotate: '1.2deg', offset: 'md:mt-16' },
];

/**
 * The certificate lightbox: the certificate itself, big, on the same blurred
 * scrim the project overlay uses.
 *
 * Rendered through a portal for the same reason ProjectModal is — the cards it
 * opens from are tilted with `rotate()`, and a rotated ancestor tilts a fixed
 * overlay with it.
 */
const CertificateLightbox = ({
  certificate,
  onClose,
}: {
  certificate: Certificate | null;
  onClose: () => void;
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const isOpen = certificate !== null;

  useOverlay(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;

    const backdrop = backdropRef.current;
    const panel = panelRef.current;

    closeRef.current?.focus();

    if (prefersReducedMotion() || !backdrop || !panel) return;

    const tl = gsap.timeline();
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' }).fromTo(
      panel,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: OVERLAY_EASE },
      '<0.04'
    );

    // Braces on purpose: tl.kill() returns the Timeline, and an effect cleanup
    // has to return void or undefined.
    return () => {
      tl.kill();
    };
  }, [isOpen]);

  if (!certificate) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${certificate.title} preview`}
      data-lenis-prevent
    >
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={`paper-card relative z-10 rounded-2xl p-2 ${
          certificate.type === 'portrait' ? 'max-w-[460px] w-[90vw]' : 'max-w-[1000px] w-[94vw]'
        }`}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close certificate preview"
          className="absolute right-4 top-4 z-20 rounded-full bg-background/80 p-2 text-foreground backdrop-blur transition-colors hover:bg-muted"
        >
          <X size={18} />
        </button>

        <img
          src={certificate.image}
          alt={certificate.title}
          className="max-h-[82vh] w-full rounded-xl object-contain"
        />

        <div className="px-3 pb-3 pt-4">
          <h3 className="text-lg font-extrabold tracking-tight">{certificate.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {certificate.issuer} · {certificate.date}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Certificates = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openCertificate, setOpenCertificate] = useState<Certificate | null>(null);
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
    <section id="certificates" ref={sectionRef} className="relative px-6 py-24 md:py-32">
      <div className="container mx-auto max-w-6xl">
        <div
          className={`flex items-start gap-6 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <Award className="hidden shrink-0 text-accent md:block" size={36} aria-hidden="true" />
          <SelectionHeading label="Certifications">
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-[2.6rem]">
              Paper that says I turned up.
            </h2>
          </SelectionHeading>
        </div>

        <div className="mt-20 grid gap-x-16 gap-y-16 md:grid-cols-2">
          {CERTIFICATES.map((certificate, index) => {
            const placement = CARD_PLACEMENT[index % CARD_PLACEMENT.length];

            return (
              // A button, not a link — this opens an overlay and never
              // navigates, same reasoning as the project cards.
              <button
                key={certificate.id}
                type="button"
                onClick={() => setOpenCertificate(certificate)}
                aria-haspopup="dialog"
                className={`group block w-full text-left transition-all duration-700 ${placement.offset} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div
                  className="paper-card overflow-hidden rounded-xl p-2"
                  style={{ transform: `rotate(${placement.rotate})` }}
                >
                  {/* object-contain, not cover: a certificate cropped to fill a
                      fixed box loses its border and often its title, and the two
                      here are different shapes (one landscape, one portrait). A
                      fixed aspect keeps the grid even; contain keeps the whole
                      document visible inside it. */}
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded-lg bg-muted object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <h3 className="mt-6 text-xl font-extrabold tracking-tight">{certificate.title}</h3>

                <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                  <Award size={16} className="shrink-0 text-accent" />
                  <span>{certificate.issuer}</span>
                  <span aria-hidden="true">·</span>
                  <span>{certificate.date}</span>
                </div>

                <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">
                  {certificate.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <CertificateLightbox
        certificate={openCertificate}
        onClose={() => setOpenCertificate(null)}
      />
    </section>
  );
};

export default Certificates;
