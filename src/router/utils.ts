import { Menu } from "@/api"
import { tLocales } from "@/i18n"
import en_menu from "@/i18n/en/menu"
import zh_menu from "@/i18n/zh/menu"
export type SoonRouteMeta = {
  title?: string | (() => string)
  link?: string
  isHide?: boolean
  isKeepAlive?: boolean
  isAffix?: boolean
  isIframe?: boolean
  icon?: string | object
  layout?: string
}
export type SoonRoute = {
  path?: string
  redirect?: string
  children?: SoonRoute[]

  meta?: SoonRouteMeta
}

const t = tLocales({ zh: zh_menu, en: en_menu })

export const parseMenuTitle = (menus: Menu[]): Menu[] => {
  return menus.map((m) => {
    return {
      ...m,
      meta: {
        ...m.meta,
        title: typeof m.meta.title === "string" ? () => t((m.meta.title ?? "") as any) : m.meta.title,
      },
      children: m.children ? parseMenuTitle(m.children) : [],
    }
  }) as unknown as Menu[]
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

export const getPathMenu = (targetPath: string, menus: Menu[]) => {
  let result: Menu[] = []
  const target = menus.find((m) => m.path === targetPath)
  if (target) return [target]
  menus.some((m) => {
    const _menu = getPathMenu(targetPath, m.children ?? [])

    if (_menu.length) {
      result = [m, ..._menu]
      return true
    }
  })
  return result
}
