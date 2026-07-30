import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* attribute="class" is what pairs this with tailwind.config's darkMode:
        ["class"] — next-themes toggles `.dark` on <html>, Tailwind's dark:
        variants and the .dark palette in index.css both hang off that one class.
        defaultTheme="system" so a first visit matches the visitor's machine. */}
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
