import { motion } from 'framer-motion'
import lightBulbImg from '../../assets/Light Bulb.png'
import { landingAssetUrls } from '../../assets/landingAssets'
import { DESIGN_TOKENS, fallbackImages } from '../../constants/landingPage'
import { AssetImage, StraightDivider } from '../landing/Primitives'

const MotionDiv = motion.div

export function MidBannerSection() {
  return (
    <section className="relative isolate -mt-2 overflow-hidden md:-mt-3">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: DESIGN_TOKENS.colors.bg }}
      />
      <StraightDivider top heightClass="h-14" />
      <div className="relative h-[300px] overflow-hidden md:h-[380px]">
        <AssetImage
          src={landingAssetUrls.midBanner}
          alt="Interior luxury property banner"
          className="absolute inset-0 h-full w-full min-h-full min-w-full scale-110 object-cover blur-[8px]"
          fallback={fallbackImages.image}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(9,22,45,0.30)' }}
        />
        <div className="relative mx-auto flex h-full max-w-6xl items-center justify-center px-6 md:px-10">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <img
              src={lightBulbImg}
              alt=""
              className="h-16 w-16 object-contain md:h-20 md:w-20"
              aria-hidden
            />
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}

export default MidBannerSection
