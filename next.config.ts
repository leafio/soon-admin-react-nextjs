import type { NextConfig } from "next"

import path from "path"
import { fileURLToPath } from "url"
import withBundleAnalyzer from "@next/bundle-analyzer"

import { parseBaseUrl } from "./env/parse"
import { Rewrite } from "next/dist/lib/load-custom-routes"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//console.log('dirname', __dirname)
// console.log('env', process.env)
let rewrites: undefined | (() => Promise<Rewrite[]>)

const { NODE_ENV, NEXT_PUBLIC_DEV_PROXY } = process.env
if (NODE_ENV === "development" && NEXT_PUBLIC_DEV_PROXY === "true") {
  const prefix = parseBaseUrl(process.env, true)
  rewrites = () => {
    return Promise.resolve([
      {
        source: prefix + "/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL + "/:path*",
      },
    ])
  }
}

const enabledAnalyze = process.env.ANALYZE === "true"

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // distDir: "dist",
  // reactStrictMode: false,
  rewrites,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/css")],
  },
}

export default withBundleAnalyzer({
  enabled: enabledAnalyze,
  openAnalyzer: enabledAnalyze,
})(nextConfig)
