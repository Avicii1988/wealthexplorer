import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-gray-400 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all duration-200"
      style={{ flexShrink: 0 }}
    >
      {theme === 'dark' ? (
        <Sun size={15} strokeWidth={1.8} />
      ) : (
        <Moon size={15} strokeWidth={1.8} />
      )}
    </button>
  )
}
