"use client"

import { getPathMenu } from "@/router/utils"
import { userStore } from "@/store/user"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSnapshot } from "valtio"

export default function Iframe({ link }: { link?: string }) {
  const [src, setSrc] = useState(link)
  const pathname = usePathname()
  const userSnap = useSnapshot(userStore)

  const current = (getPathMenu(pathname, (userSnap.menus as any) ?? []) ?? []).slice(-1)[0]
  const list = getPathMenu(pathname, (userSnap.menus as any) ?? [])
  //console.log("cur", current, list, list[0], list)
  // useEffect(() => {
  //     if (!link) {
  //         const current = getPathMenu(pathname, userSnap.menus as any ?? [])[-1]
  //         //console.log('current', pathname,userSnap.menus)
  //         setSrc(current?.meta?.link)
  //     }
  // }, [pathname, userSnap])
  return (
    <iframe src={current?.meta?.link ?? link ?? ""} className="h-full flex-1">
      
    </iframe>
  )
}
