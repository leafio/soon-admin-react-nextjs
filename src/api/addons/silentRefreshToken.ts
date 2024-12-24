export function createSilentRefresh(refresh_token_fun: () => Promise<void>) {
  let requests: any[] = []
  let isRefreshing = false
  return (resolve: (value: any | PromiseLike<any>) => void, reject: (reason?: any) => void, retry: any) => {
    requests.push(retry)
    if (!isRefreshing) {
      isRefreshing = true
      refresh_token_fun()
        .then(() => {
          isRefreshing = false
          requests.forEach((r) => resolve(r()))
        })
        .catch(() => {
          requests.forEach(() => reject())
        })
        .finally(() => {
          requests = []
        })
    }
  }
}
