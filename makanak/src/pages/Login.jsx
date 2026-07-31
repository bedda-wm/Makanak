import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import signinLeft from '../assets/signin_left.png'
import signinRight from '../assets/signin_right.png'
import iconFacebook from '../assets/f.png'
import iconGoogle from '../assets/g.png'
import { useAuth } from '../context/useAuth'
import { apiFetch, getApiErrorMessage } from '../lib/api'
import { DESIGN_TOKENS } from '../constants/landingPage'

/** Matches property flow / logo accent */
const BRAND_GREEN = '#38C481'
const BRAND_GREEN_DEEP = '#2a9e63'

/** Same panel treatment as `PropertyDetailsForm` */
const SIGN_IN_PANEL_BG = 'rgba(0, 1, 28, 0.80)'

function EyeIcon({ passwordVisible }) {
  if (passwordVisible) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white/80"
        aria-hidden
      >
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      </svg>
    )
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/80"
      aria-hidden
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function safeReturnPath(raw) {
  if (!raw || !raw.startsWith('/')) return '/property-details'
  if (raw.startsWith('//')) return '/property-details'
  if (raw.startsWith('/login')) return '/property-details'
  return raw
}

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { refreshAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const returnUrl = safeReturnPath(searchParams.get('returnUrl'))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (res.status === 401) {
        setError((await getApiErrorMessage(res)) || 'Invalid email or password.')
        return
      }
      if (!res.ok) {
        setError(await getApiErrorMessage(res))
        return
      }
      await refreshAuth()
      navigate(returnUrl, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={signinLeft}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
        />
        <img
          src={signinRight}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
        />
        <div className="absolute inset-0 bg-black/25" aria-hidden />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-24 md:px-8 md:pt-28">
        <div
          className="w-full max-w-md rounded-[28px] border border-white/10 p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
          style={{
            backgroundColor: SIGN_IN_PANEL_BG,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <h1
            className="text-center text-3xl font-semibold tracking-tight text-white"
            style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
          >
            Sign In
          </h1>
          <p className="mt-2 text-center text-sm text-white/70">Log in to manage your account</p>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/15 px-3 py-2 text-center text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-lg border border-white/15 bg-white/[0.06] px-4 text-sm text-white outline-none ring-0 placeholder:text-white/45 focus:border-white/30"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 w-full rounded-lg border border-white/15 bg-white/[0.06] py-2 pl-4 pr-12 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-white/80 transition hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon passwordVisible={showPassword} />
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 h-12 w-full rounded-full text-sm font-semibold text-slate-900 transition hover:brightness-105 disabled:opacity-60"
              style={{
                background: `linear-gradient(90deg, ${BRAND_GREEN_DEEP} 0%, ${BRAND_GREEN} 50%, #5ed99a 100%)`,
              }}
            >
              {submitting ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/35 bg-white/10 p-0 ring-0 transition hover:bg-white/15"
                aria-label="Sign in with Google"
              >
                <img src={iconGoogle} alt="" className="h-[18px] w-[18px] object-contain" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/35 bg-white/10 p-0 ring-0 transition hover:bg-white/15"
                aria-label="Sign in with Facebook"
              >
                <img src={iconFacebook} alt="" className="h-[18px] w-[18px] object-contain" />
              </button>
            </div>
            <p className="text-center text-sm text-white/75 sm:text-left">
              First time?{' '}
              <Link
                to="/#pricing"
                className="font-medium text-white underline decoration-white/50 underline-offset-2 transition hover:text-white"
              >
                Sign up
              </Link>{' '}
              on the landing page.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
