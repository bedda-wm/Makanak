import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import btnFb from '../../assets/btn_fb.png'
import btnGoogle from '../../assets/btn_google.png'
import signupBg from '../../assets/signupb.png'
import { useAuth } from '../../context/useAuth'
import { apiFetch, getApiErrorMessage } from '../../lib/api'
import { DESIGN_TOKENS, partnerLogos } from '../../constants/landingPage'
import { BinaryPattern, GlassCard } from '../landing/Primitives'

const MotionDiv = motion.div

export function PricingSignupSection() {
  const navigate = useNavigate()
  const { refreshAuth } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const passwordsMatch = password === confirmPassword
  const canSubmit =
    name.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    passwordsMatch &&
    !submitting

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      const res = await apiFetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      })
      if (!res.ok) {
        setError(await getApiErrorMessage(res))
        return
      }
      await refreshAuth()
      navigate('/property-details', { replace: true })
    } catch (err) {
      setError(err.message || 'Sign up failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-20 md:py-28"
      style={{ backgroundColor: DESIGN_TOKENS.colors.bg }}
    >
      <BinaryPattern />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-[0.95fr_1.05fr] md:px-10">
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-md text-center md:text-left"
        >
          <h3
            className="text-4xl font-bold tracking-tight md:text-5xl"
            style={{
              color: DESIGN_TOKENS.colors.navy,
              fontFamily: DESIGN_TOKENS.fonts.display,
            }}
          >
            Trusted market signals.
          </h3>
          <p
            className="mt-6 text-base leading-8"
            style={{ color: DESIGN_TOKENS.colors.textMuted }}
          >
            Makanak combines valuation intelligence with recognizable real estate ecosystem references,
            helping users feel confident in every estimate and next step.
          </p>
          <div
            className="mx-auto mt-10 h-px w-full max-w-xs md:mx-0"
            style={{ backgroundColor: DESIGN_TOKENS.colors.line }}
          />
          <p className="mt-5 text-sm" style={{ color: DESIGN_TOKENS.colors.textSoft }}>
            Built around familiar market references
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 text-left">
            {partnerLogos.map((logo, i) => (
              <div
                key={logo}
                className="text-2xl font-bold"
                style={{
                  color:
                    i === 0
                      ? '#2563EB'
                      : i === 1
                        ? DESIGN_TOKENS.colors.text
                        : i === 2
                          ? '#FF5A5F'
                          : '#F97316',
                }}
              >
                {logo}
              </div>
            ))}
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <div className="relative isolate overflow-hidden rounded-[24px]">
            <img
              src={signupBg}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 h-full w-full min-h-full object-cover object-center select-none"
            />
            <GlassCard
              className="relative z-10 overflow-hidden p-8"
              style={{ backgroundColor: 'rgba(255,255,255,0.86)' }}
            >
              <form className="mx-auto max-w-sm" onSubmit={onSubmit}>
                <h4
                  className="text-center text-2xl font-semibold"
                  style={{
                    color: DESIGN_TOKENS.colors.navy,
                    fontFamily: DESIGN_TOKENS.fonts.display,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Sign Up
                </h4>
                {error ? (
                  <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-800">
                    {error}
                  </p>
                ) : null}
                <div className="mt-8 space-y-4">
                  <input
                    name="name"
                    autoComplete="name"
                    placeholder="Full name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    required
                    className="h-12 w-full rounded-md border bg-white px-4 text-sm outline-none ring-0 placeholder:text-slate-400"
                    style={{ borderColor: DESIGN_TOKENS.colors.line }}
                  />
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    required
                    className="h-12 w-full rounded-md border bg-white px-4 text-sm outline-none ring-0 placeholder:text-slate-400"
                    style={{ borderColor: DESIGN_TOKENS.colors.line }}
                  />
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    required
                    className="h-12 w-full rounded-md border bg-white px-4 text-sm outline-none ring-0 placeholder:text-slate-400"
                    style={{ borderColor: DESIGN_TOKENS.colors.line }}
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(ev) => setConfirmPassword(ev.target.value)}
                    required
                    className="h-12 w-full rounded-md border bg-white px-4 text-sm outline-none ring-0 placeholder:text-slate-400"
                    style={{ borderColor: DESIGN_TOKENS.colors.line }}
                  />
                  {confirmPassword && !passwordsMatch ? (
                    <p className="text-sm text-red-600">Passwords must match.</p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-5 h-12 w-full rounded-md text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: DESIGN_TOKENS.colors.primaryDark,
                    boxShadow: DESIGN_TOKENS.shadows.soft,
                  }}
                >
                  {submitting ? 'Creating account…' : 'Start your free trial'}
                </button>
              </form>
              <div
                className="mx-auto my-5 flex max-w-sm items-center gap-4 text-xs uppercase tracking-[0.22em]"
                style={{ color: DESIGN_TOKENS.colors.textSoft }}
              >
                <div className="h-px flex-1" style={{ backgroundColor: DESIGN_TOKENS.colors.line }} />
                <span>Or</span>
                <div className="h-px flex-1" style={{ backgroundColor: DESIGN_TOKENS.colors.line }} />
              </div>
              <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
                <button type="button" className="block w-full overflow-hidden rounded-md p-0 ring-0">
                  <img src={btnFb} alt="Sign in with Facebook" className="block h-auto w-full" />
                </button>
                <button type="button" className="block w-full overflow-hidden rounded-md p-0 ring-0">
                  <img src={btnGoogle} alt="Sign in with Google" className="block h-auto w-full" />
                </button>
              </div>
              <p
                className="mx-auto mt-6 max-w-sm text-center text-sm"
                style={{ color: DESIGN_TOKENS.colors.textMuted }}
              >
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-[#325dff]">
                  Login
                </Link>
              </p>
            </GlassCard>
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}

export default PricingSignupSection
