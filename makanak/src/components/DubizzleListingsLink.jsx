import { buildDubizzleSearchUrl } from '../lib/dubizzleUrl'

const defaultClassName =
  'inline-flex items-center justify-start rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-left text-xs font-semibold text-white transition hover:bg-white/15 md:text-sm'

/**
 * Opens Dubizzle with filters derived from valuation inputs + predicted price.
 */
export function DubizzleListingsLink({ input, predictedPrice, className }) {
  const href = buildDubizzleSearchUrl(input, predictedPrice)
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? defaultClassName}
    >
      View similar listings on Dubizzle
    </a>
  )
}

export default DubizzleListingsLink
