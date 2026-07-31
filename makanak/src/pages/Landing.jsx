import { DESIGN_TOKENS } from '../constants/landingPage'
import { LandingHeroSection } from '../components/sections/LandingHeroSection'
import { HowItWorksSection } from '../components/sections/HowItWorksSection'
import { BenefitMaximizeSection } from '../components/sections/BenefitMaximizeSection'
import { BenefitReapSection } from '../components/sections/BenefitReapSection'
import { MidBannerSection } from '../components/sections/MidBannerSection'
import { PricingSignupSection } from '../components/sections/PricingSignupSection'
import { LandingMarketingFooter } from '../components/sections/LandingMarketingFooter'

/**
 * Makanak marketing landing — composed from section components.
 * Tokens & assets: `src/constants/landingPage.js`
 */
export default function Landing() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.bg,
        color: DESIGN_TOKENS.colors.text,
        fontFamily: DESIGN_TOKENS.fonts.body,
      }}
    >
      <LandingHeroSection />
      <HowItWorksSection />
      <BenefitMaximizeSection />
      <BenefitReapSection />
      <MidBannerSection />
      <PricingSignupSection />
      <LandingMarketingFooter />
    </div>
  )
}
