import { Menu } from "@/api"
import { SoonMenuData } from "@/components/soon/soon-menu/type"
import { tLocales } from "@/i18n"
import en_menu from "@/i18n/en/menu"
import ko_menu from "@/i18n/ko/menu"
import zh_menu from "@/i18n/zh/menu"
import { SoonRoute } from "@/router/utils"

export type ParsedMenu = SoonRoute & SoonMenuData & { isLink?: boolean }

const t = tLocales({ zh: zh_menu, en: en_menu, ko: ko_menu })

export function parseMenuTitle(title?: string | (() => string)) {
  return typeof title === "string" ? () => t(title as any) : title
}

export function Menus2SideMenus(menus?: Menu[]): undefined | ParsedMenu[] {
  if (!menus) return undefined

  const result = menus.map((ch) => {
    return {
      ...ch,
      label: parseMenuTitle(ch.meta.title),
      icon: ch.meta.icon,
      children: Menus2SideMenus(ch.children),
    }
  })
  return result as ParsedMenu[]
}

export function route2SideMenus(routes?: SoonRoute[]): undefined | ParsedMenu[] {
  if (!routes) return undefined

  return routes.map((ch) => {
    return {
      ...ch,
      label: parseMenuTitle(ch.meta?.title),
      icon: ch.meta?.icon,
      children: route2SideMenus(ch.children),
    }
  }) as ParsedMenu[]
}
