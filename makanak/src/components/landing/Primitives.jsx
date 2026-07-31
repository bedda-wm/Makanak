import { motion } from 'framer-motion'
import { landingAssetUrls } from '../../assets/landingAssets'
import logoImg from '../../assets/logo.png'
import underlineImg from '../../assets/underline.png'
import { DESIGN_TOKENS, fallbackImages } from '../../constants/landingPage'

const MotionDiv = motion.div

export function AssetImage({
  src,
  alt,
  className = '',
  fallback = fallbackImages.image,
  style,
}) {
  return (
    <img
      src={src || fallback}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback
      }}
    />
  )
}

export function AssetIcon({
  src,
  alt,
  className = '',
  fallback = fallbackImages.icon,
  invert = false,
}) {
  return (
    <img
      src={src || fallback}
      alt={alt}
      className={className}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback
      }}
      style={invert ? { filter: 'brightness(0) invert(1)' } : undefined}
    />
  )
}

export function BinaryPattern({ className = '', opacity = 0.12 }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ opacity }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(156,163,175,0.42) 1.3px, transparent 1.4px),
            radial-gradient(circle at 2px 2px, rgba(156,163,175,0.32) 1.1px, transparent 1.2px)
          `,
          backgroundSize: '18px 18px, 18px 18px',
          backgroundPosition: '0 0, 9px 9px',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 22%, rgba(0,0,0,0.95) 78%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 22%, rgba(0,0,0,0.95) 78%, transparent 100%)',
        }}
      />
    </div>
  )
}

export function StraightDivider({ top = false, heightClass = 'h-24' }) {
  return (
    <div
      className={`absolute left-0 right-0 ${heightClass} ${top ? 'top-0' : 'bottom-0'} overflow-hidden`}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: DESIGN_TOKENS.colors.bg,
          clipPath: top
            ? 'polygon(0 0, 100% 0, 100% 76%, 0 100%)'
            : 'polygon(0 56%, 100% 24%, 100% 100%, 0 100%)',
        }}
      />
    </div>
  )
}

export function ScriptTitle({ children }) {
  return (
    <h2
      className="text-center text-4xl font-semibold tracking-tight md:text-6xl"
      style={{
        color: DESIGN_TOKENS.colors.navy,
        fontFamily: DESIGN_TOKENS.fonts.display,
        letterSpacing: '-0.04em',
      }}
    >
      {children}
    </h2>
  )
}

export function AccentUnderline() {
  return (
    <img
      src={underlineImg}
      alt=""
      width={456}
      height={108}
      className="pointer-events-none absolute -bottom-7 left-1/2 w-[116px] max-w-none -translate-x-1/2 object-contain object-bottom select-none"
      aria-hidden
    />
  )
}

export function SmallPill({ color }) {
  return (
    <div
      className="mb-5 h-2.5 w-10 rounded-full"
      style={{ backgroundColor: color || DESIGN_TOKENS.colors.primary }}
    />
  )
}

export function GlassCard({ children, className = '', style }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 24,
        border: `1px solid ${DESIGN_TOKENS.colors.line}`,
        backgroundColor: 'rgba(255,255,255,0.92)',
        boxShadow: DESIGN_TOKENS.shadows.card,
        backdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Logo() {
  return (
    <div className="flex items-center">
      <AssetImage
        src={logoImg}
        alt="Makanak"
        className="h-8 w-auto max-w-[160px] object-contain object-left"
        fallback={fallbackImages.logo}
      />
    </div>
  )
}

export function WorldNetworkGraphic() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="pointer-events-none absolute inset-y-0 right-[calc((min(100vw,80rem)-100vw)/2+1.25rem)] z-0 flex w-[min(1400px,calc(100%+14rem))] max-w-[min(98vw,1400px)] items-center justify-end md:right-[calc((min(100vw,80rem)-100vw)/2+2.25rem)] md:w-[min(1480px,calc(100%+18rem))]"
    >
      <div
        className="absolute inset-[8%] rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(19,222,194,0.10)' }}
      />
      <AssetImage
        src={landingAssetUrls.heroMap}
        alt="World map network graphic"
        className="relative h-[min(680px,68vh)] w-auto max-h-[720px] max-w-full object-contain object-right"
        fallback={fallbackImages.illustration}
      />
    </MotionDiv>
  )
}
