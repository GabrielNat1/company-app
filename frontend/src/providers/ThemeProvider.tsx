/*import { ReactNode, useEffect } from 'react'
import { useTheme } from '../stores/theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}
*/