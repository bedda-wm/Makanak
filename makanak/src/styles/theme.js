/**
 * Global design tokens for Makanak (JS consumption).
 * Tailwind utilities are aligned via `src/index.css` @theme.
 */
export const theme = {
  colors: {
    primary: '#13DEC2',
    accent: '#6C63FF',
    background: '#F8FAFC',
    foreground: '#0B1020',
    muted: '#64748B',
    border: '#E2E8F0',
    surface: '#FFFFFF',
  },
  fontFamily: {
    sans: '"Manrope", "Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
  },
  /** Consistent spacing scale (maps to Tailwind spacing where applicable) */
  spacing: {
    xs: '0.25rem', // 1
    sm: '0.5rem', // 2
    md: '1rem', // 4
    lg: '1.5rem', // 6
    xl: '2rem', // 8
    '2xl': '3rem', // 12
    '3xl': '4rem', // 16
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  transition: {
    base: '150ms ease',
    smooth: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

export default theme
