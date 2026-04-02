import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const isMobileRef = useRef(window.innerWidth < 768);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Disable particles on mobile for better performance
    if (isMobileRef.current) {
      canvas.style.display = 'none';
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Reduce particle count significantly for performance
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15) * Math.floor(window.innerHeight / 15));
    particlesRef.current = [];

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 5 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      const connectionDistance = 100;
      const minDriftSpeed = 0.06;
      const disconnectedTargetSpeed = 0.36;
      const maxDisconnectedSpeed = 0.1;
      const connectedCounts = new Array(particlesRef.current.length).fill(0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0 && distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx -= (dx / distance) * force * 0.02;
          particle.vy -= (dy / distance) * force * 0.02;
        }

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126, 110, 227, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particlesRef.current.length; j += 1) {
          const other = particlesRef.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            connectedCounts[i] += 1;
            connectedCounts[j] += 1;

            // When two particles are close enough to form a thread, both slow down.
            const proximity = (connectionDistance - dist) / connectionDistance;
            const slowdown = 1 - Math.min(0.008, proximity * 0.008);
            particle.vx *= slowdown;
            particle.vy *= slowdown;
            other.vx *= slowdown;
            other.vy *= slowdown;

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(126, 110, 227, ${0.15 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Restore faster movement for particles that are currently not connected.
        if (connectedCounts[i] === 0) {
          const speed = Math.hypot(particle.vx, particle.vy);

          if (speed > 0 && speed < disconnectedTargetSpeed) {
            const boost = 1 + (disconnectedTargetSpeed - speed) * 0.1;
            particle.vx *= boost;
            particle.vy *= boost;
          }

          const boostedSpeed = Math.hypot(particle.vx, particle.vy);
          if (boostedSpeed > maxDisconnectedSpeed) {
            const clampFactor = maxDisconnectedSpeed / boostedSpeed;
            particle.vx *= clampFactor;
            particle.vy *= clampFactor;
          }
        }

        // Keep very slow particles drifting so the background stays alive.
        const speed = Math.hypot(particle.vx, particle.vy);
        if (speed < minDriftSpeed) {
          particle.vx += (Math.random() - 0.5) * 0.02;
          particle.vy += (Math.random() - 0.5) * 0.02;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #161616 100%)' }}
    />
  );
};

export default ParticleBackground;
