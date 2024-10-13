export function parseBaseUrl(env, isDev) {
  const { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_DEV_API_PREFIX, NEXT_PUBLIC_DEV_PROXY } = env
  let baseURL = NEXT_PUBLIC_API_URL
  //console.log("proxy", NEXT_PUBLIC_DEV_PROXY)
  //如果是开发环境，并需要跨域代理
  if ((isDev) && baseURL.startsWith("http") && NEXT_PUBLIC_DEV_PROXY === "true") {
    const url = new URL(baseURL)
    // //console.log("url", url)
    baseURL = url.pathname === "/" ? NEXT_PUBLIC_DEV_API_PREFIX : url.pathname
  }
  //console.log({ isDev: !!(isDev), baseURL })
  return baseURL
}
