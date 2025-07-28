import { SoonOptions } from "soon-fetch"

export type PagedParams = { pageSize?: number; pageIndex?: number }
export type PagedRes<T> = { list: T[]; total?: number }

export type ReqOpts = SoonOptions & {
  retry?: {
    max?: number
    enable?: (result?: { data?: any; res?: Response; err?: any }) => boolean
    delay?: number
  }
  toastErr?: boolean
}
