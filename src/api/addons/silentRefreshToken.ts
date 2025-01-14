export function createSilentRefresh(refresh_token_fun: () => Promise<void>) {
  let requests: (() => void)[] = []
  let isRefreshing = false
  return (retry: () => void) => {
    requests.push(retry)
    if (!isRefreshing) {
      isRefreshing = true
      refresh_token_fun()
        .then(() => {
          isRefreshing = false
        })
        .finally(() => {
          requests.forEach((r) => r())
          requests = []
        })
    }
  }
}
