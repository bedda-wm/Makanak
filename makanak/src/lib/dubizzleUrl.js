const BASE =
  'https://www.dubizzle.com.eg/en/properties/apartments-duplex-for-sale'

/**
 * District segment for Dubizzle URLs: lowercase, spaces → hyphens, strip other chars.
 * @example slugifyDistrict("5th Settlement") → "5th-settlement"
 * @example slugifyDistrict("Sheikh Zayed") → "sheikh-zayed"
 */
export function slugifyDistrict(district) {
  if (!district || typeof district !== 'string') return ''
  return district
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Dubizzle apartments search URL from valuation inputs and predicted price (EGP).
 *
 * @param {object} input
 * @param {number} [input.area_sqm]
 * @param {number} [input.areaSqM]
 * @param {number} input.bedrooms
 * @param {number} input.bathrooms
 * @param {string} input.district
 * @param {number} [predicted_price] EGP; falls back to `input.predicted_price_egp` / `input.predicted_price`
 * @returns {string|null} Full URL or null if required data is missing
 */
export function buildDubizzleSearchUrl(input, predicted_price) {
  if (!input || typeof input !== 'object') return null

  const areaSqm = Number(input.area_sqm ?? input.areaSqM)
  const bedrooms = Math.round(Number(input.bedrooms))
  const bathrooms = Math.round(Number(input.bathrooms))
  const district = String(input.district ?? '').trim()
  const price = Number(
    predicted_price ?? input.predicted_price_egp ?? input.predicted_price,
  )

  if (
    !Number.isFinite(areaSqm) ||
    !Number.isFinite(bedrooms) ||
    !Number.isFinite(bathrooms) ||
    !district ||
    !Number.isFinite(price)
  ) {
    return null
  }

  const slug = slugifyDistrict(district)
  if (!slug) return null

  const areaMin = Math.max(1, Math.floor(areaSqm - 20))
  const areaMax = Math.ceil(areaSqm + 20)
  const priceMin = Math.max(0, Math.floor(price - 500_000))
  const priceMax = Math.ceil(price + 500_000)

  const filter = [
    `bathrooms_eq_${bathrooms}`,
    `ft_between_${areaMin}_to_${areaMax}`,
    `price_between_${priceMin}_to_${priceMax}`,
    `rooms_eq_${bedrooms}`,
  ].join(',')

  return `${BASE}/${slug}/?filter=${filter}`
}
