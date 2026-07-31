import { motion } from 'framer-motion'
import { landingAssetUrls } from '../../assets/landingAssets'
import { DESIGN_TOKENS, fallbackImages } from '../../constants/landingPage'
import { AssetImage, SmallPill } from '../landing/Primitives'

const MotionDiv = motion.div

export function BenefitMaximizeSection() {
  return (
    <section
      id="about"
      className="relative py-12 md:py-16"
      style={{ backgroundColor: DESIGN_TOKENS.colors.bg }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-12 md:px-10">
        <MotionDiv
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative flex min-h-[280px] items-center justify-center md:min-h-[360px]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[40px]">
            <AssetImage
              src={landingAssetUrls.iso1b}
              alt=""
              className="h-full w-full object-cover"
              fallback={fallbackImages.illustration}
            />
          </div>
          <AssetImage
            src={landingAssetUrls.iso1}
            alt="Maximize your property value"
            className="relative z-10 mx-auto w-full max-w-[520px] object-contain drop-shadow-[0_30px_60px_rgba(16,24,40,0.10)]"
            fallback={fallbackImages.illustration}
          />
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-lg justify-self-end"
        >
          <SmallPill color="#F2DCA0" />
          <h3
            className="text-3xl font-semibold tracking-tight md:text-5xl"
            style={{
              color: DESIGN_TOKENS.colors.navy,
              fontFamily: DESIGN_TOKENS.fonts.display,
              letterSpacing: '-0.04em',
            }}
          >
            Maximize Your Profit
          </h3>
          <p
            className="mt-7 text-lg leading-8"
            style={{ color: DESIGN_TOKENS.colors.textMuted }}
          >
            Providing you with the best{' '}
            <span
              style={{
                color: '#52C41A',
                fontWeight: 600,
              }}
            >
              price
            </span>{' '}
            for your{' '}
            <span
              style={{
                color: '#EC531B',
                fontWeight: 600,
              }}
            >
              property
            </span>
            .
          </p>
        </MotionDiv>
      </div>
    </section>
  )
}

export default BenefitMaximizeSection
