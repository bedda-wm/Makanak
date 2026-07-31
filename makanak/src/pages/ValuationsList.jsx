import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import resultBg from '../assets/result-bg.png'
import { apiFetch, getApiErrorMessage } from '../lib/api'
import { DESIGN_TOKENS } from '../constants/landingPage'

const ACCENT = '#38C481'

function formatMoneyEgp(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  if (n >= 1_000_000) return `EGP ${(n / 1_000_000).toFixed(1)}M`
  return `EGP ${Math.round(n).toLocaleString('en-EG')}`
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function ValuationsList() {
  const [valuations, setValuations] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch('/valuations')
      if (!res.ok) {
        setError(await getApiErrorMessage(res))
        setValuations([])
        return
      }
      const data = await res.json()
      setValuations(Array.isArray(data.valuations) ? data.valuations : [])
    } catch (e) {
      setError(e.message || 'Could not load valuations')
      setValuations([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="relative min-h-dvh text-white">
      <div className="absolute inset-0">
        <img src={resultBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030b1f]/95 via-[#061433]/92 to-[#020617]/95" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(30,80,140,0.2),transparent_50%)]"
          aria-hidden
        />
      </div>

      <div
        className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-24 md:px-8 md:pt-28"
        style={{ fontFamily: DESIGN_TOKENS.fonts.body }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          Saved valuations
        </p>
        <h1
          className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl"
          style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
        >
          History
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/55">
          Newest first. Open a row for full detail.
        </p>

        {error && (
          <p className="mt-6 rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-12 text-sm text-white/50">Loading…</p>
        ) : valuations.length === 0 ? (
          <p className="mt-12 text-sm text-white/55">
            No saved valuations yet.{' '}
            <Link to="/property-details" className="font-medium text-[#7ee8b8] underline underline-offset-2">
              Run an estimate
            </Link>
          </p>
        ) : (
          <ul className="mt-10 space-y-3">
            {valuations.map((v) => {
              const id = v.id ?? v.valuation_id
              const price = v.predicted_price_egp ?? v.predicted_price ?? v.price
              const created = v.created_at ?? v.createdAt
              return (
                <li key={id}>
                  <Link
                    to={`/valuations/${id}`}
                    className="flex flex-col gap-2 rounded-[22px] border border-white/[0.12] bg-gradient-to-br from-white/[0.12] to-white/[0.04] px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-[rgba(56,196,129,0.35)] hover:from-white/[0.14] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-semibold text-white" style={{ fontFamily: DESIGN_TOKENS.fonts.display }}>
                      Valuation #{id}
                    </span>
                    <span className="text-sm text-white/50">{formatDate(created)}</span>
                    <span className="text-base font-semibold tabular-nums" style={{ color: ACCENT }}>
                      {formatMoneyEgp(price)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
