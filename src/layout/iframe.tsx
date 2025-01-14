"use client"

import { getPathRoutes, SoonRoute } from "@/router/utils"
import { routeStore } from "@/store/modules/route"
import { usePathname } from "next/navigation"
import { useSnapshot } from "valtio"

export default function Iframe({ link }: { link?: string }) {
  const pathname = usePathname()
  const routeSnap = useSnapshot(routeStore)

  const current = getPathRoutes(pathname, routeSnap.routes as SoonRoute[]).slice(-1)[0]

  return <iframe src={current?.meta?.link ?? link ?? ""} className="h-full flex-1"></iframe>
}
