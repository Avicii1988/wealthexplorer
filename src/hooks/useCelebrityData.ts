import { useState, useEffect } from 'react'
import type { Celebrity } from '../data/celebrities'

// Module-level cache — persists for the lifetime of the tab (no re-fetch on re-render)
let _cache: Celebrity[] | null = null
let _promise: Promise<Celebrity[]> | null = null

export function fetchCelebrities(): Promise<Celebrity[]> {
  if (_cache) return Promise.resolve(_cache)
  if (_promise) return _promise
  _promise = fetch(`${import.meta.env.BASE_URL}data/celebs.json`)
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load celebs.json: ${r.status}`)
      return r.json()
    })
    .then((data: Celebrity[]) => {
      _cache = data
      return data
    })
  return _promise
}

export function useCelebrities(): { celebrities: Celebrity[]; loading: boolean } {
  const [celebrities, setCelebrities] = useState<Celebrity[]>(_cache ?? [])
  const [loading, setLoading] = useState(!_cache)

  useEffect(() => {
    if (_cache) return
    fetchCelebrities().then(data => {
      setCelebrities(data)
      setLoading(false)
    })
  }, [])

  return { celebrities, loading }
}
