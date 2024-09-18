import { createSoon, SoonOptions } from "soon-fetch"
import { parseBaseUrl } from "../../env/parse.mjs"
import { getLang, tMessages } from "@/i18n"
import { message } from "antd"

export const baseURL = parseBaseUrl(
  {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DEV_API_PREFIX: process.env.NEXT_PUBLIC_DEV_API_PREFIX,
    NEXT_PUBLIC_DEV_PROXY: process.env.NEXT_PUBLIC_DEV_PROXY,
  },
  process.env.NODE_ENV === "development",
)
// console.log(`baseURL: ${baseURL}`)

const t = tMessages()

export const soon = createSoon<SoonOptions>({
  baseURL,
  defaultOptions: () => ({
    timeout: 20 * 1000,
    headers: new Headers({
      Authorization: localStorage.getItem("token") ?? "",
      "soon-lang": getLang(),
    }),
  }),
  afterResponse: async (result, resolve, reject) => {
    const res = result.response
    if (res) {
      if (res.ok) {
        if (res.headers.get("content-type")?.includes("json")) {
          const body = await res.json()
          if (body.code === 0) {
            resolve(body.data)
          } else {
            message.error(body.err ?? "Invalid JSON Response")
            reject(body.err)
          }
        } else {
          resolve(res)
        }
      } else if (res.status === 401) {
        localStorage.removeItem("token")
        location.href = "/login"
      } else {
        message.error(res.statusText)
      }
      reject(res.statusText)
    } else if (result.isTimeout) {
      message.error(t("tip.requestTimeout"))
    } else if (result.error) {
      message.error(result.error)
    }
    reject(result.error ?? "Request Error")
  },
})
