import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

/**
 * Light/dark switch. Defaults to whatever the visitor's system is set to, so
 * the first paint matches the rest of their machine rather than imposing a
 * choice; after that their click is remembered by next-themes.
 *
 * The `mounted` gate is not ceremony. The theme is only knowable in the
 * browser, so rendering an icon during SSR/first paint would commit to one and
 * then flip it once hydration reads the real value — a visible flash on every
 * load. Until mounted we render the button at its final size but empty, which
 * holds the layout still instead of letting the bar reflow.
 */
const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={mounted ? (isDark ? 'Switch to light theme' : 'Switch to dark theme') : 'Toggle theme'}
    >
      {mounted ? (
        isDark ? <Sun size={18} /> : <Moon size={18} />
      ) : (
        <span className="block h-[18px] w-[18px]" />
      )}
    </button>
  );
};

export default ThemeToggle;
