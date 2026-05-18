import { useEffect, useState } from 'react'

const cache = new Map()

/** useData(filename) — fetch a JSON file from /data with in-memory caching. */
export function useData(filename) {
  const [state, setState] = useState(() => {
    if (cache.has(filename)) return { data: cache.get(filename), loading: false, error: null }
    return { data: null, loading: true, error: null }
  })

  useEffect(() => {
    if (cache.has(filename)) {
      setState({ data: cache.get(filename), loading: false, error: null })
      return
    }
    let cancelled = false
    setState({ data: null, loading: true, error: null })
    fetch(`/data/${filename}`)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load ${filename}: ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (cancelled) return
        cache.set(filename, data)
        setState({ data, loading: false, error: null })
      })
      .catch(err => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message })
      })
    return () => { cancelled = true }
  }, [filename])

  return state
}
