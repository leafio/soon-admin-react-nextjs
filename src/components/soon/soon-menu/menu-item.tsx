import { runStrFun } from "@/utils"
import { useEffect, useState } from "react"
import { ChevronLeft } from "react-bootstrap-icons"
import styled from "styled-components"
import SoonIcon from "../soon-icon"
import { SoonMenuData } from "./type"

const MenuLi = styled.li`
  &.current {
    border-right: solid 1px rgb(var(--color-primary-600));
  }
  &.current .base {
    color: rgb(var(--color-primary-600));
    font-weight: bold;
  }

  @media screen and (min-width: 768px) {
    .menu:hover {
      color: rgb(var(--color-primary-600));
      background-color: rgb(var(--color-primary-100));
    }
  }
  .menu.active {
    color: white;
    background-color: rgb(var(--color-primary-600));
  }

  .isCollapse > div {
    justify-content: center;
  }
`
const hasPath = (item: SoonMenuData, path: string): boolean => {
  if (item.redirect === path || item.path === path) return true
  return (
    item.children?.some((ch) => {
      return hasPath(ch, path)
    }) ?? false
  )
}
export default function MenuItem({
  menu,
  level,
  isCollapse,
  selectedPath,
  onMenuItemClick,
}: {
  menu: SoonMenuData
  level?: number
  isCollapse?: boolean
  selectedPath: string
  onMenuItemClick?: (menu: SoonMenuData) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const handleMenuClick = () => {
    if (menu.children?.length) {
      setExpanded(!expanded)
    } else {
      if (onMenuItemClick) onMenuItemClick(menu)
    }
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
        onClick={handleMenuClick}
      >
        <div className="flex flex-1">
          {menu.icon && <SoonIcon icon={menu.icon} className="w-6 h-6" />}

          {!isCollapse && <span className="ml-1">{runStrFun(menu.label)}</span>}
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
            <MenuItem
              key={sub.path}
              menu={sub}
              level={(level ?? 0) + 1}
              selectedPath={selectedPath}
              onMenuItemClick={onMenuItemClick}
            />
          ))}
        </ul>
      )}
    </MenuLi>
  )
}
