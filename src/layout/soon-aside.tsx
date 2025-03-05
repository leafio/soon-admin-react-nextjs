import { appStore } from "@/store/modules/app"
import { useEffect, useRef } from "react"

import { useSnapshot } from "valtio"
import SoonMenu from "../components/soon/soon-menu"

import { usePathname, useRouter } from "next/navigation"
import { userStore } from "@/store/modules/user"
import { ParsedMenu } from "@/router/side-menu"

// import useClickOut from "@/hooks/useClickOut"

const filterNotHide = (arr?: ParsedMenu[]): ParsedMenu[] | undefined => {
  if (Array.isArray(arr)) {
    return arr.filter((a) => !a.meta?.isHide).map((a) => ({ ...a, children: filterNotHide(a.children) }))
  }
  return undefined
}

export default function SoonAside() {
  const appSnap = useSnapshot(appStore)
  const isHide = appSnap.sideBar.isHide
  const isMobile = appSnap.responsive === "mobile"

  useEffect(() => {
    appStore.sideBar.isHide = isMobile
  }, [isMobile])

  const refContent = useRef<HTMLDivElement>(null)

  // const { addClickOut, removeRemoveClickOut } = useClickOut(() => {
  //   if (appStore.responsive === "mobile") appStore.sideBar.isHide = true
  // }, refContent)
  // useEffect(() => {
  //   if (!appSnap.sideBar.isHide) {
  //     addClickOut()
  //   } else {
  //     removeRemoveClickOut()
  //   }
  // }, [appSnap.sideBar.isHide])
  const router = useRouter()
  const onMenuItemClick = (menu: ParsedMenu) => {
    if (appStore.responsive === "mobile") {
      appStore.sideBar.isHide = true
    }
    console.log("menu", menu)
    if (!menu.meta?.isIframe && menu.meta?.link) return window.open(menu.meta?.link, "_blank")

    router.push(menu.path)
  }

  const { menus } = useSnapshot(userStore)
  const visible_menus = filterNotHide(menus as ParsedMenu[]) ?? []
  const pathname = usePathname()
  return (
    <aside className="soon-aside">
      <div
        className={` opacity-0  duration-300 transition-opacity  ${!isHide && isMobile ? " opacity-100 fixed left-0  w-lvw h-lvh bg-opacity-50 z-[1]" : ""}`}
        onClick={() => (appStore.sideBar.isHide = true)}
      ></div>
      <div
        ref={refContent}
        className={`w-[208px] ${
          appSnap.sideBar.isHide ? " translate-x-[-208px] " : ""
        }  z-50 bg-white dark:bg-neutral-900 dark:text-neutral-50  fixed left-0 flex h-svh flex-col border-r border-solid border-gray-100 dark:border-black transition-transform duration-300 `}
      >
        <div className="flex h-12 items-center justify-center">
          <img className="w-8 h-8" src="/logo.svg" alt="logo" />
          {!appSnap.sideBar.isCollapse && <span className="ml-4 text-lg font-bold">{appSnap.sideBar.title}</span>}
        </div>
        <SoonMenu className="flex-1" onMenuItemClick={onMenuItemClick} selectedPath={pathname} menus={visible_menus} />
      </div>
      <div
        className={` transition-[width] duration-300 hidden md:block ${appSnap.sideBar.isHide ? "w-0" : "w-[208px]"}`}
      ></div>
    </aside>
  )
}
