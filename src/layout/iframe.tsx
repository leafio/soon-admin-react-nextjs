"use client"

import { getPathRoutes, SoonRoute } from "@/router/utils"
import { routeStore } from "@/store/modules/route"
import { Spin } from "antd"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useSnapshot } from "valtio"

export default function Iframe({ link }: { link?: string }) {
  const pathname = usePathname()
  const routeSnap = useSnapshot(routeStore)

  const current = getPathRoutes(pathname, routeSnap.routes as SoonRoute[]).slice(-1)[0]
  const [loading, setLoading] = useState(true)
  const onLoad = () => {
    setLoading(false)
  }

  return (
    <>
      <iframe src={current?.meta?.link ?? link ?? ""} className="h-full flex-1" onLoad={onLoad}></iframe>
      <Spin spinning={loading} fullscreen />
    </>
  )
}
