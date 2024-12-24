export function retry(
    fun: (retries?: number | (() => boolean)) => void,
    retries?: number | (() => boolean),
    delay: number = 1000,
  ): boolean {
    const condition = !!(retries && (typeof retries === "function" ? retries() : retries))
    if (condition) {
      const next_retries = typeof retries === "function" ? retries : retries - 1
      if (condition) {
        setTimeout(() => {
          // resolve(request(url, { ...options, retries: next_retries }))
          fun(next_retries)
        }, delay)
      }
    }
    return condition
  }