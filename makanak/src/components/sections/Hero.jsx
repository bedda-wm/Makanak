import { Link } from 'react-router-dom'
import { SectionMotion } from '../ui/SectionMotion'
import { buttonClassName } from '../../styles/buttonClassName'

export function Hero() {
  return (
    <SectionMotion className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
          AI-powered real estate
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Find your next place with Makanak
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          Placeholder hero — replace with your landing copy when you paste the
          full design. Images use{' '}
          <code className="rounded bg-border/60 px-1.5 py-0.5 text-sm text-foreground">
            /assets/images/...
          </code>{' '}
          only.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/#pricing"
            className={buttonClassName({ variant: 'primary', size: 'md' })}
          >
            Get started
          </Link>
          <Link
            to="/#pricing"
            className={buttonClassName({ variant: 'outline', size: 'md' })}
          >
            View pricing
          </Link>
        </div>
      </div>
    </SectionMotion>
  )
}

export default Hero
