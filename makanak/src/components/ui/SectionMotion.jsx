import { motion } from 'framer-motion'

const MotionSection = motion.div

const defaultTransition = { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }

/**
 * Subtle section reveal — use sparingly.
 */
export function SectionMotion({
  children,
  className = '',
  delay = 0,
}) {
  return (
    <MotionSection
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...defaultTransition, delay }}
    >
      {children}
    </MotionSection>
  )
}

export default SectionMotion
