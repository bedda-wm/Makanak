import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bathImg from '../assets/bath.png'
import bedImg from '../assets/bed.png'
import pd1 from '../assets/pd-1.png'
import pd2 from '../assets/pd-2.png'
import pd3 from '../assets/pd-3.png'
import pd4 from '../assets/pd-4.png'
import { DESIGN_TOKENS } from '../constants/landingPage'
import {
  DEFAULT_CITY,
  getDistrictsForCity,
  PLACEHOLDER_AMENITIES,
  PLACEHOLDER_CITIES,
} from '../constants/propertyFormPlaceholders'
import { useAuth } from '../context/useAuth'
import { apiFetch, getApiErrorMessage } from '../lib/api'

/** Darker, semi-transparent panel over the step-specific page background */
const FORM_PANEL_BG = 'rgba(0, 1, 28, 0.88)'

const ACCENT = '#38C481'
const ACCENT_DEEP = '#2a9e63'
const ACCENT_GLOW = 'rgba(56, 196, 129, 0.4)'

const PAGE_BG_BY_STEP = { 1: pd1, 2: pd2, 3: pd3, 4: pd4 }

const AREA_MIN = 15
const AREA_MAX = 800

const LOADING_PHRASES = [
  'Preparing great things…',
  'Analyzing your property…',
  'Crunching the numbers…',
  'Almost there…',
]

const STEPS = [
  { id: 1, key: 'rooms', label: 'Rooms', sub: 'Browse and upload' },
  { id: 2, key: 'area', label: 'Area', sub: 'Browse and upload' },
  { id: 3, key: 'location', label: 'Location', sub: 'Browse and upload' },
  { id: 4, key: 'amenities', label: 'Amenities', sub: 'Browse and upload' },
]

function StepIcon({ stepKey, active, done }) {
  const stroke = active || done ? '#fff' : 'rgba(255,255,255,0.45)'
  const size = 22
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8 }

  if (stepKey === 'rooms') {
    return (
      <svg {...common} aria-hidden>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 21V9h6v12" />
        <circle cx="12" cy="14" r="1" fill={stroke} stroke="none" />
      </svg>
    )
  }
  if (stepKey === 'area') {
    return (
      <svg {...common} aria-hidden>
        <rect x="4" y="4" width="14" height="14" rx="2" />
        <path d="M14 14l6 6" strokeLinecap="round" />
      </svg>
    )
  }
  if (stepKey === 'location') {
    return (
      <svg {...common} aria-hidden>
        <path d="M12 21s7-6.38 7-11a7 7 0 1 0-14 0c0 4.62 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" fill={active || done ? stroke : 'none'} />
      </svg>
    )
  }
  return (
    <svg {...common} aria-hidden>
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="700"
        fill={stroke}
        stroke="none"
        fontFamily="system-ui, sans-serif"
      >
        P
      </text>
    </svg>
  )
}

function CounterRow({
  icon,
  title,
  hint,
  value,
  onChange,
  focused,
  onFocus,
  min = 1,
  max = 7,
}) {
  const bump = (d) => onChange(Math.max(min, Math.min(max, value + d)))

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onFocus()
        }
      }}
      className={`flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition md:gap-5 md:px-5 md:py-5 ${
        focused
          ? 'border-[var(--accent)] bg-white/[0.04]'
          : 'border-white/15 bg-white/[0.02] hover:border-white/25'
      }`}
      style={{ '--accent': ACCENT }}
      aria-label={title}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/30 md:h-14 md:w-14"
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white md:text-base">{title}</p>
        <p className="mt-0.5 text-xs text-white/55 md:text-sm">{hint}</p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            bump(1)
          }}
          disabled={value >= max}
          className="rounded p-1 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Increase ${title}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
        <span
          className="min-w-[1.5rem] text-center text-lg font-semibold tabular-nums md:text-xl"
          style={{ color: focused ? ACCENT : 'rgba(255,255,255,0.9)' }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            bump(-1)
          }}
          disabled={value <= min}
          className="rounded p-1 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Decrease ${title}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function PropertyDetailsForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeStep, setActiveStep] = useState(1)
  const [bedrooms, setBedrooms] = useState(3)
  const [bathrooms, setBathrooms] = useState(1)
  const [roomFocus, setRoomFocus] = useState('bedrooms')
  const [areaSqM, setAreaSqM] = useState(120)
  const [city, setCity] = useState(DEFAULT_CITY)
  const [district, setDistrict] = useState(() => getDistrictsForCity(DEFAULT_CITY)[0])
  const [isCompound, setIsCompound] = useState(false)
  const [amenityIds, setAmenityIds] = useState(() => new Set())
  const [predicting, setPredicting] = useState(false)
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [predictError, setPredictError] = useState('')
  const [saveValuation, setSaveValuation] = useState(false)

  const districts = useMemo(() => getDistrictsForCity(city), [city])

  const areaFillPct = ((areaSqM - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100

  useEffect(() => {
    if (!predicting) return undefined
    const phraseTimer = window.setInterval(() => {
      setPhraseIdx((i) => (i + 1) % LOADING_PHRASES.length)
    }, 800)
    return () => window.clearInterval(phraseTimer)
  }, [predicting])

  const buildPredictBody = () => {
    const locationText = isCompound ? `compound, ${district}` : district
    return {
      bedrooms,
      bathrooms,
      area_sqm: areaSqM,
      amenities_count: amenityIds.size,
      amenities: [...amenityIds],
      location_text: locationText,
      district,
      type: 'Apartment',
      ownership: 'Primary',
      furnished: 'Yes',
      payment_option: 'Installment',
      completion_status: 'Ready',
      district_grouped: district,
      city,
      is_compound: isCompound,
    }
  }

  const runPredict = async () => {
    setPredictError('')
    setPredicting(true)
    const body = buildPredictBody()
    if (user && saveValuation) body.save = true
    try {
      const res = await apiFetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        setPredictError(await getApiErrorMessage(res))
        return
      }
      const data = await res.json()
      navigate('/results', {
        replace: true,
        state: {
          fromPredict: true,
          bedrooms,
          bathrooms,
          areaSqM,
          district,
          isCompound,
          amenities: [...amenityIds],
          predicted_price_egp: data.predicted_price_egp,
          explanation: data.explanation,
          saved: data.saved,
          valuation_id: data.valuation_id,
        },
      })
    } catch (e) {
      setPredictError(e.message || 'Could not complete prediction')
    } finally {
      setPredicting(false)
    }
  }

  const goNext = async () => {
    if (activeStep < 4) {
      setActiveStep((s) => s + 1)
      return
    }
    await runPredict()
  }

  const goPrev = () => {
    if (activeStep > 1) setActiveStep((s) => s - 1)
  }

  const setCityAndDistrict = (nextCity) => {
    setCity(nextCity)
    const d = getDistrictsForCity(nextCity)
    setDistrict(d[0] ?? '')
  }

  const toggleAmenity = (id) => {
    setAmenityIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const goToStep = (id) => {
    setActiveStep(id)
  }

  const pageBackgroundSrc = predicting ? pd4 : PAGE_BG_BY_STEP[activeStep]

  const loginReturn = `/login?returnUrl=${encodeURIComponent('/property-details')}`

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <img
          key={pageBackgroundSrc}
          src={pageBackgroundSrc}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-12 pt-20 md:px-8 md:pt-24">
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-[28px] border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.5)] lg:min-h-[560px] lg:flex-row"
          style={{ backgroundColor: FORM_PANEL_BG }}
        >
          {/* Sidebar stepper */}
          <aside className="border-b border-white/10 p-6 md:p-8 lg:w-[min(100%,280px)] lg:shrink-0 lg:border-b-0 lg:border-r lg:border-white/10">
            <h1
              className="text-xl font-bold leading-tight text-white md:text-2xl"
              style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
            >
              <span style={{ color: ACCENT }}>Property</span> Details Form
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Follow the 4 steps below to register your property
            </p>

            <nav className="relative mt-8" aria-label="Form steps">
              <div
                className="absolute bottom-6 left-[21px] top-6 w-px bg-white/12"
                aria-hidden
              />
              <ol className="relative space-y-8">
                {STEPS.map((step) => {
                  const active = activeStep === step.id
                  const done = activeStep > step.id

                  return (
                    <li key={step.id} className="relative flex gap-4">
                      <button
                        type="button"
                        onClick={() => goToStep(step.id)}
                        className={`relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          active
                            ? 'border-transparent shadow-[0_0_0_2px_rgba(56,196,129,0.45)]'
                            : done
                              ? 'border-white/20 bg-[rgba(56,196,129,0.22)]'
                              : 'border-white/20 bg-black/30'
                        }`}
                        style={active ? { backgroundColor: ACCENT } : undefined}
                        aria-current={active ? 'step' : undefined}
                      >
                        <StepIcon stepKey={step.key} active={active} done={done && !active} />
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(step.id)}
                        className="min-w-0 flex-1 pb-0 pt-1 text-left"
                      >
                        <p
                          className={`text-sm font-semibold ${active || done ? 'text-white' : 'text-white/45'}`}
                        >
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-xs text-white/40">{step.sub}</p>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </nav>
          </aside>

          <section className="relative flex flex-1 flex-col p-6 md:p-8 lg:p-10">
            {!predicting && (
              <>
            {activeStep === 1 && (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-white/45">Step 1/4</p>
                <h2
                  className="mt-2 text-2xl font-semibold text-white md:text-3xl"
                  style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
                >
                  How many <span style={{ color: ACCENT }}>rooms</span> do you have?
                </h2>
                <p className="mt-2 text-sm text-white/55">
                  Kindly enter the number of rooms you have along with the corresponding type.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  <CounterRow
                    icon={
                      <img
                        src={bedImg}
                        alt=""
                        className="h-6 w-6 object-contain md:h-7 md:w-7"
                        aria-hidden
                      />
                    }
                    title="Bedrooms"
                    hint="How many bedrooms does your house have?"
                    value={bedrooms}
                    onChange={setBedrooms}
                    focused={roomFocus === 'bedrooms'}
                    onFocus={() => setRoomFocus('bedrooms')}
                    min={1}
                    max={7}
                  />
                  <CounterRow
                    icon={
                      <img
                        src={bathImg}
                        alt=""
                        className="h-6 w-6 object-contain md:h-7 md:w-7"
                        aria-hidden
                      />
                    }
                    title="Bathrooms"
                    hint="How many bathrooms does your house have?"
                    value={bathrooms}
                    onChange={setBathrooms}
                    focused={roomFocus === 'bathrooms'}
                    onFocus={() => setRoomFocus('bathrooms')}
                    min={1}
                    max={7}
                  />
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-white/45">Step 2/4</p>
                <h2
                  className="mt-2 text-2xl font-semibold text-white md:text-3xl"
                  style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
                >
                  How <span style={{ color: ACCENT }}>big</span> is your place?
                </h2>
                <p className="mt-2 text-sm text-white/55">
                  Kindly showcase the size of your property (15–800 m²).
                </p>
                <div className="mt-10">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <span
                      className="inline-block rounded-full px-4 py-2 text-sm font-semibold text-slate-900"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {areaSqM} m²
                    </span>
                  </div>
                  <div className="relative w-full py-2">
                    <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 w-full -translate-y-1/2">
                      <div className="absolute inset-0 rounded-full bg-white/15" aria-hidden />
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{
                          width: `${areaFillPct}%`,
                          backgroundColor: ACCENT,
                          borderRadius: areaFillPct >= 99.5 ? '9999px' : '9999px 0 0 9999px',
                        }}
                        aria-hidden
                      />
                    </div>
                    <input
                      type="range"
                      min={AREA_MIN}
                      max={AREA_MAX}
                      step={1}
                      value={areaSqM}
                      onChange={(e) => setAreaSqM(Number(e.target.value))}
                      className="property-area-slider relative z-10 h-2 w-full cursor-pointer appearance-none bg-transparent"
                      aria-valuemin={AREA_MIN}
                      aria-valuemax={AREA_MAX}
                      aria-valuenow={areaSqM}
                      aria-label="Property area in square meters"
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-white/35 sm:text-xs">
                    <span>15</span>
                    <span>200</span>
                    <span>400</span>
                    <span>600</span>
                    <span>800</span>
                  </div>
                </div>
              </>
            )}

            {activeStep === 3 && (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-white/45">Step 3/4</p>
                <h2
                  className="mt-2 text-2xl font-semibold text-white md:text-3xl"
                  style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
                >
                  Where is your property <span style={{ color: ACCENT }}>located</span>?
                </h2>
                <p className="mt-2 text-sm text-white/55">
                  Kindly pinpoint where your property is.
                </p>
                <div className="mt-8 flex flex-col gap-5">
                  <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/50">
                      City
                    </span>
                    <select
                      value={city}
                      onChange={(e) => setCityAndDistrict(e.target.value)}
                      className="h-12 w-full cursor-pointer rounded-xl border border-white/15 bg-black/35 px-4 text-sm text-white outline-none focus:border-[var(--a)]"
                      style={{ '--a': ACCENT }}
                    >
                      {PLACEHOLDER_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-slate-900 text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/50">
                      District
                    </span>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="h-12 w-full cursor-pointer rounded-xl border border-white/15 bg-black/35 px-4 text-sm text-white outline-none focus:border-[var(--a)]"
                      style={{ '--a': ACCENT }}
                    >
                      {districts.map((d) => (
                        <option key={d} value={d} className="bg-slate-900 text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      checked={isCompound}
                      onChange={(e) => setIsCompound(e.target.checked)}
                      className="h-4 w-4 shrink-0 rounded border-white/35 bg-transparent accent-[var(--a)]"
                      style={{ '--a': ACCENT }}
                    />
                    <span className="text-sm text-white/90">This property is in a compound</span>
                  </label>
                </div>
              </>
            )}

            {activeStep === 4 && (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-white/45">Step 4/4</p>
                <h2
                  className="mt-2 text-2xl font-semibold text-white md:text-3xl"
                  style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
                >
                  Are there <span style={{ color: ACCENT }}>amenities</span> available?
                </h2>
                <p className="mt-2 text-sm text-white/55">Does your property have any of the following?</p>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {PLACEHOLDER_AMENITIES.map((a) => {
                    const selected = amenityIds.has(a.id)
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAmenity(a.id)}
                        className={`flex items-start gap-4 rounded-xl border px-4 py-4 text-left transition md:px-5 md:py-5 ${
                          selected
                            ? 'border-[var(--accent)] bg-white/[0.06]'
                            : 'border-white/15 bg-white/[0.02] hover:border-white/25'
                        }`}
                        style={{ '--accent': ACCENT }}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                            selected ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-white/35'
                          }`}
                          style={{ '--accent': ACCENT }}
                          aria-hidden
                        >
                          {selected && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-slate-900">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-white">{a.label}</span>
                          <span className="mt-0.5 block text-xs text-white/50">{a.description}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-8 rounded-xl border border-white/12 bg-white/[0.03] px-4 py-4">
                  <label
                    className={`flex cursor-pointer items-start gap-3 ${user ? '' : 'cursor-not-allowed opacity-80'}`}
                  >
                    <input
                      type="checkbox"
                      checked={user ? saveValuation : false}
                      disabled={!user}
                      onChange={(e) => setSaveValuation(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-white/35 bg-transparent accent-[var(--a)] disabled:cursor-not-allowed"
                      style={{ '--a': ACCENT }}
                    />
                    <span className="text-sm text-white/90">
                      <span className="font-medium text-white">Save this valuation</span>
                      <span className="mt-1 block text-white/55">
                        {user
                          ? 'Store this run in your account history.'
                          : (
                            <>
                              Log in to save.{' '}
                              <Link to={loginReturn} className="font-medium underline" style={{ color: ACCENT }}>
                                Log in
                              </Link>
                            </>
                            )}
                      </span>
                    </span>
                  </label>
                </div>
              </>
            )}

            {predictError && activeStep === 4 ? (
              <p className="mt-4 rounded-lg border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {predictError}
              </p>
            ) : null}

            <div className="mt-auto flex items-center justify-between gap-4 pt-10">
              <div className="min-w-0 flex-1">
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="rounded-full border border-white/35 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Previous Step
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => void goNext()}
                disabled={predicting}
                className="shrink-0 rounded-full px-10 py-3.5 text-sm font-semibold text-slate-900 transition hover:brightness-110 disabled:opacity-50"
                style={{
                  background: `linear-gradient(90deg, ${ACCENT_DEEP} 0%, ${ACCENT} 50%, #5ed99a 100%)`,
                  boxShadow: `0 0 28px ${ACCENT_GLOW}`,
                }}
              >
                {activeStep === 4 ? (predicting ? 'Working…' : 'Finalize') : 'Next Step'}
              </button>
            </div>
              </>
            )}
          </section>
        </div>
      </main>

      {predicting && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 px-6 backdrop-blur-md"
          role="alert"
          aria-busy="true"
          aria-live="polite"
        >
          <div
            className="h-24 w-24 shrink-0 animate-spin rounded-full border-4 border-white/25"
            style={{ borderTopColor: ACCENT, borderRightColor: 'rgba(56,196,129,0.35)' }}
            aria-hidden
          />
          <p
            className="mt-10 max-w-md text-center text-lg font-medium text-white md:text-xl"
            style={{ fontFamily: DESIGN_TOKENS.fonts.display }}
          >
            {LOADING_PHRASES[phraseIdx]}
          </p>
          <p className="mt-3 text-sm text-white/50">Hang tight — running the model…</p>
        </div>
      )}

      <style>{`
        .property-area-slider::-webkit-slider-runnable-track {
          height: 8px;
          background: transparent;
          border-radius: 9999px;
        }
        .property-area-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          margin-top: -7px;
          border-radius: 9999px;
          background: ${ACCENT};
          border: 3px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 12px rgba(56, 196, 129, 0.5);
          cursor: pointer;
        }
        .property-area-slider::-moz-range-track {
          height: 8px;
          background: transparent;
          border-radius: 9999px;
        }
        .property-area-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          margin-top: -7px;
          border: none;
          border-radius: 9999px;
          background: ${ACCENT};
          box-shadow: 0 0 0 3px rgba(255,255,255,0.9), 0 2px 12px rgba(56, 196, 129, 0.5);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
