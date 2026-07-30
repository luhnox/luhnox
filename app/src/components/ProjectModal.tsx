import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Github, X } from 'lucide-react';
import gsap from 'gsap';
import { OVERLAY_EASE, prefersReducedMotion, useOverlay } from '@/hooks/useOverlay';

export interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  /** Long-form write-up. Optional: older entries only have the one-line blurb. */
  overview?: string[];
  /** "Role", "Stack", "Status" style facts, shown as a definition grid. */
  facts?: { label: string; value: string }[];
}

interface ProjectModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

/**
 * The project detail view: an in-page overlay, not a route.
 *
 * That shape is taken from the reference site (muuwafi.com), which was checked
 * rather than assumed — every plausible detail route there (/projects, /work,
 * /project, /case-study) returns 404, so its cards cannot be navigating
 * anywhere. It ships GSAP and Lenis, and its stylesheet carries a
 * backdrop-blur utility, which is what this reproduces: a blurred scrim over
 * the frozen page, with the panel and its contents animated in by GSAP.
 *
 * Rendered through a portal so the panel is a child of <body> rather than of a
 * card. Inside the grid it would inherit the card's `rotate()` — every project
 * tile is deliberately tilted a degree or two — and a rotated ancestor tilts
 * the fixed overlay with it.
 */
const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const isOpen = project !== null;

  // Scroll lock, Lenis pause, Escape, focus restore — shared with the
  // certificate lightbox so the two cannot drift apart.
  useOverlay(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;

    const backdrop = backdropRef.current;
    const panel = panelRef.current;

    // Focus moves to Close rather than the panel itself: it is the one control
    // that is always present, so Enter always does something predictable.
    closeRef.current?.focus();

    if (prefersReducedMotion() || !backdrop || !panel) return;

    const tl = gsap.timeline();
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' })
      .fromTo(
        panel,
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: OVERLAY_EASE },
        '<0.04'
      )
      // The panel's own children come in after it, staggered, so the eye lands
      // on the image and then walks down the text instead of the whole card
      // appearing at once.
      .fromTo(
        panel.querySelectorAll('[data-modal-stagger]'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: OVERLAY_EASE, stagger: 0.06 },
        '<0.12'
      );

    // Braces on purpose: tl.kill() returns the Timeline, and an effect cleanup
    // has to return void or undefined.
    return () => {
      tl.kill();
    };
  }, [isOpen]);

  if (!project) return null;

  const liveUrl = project.demoUrl;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain p-4 py-10 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      // Lenis reads this and keeps its hands off the wheel in here, so the
      // dialog scrolls natively even while the page behind it is frozen.
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
        className="paper-card relative z-10 w-full max-w-3xl rounded-2xl p-2"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-20 rounded-full bg-background/80 p-2 text-foreground backdrop-blur transition-colors hover:bg-muted"
        >
          <X size={18} />
        </button>

        <img
          data-modal-stagger
          src={project.image}
          alt={project.title}
          className="aspect-[16/10] w-full rounded-xl object-cover"
        />

        <div className="px-4 pb-5 pt-6 sm:px-6">
          <h3
            id="project-modal-title"
            data-modal-stagger
            className="text-2xl font-extrabold tracking-tight md:text-3xl"
          >
            {project.title}
          </h3>

          <p data-modal-stagger className="mt-3 leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {project.overview?.map((paragraph, index) => (
            <p
              key={index}
              data-modal-stagger
              className="mt-3 leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}

          {project.facts && project.facts.length > 0 && (
            <dl
              data-modal-stagger
              className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-border pt-5 sm:grid-cols-2"
            >
              {project.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div
            data-modal-stagger
            className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
          >
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div data-modal-stagger className="mt-7 flex flex-wrap gap-3">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
              >
                Visit site
                <ArrowUpRight size={16} />
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Github size={16} />
              Source
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;
