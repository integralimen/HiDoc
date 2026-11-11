import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

export function useQueryParams<Key extends string>() {
  const [searchParams, setSearchParams] = useSearchParams()

  function getParam(key: Key): string {
    return searchParams.get(key) ?? ''
  }

  const updateParams = useCallback(
    (values: Partial<Record<Key, string>>, replace = false) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)

          for (const key in values) {
            const value = values[key]

            if (value) {
              next.set(key, value)
            } else {
              next.delete(key)
            }
          }

          return next
        },
        { replace },
      )
    },
    [setSearchParams],
  )

  return { searchParams, getParam, updateParams }
}
