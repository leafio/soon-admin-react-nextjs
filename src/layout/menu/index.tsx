import { userStore } from "@/store/user"
import { useSnapshot } from "valtio"
import MenuItem from "./menu-item"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const filterChildrenNotHide = (arr?: any[]): any[] | undefined => {
  if (Array.isArray(arr)) {
    return arr.filter((a) => !a.meta?.isHide).map((a) => ({ ...a, children: filterChildrenNotHide(a.children) }))
  }
  return undefined
}

export default function SoonMenu({ isCollapse, className = "" }: { isCollapse?: boolean; className?: string }) {
  const snap = useSnapshot(userStore)
  const menus = filterChildrenNotHide(snap.menus as any[])

  const pathname = usePathname()

  return (
    <ul className={"h-screen overflow-hidden " + className}>
      {(menus ?? []).map((menu) => (
        <MenuItem key={menu.path} menu={menu} isCollapse={isCollapse} selectedPath={pathname} />
      ))}
    </ul>
  )
}
