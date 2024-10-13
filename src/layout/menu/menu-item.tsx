import { Menu } from "@/api"
import SoonIcon from "@/components/soon-icon"
import { useLang } from "@/i18n"
import { appStore } from "@/store/app"
import { runStrFun } from "@/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronLeft } from "react-bootstrap-icons"
import styled from "styled-components"

const MenuLi = styled.li`
  &.current {
    border-right: solid 1px var(--soon-menu-hover-text-color);
  }
  &.current .base {
    color: var(--soon-menu-hover-text-color);
    font-weight: bold;
  }

  @media screen and (min-width: 768px) {
    .menu:hover {
      color: var(--soon-menu-hover-text-color);
      background-color: var(--soon-menu-hover-bg-color);
    }
  }
  .menu.active {
    color: white;
    background-color: var(--soon-color-primary);
  }

  .isCollapse > div {
    justify-content: center;
  }
`

export default function MenuItem({
  menu,
  level,
  isCollapse,
  selectedPath,
}: // setSelectedPath,
{
  menu: Menu
  level?: number
  isCollapse?: boolean
  selectedPath: string
  // setSelectedPath: (value: string) => void;
}) {
  useLang()
  const router = useRouter()

  const [expanded, setExpanded] = useState(false)

  const handleClickMenu = () => {
    if (menu.children?.length) {
      setExpanded(!expanded)
    } else {
      if (appStore.responsive === "mobile") {
        //console.log("app", appStore)
        appStore.sideBar.isHide = true
      }
      if (!menu.meta.isIframe && menu.meta?.link) return window.open(menu.meta?.link, "_blank")
      // if (selectedPath) setSelectedPath(menu.path)
      router.push(menu.path)
    }
  }
  const hasPath = (item: Menu, path: string): boolean => {
    if (item.redirect === path || item.path === path) return true
    return (
      item.children?.some((ch) => {
        if (ch.path === path) return true
        return hasPath(ch, path)
      }) ?? false
    )
  }
  const hasSelect = hasPath(menu, selectedPath ?? "")

  useEffect(() => {
    if (hasSelect) setExpanded(true)
  }, [selectedPath])
  return (
    <MenuLi className={`${hasSelect && !level ? "current" : ""}  ${isCollapse ? "isCollapse" : ""}`}>
      <div
        className={`flex-1 flex items-center justify-between mx-1 rounded menu cursor-pointer h-[3em] mt-1 ${menu.path === selectedPath ? "active" : ""} ${!level ? "base" : ""}`}
        style={{ paddingLeft: `calc(${(level ?? 0) * 16}px + 0.5rem)` }}
        onClick={handleClickMenu}
      >
        <div className="flex flex-1">
          {!level && menu.meta?.icon && <SoonIcon icon={menu.meta.icon} className="w-6 h-6" />}

          {!isCollapse && <span className="ml-1">{runStrFun(menu.meta?.title)}</span>}
        </div>

        {!isCollapse && menu.children && menu.children.length > 0 && (
          <div className="mx-2">
            <ChevronLeft className={`transition-transform ${expanded ? "-rotate-90" : ""}`} />
          </div>
        )}
      </div>
      {expanded && !isCollapse && (
        <ul>
          {(menu.children ?? []).map((sub) => (
            <MenuItem key={sub.path} menu={sub} level={(level ?? 0) + 1} selectedPath={selectedPath} />
          ))}
        </ul>
      )}
    </MenuLi>
  )
}
