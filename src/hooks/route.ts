import { getPathRoutes, SoonRoute } from "@/router/utils"
import { routeStore } from "@/store/modules/route"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { useSnapshot } from "valtio"

export function useCurrentRoutes() {
  const pathname = usePathname()
  const { routes } = useSnapshot(routeStore)
  const pathMenus = getPathRoutes(pathname, routes as SoonRoute[])
  const current = useMemo(() => pathMenus.slice(-1)[0], [pathMenus])
  return [current, pathMenus] as [current: SoonRoute, pathRoutes: SoonRoute[]]
}
