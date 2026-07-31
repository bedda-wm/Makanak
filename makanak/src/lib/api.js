/**
 * API base must match the browser hostname (localhost vs 127.0.0.1) for session cookies.
 * Set `VITE_API_URL` in `.env`, e.g. http://localhost:5050
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL
  if (typeof raw === 'string' && raw.trim()) {
    return raw.replace(/\/$/, '')
  }
  return 'http://localhost:5050'
}

function joinUrl(base, path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Fetch against the Flask API with session cookies.
 * Merges `credentials: 'include'`; prefixes `VITE_API_URL`.
 */
export async function apiFetch(path, options = {}) {
  const base = getApiBaseUrl()
  const url = path.startsWith('http') ? path : joinUrl(base, path)
  const { headers: initHeaders, ...rest } = options
  const headers = new Headers(initHeaders ?? undefined)
  return fetch(url, {
    ...rest,
    credentials: 'include',
    headers,
  })
}

/** Read `{ error: string }` or plain text from a failed response body. */
export async function getApiErrorMessage(res) {
  const text = await res.text()
  if (!text) return `Request failed (${res.status})`
  try {
    const data = JSON.parse(text)
    if (data && typeof data.error === 'string') return data.error
    if (data && typeof data.message === 'string') return data.message
  } catch {
    /* not JSON */
  }
  return text
}
