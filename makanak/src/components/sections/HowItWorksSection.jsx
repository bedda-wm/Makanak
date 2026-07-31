import { motion } from 'framer-motion'
import arrowImg from '../../assets/arrow.png'
import { DESIGN_TOKENS, stats } from '../../constants/landingPage'

const MotionDiv = motion.div
import {
  AssetIcon,
  BinaryPattern,
  ScriptTitle,
  AccentUnderline,
} from '../landing/Primitives'

export function HowItWorksSection() {
  return (
    <section
      className="relative -mt-10 overflow-hidden pb-10 pt-14 md:-mt-12"
      style={{ backgroundColor: DESIGN_TOKENS.colors.bg }}
    >
      <BinaryPattern />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div className="absolute right-[20%] top-0 z-10 hidden md:block">
          <MotionDiv
            animate={{ rotate: [0, 1.5, 0], y: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <img
              src={arrowImg}
              alt=""
              width={93}
              height={171}
              className="h-[171px] w-[93px] max-w-none object-contain pl-0 -my-[81px] -mx-[30px] -rotate-12"
              aria-hidden
            />
          </MotionDiv>
        </div>

        <div className="pt-14 text-center md:pt-20">
          <ScriptTitle>
            How it works in 3{' '}
            <span className="relative inline-block px-1">
              steps
              <AccentUnderline />
            </span>
          </ScriptTitle>
          <p
            className="mx-auto mt-5 max-w-xl text-[15px] leading-8"
            style={{ color: DESIGN_TOKENS.colors.textSoft }}
          >
            Our aim is to offer a straightforward solution that provides the
            foremost value for your needs.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-10">
          {stats.map((item, index) => (
            <MotionDiv
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="rounded-[20px] px-4 py-6 text-center transition hover:-translate-y-1"
            >
              <div className="mx-auto flex justify-center">
                <AssetIcon
                  src={item.icon}
                  alt={item.title}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <h3
                className="mt-5 text-lg font-semibold"
                style={{
                  color: DESIGN_TOKENS.colors.navy,
                  fontFamily: DESIGN_TOKENS.fonts.display,
                  letterSpacing: '-0.02em',
                }}
              >
                {item.title}
              </h3>
              <p
                className="mx-auto mt-4 max-w-[260px] text-sm leading-7"
                style={{ color: DESIGN_TOKENS.colors.textMuted }}
              >
                {item.text}
              </p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
