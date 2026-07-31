import { SectionMotion } from '../ui/SectionMotion'

const features = [
  {
    title: 'Smart search',
    body: 'Placeholder — wire your AI matching copy here.',
  },
  {
    title: 'Trusted listings',
    body: 'Placeholder — integrate data sources when ready.',
  },
  {
    title: 'Guided decisions',
    body: 'Placeholder — highlight assistant workflows.',
  },
]

export function FeatureSection() {
  return (
    <section
      className="border-y border-border/80 bg-surface py-16 sm:py-20"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionMotion className="mx-auto max-w-2xl text-center">
          <h2
            id="features-heading"
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Built for modern property seekers
          </h2>
          <p className="mt-4 text-lg text-muted">
            Replace this grid with your pasted landing sections.
          </p>
        </SectionMotion>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <SectionMotion key={item.title} delay={i * 0.06}>
              <li className="rounded-xl border border-border/80 bg-background p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-muted leading-relaxed">{item.body}</p>
              </li>
            </SectionMotion>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FeatureSection
