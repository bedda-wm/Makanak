import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logoImg from '../../assets/logo.png'
import { useAuth } from '../../context/useAuth'

const MotionHeader = motion.header

const BRAND_GREEN = '#38C481'

const linkClass =
  'text-sm font-medium text-white/90 transition-colors hover:text-white'

export function Navbar() {
  const { user, loading, logout } = useAuth()

  return (
    <MotionHeader
      className="absolute inset-x-0 top-0 z-50 border-0 bg-transparent"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <nav
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10"
        aria-label="Primary"
      >
        <Link to="/" className="flex min-w-0 shrink-0 items-center drop-shadow-md">
          <img
            src={logoImg}
            alt="Makanak"
            className="h-8 w-auto max-w-[140px] object-contain object-left"
          />
        </Link>
        <ul className="flex flex-wrap items-center justify-end gap-3 sm:gap-6">
          <li>
            <Link to="/#pricing" className={linkClass}>
              About
            </Link>
          </li>
          <li>
            <Link to="/property-details" className={linkClass}>
              Estimate
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/valuations" className={linkClass}>
                  History
                </Link>
              </li>
              <li
                className="max-w-[120px] truncate text-sm font-semibold sm:max-w-[180px]"
                style={{ color: BRAND_GREEN }}
                title={user.email}
              >
                {user.name || user.email}
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-lg border border-white/35 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Log out
                </button>
              </li>
            </>
          ) : loading ? (
            <li className="text-sm text-white/60">…</li>
          ) : (
            <>
              <li>
                <Link to="/login" className={linkClass}>
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  to="/#pricing"
                  className="rounded-lg border border-white/45 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </MotionHeader>
  )
}

export default Navbar
