/**
 * MAKANAK LANDING PAGE — data & tokens
 * Bundled assets are imported from `src/assets/` (Vite).
 */

import howItWorks1 from '../assets/how it works_1.png'
import howItWorks2 from '../assets/how it works_2.png'
import howItWorks3 from '../assets/how it works_3.png'

export const DESIGN_TOKENS = {
  colors: {
    bg: '#F6F8FB',
    surface: '#FFFFFF',
    surfaceSoft: '#EFF4F8',
    text: '#172033',
    textMuted: '#667085',
    textSoft: '#98A2B3',
    navy: '#1D1B4F',
    primary: '#13DEC2',
    primaryDark: '#0FB29C',
    secondary: '#6154F7',
    accent: '#F3BC4A',
    line: '#E6EDF4',
    heroOverlay: 'rgba(7, 20, 43, 0.42)',
    footerOverlay: 'rgba(10, 16, 31, 0.84)',
  },
  fonts: {
    display: '"Manrope", "Plus Jakarta Sans", "Inter", Arial, sans-serif',
    body: '"Manrope", "Plus Jakarta Sans", "Inter", Arial, sans-serif',
    accent: '"Manrope", "Plus Jakarta Sans", "Inter", Arial, sans-serif',
  },
  shadows: {
    soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
    card: '0 28px 70px rgba(15, 23, 42, 0.14)',
    glow: '0 0 36px rgba(19, 222, 194, 0.26)',
  },
}

export const assetPaths = {
  logoMark: '/assets/icons/logo-mark.svg',

  menuIcon: '/assets/icons/menu.svg',
  globeIcon: '/assets/icons/globe.svg',
  brainIcon: '/assets/icons/brain.svg',
  trendIcon: '/assets/icons/trend.svg',
  facebookIcon: '/assets/icons/facebook.svg',
  instagramIcon: '/assets/icons/instagram.svg',
  linkedinIcon: '/assets/icons/linkedin.svg',
  mailIcon: '/assets/icons/mail.svg',
  arrowRightIcon: '/assets/icons/arrow-right.svg',
}

export const fallbackImages = {
  image: 'https://placehold.co/1200x700/eef2f7/94a3b8?text=Add+image+asset',
  illustration:
    'https://placehold.co/760x520/f8fafc/94a3b8?text=Add+illustration+asset',
  icon: 'https://placehold.co/64x64/ffffff/64748b?text=+',
  logo: 'https://placehold.co/40x40/ffffff/14e1c5?text=M',
}

export const stats = [
  {
    icon: howItWorks1,
    title: 'Up to date data',
    text: 'Property intelligence informed by current market movement, location signals, and comparable listings.',
  },
  {
    icon: howItWorks2,
    title: 'Powerful algorithms',
    text: 'Machine learning models help estimate property value with more consistency and less guesswork.',
  },
  {
    icon: howItWorks3,
    title: 'Valuable future insights',
    text: 'Clearer projections and practical signals help owners and buyers make smarter next moves.',
  },
]

export const partnerLogos = ['Zillow', 'dubizzle', 'airbnb', 'Property Finder']
