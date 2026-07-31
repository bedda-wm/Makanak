import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { landingAssetUrls } from '../../assets/landingAssets'
import { DESIGN_TOKENS, fallbackImages } from '../../constants/landingPage'
import {
  AssetImage,
  BinaryPattern,
  StraightDivider,
  WorldNetworkGraphic,
} from '../landing/Primitives'

const MotionDiv = motion.div

/** Teal (landing token) → brand green — slight gradient blend */
const ACCENT_TEAL = DESIGN_TOKENS.colors.primary
const BRAND_GREEN = '#38C481'
const ACCENT_GRADIENT = `linear-gradient(90deg, ${ACCENT_TEAL} 0%, ${BRAND_GREEN} 100%)`
const BRAND_GREEN_GLOW = '0 0 32px rgba(56, 196, 129, 0.22)'

export function LandingHeroSection() {
  return (
    <section className="relative isolate overflow-visible">
      <div className="absolute inset-0 overflow-hidden">
        <AssetImage
          src={landingAssetUrls.heroBg}
          alt="Luxury property background"
          className="h-full w-full min-h-full min-w-full scale-110 object-cover blur-[8px]"
          fallback={fallbackImages.image}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: DESIGN_TOKENS.colors.heroOverlay }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-black/10" />

      <div className="relative z-10 mx-auto grid min-h-[min(740px,calc(100dvh-5rem))] max-w-7xl items-center gap-10 px-6 pb-32 pt-24 md:grid-cols-[0.88fr_1.12fr] md:px-10 md:pb-36 md:pt-28 lg:min-h-[min(820px,calc(100dvh-5rem))]">
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="relative z-10 max-w-xl"
        >
          <h1
            className="mt-2 text-5xl font-semibold leading-[0.95] text-white md:text-7xl"
            style={{
              fontFamily: DESIGN_TOKENS.fonts.display,
              letterSpacing: '-0.04em',
            }}
          >
            Know Your{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: ACCENT_GRADIENT }}
            >
              Worth.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-8 text-white/82">
            Utilize the power of{' '}
            <span
              className="bg-clip-text font-bold text-transparent"
              style={{ backgroundImage: ACCENT_GRADIENT }}
            >
              machine learning
            </span>{' '}
            to find out how much your property actually costs!
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/property-details"
              className="rounded-full px-7 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:brightness-105"
              style={{
                background: ACCENT_GRADIENT,
                boxShadow: BRAND_GREEN_GLOW,
              }}
            >
              Try for free
            </Link>
            <Link
              to="/#pricing"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              Learn More
            </Link>
          </div>
        </MotionDiv>

        <div className="relative z-0 hidden min-h-[min(520px,50vh)] md:block">
          <div
            className="absolute inset-x-10 top-1/2 h-72 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, rgba(19, 222, 194, 0.14) 0%, rgba(56, 196, 129, 0.1) 65%, transparent 75%)`,
            }}
          />
          <WorldNetworkGraphic />
        </div>
      </div>

      <StraightDivider />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-24">
          <BinaryPattern opacity={0.28} />
        </div>
      </div>
    </section>
  )
}

export default LandingHeroSection
