import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import resultBg from '../assets/result-bg.png'
import { apiFetch, getApiErrorMessage } from '../lib/api'
import { DESIGN_TOKENS } from '../constants/landingPage'
import { DubizzleListingsLink } from '../components/DubizzleListingsLink'
import { getValuationInputRows } from '../constants/valuationDisplay'

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
  return d.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })
}

export default function ValuationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [valuation, setValuation] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch(`/valuations/${id}`)
      if (res.status === 404) {
        setError('Valuation not found.')
        setValuation(null)
        return
      }
      if (!res.ok) {
        setError(await getApiErrorMessage(res))
        setValuation(null)
        return
      }
      const data = await res.json()
      setValuation(data.valuation ?? data)
    } catch (e) {
      setError(e.message || 'Could not load valuation')
      setValuation(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const onDelete = async () => {
    if (!window.confirm('Delete this valuation? This cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await apiFetch(`/valuations/${id}`, { method: 'DELETE' })
      if (res.status === 404) {
        setError('Already removed.')
        return
      }
      if (!res.ok) {
        setError(await getApiErrorMessage(res))
        return
      }
      navigate('/valuations', { replace: true })
    } catch (e) {
      setError(e.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const price =
    valuation?.predicted_price_egp ?? valuation?.predicted_price ?? valuation?.price
  const created = valuation?.created_at ?? valuation?.createdAt
  const explanation = valuation?.explanation
  const inputRows = valuation ? getValuationInputRows(valuation) : []

  return (
    <div className="relative min-h-dvh text-white">
      <div className="absolute inset-0">
        <img src={resultBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030b1f]/95 via-[#061433]/92 to-[#020617]/95" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_55%_at_50%_0%,rgba(30,80,140,0.22),transparent_52%)]"
          aria-hidden
        />
      </div>

      <div
        className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-24 md:px-8 md:pt-28"
        style={{ fontFamily: DESIGN_TOKENS.fonts.body }}
      >
        <Link
          to="/valuations"
          className="text-sm font-medium text-[#7ee8b8] underline decoration-white/30 underline-offset-4 transition hover:text-white"
        >
          ← Back to history
        </Link>

        {loading ? (
          <p className="mt-12 text-sm text-white/50">Loading…</p>
        ) : error ? (
          <p className="mt-12 rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        ) : (
          <>
            <div className="mt-10 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                  Valuation detail
                </p>
                <h1
                  className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl"
                  style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
                >
                  #{id}
                </h1>
                <p className="mt-2 text-sm text-white/50">{formatDate(created)}</p>
              </div>
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="rounded-full border border-red-400/40 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-100 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>

            <section
              className="mt-8 overflow-hidden rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-white/[0.12] to-white/[0.04] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-10"
              aria-labelledby="estimate-heading"
            >
              <h2 id="estimate-heading" className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                Predicted price
              </h2>
              <p
                className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl"
                style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
              >
                {formatMoneyEgp(price)}
              </p>
              <div className="mt-6 flex justify-start">
                <DubizzleListingsLink
                  input={{
                    area_sqm: valuation.area_sqm ?? valuation.areaSqM,
                    bedrooms: valuation.bedrooms,
                    bathrooms: valuation.bathrooms,
                    district: valuation.district,
                  }}
                  predictedPrice={Number(price)}
                />
              </div>
            </section>

            {explanation ? (
              <section className="mt-6 overflow-hidden rounded-[28px] border border-white/[0.12] bg-white/[0.06] p-8 shadow-[0_20px_55px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-10">
                <h2 className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                  Explanation
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/88">{explanation}</p>
              </section>
            ) : null}

            {inputRows.length > 0 ? (
              <section className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                  Property details
                </h2>
                <p className="mt-1 text-sm text-white/45">What you entered</p>
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  {inputRows.map(({ key, label, value }) => (
                    <div
                      key={key}
                      className="rounded-2xl border border-white/[0.1] bg-white/[0.05] px-4 py-3.5 backdrop-blur-sm md:px-5 md:py-4"
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                        {label}
                      </dt>
                      <dd className="mt-1.5 break-words text-[15px] font-medium leading-snug text-white/95 md:text-base">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
