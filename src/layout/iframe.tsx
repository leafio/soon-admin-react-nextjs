"use client"

import { getPathMenu } from "@/router/utils"
import { userStore } from "@/store/user"
import { usePathname } from "next/navigation"
import { useSnapshot } from "valtio"

export default function Iframe({ link }: { link?: string }) {
  const pathname = usePathname()
  const userSnap = useSnapshot(userStore)

  const current = (getPathMenu(pathname, (userSnap.menus as any) ?? []) ?? []).slice(-1)[0]

  return (
    <iframe src={current?.meta?.link ?? link ?? ""} className="h-full flex-1">

    </iframe>
  )
}
