# luhnox — Portfolio

Personal portfolio site. The app lives in `app/` (there is no package.json at the
repo root).

## Hard rules

### No emoji. Anywhere.

Not in the UI, not in source, not in comments, not in commit messages, not in
replies to the user. Owner's instruction, and it is absolute.

When a heading or a card wants a small icon beside it, use **lucide-react** —
already a dependency and used throughout. Three emoji were removed for this
reason and replaced with `Award`, `Lightbulb` and `Crown`.

### Commit to `main`

Never create a side branch. The Vercel deploy follows `main`, so work parked on a
branch looks finished while the live site never changes.

## Deployment

- Vercel, project root at the repo root; `vercel.json` sets
  `buildCommand: cd app && npm run build` and `outputDirectory: app/dist`.
- `index.html` revalidates on every request; hashed assets are immutable for a
  year. If the phone shows an older design than the desktop, that is a stale
  client cache, not a bug in the code.

## Stack

Vite 7 + React 19 + TypeScript, Tailwind 3.4, shadcn/ui on Radix primitives,
lucide-react for icons, Lenis for smooth scroll, GSAP for scroll and overlay
animation, next-themes for the light/dark switch.

## Design

The palette is **paper**: an off-white sheet the work sits on, surfaces going
lighter as they come forward. It is deliberate — commit `e30cb28` replaced a
dark/neon design with it, matching the reference site the owner works from
(muuwafi.com, which is also `#f9f9f9`).

Leftovers from the neon era still exist and are traps:

- `gradient-text` no longer makes a gradient; it is one flat colour now.
- `glass`, `liquid-btn`, `input-animated`, `timeline-line` are unused or stale.
- A hardcoded `purple` token and a `dark` colour token exist in
  `tailwind.config.js` and do not follow the theme. Use `accent` / `primary`.

Sections already migrated to the paper design: **Hero, Experience, Certificates,
Projects**. Still on the old vocabulary: **About, Skills**.

## Things that will break if you forget them

- **Both themes.** Anything with a fixed colour has to be checked against the
  dark palette. Two real bugs came from this: the Experience number chips put
  `text-foreground` over fixed pastels (white digits on pale yellow), and
  `paper-card`'s drop shadow is invisible on near-black, so depth there comes
  from the border instead.
- **`overflow-x-clip`, not `overflow-x-hidden`,** on the App wrapper.
  `overflow-x: hidden` forces `overflow-y: auto`, making that div a scroll
  container — the sticky hero then pins to it instead of the viewport, and since
  the div grows with its content and never scrolls, the pin silently does
  nothing.
- **The hero is not lazy-loaded**, because it is above the fold. A static
  `import gsap` there lands GSAP in the entry chunk: measured at 217 kB -> 333 kB.
  Import it dynamically inside the effect.
- **Overlays must pause Lenis**, not just set `overflow: hidden` on the body.
  Lenis animates scroll position itself, so a "locked" page keeps gliding behind
  the dialog. Use the `useOverlay` hook, which also owns Escape and focus
  restore.
- **`noUnusedLocals` is on.** An unused variable is a build error, not a warning.

## Verifying

`cd app && npm run build` runs `tsc -b` first, so it is the real typecheck.
A build passing does NOT mean the UI works — animation and layout still need a
browser.
