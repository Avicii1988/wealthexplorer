import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
})

// Injected at runtime to avoid CSS minifier issues with escaped Tailwind selectors
const LIGHT_MODE_CSS = `
html.light body { background-color: #f2ede4; color: #1a1a1a; }
html.light [class*="bg-[#0a0a0a"] { background-color: #f2ede4 !important; }
html.light [class*="bg-[#111"] { background-color: #e8e1d5 !important; }
html.light [class*="bg-[#131313"] { background-color: #e5ddd1 !important; }
html.light [class*="bg-[#141414"] { background-color: #e2dace !important; }
html.light [class*="bg-[#161616"] { background-color: #dbd3c5 !important; }
html.light [class*="bg-[#1a1a1a"] { background-color: #d5cbbe !important; }
html.light [class*="bg-[#0d0d0d"] { background-color: #eae4da !important; }
html.light [class*="bg-[#0f0f0f"] { background-color: #ebe5db !important; }
html.light [class*="bg-[#1c1c1c"] { background-color: #d2c9ba !important; }
html.light [class*="bg-[#222"] { background-color: #cbc1b0 !important; }
html.light [class*="bg-[#2a2a2a"] { background-color: #c2b8a5 !important; }
html.light [class*="text-white"] { color: #1a1a1a !important; }
html.light [class*="text-gray-100"] { color: #2a2a2a !important; }
html.light [class*="text-gray-200"] { color: #333 !important; }
html.light [class*="text-gray-300"] { color: #444 !important; }
html.light [class*="text-gray-400"] { color: #5c5750 !important; }
html.light [class*="text-gray-500"] { color: #7a7168 !important; }
html.light [class*="text-gray-600"] { color: #9a9188 !important; }
html.light [class*="border-white"] { border-color: rgba(0,0,0,0.14) !important; }
html.light [class*="divide-white"] > * + * { border-color: rgba(0,0,0,0.10) !important; }
html.light [class*="placeholder-gray"]::placeholder { color: #a09890 !important; }
`

let styleEl: HTMLStyleElement | null = null

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'light') {
    root.classList.add('light')
    root.classList.remove('dark')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'we-light-theme'
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = LIGHT_MODE_CSS
  } else {
    root.classList.remove('light')
    root.classList.add('dark')
    if (styleEl) {
      styleEl.textContent = ''
    }
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('we_theme')
      if (saved === 'light' || saved === 'dark') return saved
    } catch {}
    return 'dark'
  })

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem('we_theme', theme)
    } catch {}
  }, [theme])

  // Apply on first mount (SSR-safe, no flash)
  useEffect(() => {
    applyTheme(theme)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
