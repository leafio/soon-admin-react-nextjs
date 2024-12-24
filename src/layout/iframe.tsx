"use client"

import { getPathRoutes, SoonRoute } from "@/router/utils"
import { appStore } from "@/store/app"
import { usePathname } from "next/navigation"
import { useSnapshot } from "valtio"

export default function Iframe({ link }: { link?: string }) {
  const pathname = usePathname()
  const appSnap = useSnapshot(appStore)

  const current = getPathRoutes(pathname, appSnap.routes as SoonRoute[]).slice(-1)[0]

  return <iframe src={current?.meta?.link ?? link ?? ""} className="h-full flex-1"></iframe>
}
