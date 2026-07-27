/**
 * The page's backdrop: a dot grid, like the canvas of a design tool.
 *
 * It replaces a particle field that ran a requestAnimationFrame loop for the
 * whole session, recomputing distances between every pair of ~80 particles on
 * each frame. This is two gradients and no JavaScript at all, which is also
 * why it can stay on mobile, where the particles had to be switched off.
 */
const CanvasBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
    <div className="canvas-grid absolute inset-0 opacity-60" />
    {/* Softens the grid at the edges so it reads as texture, not as a table. */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,hsl(var(--background))_88%)]" />
  </div>
);

export default CanvasBackground;
