'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg glass-sm hover:scale-110 transition-all duration-300 group"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400 absolute inset-2 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
