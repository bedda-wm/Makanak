import { PLACEHOLDER_AMENITIES } from './propertyFormPlaceholders'

/**
 * Valuation API keys we do not collect in the property form — hide on detail UI.
 */
export const VALUATION_HIDDEN_KEYS = new Set([
  'explanation',
  'predicted_price_egp',
  'predicted_price',
  'price',
  'id',
  'valuation_id',
  'user_id',
  'created_at',
  'createdAt',
  'updated_at',
  'updatedAt',
  // Model / defaults not shown in the form
  'furnished',
  'completion_status',
  'payment_option',
  'ownership',
  'type',
  'district_grouped',
  'save',
  'location_text',
  'city',
  'City',
])

/** API snake_case → labels matching the property form copy */
export const VALUATION_FIELD_LABELS = {
  district: 'District',
  area_sqm: 'Area (m²)',
  bedrooms: 'Bedrooms',
  bathrooms: 'Bathrooms',
  is_compound: 'In a compound',
  amenities_count: 'Amenities',
}

/** Preferred display order (only keys present on the object are shown). */
export const VALUATION_FIELD_ORDER = [
  'district',
  'area_sqm',
  'bedrooms',
  'bathrooms',
  'is_compound',
  'amenities_count',
]

function normalizeAmenityIds(valuation) {
  const raw = valuation.amenities ?? valuation.amenity_ids ?? valuation.amenityIds
  if (raw == null) return []
  if (Array.isArray(raw)) return raw.map((x) => String(x))
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.map((x) => String(x)) : []
    } catch {
      return []
    }
  }
  return []
}

/** Human-readable amenities: labels from ids when stored; else count fallback. */
export function formatAmenitiesDisplay(valuation) {
  const ids = normalizeAmenityIds(valuation)
  if (ids.length > 0) {
    const labels = PLACEHOLDER_AMENITIES.filter((a) => ids.includes(String(a.id))).map((a) => a.label)
    if (labels.length > 0) return labels.join(', ')
    return ids.join(', ')
  }
  const n = Number(valuation.amenities_count)
  if (!Number.isFinite(n)) return '—'
  if (n === 0) return 'None selected'
  return `${n} selected`
}

function formatValuationValue(key, raw) {
  if (raw === null || raw === undefined) return '—'
  if (key === 'is_compound') {
    if (raw === true || raw === 'true' || raw === 1 || raw === '1') return 'Yes'
    if (raw === false || raw === 'false' || raw === 0 || raw === '0') return 'No'
  }
  if (typeof raw === 'object') return JSON.stringify(raw)
  return String(raw)
}

/**
 * Rows for “what you entered” — only known form fields, human labels, stable order.
 */
export function getValuationInputRows(valuation) {
  if (!valuation || typeof valuation !== 'object') return []
  const rows = []
  for (const key of VALUATION_FIELD_ORDER) {
    if (key === 'amenities_count') {
      const hasCount = Object.prototype.hasOwnProperty.call(valuation, 'amenities_count')
      const hasList = normalizeAmenityIds(valuation).length > 0
      if (!hasCount && !hasList) continue
      rows.push({
        key: 'amenities_count',
        label: VALUATION_FIELD_LABELS.amenities_count,
        value: formatAmenitiesDisplay(valuation),
      })
      continue
    }
    if (!Object.prototype.hasOwnProperty.call(valuation, key)) continue
    if (VALUATION_HIDDEN_KEYS.has(key)) continue
    const label = VALUATION_FIELD_LABELS[key] ?? key
    const value = formatValuationValue(key, valuation[key])
    rows.push({ key, label, value })
  }
  return rows
}
