"use client"

import {
  TextIndentLeft,
  TextIndentRight,
  Github,
  FullscreenExit,
  Fullscreen,
  Sun,
  Moon,
  Gear,
} from "react-bootstrap-icons"
import User from "./user"

import LangSwitch from "../lang-switch"

import { appStore } from "@/store/modules/app"
import { useSnapshot } from "valtio"

import { usePathname } from "next/navigation"
import { userStore } from "@/store/modules/user"

import { getTreePathArr } from "@/utils"
import { ParsedMenu } from "@/router/side-menu"
import { useFullscreen } from "ahooks"
import { useState } from "react"

import Settings from "./settings"
import { SoonBreadcrumb } from "@/components/soon"

export const getPathMenu = (targetPath: string, menus: ParsedMenu[]) => {
  return getTreePathArr(menus, "path", targetPath)
}

export default function Header() {
  const toggleSideMenu = (e: any) => {
    appStore.sideBar.isHide = !appStore.sideBar.isHide
    //console.log("result", appStore.sideBar.isHide)
  }
  const sideBar = useSnapshot(appStore.sideBar)

  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen }] = useFullscreen(document.body)

  const iconProps = {
    className: "w-8 h-8 cursor-pointer p-1 rounded-sm",
    style: { color: "rgb(var(--color-primary-600))", backgroundColor: "var(--color-primary-100)" },
    onClick: toggleSideMenu,
  }

  const pathname = usePathname()
  const { menus } = useSnapshot(userStore)
  const breadcrumbList = getPathMenu(pathname, menus as ParsedMenu[])

  const { theme } = useSnapshot(appStore)
  const isDark = theme === "dark"
  const toggleDark = () => {
    appStore.theme = isDark ? "light" : "dark"
  }
  const [showDraw, setShowDraw] = useState(false)

  return (
    <header className="flex justify-between p-2  backdrop-saturate-200 backdrop-blur  bg-opacity-90 soon-header bg-white dark:bg-neutral-900 dark:text-neutral-100">
      <div className="flex items-center">
        {sideBar.isHide ? <TextIndentLeft {...iconProps} /> : <TextIndentRight {...iconProps} />}
        <SoonBreadcrumb className="ml-4" items={breadcrumbList} />
      </div>
      <div className="flex items-center">
        <div className="mr-4 cursor-pointer hidden md:block" onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </div>
        <LangSwitch className="mr-4" />

        <div className="mr-4 cursor-pointer hidden md:block" onClick={toggleDark}>
          {isDark ? <Moon /> : <Sun />}
        </div>
        {/* <div className="mr-4 cursor-pointer hidden md:block">
          <Search />
        </div>
        <div className="mr-4 cursor-pointer hidden md:block">
          <Gear />
        </div>
        <div className="mr-4 cursor-pointer hidden md:block">
          <Bell />
        </div> */}
        <div className="mr-4 cursor-pointer hidden md:block select-none" onClick={() => setShowDraw(true)}>
          <Gear />
        </div>
        <a
          href="https://github.com/leafio/soon-admin-vue3"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit Soon Admin Vue3 GitHub repository"
        >
          <Github className="mr-4" />
        </a>

        <User />
      </div>
      <Settings open={showDraw} onClose={() => setShowDraw(false)} />
    </header>
  )
}
