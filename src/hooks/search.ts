import { useCallback, useRef, useState } from "react"

export function useSearch<T extends (...args: any) => Promise<any>>(
  api: T,
  options?: {
    loadingDelay?: number
    minLoadingInterval?: number
  },
) {
  type Args = Parameters<T>
  type Data = Awaited<ReturnType<T>>

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Data>()
  const refIsFetching = useRef(false)
  const search = useCallback(
    (...args: Args) => {
      const promise_loading = new Promise<void>((resolve, reject) => {
        const startLoading = () => {
          setLoading(true)
          setTimeout(() => {
            resolve()
          }, options?.minLoadingInterval ?? 300)
        }
        if (options?.loadingDelay) {
          setTimeout(() => {
            startLoading()
          }, options.loadingDelay)
        } else {
          startLoading()
        }
      })
      refIsFetching.current = true

      const promise_fetch: Promise<Data> = api(...args)
        .then((res) => {
          setData(res)
          return res
        })
        .finally(() => {
          refIsFetching.current = false
        })
      Promise.allSettled([promise_fetch, promise_loading]).finally(() => {
        setLoading(false)
      })
      return promise_fetch
    },
    [api, options?.loadingDelay, options?.minLoadingInterval],
  )
  return { loading, search, isFetching: refIsFetching.current, data }
}
