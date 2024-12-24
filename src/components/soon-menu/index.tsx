import MenuItem from "./menu-item"

import { SoonMenuData } from "@/components/soon-menu/type"

export default function SoonMenu({
  menus,
  isCollapse,
  className = "",
  onMenuItemClick,
  selectedPath,
}: {
  menus: SoonMenuData[]
  isCollapse?: boolean
  className?: string
  onMenuItemClick?: (menu: SoonMenuData) => void
  selectedPath: string
}) {
  return (
    <ul className={"h-screen overflow-hidden " + className}>
      {menus.map((menu) => (
        <MenuItem
          key={menu.path}
          menu={menu}
          isCollapse={isCollapse}
          selectedPath={selectedPath}
          onMenuItemClick={onMenuItemClick}
        />
      ))}
    </ul>
  )
}
