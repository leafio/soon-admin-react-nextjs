import { createSoon, SoonOptions, createSilentRefresh } from "soon-fetch"
import isNetworkError from "is-network-error"

import { parseBaseUrl } from "../../env/parse"
import { getLang, tLocales } from "@/i18n"
import { refresh_token } from "./modules/auth"
import { toast } from "@/components/toast"
import { soon_local } from "@/utils/storage"

export const baseURL = parseBaseUrl(
  {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DEV_API_PREFIX: process.env.NEXT_PUBLIC_DEV_API_PREFIX,
    NEXT_PUBLIC_DEV_PROXY: process.env.NEXT_PUBLIC_DEV_PROXY,
  },
  process.env.NODE_ENV === "development",
)
// //console.log(`baseURL: ${baseURL}`)

const t = tLocales()
const silentRefresh = createSilentRefresh(() =>
  refresh_token({ token: soon_local.refresh_token.get() ?? "" })
    .then((res) => {
      soon_local.token.set(res.token)
    })
    .catch(() => {
      soon_local.refresh_token.remove()
      soon_local.token.remove()
      location.href = "/login"
    }),
)

type ReqOpts = SoonOptions & {
  retry?: {
    max?: number
    enable?: (result?: { data?: any; res?: Response; err?: any }) => boolean
    delay?: number
  }
  toastErr?: boolean
}

export const soon = createSoon<ReqOpts>(
  (url, options) => {
    const isGet = !options?.method || options?.method.toLocaleLowerCase() === "get"
    return {
      url,
      options,
      baseURL,
      baseOptions: {
        timeout: 20 * 1000,
        headers: new Headers({
          Authorization: soon_local.token.get() ?? "",
          "soon-lang": getLang(),
        }),
        share: isGet ? true : false,
        staleTime: isGet ? 2 * 1000 : 0,
      },
    }
  },

  ({ parsed }) =>
    <T>(url: string, options?: ReqOpts) => {
      return new Promise<T>(async (resolve, reject) => {
        let res,
          err,
          data,
          errMsg = "",
          is_net_err = false

        try {
          res = await fetch(parsed.url, parsed.options)
        } catch (error: any) {
          err = error
          is_net_err = isNetworkError(error)
        }

        if (res) {
          if (res.ok) {
            if (res.headers.get("content-type")?.includes("json")) {
              const body = await res.json()
              if (body.code === 0) {
                data = body.data
              } else {
                errMsg = body.err ?? t("tip.requestError")
                err = body.err
              }
            } else {
              data = res
            }
          } else if (res.status === 401) {
            silentRefresh(
              () => resolve(soon.request(url, options)),
              () => reject(),
            )
            return
          } else {
            errMsg = res.statusText
            err = res.statusText
          }
        }
        //重试
        const { max, enable, delay } = parsed.options?.retry || {}
        const retry = max && (enable ? enable({ data, res, err }) : is_net_err)
        if (retry) {
          setTimeout(
            () => resolve(soon.request(url, { ...options, retry: { ...options?.retry, max: max - 1 } })),
            delay,
          )
          return
        }

        if (err) {
          if (err.name === "TimeoutError") {
            errMsg = t("tip.requestTimeout")
          }
          // else if (err.name === "AbortError") {
          //  //message.error(err)
          // reject(err)
          // }
        }
        //显示错误信息
        const showErrToast = parsed.options?.toastErr ?? true
        if (showErrToast && errMsg) {
          toast.error(errMsg)
        }
        //完成promise
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    },
)
