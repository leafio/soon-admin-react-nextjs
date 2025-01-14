import { proxy } from "valtio"
import { deepClone } from "valtio/utils"
export const DEFAULT_THEME_COLORS = {
  primary: "#8c57ff",
  success: "#67C23A",
  warning: "#E6A23C",
  // danger: "#F56C6C",
  info: "#909399",
  error: "#f56c6c",
}
const default_data = {
  responsive: "pc" as "pc" | "mobile",
  sideBar: {
    title: "Soon Admin",
    isCollapse: false,
    isHide: false,
  },
  theme: "light",
  colors: {
    ...DEFAULT_THEME_COLORS,
  },
}

export const appStore = proxy(deepClone(default_data))
