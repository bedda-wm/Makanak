import { motion } from 'framer-motion'
import { landingAssetUrls } from '../../assets/landingAssets'
import { DESIGN_TOKENS, fallbackImages } from '../../constants/landingPage'
import { AssetImage, SmallPill } from '../landing/Primitives'

const MotionDiv = motion.div

export function BenefitReapSection() {
  return (
    <section
      className="relative pb-16 pt-6 md:pb-20 md:pt-8"
      style={{ backgroundColor: DESIGN_TOKENS.colors.bg }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-12 md:px-10">
        <MotionDiv
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-lg"
        >
          <SmallPill color="#9324ED" />
          <h3
            className="text-3xl font-semibold tracking-tight md:text-5xl"
            style={{
              color: DESIGN_TOKENS.colors.navy,
              fontFamily: DESIGN_TOKENS.fonts.display,
              letterSpacing: '-0.04em',
            }}
          >
            Reap The Benefits
          </h3>
          <p
            className="mt-7 text-lg leading-8"
            style={{ color: DESIGN_TOKENS.colors.textMuted }}
          >
            Employ highly{' '}
            <span
              style={{
                color: '#00C2FF',
                fontWeight: 600,
              }}
            >
              optimized
            </span>{' '}
            artificial intelligence{' '}
            <span
              style={{
                color: '#FF1EF6',
                fontWeight: 600,
              }}
            >
              automation
            </span>
            .
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative flex min-h-[280px] items-center justify-center md:min-h-[360px]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[40px]">
            <AssetImage
              src={landingAssetUrls.iso2b}
              alt=""
              className="h-full w-full object-cover"
              fallback={fallbackImages.illustration}
            />
          </div>
          <AssetImage
            src={landingAssetUrls.iso2}
            alt="AI-powered property automation"
            className="relative z-10 mx-auto w-full max-w-[560px] object-contain drop-shadow-[0_30px_60px_rgba(16,24,40,0.08)]"
            fallback={fallbackImages.illustration}
          />
        </MotionDiv>
      </div>
    </section>
  )
}

export default BenefitReapSection
