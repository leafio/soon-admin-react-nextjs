import { appStore } from "@/store/modules/app"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { getPathRoutes, parseRedirectNext, SoonRoute } from "./utils"
import { bizRoutes, staticRoutes } from "./routes"
import { own_menus } from "@/api"
import { initUser, userStore } from "@/store/modules/user"
import { Menus2SideMenus, route2SideMenus } from "@/router/side-menu"
import { routeStore } from "@/store/modules/route"

export const initRoutesMenus = async (routes?: SoonRoute[]) => {
  await initUser()
  let result: SoonRoute[] = []
  if (!routes) {
    userStore.menus = Menus2SideMenus(await own_menus())
  } else {
    userStore.menus = route2SideMenus(routes as any)
  }
  result.push(...(userStore.menus ?? []), ...(route2SideMenus(staticRoutes) ?? []))
  result = parseRedirectNext(result)

  const notLoginRoutes = result.filter((p) => p.path !== routeStore.route.loginUrl)
  if (!routeStore.route.homeUrl && notLoginRoutes.length) {
    routeStore.route.homeUrl = notLoginRoutes[0].redirect ?? notLoginRoutes[0].path
  }
  routeStore.routes = result
}

const ROUTER_WHITE_LIST: string[] = []
export const everyRoute = async (path: string, router: AppRouterInstance) => {
  const token = localStorage.getItem("token")

  // 1.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  if (ROUTER_WHITE_LIST.includes(path)) return true

  // 2.判断是访问登陆页，有 token 就在当前页面，没有 token 重置路由到登陆页
  if (path.toLocaleLowerCase() === routeStore.route.loginUrl) {
    return true
  }

  // 3.判断是否有 token，没有重定向到 login 页面
  if (!token) {
    router.replace(routeStore.route.loginUrl)
    return false
  }

  // 4.如果没有菜单列表，就重新请求菜单列表并添加动态路由
  if (!routeStore.routes) {
    // 前端写死路由
    // await initRoutesMenus(bizRoutes)
    // 从后端获取路由
    await initRoutesMenus()
  }

  const cur_routes = getPathRoutes(path, routeStore.routes)
  const url = routeStore.route.homeUrl ?? "/"
  const current = cur_routes.slice(-1)[0]
  if (!current || path === "/") {
    router.replace(url)
    return false
  } else if (current?.redirect) {
    router.replace(current?.redirect)
    return false
  }

  return true
}
