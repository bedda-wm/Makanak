import { Link } from 'react-router-dom'
import { SectionMotion } from '../ui/SectionMotion'
import { buttonClassName } from '../../styles/buttonClassName'

export function SignupSection() {
  return (
    <SectionMotion className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface px-6 py-12 text-center shadow-sm sm:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, #6C63FF 0%, transparent 55%)',
          }}
          aria-hidden
        />
        <div className="relative">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ready to explore with Makanak?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Placeholder CTA — swap for your signup form or mail capture from the
            pasted design.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/#pricing"
              className={buttonClassName({ variant: 'primary', size: 'lg' })}
            >
              Join the waitlist
            </Link>
          </div>
        </div>
      </div>
    </SectionMotion>
  )
}

export default SignupSection
