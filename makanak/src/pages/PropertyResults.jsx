import { useMemo } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import resultBg from '../assets/result-bg.png'
import { DESIGN_TOKENS } from '../constants/landingPage'
import { DubizzleListingsLink } from '../components/DubizzleListingsLink'
import { PLACEHOLDER_AMENITIES } from '../constants/propertyFormPlaceholders'

const ACCENT = '#38C481'

/** Split "EGP 7.1M" → currency label vs amount (amount only is styled green). */
function splitEstimateDisplay(formatted) {
  const m = formatted.match(/^EGP\s+(.+)$/i)
  if (m) return { currency: 'EGP', amount: m[1] }
  return { currency: null, amount: formatted }
}

function derivePreviewEstimate(areaSqM, bedrooms) {
  const raw = 720_000 + areaSqM * 3_800 + bedrooms * 88_000
  const m = raw / 1_000_000
  if (m >= 1) return `EGP ${m.toFixed(1)}M`
  return `EGP ${Math.round(raw).toLocaleString('en-EG')}`
}

function formatEstimate(raw) {
  const value = Number(raw)
  if (!Number.isFinite(value)) return null
  if (value >= 1_000_000) return `EGP ${(value / 1_000_000).toFixed(1)}M`
  return `EGP ${Math.round(value).toLocaleString('en-EG')}`
}

function amenityLabels(ids) {
  const set = new Set(ids)
  return PLACEHOLDER_AMENITIES.filter((a) => set.has(a.id)).map((a) => a.label)
}

function EstimateFigure({ formatted }) {
  const { currency, amount } = splitEstimateDisplay(formatted)
  return (
    <p
      className="text-4xl font-bold tracking-tight md:text-5xl"
      style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
    >
      {currency ? (
        <>
          <span className="text-white/90">{currency} </span>
          <span className="text-white/90">{amount}</span>
        </>
      ) : (
        <span className="text-white/90">{amount}</span>
      )}
    </p>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 backdrop-blur-sm md:px-5 md:py-4">
      <dt
        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: ACCENT }}
      >
        {label}
      </dt>
      <dd className="mt-1.5 text-[15px] font-medium leading-snug text-white/95 md:text-base">{value}</dd>
    </div>
  )
}

export default function PropertyResults() {
  const { state } = useLocation()
  const fromPredict = Boolean(state?.fromPredict)

  const areaSqM = state?.areaSqM ?? 120
  const bedrooms = state?.bedrooms ?? 3
  const bathrooms = state?.bathrooms ?? 1
  const district = state?.district ?? '—'
  const isCompound = state?.isCompound ?? false
  const amenities = useMemo(() => {
    return Array.isArray(state?.amenities) ? state.amenities : []
  }, [state])

  const previewEstimate = useMemo(() => derivePreviewEstimate(areaSqM, bedrooms), [areaSqM, bedrooms])
  const predictedNumeric = Number(state?.predicted_price_egp)
  const hasPrediction = Number.isFinite(predictedNumeric)
  const formattedFromApi = formatEstimate(state?.predicted_price_egp)
  const estimate = formattedFromApi ?? previewEstimate

  const labels = useMemo(() => amenityLabels(amenities), [amenities])
  const amenitiesDisplay =
    labels.length > 0 ? labels.join(', ') : amenities.length > 0 ? `${amenities.length} selected` : 'None selected'

  const explanation = typeof state?.explanation === 'string' ? state.explanation : ''
  const saved = Boolean(state?.saved)
  const valuationId = state?.valuation_id

  if (!fromPredict) {
    return <Navigate to="/property-details" replace />
  }

  return (
    <div className="relative min-h-dvh text-white">
      <div className="absolute inset-0">
        <img src={resultBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030818]/95 via-[#0a1628]/92 to-[#020617]/95" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col px-5 pb-16 pt-24 md:px-8 md:pt-28">
        <header className="flex flex-wrap items-center justify-end gap-2">
          <Link
            to="/property-details"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/10"
          >
            Edit inputs
          </Link>
          {saved && valuationId != null ? (
            <Link
              to={`/valuations/${valuationId}`}
              className="rounded-full border border-[#38C481]/40 bg-[#38C481]/15 px-4 py-2 text-xs font-medium text-[#7ee8b8] transition hover:bg-[#38C481]/25"
            >
              View saved
            </Link>
          ) : null}
          <Link
            to="/"
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/90 transition hover:bg-white/15"
          >
            Home
          </Link>
        </header>

        <p className="mt-10 text-xs font-medium uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
          Valuation result
        </p>
        <h1
          className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl"
          style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
        >
          Your property estimate
        </h1>

        {saved && valuationId != null ? (
          <p className="mt-4 rounded-xl border border-[#38C481]/35 bg-[#38C481]/10 px-4 py-3 text-sm text-white/90">
            Valuation saved as{' '}
            <Link to={`/valuations/${valuationId}`} className="font-semibold text-[#7ee8b8] underline underline-offset-2">
              #{valuationId}
            </Link>
            . You can open it anytime from History.
          </p>
        ) : null}

        <section
          className="mt-8 overflow-hidden rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-white/[0.12] to-white/[0.03] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-10"
          aria-live="polite"
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: ACCENT }}
          >
            Overall estimate
          </p>
          <div className="mt-4 min-h-[3.5rem] md:min-h-[4.5rem]">
            <EstimateFigure formatted={estimate} />
          </div>
          <p className="mt-3 text-sm text-white/45">
            {formattedFromApi ? 'From our valuation model.' : 'Showing a preview figure — model value unavailable.'}
          </p>
          <p className="mt-4 text-xs text-white/35">For information only — not financial advice.</p>
          {hasPrediction ? (
            <div className="mt-6 flex justify-start">
              <DubizzleListingsLink
                input={{
                  area_sqm: areaSqM,
                  bedrooms,
                  bathrooms,
                  district,
                }}
                predictedPrice={predictedNumeric}
              />
            </div>
          ) : null}
        </section>

        {explanation ? (
          <section className="mt-8 overflow-hidden rounded-[28px] border border-white/[0.12] bg-white/[0.05] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
              Explanation
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/88">{explanation}</p>
          </section>
        ) : null}

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            Property details
          </h2>
          <p className="mt-1 text-sm text-white/40">What you entered</p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <DetailItem label="District" value={district} />
            <DetailItem label="Area" value={`${areaSqM} m²`} />
            <DetailItem label="Bedrooms" value={String(bedrooms)} />
            <DetailItem label="Bathrooms" value={String(bathrooms)} />
            <DetailItem label="In a compound" value={isCompound ? 'Yes' : 'No'} />
            <div className="sm:col-span-2">
              <DetailItem label="Amenities" value={amenitiesDisplay} />
            </div>
          </dl>
        </section>
      </div>
    </div>
  )
}
