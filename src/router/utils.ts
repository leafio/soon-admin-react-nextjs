import { getTreePathArr } from "@/utils"
import { ReactNode } from "react"
export type SoonRouteMeta = {
  title?: string | (() => string)
  link?: string
  isHide?: boolean
  isKeepAlive?: boolean
  isAffix?: boolean
  isIframe?: boolean
  icon?: string | ReactNode
  layout?: string
}
export type SoonRoute = {
  path: string
  redirect?: string
  children?: SoonRoute[]
  name?: string

  meta?: SoonRouteMeta
}

// /**动态解析 redirect */
export function parseRedirectNext(routes: { path: string; redirect?: string; children?: any }[]): any[] {
  return routes.map((item) => {
    if (item.redirect === "toNext" && item.children?.length) {
      const children = parseRedirectNext(item.children)
      return {
        ...item,
        redirect: children[0].redirect || children[0].path,
      }
    }
    return item
  })
}

export const getPathRoutes = (targetPath: string, routes?: SoonRoute[]) => {
  if (!routes) return []
  return getTreePathArr(routes as SoonRoute[], "path", targetPath)
}
